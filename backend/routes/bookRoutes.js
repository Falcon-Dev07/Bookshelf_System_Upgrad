const express = require("express");
const {
  searchBooks,
  checkBookExists,
  createBook,
  getUserBooks,
  deleteUserBook,
  updateUserBookRating,
  fetchBookDetails,
  postBookReview,
  addBookStatus,
} = require("../controllers/bookController");
const router = express.Router();
const { rateBook } = require("../controllers/bookController");
//const auth = require("../middleware/auth");
const authenticateToken = require("../middleware/auth");

// Search for books
router.get("/search", searchBooks); // Search for books

// Route to check if the book already exists for a user
//add exists to this route because its clashing with fetchBookDetails
router.get("/exists/:userId/:googleId", checkBookExists);

// Route to create a new book
router.post("/", createBook);

// Get all books for a specific user
router.get("/:userId", getUserBooks);

// Delete a specific book for a user
router.delete("/:userId/:bookId", deleteUserBook);

// Update a book's rating for a user
router.patch("/:userId/:bookId", updateUserBookRating);

// Route to get book  details by book ID and userid for review
router.get("/:userId/:bookId", fetchBookDetails);

//Route to add review to db
router.post("/review/:bookId", postBookReview);

// Route to add or update book status
router.post("/status", addBookStatus);

module.exports = router;
