import React from "react";
import Header from "./Header";
import backgroundImage from "../assets/background.png";

const HomePage = () => {
  const menuItems = [
    { name: "Login", link: "/login" },
    { name: "Sign-Up", link: "/signup" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>
      {/* Page Content */}
      <div className="relative z-20">
        {/* Header */}
        <Header menuItems={menuItems} />

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-balance text-white px-6">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              Fill your Bookshelf
            </h1>
            <h3 className="text-lg sm:text-xl text-white font-semibold mb-6">
              Discover, review, and share your favorite books with friends!
            </h3>
            <h3 className="text-lg sm:text-xl text-white font-semibold mb-6">
              Invokes a cozy and familiar space for readers.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
