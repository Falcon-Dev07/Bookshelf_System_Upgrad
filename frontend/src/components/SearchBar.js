import React, { useState } from "react";

const SearchBar = ({ onBookSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    setQuery(e.target.value);

    // Simulate search results for now
    if (e.target.value.length > 2) {
      setResults([
        { id: 1, title: "Book 1", author: "Author 1" },
        { id: 2, title: "Book 2", author: "Author 2" },
      ]);
    } else {
      setResults([]);
    }
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
        <ul className="absolute w-full bg-white shadow-lg max-h-40 overflow-y-auto mt-1 rounded-md z-10">
          {results.map((book) => (
            <li
              key={book.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onBookSelect(book);
                setQuery("");
                setResults([]);
              }}
            >
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
