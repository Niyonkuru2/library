import { useState } from "react";

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-screen bg-black shadow-lg z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:relative md:w-64`}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center p-4 space-x-2 border-b">
            <img src="/s7.png" alt="Logo" className="w-6 h-6" />
            <h1 className="text-lg font-bold text-white">HypeBooks</h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  📊 <span className="text-white">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/members"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  👥 <span className="text-white">Members</span>
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  📚 <span className="text-white">Books</span>
                </a>
              </li>
              <li>
                <a
                  href="/report"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  📋 <span className="text-white">Reports</span>
                </a>
              </li>
              <li>
                <a
                  href="/issues"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  📝 <span className="text-white">Issued Books</span>
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  💸 <span className="text-white">Returns</span>
                </a>
              </li>
              <li>
                <a
                  href="/reservations"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  📅 <span className="text-white">Reseved Book</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar Toggle Button (Visible on Mobile Only) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      {/* Overlay when Sidebar is Open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SideBar;
