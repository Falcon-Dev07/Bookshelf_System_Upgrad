import React from "react";
import Header from "./Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getUserId from "../utils/getUserId";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const DashboardPage = ({ username }) => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];
  const [protectedData, setProtectedData] = useState(null); // State for protected data
  const navigate = useNavigate();

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
      <Header menuItems={menuItems} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome to your Dashboard!
        </h2>
        <p className="text-gray-600 mt-2">
          Use the navigation menu above to explore the Bookshelf system.
        </p>

        {/* Example Content Section */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800">
              Dashboard Features:
            </h3>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>View your bookshelf.</li>
              <li>Connect with friends and share reviews.</li>
              <li>Update your profile and settings.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
