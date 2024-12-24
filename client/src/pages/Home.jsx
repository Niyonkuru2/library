import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Hero from "../components/Hero";
import { TailSpin } from "react-loader-spinner";
import { useAuth } from "../Context/Auth";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth(); 

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:9000/api/book/getbooks")
      .then((response) => {
        setBooks(response.data); // Assuming response.data contains an array of book objects
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after data fetch is complete
      });
  }, []);

  const getNewBooks = () => {
    return books.slice(0, 5); // Display the first 5 books
  };

  return (
    <section className="py-8 bg-gray-100 min-h-screen">
      <Hero />
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">New Books This Week</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <TailSpin color="#4fa94d" height={80} width={80} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {getNewBooks().map((book) => (
              <div key={book.isbn} className="flex flex-col items-center">
                <img
                  src={book.image || "/placeholder.png"} // Use a placeholder image if none exists
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-2 text-sm font-medium text-center">
                  {book.title}
                </p>
                {isLoggedIn && ( // Conditionally render the link based on isLoggedIn
                  <Link
                    to={`/book/${book.isbn}`}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
