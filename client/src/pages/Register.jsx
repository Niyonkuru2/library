import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const RegisterPage = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    category: "", // Add a field for category
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("https://library-8l38.onrender.com/api/user/register", formData);
      setIsSubmitting(false);

      if (response.data.success) {
        toast.success("Registration successful!");
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Simulate a page load delay (e.g., fetching data, etc.)
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-6 py-8 shadow-lg rounded-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/s7.png" alt="HypeBooks Logo" className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">HypeBooks</h1>

        {/* Heading */}
        <h2 className="text-lg font-semibold text-center mb-2">Create an account</h2>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center mb-4">
            <TailSpin color="#4fa94d" height={40} width={40} />
          </div>
        ) : (
          <>
            {/* Name Input */}
            <input
              type="text"
              placeholder="Full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email Input */}
            <input
              type="email"
              placeholder="email@domain.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Category Select */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your category</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Research Scholar">Research Scholar</option>
              <option value="Faculty">Faculty</option>
            </select>

            {/* Sign up Button */}
            <button
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={handleRegister}
              disabled={isSubmitting} // Disable the button while submitting
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>
          </>
        )}

        {/* Sign in link */}
        <p className="mt-5">
          Already have an account?{" "}
          <span>
            <a href="/login" className="text-blue-500">
              Sign In
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
