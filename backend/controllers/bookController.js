const axios = require("axios");
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

//Add Book to Bookshelf

exports.addBookToShelf = async (req, res) => {
  const { userId, book } = req.body;
  try {
    const newBook = await Book.create({ ...book, addedBy: userId });
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book to bookshelf." });
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
