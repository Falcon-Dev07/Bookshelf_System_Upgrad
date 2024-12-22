import React, { useState, useEffect } from "react";
import {
  fetchUserBooks,
  deleteUserBook,
  updateUserBookRating,
} from "../utils/api";
import StarRating from "./StarRating";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const BookshelfTable = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId) return;
      const data = await fetchUserBooks(userId);
      setBooks(data);
    };
    fetchBooks();
  }, [userId]);

  const handleDelete = async (bookId) => {
    const userConfirmation = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (userConfirmation) {
      try {
        await deleteUserBook(userId, bookId);
        setBooks(books.filter((book) => book._id !== bookId));
      } catch (error) {
        console.error("Error deleting the book:", error);
      }
    }
  };

  const handleRatingChange = async (bookId, rating) => {
    const updatedBook = await updateUserBookRating(userId, bookId, rating);
    setBooks(books.map((book) => (book._id === bookId ? updatedBook : book)));
  };

  // Pagination Logic
  const indexOfLastBook = currentPage * recordsPerPage;
  const indexOfFirstBook = indexOfLastBook - recordsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(books.length / recordsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="overflow-x-auto items-center justify-center p-6 bg-gray-100 min-h-screen">
        <table className="table-auto max-w-4xl text-left justify-self-center">
          <thead className="text-lime-950 font-normal font-sans justify-center items-center">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Authors</th>
              <th className="p-4">Avg Rating</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50">
                <td className="p-2">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16"
                  />
                </td>
                <td className="p-4">{book.title}</td>
                <td className="p-4 text-sm">{book.author.join(", ")}</td>
                <td className="p-4 text-sm">{book.avgRate || "N/A"}</td>
                <td className="p-4">
                  <StarRating
                    value={
                      book.ratings.find((r) => r.userId === userId)?.rating || 0
                    }
                    onChange={(rating) => handleRatingChange(book._id, rating)}
                  />
                </td>
                <td className="p-4 text-sm text-center">
                  {book?.reviews?.length > 0 &&
                  book.reviews[book.reviews.length - 1]?.reviewText ? (
                    <span>
                      {/* Show only the first 2-3 words of the review */}
                      {book.reviews[book.reviews.length - 1].reviewText
                        .split(" ")
                        .slice(0, 3)
                        .join(" ")}
                      ...
                    </span>
                  ) : (
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => navigate(`/review1/${book._id}`)}
                    >
                      Your Review
                    </button>
                  )}
                </td>

                {/* <td className="p-4 text-sm text-center">
                  {book?.reviews?.length > 0 &&
                  book.reviews[book.reviews.length - 1]?.reviewText ? (
                    <span>
                      {book.reviews[book.reviews.length - 1].reviewText}
                    </span>
                  ) : (
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => navigate(`/review1/${book._id}`)}
                    >
                      Your Review
                    </button>
                  )}
                </td>*/}
                <td className="p-4 text-center relative">
                  {/* Delete Icon in Top-Right Corner */}
                  <span
                    className="absolute style={{ opacity: 0.7 }} text-xs top-1 right-1 text-gray-300 hover:text-gray-500 cursor-pointer"
                    onClick={() => handleDelete(book._id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </span>

                  {/* Row Content */}
                  <div className="inline-block">
                    <button
                      className="text-blue-500 text-xs hover:underline"
                      onClick={() => navigate(`/review1/${book._id}`)}
                    >
                      Edit
                    </button>
                    <button className="text-blue-500 text-xs hover:underline ml-4">
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handlePrev}
            className={`px-4 py-2 mx-2 ${
              currentPage > 1
                ? "text-gray-600 border border-gray-300 rounded-lg hover:bg-green-100"
                : "text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
            }`}
            disabled={currentPage === 1}
          >
            &#8592; Prev
          </button>
          <span className="text-gray-600">
            {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, books.length)} of{" "}
            {books.length}
          </span>
          <button
            onClick={handleNext}
            className={`px-4 py-2 mx-2 ${
              currentPage < totalPages
                ? "text-gray-600 border border-gray-300 rounded-lg hover:bg-green-100"
                : "text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
            }`}
            disabled={currentPage === totalPages}
          >
            Next &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookshelfTable;
