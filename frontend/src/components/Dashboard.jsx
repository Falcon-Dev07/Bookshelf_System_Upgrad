import React from "react";
import Header from "./Header";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import getUserId from "../utils/getUserId";
import WantToRead from "./WantToRead";
import CurrentlyReading from "./CurrentlyReading";
import ReadingCompleted from "./ReadingCompleted";

import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const DashboardPage = ({ username }) => {
  const menuItems1 = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];
  const [protectedData, setProtectedData] = useState(null); // State for protected data

  //for sidebar menu
  const menuItems = [
    { name: "Currently Reading", key: "currently-reading" },
    { name: "Want to Read", key: "want-to-read" },
    { name: "Read", key: "reading-completed" },
  ];

  const [activeCategory, setActiveCategory] = useState("reading"); // Active category state
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeCategory) {
      case "currently-reading":
        return <CurrentlyReading />;
      case "want-to-read":
        return <WantToRead />;
      case "reading-completed":
        return <ReadingCompleted />;
      default:
        return <div>Select a category to view books.</div>;
    }
  };

  useEffect(() => {
    // Check if the token is in the URL (Google login)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store the token in localStorage for future use
      localStorage.setItem("token", token);
      console.log("Token saved to localStorage:", token);
      window.history.replaceState({}, "", "/dashboard"); // Clean the URL (remove token)
    }

    // Store the user-id in localStorage for future use
    const userId = getUserId();
    localStorage.setItem("userId", userId);
    console.log("Decoded User ID:", userId);

    // from this line it fetch the token for both login and signup
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      // If no token, redirect to login
      console.log(storedToken);
      navigate("/login");
    } else {
      // Optionally, validate the token with the backend or fetch protected data
      fetchProtectedData(storedToken);
    }
  }, [navigate]);

  // Function to fetch protected data
  const fetchProtectedData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await fetch("http://localhost:5000/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProtectedData(data); // Update state with the fetched data
      } else {
        console.error("Failed to access protected route");
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header menuItems={menuItems1} />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="md:w-52 bg-gradient-to-b from- from-slate-100 to-slate-500 shadow-transparent flex-shrink-0 sticky top-0 h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-slate-700 tracking-wide">
              Dashboard
            </h2>
          </div>
          <nav className="flex flex-col p-4 space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveCategory(item.key)}
                className={`text-left p-3 rounded-lg text-gray-700 font-medium transition ${
                  activeCategory === item.key
                    ? "bg-slate-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 md:p-8">
          <div className="bg-white shadow rounded-lg p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
