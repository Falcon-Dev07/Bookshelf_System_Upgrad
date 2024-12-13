import React, { useEffect, useState } from "react";
import { fetchWantToReadBooks } from "../utils/api";

const WantToRead = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchWantToReadBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadBooks();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">
        Next on My List
      </h2>
      <div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-2 h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-2">
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
                  defaultValue="want-to-read"
                >
                  <option value="want-to-read">Want to Read</option>{" "}
                  <option value="currently-reading">Currently Reading</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WantToRead;
