import React, { useState } from "react";
import SearchBar from "./SearchBar";
import BookTable from "./BookTable";
import Header from "./Header";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const MyBookshelfPage = ({ username }) => {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mr-8">
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
      {/*<BookTable books={books} />*/}
    </div>
  );
};

export default MyBookshelfPage;
