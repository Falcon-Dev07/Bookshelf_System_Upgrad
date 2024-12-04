import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const BookTable = ({ books }) => {
  // for more than 10 pages next page on mybookshelf
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
              <td className="border px-4 py-2">{book.author}</td>
              <td className="border px-4 py-2">4.5</td>
              <td className="border px-4 py-2">⭐⭐⭐⭐⭐</td>
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
