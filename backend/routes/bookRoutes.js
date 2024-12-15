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
  fetchWantToReadBooks,
  updateBookStatus,
  getCompletedBooks,
  updateStatusFromCompletedBook,
  getCurrentlyReadingBooks,
  updateBookProgress,
  markBookAsFinished,
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

// Route to fetch books with a status want to read
router.get("/want/status/:userId", fetchWantToReadBooks);

// Route to set the updated book status from want to read page
router.post("/update-status", updateBookStatus);

// Fetch completed books for a user
router.get("/status/completed/:userId", getCompletedBooks);

// Update book status
router.put("/:userId/book/:bookId", updateStatusFromCompletedBook);

// Fetch currently reading books
router.get("/status/currently-reading/:userId", getCurrentlyReadingBooks);

// Update book progress and notes
router.put("/status/update-progress", updateBookProgress);

router.put("/status/finish/:userId", markBookAsFinished);

module.exports = router;
