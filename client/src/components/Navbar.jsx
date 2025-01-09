import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth"; 
import axios from 'axios'
import {toast} from 'react-toastify'

const Navbar = ({ isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isSubscriptionPopupOpen, setIsSubscriptionPopupOpen] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
  const [userProfilePic, setUserProfilePic] = useState("/noavatar.jpg");
  const [userName, setUserName] = useState("Guest");
  const [formData, setFormData] = useState({
    category: '',
    duration: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:9000/api/subscribe/addsubscribe', formData);
      toast(response.data.message); 
      toggleSubscriptionPopup(); // Close the popup after successful submission
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert(error.response?.data?.message || 'Failed to create subscription.');
    }
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleLogoutPopup = () => setIsLogoutPopupOpen(!isLogoutPopupOpen);
  const toggleSubscriptionPopup = () => setIsSubscriptionPopupOpen(!isSubscriptionPopupOpen);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("isAdmin");
    setIsLogoutPopupOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userMembershipStatus = localStorage.getItem("membershipStatus");
    const userIsAdmin = localStorage.getItem("isAdmin");

    if (userMembershipStatus) {
      setMembershipStatus(userMembershipStatus);
    }

    setIsAdmin(userIsAdmin);
      const profilePic = localStorage.getItem("profilePic") || "/noavatar.jpg";
      const name = localStorage.getItem("userName") || "Guest";
      setUserProfilePic(profilePic);
      setUserName(name);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow-md z-50">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/s7.png" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-lg sm:text-xl font-bold">HypeBooks</h1>
          </a>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            ☰
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          <li>
            <a href="/" className="hover:text-gray-600">
              Home
            </a>
          </li>
          {isLoggedIn ? (
            <li>
              <a href="/library" className="hover:text-gray-600">
                Library
              </a>
            </li>
            
          ) : (
            <li>
              <a href="/login" className="hover:text-gray-600">
                Login
              </a>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center space-x-6 md:space-x-4 lg:space-x-8">
          {isLoggedIn && membershipStatus && (
            <span className="text-sm text-blue-500">{`Membership: ${membershipStatus}`}</span>
          )}

{isLoggedIn && (
            <a href="/dashboard" className="hover:text-gray-600">
              <span>Dashboard</span>
            </a>
          )}

          {isLoggedIn && (
            <a
              href="/reserveissue"
              className="hover:text-gray-600"
              aria-label="Notifications"
            >
              <span>Your Books</span>
            </a>
          )}

          {isLoggedIn && (
            <button
              onClick={toggleSubscriptionPopup}
              className="px-4 py-2 text-white bg-black rounded-md hover:opacity-80"
            >
              Subscription
            </button>
          )}

          {isLoggedIn && (
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleProfileMenu}>
              <img
                src={userProfilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full bg-gray-300 object-cover"
              />
              <span className="text-sm font-medium text-gray-800">{userName}</span>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <h1 className="text-lg font-bold">HypeBooks</h1>
          <button
            onClick={toggleMobileMenu}
            className="text-2xl focus:outline-none"
            aria-label="Close Mobile Menu"
          >
            ✖
          </button>
        </div>

        <ul className="flex flex-col space-y-6 mt-8 px-4 text-lg font-medium">
          <li>
            <a href="/" className="hover:text-gray-600">
              Home
            </a>
          </li>

          {isLoggedIn && (
            <li>
              <a href="/library" className="hover:text-gray-600">
                Library
              </a>
            </li>
          )}

          {isLoggedIn && isAdmin === "true" && (
            <li>
              <a href="/dashboard" className="hover:text-gray-600">
                Dashboard
              </a>
            </li>
          )}

          {isLoggedIn ? (
            <li>
              <button
                onClick={toggleLogoutPopup}
                className="hover:text-gray-600"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <a href="/login" className="hover:text-gray-600">
                Login
              </a>
            </li>
          )}
        </ul>
      </div>

      {isSubscriptionPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Apply for Membership</h2>
            <form className="space-y-4"onSubmit={handleSubmit}>
              <div>
                <label htmlFor="category" className="block text-sm font-medium">
                  Subscription Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="undergraduate">Undergraduate students</option>
                  <option value="postgraduate">Postgraduate students</option>
                  <option value="research">Research scholars</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleSubscriptionPopup}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
                >
                  Apply for Membership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-500 ${isProfileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={toggleProfileMenu}
            className="text-lg focus:outline-none"
            aria-label="Close Menu"
          >
            ✖
          </button>
        </div>
        <div className="px-4 py-2 text-sm font-medium">{userName}</div>
        <ul className="p-4 space-y-4">
          <li>
            <a href="/dashboard" className="hover:text-gray-400">
              Dashboard
            </a>
          </li>
          <hr className="border-gray-700" />
          <li>
            <button onClick={toggleLogoutPopup} className="hover:text-gray-400">
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      {isLogoutPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Log Out?</h2>
            <p className="text-sm mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={toggleLogoutPopup}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
