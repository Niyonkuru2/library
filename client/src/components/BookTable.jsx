import { useState } from "react";

// Modal Form for Adding and Editing Book
const BookFormModal = ({ isOpen, onClose, onSave, bookData }) => {
  const [formData, setFormData] = useState(
    bookData || { title: "", author: "", isbn: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? "block" : "hidden"}`}
    >
      <div className="flex justify-center items-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">{bookData ? "Edit Book" : "Add New Book"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Book Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                name="author"
                id="author"
                value={formData.author}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                id="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Book Table with Pagination
const BookTable = ({ books = [], onEdit, onDelete, onAddBook }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5); // Adjust the number of books per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (book = null) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = (book) => {
    if (currentBook) {
      onEdit(book);
    } else {
      onAddBook(book);
    }
    closeModal();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Book List</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => openModal()}
        >
          Add New Book
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Book ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Book Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Author</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ISBN</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.id} className="border-t">
              <td className="px-4 py-2 text-sm">{book.id}</td>
              <td className="px-4 py-2 text-sm">{book.title}</td>
              <td className="px-4 py-2 text-sm">{book.author}</td>
              <td className="px-4 py-2 text-sm">{book.isbn}</td>
              <td className="px-4 py-2 text-sm">
                <button
                  onClick={() => openModal(book)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(book.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * booksPerPage >= books.length}
          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Book Form Modal */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        bookData={currentBook}
      />
    </div>
  );
};

export default BookTable;
