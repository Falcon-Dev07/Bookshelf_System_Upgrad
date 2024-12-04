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
      const books = await fetchBooks(value); // Call the utility function
      setResults(books || []); // Set results
    } else {
      setResults([]);
    }
  };

  const handleSelectBook = (book) => {
    navigate(`/book/${book.id}`, { state: { book } }); // Redirect with state
  };

  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search for books"
        className="w-3/4 p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <div className="absolute bg-white w-full shadow-md z-10">
          {results.map((book) => (
            <div
              key={book.id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectBook(book)}
            >
              {book.volumeInfo.title} by
              {book.volumeInfo.authors?.join(", ") || "Unknown"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
