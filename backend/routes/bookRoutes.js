const express = require("express");
const {
  searchBooks,
  getBookDetails,
  addBookToBookshelf,
  checkBookExists,
  getUserBooks,
} = require("../controllers/bookController");
const router = express.Router();
const { rateBook } = require("../controllers/bookController");
const auth = require("../middleware/auth");
//const validateObjectId = require("../middleware/validateObjectId");

router.get("/search", searchBooks); // Search for books
//router.get("/details/:googleId", getBookDetails); // Get book details by Google ID
//router.post("/add", addBookToShelf); // Add book to the user's bookshelf
//router.get("/exists/:googleId", checkBookExists); // Check if a book is already in the bookshelf
router.post("/add", auth, addBookToBookshelf); // Add book to bookshelf
// Update rating for a book
router.post("/rate/:bookId", rateBook);

router.get("/:userId", auth, getUserBooks); // Fetch user's books

module.exports = router;
