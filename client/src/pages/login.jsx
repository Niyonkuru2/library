import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { useAuth } from '../Context/Auth';
import RegisterPage from './Register'; 

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // State to control signup modal
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from context

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/");
    }
  }, [navigate]);

  // Handle user login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const formData = { email, password };
      const response = await axios.post("http://localhost:9000/api/user/login", formData);

      setLoading(false);
      if (response.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.userRole);

        login(); // Call the login function from context

        const redirectTo = localStorage.getItem("redirectTo") || "/";
        localStorage.removeItem("redirectTo"); // Clean up
        navigate(redirectTo);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  // Handle password reset request
  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter an email address.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:9000/api/user/request-reset-password", { email: resetEmail });
      if (response.data.success) {
        toast.success("Password reset link sent to your email.");
        setIsResetModalOpen(false); // Close the modal after successful request
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-6 py-8 shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <img src="/s7.png" alt="HypeBooks Logo" className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">HypeBooks</h1>
        <h2 className="text-lg font-semibold text-center mb-2">Sign in</h2>

        {loading ? (
          <div className="flex justify-center items-center mb-4">
            <TailSpin color="#4fa94d" height={40} width={40} />
          </div>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={handleLogin}
            >
              Sign in with email
            </button>
          </>
        )}

        <p className="mt-5 text-center">
          Forgot your password?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsResetModalOpen(true)} // Open the reset password modal
          >
            Reset it
          </span>
        </p>

        <p className="mt-5 text-center">
          You don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsSignupModalOpen(true)} // Open the signup modal
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Reset Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Reset Password</h2>
            <p className="mb-4">Enter your email to receive a password reset link.</p>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsResetModalOpen(false)} // Close the modal
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword} // Handle password reset
                className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <RegisterPage /> {/* Render the RegisterPage inside the modal */}
            <button
              onClick={() => setIsSignupModalOpen(false)} // Close the modal
              className="absolute top-4 right-4 text-gray-500 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
