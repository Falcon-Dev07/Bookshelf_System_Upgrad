import React from "react";
import Header from "./Header";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const DashboardPage = ({ username }) => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/mybookshelf", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/", icon: ArrowRightOnRectangleIcon },
  ];

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
