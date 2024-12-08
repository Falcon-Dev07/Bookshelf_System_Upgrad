const express = require("express");
const {
  searchBooks,
  getBookDetails,
  addBookToBookshelf,
  checkBookExists,
  getUserBooks,
  createBook,
} = require("../controllers/bookController");
const router = express.Router();
const { rateBook } = require("../controllers/bookController");
const auth = require("../middleware/auth");

// Search for books
router.get("/search", searchBooks); // Search for books

// Route to check if the book already exists for a user
router.get("/:userId/:googleId", checkBookExists);

// Route to create a new book
router.post("/", createBook);

module.exports = router;
