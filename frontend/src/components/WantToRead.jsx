import React, { useEffect, useState } from "react";
import { fetchWantToReadBooks, updateBookStatus } from "../utils/api";

const WantToRead = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadBooks = async () => {
      if (userId) {
        try {
          //console.log("Received frontend userId in want to read:", userId);
          const data = await fetchWantToReadBooks(userId);
          setBooks(data);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    loadBooks();
  }, [userId]);

  const handleStatusChange = async (googleId, newStatus) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

    if (!token || !userId) {
      alert("User not authenticated!");
      return;
    }

    try {
      const updatedData = await updateBookStatus(userId, googleId, newStatus);

      // Update the local state to reflect the status change
      //if (newStatus !== "want_to_read") {
      // Remove the book from the local state if its status changes to something else
      ///setBooks((prevBooks) =>
      //prevBooks.filter((book) => book.googleId !== googleId)
      //);
      //}

      // Update the local state to reflect the status change
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.googleId !== googleId)
      );
      alert("Book status updated successfully!");
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">
        Next on My List
      </h2>
      <div className="w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <div
            key={book.googleId}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-80"
          >
            <div className="p-2 h-32 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-2 flex-1 flex flex-col">
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
              <div className="mt-auto">
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  defaultValue={book.status || "want_to_read"}
                  onChange={(e) =>
                    handleStatusChange(book.googleId, e.target.value)
                  }
                >
                  <option value="want_to_read">Want to Read</option>{" "}
                  <option value="currently_reading">Currently Reading</option>
                  <option value="completed">Read</option>
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
