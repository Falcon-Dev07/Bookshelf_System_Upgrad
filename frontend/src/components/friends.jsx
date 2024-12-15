import React, { useState, useEffect } from "react";
import Header from "./Header";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" flex-1 mr-8">
        {/* Header */}
        <Header menuItems={menuItems} />
      </div>
      {/* Main Content */}
      <div className="flex items-center justify-between mb-12 space-x-6"></div>
    </div>
  );
};

export default Friends;
