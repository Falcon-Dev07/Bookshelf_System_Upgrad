import React, { useState, useEffect } from "react";
import { fetchCompletedBooks } from "../utils/api"; // Fetch books with completed status

const ReadingCompleted = () => {
  const [books, setBooks] = useState([]);

  /*useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await fetchCompletedBooks(); // Fetch completed books from the API
        setBooks(data);
      } catch (error) {
        console.error("Error fetching completed books:", error);
      }
    };

    fetchBooks();
  }, []);*/

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">
        My Completed Reads
      </h2>
      <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-slate-800">
                {book.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1">{book.author}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">&#9733;</span>
                <span className="ml-1 text-sm text-slate-600">
                  {book.avgRate}
                </span>
              </div>
              <div className="mt-4">
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  defaultValue="read"
                >
                  <option value="read">Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="want-to-read">Want to Read</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingCompleted;
