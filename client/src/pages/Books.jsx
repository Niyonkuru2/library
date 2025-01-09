import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import SideBar from "../components/Sibebar"; 
import axios from "axios";
import { toast } from "react-toastify";
const formattedDate = (date) => {
  if (date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "";
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    rackNumber: "",
    copiesAvailable: "",
    lastIssuedDate: "",
    category: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategories([
        { _id: "fiction", name: "Fiction" },
        { _id: "nonfiction", name: "Non-Fiction" },
        { _id: "history", name: "History" },
        { _id: "biograph", name: "Biography" },
        { _id: "science", name: "Science" },
      ]);
    };

    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://library-8l38.onrender.com/api/book/getbooks");
        setBooks(response.data);
      } catch (err) {
        setError("Failed to fetch books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchBooks();
  }, []);

  const handleAddOrUpdateBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("isbn", newBook.isbn);
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("rackNumber", newBook.rackNumber);
    formData.append("copiesAvailable", newBook.copiesAvailable);
    formData.append("lastIssuedDate", newBook.lastIssuedDate);
    formData.append("category", newBook.category);
    formData.append("description", newBook.description);
    if (newBook.image) {
      formData.append("image", newBook.image);
    }

    try {
      if (isEdit) {
        const response = await axios.put(
          `https://library-8l38.onrender.com/api/book/updatebook/${newBook.isbn}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const updatedBooks = books.map((book) =>
          book.isbn === response.data.book.isbn ? response.data.book : book
        );
        setBooks(updatedBooks);
        toast.success(response.data.message)
      } else {
        const response = await axios.post("https://library-8l38.onrender.com/api/book/addbook", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBooks([...books, response.data.book]);
        toast.success(response.data.message);
      }

      setNewBook({
        title: "",
        author: "",
        isbn: "",
        rackNumber: "",
        copiesAvailable: "",
        lastIssuedDate: "",
        image: null,
        category: "",
        description: "",
      });
      setIsPopupOpen(false);
      setIsEdit(false);
      setSelectedBook(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleEditBook = (book) => {
    setNewBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      rackNumber: book.rackNumber,
      copiesAvailable: book.copiesAvailable,
      lastIssuedDate: book.lastIssuedDate,
      category: book.category,
      description:book.description,
      image: null,
    });
    setIsPopupOpen(true);
    setIsEdit(true);
    setSelectedBook(book);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEdit(false);
    setSelectedBook(null);
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      rackNumber: "",
      copiesAvailable: "",
      lastIssuedDate: "",
      image: null,
      category: "",
      description: ""
    });
  };

  const handleDeleteBook = async (isbn) => {
    try {
      await axios.delete(`https://library-8l38.onrender.com/api/book/deletebook/${isbn}`);
      setBooks(books.filter((book) => book.isbn !== isbn));
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete the book. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin color="#4fa94d" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar />

      <div className="flex-1 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mt-12 mb-6 text-center">Books in the Library</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add New Book
          </button>
        </div>

        <table className="w-full border-collapse bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Book ID</th>
              <th className="border p-3 text-left">Book Title</th>
              <th className="border p-3 text-left">Author</th>
              <th className="border p-3 text-left">ISBN</th>
              <th className="border p-3 text-left">Rack Number</th>
              <th className="border p-3 text-left">Copies Available</th>
              <th className="border p-3 text-left">Last Issued Date</th>
              <th className="border p-3 text-left">Category</th> 
              <th className="border p-3 text-left">description</th>
              <th className="border p-3 text-left">Cover Image</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book._id} className="hover:bg-gray-50">
                <td className="border p-3">{index + 1}</td>
                <td className="border p-3">{book.title}</td>
                <td className="border p-3">{book.author}</td>
                <td className="border p-3">{book.isbn}</td>
                <td className="border p-3">{book.rackNumber}</td>
                <td className="border p-3">{book.copiesAvailable}</td>
                <td className="border p-3">{formattedDate(book.lastIssuedDate)}</td>
                <td className="border p-3">{book.category || "N/A"}</td>
                <td className="border p-3">
  {book.description.length > 15 ? book.description.slice(0, 15) + "..." : book.description}
</td>
                <td className="border p-3">
                  {book.image ? (
                    <img src={book.image} alt="Cover" className="w-16 h-16 object-cover" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="border p-3 flex space-x-2">
                  <button onClick={() => handleEditBook(book)} className="text-blue-500 hover:text-blue-700">✏️</button>
                  <button onClick={() => handleDeleteBook(book.isbn)} className="text-red-500 hover:text-red-700">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all">
              <h2 className="text-lg font-bold mb-4">{isEdit ? "Edit Book" : "Add New Book"}</h2>

              <form onSubmit={handleAddOrUpdateBook} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-2">ISBN</label>
                    <input
                      type="text"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      className="w-full border p-2 rounded-md"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Author</label>
                    <input
                      type="text"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Rack Number</label>
                    <input
                      type="text"
                      value={newBook.rackNumber}
                      onChange={(e) => setNewBook({ ...newBook, rackNumber: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Copies Available</label>
                    <input
                      type="number"
                      value={newBook.copiesAvailable}
                      onChange={(e) => setNewBook({ ...newBook, copiesAvailable: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Last Issued Date</label>
                    <input
                      type="date"
                      value={newBook.lastIssuedDate ? formattedDate(newBook.lastIssuedDate) : ""}
                      onChange={(e) => setNewBook({ ...newBook, lastIssuedDate: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Category</label>
                    <select
                      value={newBook.category}
                      onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Description</label>
                    <textarea
                      type="text"
                      value={newBook.description}
                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    ></textarea>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-2">Cover Image</label>
                    <input
                      type="file"
                      onChange={(e) => setNewBook({ ...newBook, image: e.target.files[0] })}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-between space-x-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    {isEdit ? "Update Book" : "Add Book"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
