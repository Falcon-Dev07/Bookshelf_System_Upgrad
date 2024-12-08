import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import baseURL from "../services/api";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
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
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];
  const navigate = useNavigate(); // Initialize the navigate function
  const { state } = useLocation(); // Access book details passed via state
  const book = state?.book;

  const handleAddToBookshelf = async () => {
    // Fetch user ID from local storage
    const userId = localStorage.getItem("userId"); // Replace "userId" with the actual key you used to store the user ID

    console.log(userId);
    if (!userId) {
      alert(
        "User  is not logged in. Please log in to add books to your bookshelf."
      );
      return;
    }
    if (!book) {
      alert("Book details are missing. Please try again.");
      return;
    }
    try {
      // Check if the book already exists
      const checkResponse = await baseURL.get(
        `/api/books/${userId}/${book.id}`
      );
      if (checkResponse.data.exists) {
        alert(`${book.volumeInfo.title} is already in your bookshelf.`);
        navigate("/MyBookshelfPage"); // Redirect to MyBookshelfPage
        return;
      }
      const response = await baseURL.post(
        "/api/books", // Use the centralized base URL for axios
        {
          googleId: book.id, // Assuming book.id is the Google ID
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors,
          coverImage: book.volumeInfo.imageLinks?.thumbnail,
          description: book.volumeInfo.description,
          avgRate: book.volumeInfo.averageRating || 0,
          numberOfPages: book.volumeInfo.pageCount || 0,
          userId: userId, // Replace with the actual user ID from your auth context or state
        }
      );
      alert(`${book.volumeInfo.title} has been added to your bookshelf!`);
      navigate("/MyBookshelfPage"); // Redirect to MyBookshelfPage
    } catch (error) {
      console.error("Error adding book to bookshelf:", error);
      alert("Failed to add book to bookshelf.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header menuItems={menuItems} />

      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Book Cover Image */}
          <div className="w-full md:w-1/3 p-4 flex justify-center bg-gradient-to-r from-blue-50 to-white">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || ""}
              alt={book.volumeInfo.title}
              className="w-40 h-60 object-contain rounded-lg shadow-md transition-transform transform hover:scale-105"
            />
          </div>

          {/* Book Details */}
          <div className="w-full md:w-2/3 p-6">
            {/* Title */}
            <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {book.volumeInfo.title}
            </h2>

            {/* Author */}
            <p className="text-lg text-gray-600 mb-6">
              By{" "}
              <span className="font-medium">
                {book.volumeInfo.authors?.join(", ") || "Unknown"}
              </span>
            </p>

            {/* Scrollable Description */}
            <div className="max-h-48 overflow-y-auto text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-md shadow-inner">
              {book.volumeInfo.description || "No description available."}
            </div>

            {/* Average Rating */}
            <div className="flex items-center space-x-4 mb-6">
              {/* Label */}
              <span className="text-base font-medium text-gray-700">
                Average Rating:
              </span>
              {/* Star Icon and Rating */}
              <span className="text-base font-semibold text-green-600 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.5l-6.18 3.25L7 16.63l-5-4.87 6.91-1L12 4.5z"
                  />
                </svg>
                {book.volumeInfo.averageRating || "N/A"}
              </span>
            </div>

            {/* Want to Read Button */}
            <div>
              <button
                className="px-8 py-3 bg-sky-900 hover:bg-sky-900 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                onClick={handleAddToBookshelf}
              >
                Want to Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /*  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header *
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
  );*/
};

export default BookDescription;
