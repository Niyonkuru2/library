import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Import the spinner

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:9000/api/book/getbooks")
      .then((response) => {
        setBooks(response.data); // Assuming response.data is an array of book objects
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching data
      });
  }, []);

  const filterBooksByCategory = (books) => {
    if (selectedCategory === 'All') return books;
    return books.filter((book) => book.category === selectedCategory);
  };

  const filterBooksBySearch = (books) => {
    if (!searchQuery) return books;
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getNewBooks = () => {
    const filteredBooks = filterBooksByCategory(books);
    return filterBooksBySearch(filteredBooks).slice(0, 5); // First 5 books
  };

  const getPopularBooks = () => {
    const filteredBooks = filterBooksByCategory(books);
    return filterBooksBySearch(filteredBooks).slice(-5); // Last 5 books
  };

  return (
    <section className="py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-3xl font-bold text-center mt-9">Library Store</h1>
        
        {/* Show loading spinner if loading */}
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <TailSpin color="#4fa94d" height={80} width={80} />
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 mt-3">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div className="flex flex-wrap gap-4">
                  {["All", "Fiction", "Non-Fiction", "History", "Biography"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedCategory === category ? 'bg-black text-white' : 'border-black text-black'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded px-4 py-2 w-full md:w-1/3"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-6">New Books This Week</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {getNewBooks().map((book) => (
                <div key={book.id} className="flex flex-col items-center">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-sm font-medium text-center">{book.title}</p>
                  <Link to={`/book/${book.isbn}`} className="mt-2 text-blue-500 hover:underline">
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-6">Most Popular Books</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {getPopularBooks().map((book) => (
                <div key={book.id} className="flex flex-col items-center">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-sm font-medium text-center">{book.title}</p>
                  <Link to={`/book/${book.isbn}`} className="mt-2 text-blue-500 hover:underline">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LibraryPage;
