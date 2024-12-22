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
  const { userId, googleId, status, progress } = req.body;

  if (
    userId === undefined ||
    googleId === undefined ||
    status === undefined ||
    progress === undefined
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if the user has already set a status for this book
    let bookStatus = await StatusBook.findOne({ userId, googleId });

    if (bookStatus) {
      // If status exists, update it
      bookStatus.status = status; // Update status
      bookStatus.progress = progress;
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
        progress,
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

// Get books for a specific user on mybookshelf table

exports.getUserBooks = async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ userIds: userId });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// this details shows on review page

exports.fetchBookDetails = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid Book ID" });
    }

    const book = await Book.findById(bookId)
      .populate("reviews.userId", "name")
      .populate("ratings.userId", "name");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Extract the specific review and rating for the user
    const userReview = book.reviews.find(
      (review) => review.userId?._id.toString() === userId
    );
    const userRating = book.ratings.find(
      (rating) => rating.userId?._id.toString() === userId
    );

    res.status(200).json({
      ...book.toObject(),
      review: userReview ? userReview.reviewText : "",
      rating: userRating ? userRating.rating : 0, // Include user's rating or 0 if not rated
    });
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postBookReview = async (req, res) => {
  const { bookId } = req.params; // Extract bookId from the route
  const { userId, reviewText, rating } = req.body; // Extract reviewText and rating from the body

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    const existingReview = book.reviews.find(
      (review) => review.userId.toString() === userId
    );
    const existingRating = book.ratings.find(
      (ratingObj) => ratingObj.userId.toString() === userId
    );

    // If the user has already reviewed the book, update the review and rating
    if (existingReview) {
      existingReview.reviewText = reviewText || ""; // Update the review with new text (empty if not provided)
    } else {
      // If no review exists, add a new one
      book.reviews.push({ userId, reviewText });
    }

    // Handle the case where rating is 0 or no rating is provided
    if (rating !== undefined && rating !== null) {
      if (existingRating) {
        existingRating.rating = rating; // Update the rating with the new one
      } else {
        // If no rating exists, add a new one (even if it's 0)
        book.ratings.push({ userId, rating });
      }
    } else {
      // If no rating is provided (null or undefined), you can optionally remove the rating or leave it empty
      if (existingRating) {
        // Optionally remove the rating (set it to 0 or remove it)
        existingRating.rating = 0; // You can also choose to delete the rating
      }
    }

    await book.save();

    res
      .status(200)
      .json({ message: "Review and rating added/updated successfully", book });
  } catch (error) {
    console.error("Error adding/updating review or rating:", error);
    res
      .status(500)
      .json({ message: "Error adding/updating review or rating", error });
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

//Fetch the records of a books whose status ="Want_To_Read"
exports.fetchWantToReadBooks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find books with "want_to_read" status for the user
    const userBooks = await StatusBook.find({
      userId,
      status: "want_to_read",
      progress: 0,
    });

    // Get detailed book information
    const bookDetails = await Book.find({
      googleId: { $in: userBooks.map((b) => b.googleId) },
    });

    res.status(200).json(bookDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//set the Updated book status from the want to read page
exports.updateBookStatus = async (req, res) => {
  try {
    const { userId, googleId, status } = req.body;

    if (!userId || !googleId || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Set progress based on status

    let progress = 0;
    if (status === "completed") progress = 100;
    else if (status === "currently_reading") progress = 0;
    else if (status === "want_to_read") progress = 0;

    // Find or create the BookStatus record for the user
    let userBookStatus = await StatusBook.findOneAndUpdate(
      { userId, googleId },
      { status, progress },
      { new: true, upsert: true } // upsert will create the document if it doesn't exist
    );

    res.status(200).json({
      message: "Book status updated successfully",
      data: userBookStatus,
    });
  } catch (error) {
    console.error("Error updating book status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Get books details whoes status is completed
exports.getCompletedBooks = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch books with status "completed" and progress 100 for the user
    const completedBooks = await StatusBook.find({
      userId,
      status: "completed",
      progress: 100,
    });

    // Get detailed book information
    const bookDetails = await Book.find({
      googleId: { $in: completedBooks.map((b) => b.googleId) },
    });

    res.status(200).json(bookDetails);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch completed books", error });
  }
};

//set the Updated book status from the completed page
exports.updateStatusFromCompletedBook = async (req, res) => {
  const { userId, bookId } = req.params;
  const { status } = req.body;

  try {
    let progress = 0;
    if (status === "completed") progress = 100;
    else if (status === "currently_reading") progress = 0;
    else if (status === "want_to_read") progress = 0;

    // Find or create the BookStatus record for the user

    const updatedBook = await StatusBook.findOneAndUpdate(
      { userId, googleId: bookId }, // Find the book entry for the user
      { status, progress }, // Update the status and progress
      { new: true, upsert: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res
      .status(200)
      .json({ message: "Book status updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Failed to update book status", error });
  }
};

// Fetch books by status
exports.getCurrentlyReadingBooks = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const books = await StatusBook.find({
      userId,
      status: "currently_reading",
      progress: { $gte: 0, $lte: 100 },
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found for this user" });
    }

    const bookDetails = await Book.find({
      googleId: { $in: books.map((b) => b.googleId) },
    });
    res.status(200).json(bookDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Update book progress and notes
exports.updateBookProgress = async (req, res) => {
  const { userId, googleId, progress, notes } = req.body;
  //console.log("userId:", userId, "googleId:", googleId);
  //console.log("Received request:", { userId, googleId, progress, notes });
  try {
    const userBook = await StatusBook.findOne({ userId, googleId });
    if (!userBook)
      return res.status(404).json({ message: "Book not found in Progress" });

    userBook.progress = progress;
    userBook.readingNotes = notes;
    await userBook.save();

    res
      .status(200)
      .json({ message: "Book progress updated successfully", book: userBook });
  } catch (error) {
    res.status(500).json({ message: "Error updating book progress", error });
  }
};

// Mark book as finished or completed from CurentlyReading
exports.markBookAsFinished = async (req, res) => {
  const { userId } = req.params;
  const { googleId } = req.body;

  const status = "completed";
  try {
    let progress = 0;
    if (status === "completed") progress = 100;
    // Update the status of the book to "completed" and set progress to 100
    const updatedStatus = await StatusBook.findOneAndUpdate(
      { userId, googleId },
      { status, progress },
      { new: true, upsert: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Return the updated book status
    res.json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: "Error updating book status." });
  }
};
