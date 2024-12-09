const express = require("express");
const {
  searchBooks,
  checkBookExists,
  createBook,
  getUserBooks,
  deleteUserBook,
  updateUserBookRating,
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

// Get all books for a specific user
router.get("/:userId", getUserBooks);

// Delete a specific book for a user
router.delete("/:userId/:bookId", deleteUserBook);

// Update a book's rating for a user
router.patch("/:userId/:bookId", updateUserBookRating);

module.exports = router;
