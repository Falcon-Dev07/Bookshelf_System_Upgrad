const express = require("express");
const {
  searchBooks,
  getBookDetails,
  addBookToShelf,
  checkBookExists,
} = require("../controllers/bookController");
const router = express.Router();

router.get("/search", searchBooks); // Search for books
router.get("/details/:googleId", getBookDetails); // Get book details by Google ID
router.post("/add", addBookToShelf); // Add book to the user's bookshelf
router.get("/exists/:googleId", checkBookExists); // Check if a book is already in the bookshelf

module.exports = router;
