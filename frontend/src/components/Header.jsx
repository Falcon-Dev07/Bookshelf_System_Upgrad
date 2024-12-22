import React from "react";
import logo from "../assets/logo1.png";
const Header = ({ menuItems }) => {
  return (
    <header
      className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from- from-white to-slate-600
      shadow-transparent sticky top-0 w-full z-50"
    >
      {/* Logo */}
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Modern Logo (Book Icon) */}
          <img src={logo} alt="Bookshelf Logo" className="h-10 w-10" />

          {/* Bookshelf Title */}
          <span className="text-3xl font-semibold text-slate-800 tracking-tight">
            bookShelf
          </span>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Navigation"
            id="menu-toggle"
          >
            ☰
          </button>
        </div>

        {/* Navigation dynamic menu Links for adding  differnt page */}

        <nav className="hidden md:block w-full md:w-auto" id="menu">
          <ul className="flex flex-col md:flex-row md:space-x-8 items-center">
            {menuItems.map((item, index) => (
              <li key={index} className="my-2 md:my-0">
                <a
                  href={item.link}
                  className=" text-white text-sm font-semibold hover:underline flex items-center space-x-2"
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;
