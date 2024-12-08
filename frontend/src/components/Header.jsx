import React from "react";

const Header = ({ menuItems }) => {
  return (
    <header
      className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from- from-white to-slate-500
      shadow-lg sticky top-0 w-full z-50"
    >
      {/* Logo */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-serif text-pretty text-blue-600">
          <span className="serif ">📚 Readers' Corner</span>
        </div>

        {/* Navigation dynamic menu Links for adding  differnt page */}

        <nav>
          <ul className="flex justify-items-center space-x-20">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className=" text-white text-sm font-semibold hover:underline flex items-center space-x-1"
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
