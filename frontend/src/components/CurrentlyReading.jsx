import React, { useState, useEffect } from "react";
import {
  getCurrentlyReadingBooks,
  updateBookProgress,
  markBookAsFinished,
} from "../utils/api";

const CurrentlyReading = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [progressValue, setProgressValue] = useState("");
  const [readingNotes, setReadingNotes] = useState("");
  const [error, setError] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getCurrentlyReadingBooks(userId);
        console.log("Books fetched on load:", data);
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    loadBooks();
  }, []);

  const handleFinishBook = async (googleId) => {
    try {
      const userId = localStorage.getItem("userId");
      //await axios.post(`/api/books/finish/${userId}`, { googleId });
      // Remove the finished book from the list
      //setBooks(books.filter((book) => book.googleId !== googleId));

      console.log(userId, googleId);

      const updateData = await markBookAsFinished(userId, googleId);

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.googleId !== googleId)
      );
      alert("Book status updated successfully!");
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  const handleUpdateProgress = (book, e) => {
    //console.log("Book being selected handleUpdateProgress:", book);
    const buttonRect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.top + window.scrollY + 10,
      left: buttonRect.left + window.scrollX,
    });

    // Use the book object directly
    setSelectedBook(book);
    //setProgressValue(book.progress.toString());
    //setProgressValue(book.progress?.toString() || ""); // Handle undefined progress
    setProgressValue(book.progress?.toString() ?? ""); // Use nullish coalescing for 0 handling
    setReadingNotes(book.notes || ""); // Default to an empty string if no notes exist
    setError("");
  };

  const handleProgressChange = (e) => {
    const value = e.target.value.trim(); // Get the input value
    if (value && (isNaN(value) || value < 0 || value > 100)) {
      setError("Progress must be between 0 and 100.");
    } else {
      setError(""); // Clear error if valid
    }
    setProgressValue(value); // Always update state to reflect user input
  };

  const handleSaveProgress = async () => {
    if (!selectedBook) return;

    //console.log("Selected Book in handlesaveprogress:", selectedBook);

    const newProgressValue =
      progressValue === ""
        ? selectedBook.progress
        : parseInt(progressValue, 10);

    if (newProgressValue < 0 || newProgressValue > 100) {
      setError("Progress must be a number between 0 and 100.");
      return;
    }

    //console.log("Before update:", selectedBook);
    try {
      // Call the API to update progress (assuming it returns the updated book)
      const updatedBook = await updateBookProgress(
        selectedBook.googleId, // Use googleId to identify the book
        newProgressValue,
        readingNotes
      );

      // Update the `books` state immutably
      setBooks((prevBooks) =>
        prevBooks.map(
          (book) =>
            book.googleId === updatedBook.googleId // Match books by googleId
              ? {
                  ...book, // Keep other properties
                  progress: updatedBook.book.progress, // Update progress
                  notes: updatedBook.book.notes, // Update notes
                }
              : book // Return unchanged books as they are
        )
      );
      alert("Progress Status has updated");
      //console.log("After update:", updatedBook); // Log the updated state

      // Reset the popup state
      setSelectedBook(null);
      setProgressValue("");
      setReadingNotes("");
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const handleCancel = () => {
    setSelectedBook(null);
    setError("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">
        My Active Reads
      </h2>
      <div className="w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <div
            key={book.googleId}
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
              {book.progress > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Completed: {book.progress}%
                  </p>
                </div>
              )}
              <button
                onClick={(e) => handleUpdateProgress(book, e)}
                className="mt-4 px-4 py-2 bg-slate-500 text-white text-sm rounded-lg shadow hover:bg-blue-400"
              >
                Update Progress
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedBook && (
        <div
          className="absolute z-10 bg-white shadow-lg p-4 rounded-lg w-60 border border-gray-300"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Update Progress
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={progressValue}
              //onChange={(e) => setProgressValue(e.target.value)}
              onChange={handleProgressChange}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="%"
            />
            <span className="text-sm text-slate-700">% done</span>
            <button
              onClick={(e) => handleFinishBook(selectedBook.googleId)}
              className="text-blue-500 text-sm hover:underline"
            >
              Finished!
            </button>
          </div>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <textarea
            value={readingNotes}
            onChange={(e) => setReadingNotes(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            placeholder="Add your reading notes here..."
          ></textarea>
          <div className="flex justify-between">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-sm rounded-lg shadow"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProgress}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-400"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentlyReading;
