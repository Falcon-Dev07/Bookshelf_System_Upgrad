import React, { useState } from "react";
import { fetchBooks } from "../utils/api"; // Adjust path as necessary
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onBookSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const books = await fetchBooks(value); // Fetch books from API
      setResults(books || []); // Set results
    } else {
      setResults([]);
    }
  };

  const handleSelectBook = (book) => {
    navigate(`/book/${book.id}`, { state: { book } }); // Redirect with state
  };

  return (
    <div className="flex flex-col items-center justify-center pt-5 relative w-full max-w-lg mx-auto ">
      {/* Search Input */}
      <div className="w-full max-w-sm mx-auto items-center">
        <input
          type="text"
          placeholder="Search for books"
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          value={query}
          onChange={handleSearch}
        />
      </div>
      {/* Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full mt-1 bg-white w-full shadow-md rounded-md z-10 max-h-72 overflow-y-auto">
          {results.map((book) => (
            <div
              key={book.id}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectBook(book)}
            >
              {/* Cover Image */}
              <img
                src={
                  book.volumeInfo.imageLinks?.thumbnail || "/placeholder.png"
                }
                alt={book.volumeInfo.title}
                className="w-12 h-16 object-cover rounded-md mr-4"
              />

              {/* Book Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {book.volumeInfo.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
