const axios = require("axios");
const mongoose = require("mongoose");
const Book = require("../models/Book");

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

// Controller to check if a book exists for a user
exports.checkBookExists = async (req, res) => {
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

// Controller function to get book details by ID in review page
exports.getBookById = async (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.headers.authorization?.split(" ")[1]; // Retrieve userId from the Authorization header

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user ID provided" });
  }

  console.log("Fetching book with ID:", bookId, "for User ID:", userId);

  try {
    // Check if the book belongs to the user (userIds array)
    const book = await Book.findOne({
      _id: bookId,
      userIds: { $in: [userId] }, // Ensure the book is accessible to this user
    });

    if (book) {
      res.json(book);
    } else {
      res
        .status(404)
        .json({ message: "Book not found or not accessible to the user" });
    }
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* // this without userid for review page
exports.getBookById = async (req, res) => {
  const bookId = req.params.bookId;
  console.log("Fetching book with ID:", bookId);

  try {
    // Fetch book from database
    // Determine if bookId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }
    const book = await Book.findById(mongoose.Types.ObjectId(bookId));
    //const book = await Book.findById(bookId);
    //const book = await Book.findById("6757436aadc3c42eb7ec3cf0");
    //console.log("Result for hardcoded ID:", book);
    console.log("Book fetched from database:(Controller)", book);

    if (book) {
      res.json(book); // Return the book details as JSON
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};*/

// Delete a book for a user
exports.deleteUserBook = async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (!Array.isArray(book.userIds)) {
      return res.status(500).json({ message: "Invalid userIds structure" });
    }

    book.userIds = book.userIds.filter((id) => id.toString() !== userId);
    if (book.userIds.length === 0) {
      //await book.remove();
      await Book.deleteOne({ _id: bookId }); // Use deleteOne for better compatibility
    } else {
      await book.save();
    }
    res.status(200).json({ message: "Book removed successfully" });
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
