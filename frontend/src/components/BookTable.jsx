import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaStar } from "react-icons/fa";
import getUserId from "../utils/getUserId";
import axios from "axios";

const BookTable = () => {
  // for more than 10 pages next page on mybookshelf
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const totalPages = Math.ceil(books.length / booksPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );
  // for adding data on table
  //const [books, setBooks] = useState([]);

  const userId = getUserId(); // Dynamically fetch user ID

  useEffect(() => {
    if (!userId) {
      throw new Error("User not logged in or user ID not available.");
      return;
    }
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`/api/books/${userId}`); // Replace with user ID
        //const response = await addBookToBookshelf(book); // `userId` is dynamically handled in `services/api.js`

        console.log("Books fetched successfully:", response.data);
        setBooks(response.data);
      } catch (error) {
        console.error(
          "Error fetching books:",
          error.response?.data || error.message
        );
      }
    };
    fetchBooks();
  }, [userId]);

  const handleRating = async (bookId, newRating) => {
    try {
      const response = await axios.post(`/api/books/rate/${bookId}`, {
        userId, // Replace with actual user ID
        rating: newRating,
      });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId
            ? { ...book, averageRating: response.data.averageRating }
            : book
        )
      );
    } catch (error) {
      alert("Error updating rating");
    }
  };

  return (
    <div className="overflow-x-auto flex justify-center mt-10">
      <table className="table w-3/4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Cover</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Avg Rating</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Review</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <img
                  src={book.coverImage || "https://via.placeholder.com/100"}
                  alt={book.title}
                  className="h-16 w-auto"
                />
              </td>
              <td className="border px-4 py-2">{book.title}</td>
              <td className="border px-4 py-2">{book.author.join(", ")}</td>
              <td className="border px-4 py-2">
                {book.averageRating || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${
                      star <= book.averageRating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRating(book._id, star)}
                  />
                ))}
              </td>
              <td className="border px-4 py-2">
                <a href="#" className="text-blue-500 underline mr-2">
                  write a review
                </a>
              </td>
              <td className="border px-4 py-2">
                <a href="#" className="text-blue-500 underline mr-2">
                  Edit
                </a>
                <a href="#" className="text-blue-500 underline">
                  View
                </a>
              </td>
              <td className="border px-4 py-2">
                <button className="text-red-500">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* paging*/}

      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            } rounded`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookTable;
