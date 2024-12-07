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

//Get Book Details
exports.getBookDetails = async (req, res) => {
  const { googleId } = req.params;
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_API}/${googleId}`);
    const book = response.data.volumeInfo;
    res.json({
      googleId,
      title: book.title,
      author: book.authors || ["Unknown"],
      coverImage: book.imageLinks?.thumbnail || "",
      description: book.description || "No description available.",
      averageRating: book.averageRating || "Not rated",
      pageCount: book.pageCount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details." });
  }
};

exports.getUserBooks = async (req, res) => {
  const { userId } = req.params;

  try {
    const books = await Book.find({ userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books." });
  }
};

//Add Book to Bookshelf

exports.addBookToBookshelf = async (req, res) => {
  const { book } = req.body;
  const userId = req.userId || req.body.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID format.");
    return;
  }
  try {
    const existingBook = await Book.findOne({ userId, title: book.title });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book already in your bookshelf" });
    }

    const newBook = await Book.create({ ...book, userId });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book to bookshelf" });
  }
};

// Book rating
exports.rateBook = async (req, res) => {
  const { bookId } = req.params;
  const { userId, rating } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if the user has already rated the book
    const existingRating = book.ratings.find(
      (r) => r.userId.toString() === userId
    );
    if (existingRating) {
      existingRating.rating = rating; // Update the rating
    } else {
      book.ratings.push({ userId, rating }); // Add a new rating
    }

    // Calculate average rating
    const totalRatings = book.ratings.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating = totalRatings / book.ratings.length;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating rating" });
  }
};

//Check If Book Exists
exports.checkBookExists = async (req, res) => {
  const { googleId } = req.params;
  const { userId } = req.query;
  try {
    const book = await Book.findOne({ googleId, addedBy: userId });
    if (book) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Error checking book existence." });
  }
};
