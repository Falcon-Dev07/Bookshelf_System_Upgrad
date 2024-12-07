import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserId from "../utils/getUserId";
import Header from "./Header";
import { addBookToBookshelf } from "../services/api";

import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const BookDescription = ({ selectedBook }) => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];
  const { id } = useParams(); // Get the book ID from the URL
  const { state } = useLocation(); // Access book details passed via state
  const book = state?.book; // Use state to get the book details

  const navigate = useNavigate();

  const handleAddToBookshelf = async () => {
    try {
      const userId = getUserId(); // Dynamically fetch user ID
      console.log(userId);
      if (!userId) {
        throw new Error("User not logged in or user ID not available.");
      }

      /*await axios.post("/api/books/add", {
        userId, // Replace with actual user ID
        book: selectedBook,
      });*/
      await addBookToBookshelf(book); // `userId` is dynamically handled in `services/api.js`
      alert("Book added to your bookshelf!");
      navigate("/mybookshelf"); // Redirect to bookshelf
    } catch (error) {
      alert(error.response?.data?.message || "Error adding book");
    }
  };

  if (!book) {
    return (
      <div>
        <h1>Book not found!</h1>
        <p>Please go back and select a book from the search results.</p>
      </div>
    );
  }

  /*const handleAddToBookshelf = () => {
    alert(`${book.volumeInfo.title} has been added to your bookshelf!`);
    // Add your logic to save the book to the bookshelf
  };*/

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header menuItems={menuItems} />
      <div>
        <img
          src={book.volumeInfo.imageLinks?.thumbnail || ""}
          alt={book.volumeInfo.title}
          className="my-4 w-1/4"
        />
        <h2 className="text-2xl font-bold">{book.volumeInfo.title}</h2>
        <p className="text-gray-700">
          By {book.volumeInfo.authors?.join(", ") || "Unknown"}
        </p>
      </div>

      <p className="mt-4">
        {book.volumeInfo.description || "No description available."}
      </p>
      <p className="mt-2">
        Average Rating: {book.volumeInfo.averageRating || "N/A"}
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
