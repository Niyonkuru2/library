import  { useState } from "react";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.png" // Replace with your logo path
          alt="Logo"
          className="w-8 h-8"
        />
        <h1 className="text-lg font-bold">HypeBooks</h1>
      </div>

      {/* Center Section: Search Bar */}
      <div className="hidden md:flex items-center relative w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <span className="absolute left-3 text-gray-400">🔍</span>
      </div>

      {/* Right Section: Profile */}
      <div className="relative">
        {/* Profile Avatar */}
        <div
          onClick={toggleProfileMenu}
          className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
        >
          <img
            src="/profile.png" // Replace with your profile image path
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dropdown Menu */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-lg z-50">
            <ul className="py-2">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Search Icon */}
      <div className="md:hidden">
        <button
          className="p-2 bg-gray-100 rounded-md"
          aria-label="Search"
        >
          🔍
        </button>
      </div>
    </header>
  );
};

export default Header;
