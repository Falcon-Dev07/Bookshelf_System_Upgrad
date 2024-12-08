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

//Get Book Details (This shows on description page)
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
