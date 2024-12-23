import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import { Link } from "react-router-dom";

const Hero = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch first 3 books from the API
    axios
      .get("http://localhost:9000/api/book/getbooks")
      .then((response) => {
        setBooks(response.data.slice(0, 3)); // Limit to first 3 books
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  return (
    <section className="w-full py-8 bg-gradient-to-b from-pink-100 to-cyan-100">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="rounded-lg"
        >
          {books.map((book) => (
            <SwiperSlide key={book.isbn}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white rounded-lg shadow-lg p-6">
                {/* Left Side */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                  <div className="flex mb-2">
                    {/* Star Ratings */}
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={`text-xl ${
                          index < book.rating ? "text-black" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {/* Check if description is available before displaying */}
                  {book.description ? (
                    <p className="text-sm text-gray-700 mb-4">{book.description}</p>
                  ) : (
                    <p className="text-sm text-gray-700 mb-4">No description available.</p>
                  )}
                  <button className="px-4 py-2 bg-black text-white rounded-md hover:opacity-80">
                  <Link to={`/book/${book.isbn}`} className="mt-2 text-white-500">
                    View Details
                  </Link>
                  </button>
                </div>
                {/* Right Side */}
                <div className="flex-1 flex justify-center">
                  <img
                    src={book.image || "/placeholder.png"}
                    alt={book.title}
                    className="w-48 md:w-64 rounded-lg shadow-md"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Hero;
