import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import SideBar from "../components/Sibebar";

const Return = () => {
  const [returnQuery, setReturnQuery] = useState("");
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [overdueCharge, setOverdueCharge] = useState(0);

  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Simulate a 2-second page load
    }, 2000);
    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  // Fetch book details from API
  const searchBook = async () => {
    if (!returnQuery.trim()) {
      setError("Please enter a book title or ISBN.");
      return;
    }

    setSearching(true);
    setError(null);
    setBookDetails(null);

    try {
      const response = await fetch(`https://your-api-endpoint.com/books?query=${returnQuery}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch book details. Please try again.");
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error("No book found with the provided query.");
      }

      // Calculate overdue charges if applicable
      const today = new Date();
      const dueDate = new Date(data.dueDate);
      const overdueDays = Math.max(
        Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)),
        0
      );
      const charge = overdueDays * data.penaltyRate;

      setBookDetails(data);
      setOverdueCharge(charge);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSearching(false);
    }
  };

  // Simulate book return process
  const handleReturn = () => {
    setSearching(true);
    setTimeout(() => {
      alert("Book returned successfully!");
      setBookDetails(null);
      setReturnQuery("");
      setOverdueCharge(0);
      setSearching(false);
    }, 2000); // Simulate delay
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin color="#4fa94d" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full">
      <SideBar />
      <div className="flex flex-col w-full justify-center items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 mt-24 text-center">Return Books</h1>

        <div className="mb-4 w-full md:w-1/3">
          <label htmlFor="isbn" className="block text-lg font-medium text-gray-700 mb-2">
            Search for a Book to Return:
          </label>
          <input
            type="text"
            id="isbn"
            value={returnQuery}
            onChange={(e) => setReturnQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter ISBN or Book Title"
          />
          <button
            onClick={searchBook}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
            disabled={searching}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {searching ? (
          <div className="flex justify-center items-center h-64">
            <TailSpin color="#4fa94d" height={80} width={80} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : bookDetails ? (
          <div className="mt-6 bg-white shadow-lg rounded-lg p-6 w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Book Details</h2>
            <p>
              <strong>Title:</strong> {bookDetails.title}
            </p>
            <p>
              <strong>ISBN:</strong> {bookDetails.isbn}
            </p>
            <p>
              <strong>Borrowed By:</strong> {bookDetails.memberName}
            </p>
            <p>
              <strong>Due Date:</strong> {bookDetails.dueDate}
            </p>
            <p>
              <strong>Return Date:</strong> {bookDetails.returnDate}
            </p>
            <p className="text-red-500 font-bold">
              <strong>Overdue Charges:</strong> {overdueCharge > 0 ? `$${overdueCharge}` : "No charges"}
            </p>

            <button
              onClick={handleReturn}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md"
              disabled={searching}
            >
              {searching ? "Processing..." : "Process Return"}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">Enter a book title or ISBN to search for returns.</p>
        )}
      </div>
    </div>
  );
};

export default Return;
