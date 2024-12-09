import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BookshelfTable from "./BookshelfTable ";
import Header from "./Header";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const MyBookshelfPage = () => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];

  const [books, setBooks] = useState([]);

  const handleBookSelect = (book) => {
    setBooks((prevBooks) => [...prevBooks, book]);
  };

  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If no userId, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" flex-1 mr-8">
        {/* Header */}
        <Header menuItems={menuItems} />
      </div>
      {/* Main Content */}
      <div className="flex items-center justify-between mb-12 space-x-6">
        {/* Logo and Title Section */}
        <div className="flex items-center space-x-4">
          {/* Title */}
          <h2 className="text-3xl font-semibold text-gradient bg-gradient-to-r from-purple-600 via-blue-500 text-transparent bg-clip-text hover:scale-105 transition-all duration-300 ease-in-out tracking-tight">
            MyBooks
          </h2>
        </div>
        <SearchBar onBookSelect={handleBookSelect} />
      </div>
      {/*<BookshelfTable books={books} />*/}
      {userId ? (
        <div className="flex justify-center">
          <BookshelfTable userId={userId} />
        </div>
      ) : (
        <p className="text-center text-red-500">Loading...</p>
      )}
    </div>
  );
};

export default MyBookshelfPage;
