import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "./Header";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const BookDescription = () => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/", icon: ArrowRightOnRectangleIcon },
  ];
  const { id } = useParams(); // Get the book ID from the URL
  const { state } = useLocation(); // Access book details passed via state
  const book = state?.book; // Use state to get the book details

  if (!book) {
    return (
      <div>
        <h1>Book not found!</h1>
        <p>Please go back and select a book from the search results.</p>
      </div>
    );
  }

  const handleAddToBookshelf = () => {
    alert(`${book.volumeInfo.title} has been added to your bookshelf!`);
    // Add your logic to save the book to the bookshelf
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header menuItems={menuItems} />
      <h1 className="text-2xl font-bold">{book.volumeInfo.title}</h1>
      <p className="text-lg text-gray-600">
        By {book.volumeInfo.authors?.join(", ") || "Unknown"}
      </p>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || ""}
        alt={book.volumeInfo.title}
        className="my-4 w-1/4"
      />
      <p className="text-gray-700">
        {book.volumeInfo.description || "No description available."}
      </p>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={handleAddToBookshelf}
      >
        Want to Read
      </button>
    </div>
  );
};

export default BookDescription;
