const axios = require("axios");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const StatusBook = require("../models/BookStatus");

//Search Books via Google Books API
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

exports.searchBooks = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `${GOOGLE_BOOKS_API}?q=${query}&key=${process.env.GOOGLE_API_KEY}`
    );
    const books = response.data.items.map((item) => ({
      googleId: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors || ["Unknown"],
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
    }));
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching books." });
  }
};

// for adding book in database
exports.createBook = async (req, res) => {
  const {
    googleId,
    title,
    author,
    coverImage,
    description,
    avgRate,
    numberOfPages, //save the page count
    userId,
  } = req.body;

  // Validate request body
  if (!userId || !googleId || !title || !author || !coverImage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if the user already added this book (based on userId and googleId)
    const existingBook = await Book.findOne({ googleId });
    if (existingBook) {
      // If the book already exists, add the user to the userIds array
      if (existingBook.userIds.includes(userId)) {
        return res
          .status(400)
          .json({ message: "Book already added by this user." });
      }

      existingBook.userIds.push(userId);
      await existingBook.save();
      return res.status(200).json(existingBook);
    } else {
      const newBook = new Book({
        googleId,
        title,
        author,
        coverImage,
        description,
        avgRate: avgRate || 0,
        numberOfPages,
        userIds: [userId],
      });

      await newBook.save();
      res.status(201).json(newBook);
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate entry error
      return res
        .status(400)
        .json({ message: "Book already exists in your bookshelf." });
    }
    console.error("Error saving book:", error);
    res.status(500).json({ message: "Failed to save book." });
  }
};

//Adding status of the book int the database
exports.addBookStatus = async (req, res) => {
  const { userId, googleId, status } = req.body;

  if (!userId || !googleId || !status) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if the user has already set a status for this book
    let bookStatus = await StatusBook.findOne({ userId, googleId });

    if (bookStatus) {
      // If status exists, update it
      bookStatus.status = status; // Update status
      await bookStatus.save();
      return res
        .status(200)
        .json({ message: "Book status updated successfully" });
    } else {
      // Otherwise, create a new record for the user and book
      const newBookStatus = new StatusBook({
        userId,
        googleId,
        status: status || "want to read", // Default to 'want to read' if no status is provided
      });
      await newBookStatus.save();
      return res
        .status(201)
        .json({ message: "Book status added successfully" });
    }
  } catch (error) {
    console.error("Error adding book status:", error);
    res.status(500).json({ message: "Failed to add book status" });
  }
};

// Controller to check if a book exists for a user
exports.checkBookExists = async (req, res) => {
  console.log("Here");
  const { userId, googleId } = req.params;
  try {
    const book = await Book.findOne({ googleId });
    if (book && book.userIds.includes(userId)) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking book existence:", error);
    res.status(500).json({ error: "Error checking book existence" });
  }
};

// Get books for a specific user

exports.getUserBooks = async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ userIds: userId });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};
/*
exports.getUserBooks = async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ userIds: userId });
    //change from here for fetching review
    const booksWithReviews = books.map((book) => {
      const userReview = book.reviews.find(
        (review) => review.userId.toString() === userId
      );
      return {
        ...book._doc,
        userReview: userReview ? userReview.reviewText : null,
      };
    });
    res.status(200).json(booksWithReviews); //till here
    //res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};*/

// this without userid for review page
exports.fetchBookDetails = async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    const book = await Book.findById(bookId);

    if (book) {
      res.json(book); // Return the book details as JSON
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Add review to database
exports.postBookReview = async (req, res) => {
  const { bookId } = req.params; // Extract bookId from the route
  const { userId, reviewText } = req.body; // Extract data from request body

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    const existingReview = book.reviews.find(
      (review) => review.userId.toString() === userId
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book." });
    }

    // Add review and rating
    book.reviews.push({ userId, reviewText });

    await book.save();

    res.status(200).json({ message: "Review added successfully", book });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review", error });
  }
};

// Delete a book for a user and this delete the status of book for that user also

exports.deleteUserBook = async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    // Step 1: Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!Array.isArray(book.userIds)) {
      return res.status(500).json({ message: "Invalid userIds structure" });
    }

    // Step 2: Remove the userId from the book's userIds array
    book.userIds = book.userIds.filter((id) => id.toString() !== userId);

    // Step 3: Check if there are no more userIds; if so, delete the book
    if (book.userIds.length === 0) {
      await Book.deleteOne({ _id: bookId }); // Delete the book if no users are associated
    } else {
      await book.save(); // Save the updated userIds
    }

    // Step 4: Delete the corresponding record from the StatusBook schema
    const statusDeleteResult = await StatusBook.deleteOne({
      userId,
      googleId: book.googleId,
    });

    if (statusDeleteResult.deletedCount === 0) {
      console.warn(
        `No record found in StatusBook for userId: ${userId} and googleId: ${book.googleId}`
      );
    }
    res
      .status(200)
      .json({ message: "Book and related status removed successfully" });
  } catch (error) {
    console.error("Error in deleteUserBook:", error); // Log the actual error
    res.status(500).json({ message: "Error removing book", error });
  }
};

// Update a user's rating for a book
exports.updateUserBookRating = async (req, res) => {
  const { userId, bookId } = req.params;
  const { rating } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const existingRating = book.ratings.find(
      (r) => r.userId.toString() === userId
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      book.ratings.push({ userId, rating });
    }

    // Recalculate average rating
    const totalRatings = book.ratings.reduce((sum, r) => sum + r.rating, 0);
    book.avgRate = (totalRatings / book.ratings.length).toFixed(2);

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error });
  }
};
