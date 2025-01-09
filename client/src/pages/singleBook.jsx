import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';

const BookDetailPage = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [membershipCode, setMembershipCode] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isMembershipCodeModalOpen, setIsMembershipCodeModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the book details
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://library-8l38.onrender.com/api/book/getbook/${isbn}`);
        setBook(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [isbn]);

  const handleIssueBook = () => {
    if (book.copiesAvailable > 0) {
      setIsMembershipCodeModalOpen(true);
    } else {
      toast.error('No copies available for issuing.');
    }
  };

  const handleConfirmIssueBook = async () => {
    if (!membershipCode.trim()) {
      toast.error('Please enter your membership code.');
      return;
    }

    if (!issueDate || !dueDate) {
      toast.error('Please select reservation date and expiry date.');
      return;
    }

    setIsActionLoading(true);

    try {
      const response = await axios.post('https://library-8l38.onrender.com/api/transaction/addtransaction', {
        isbn,
        membershipCode,
        issueDate,
        dueDate,
      });

      toast.success(response.data.message);
      setBook((prevBook) => ({
        ...prevBook,
        copiesAvailable: prevBook.copiesAvailable - 1,
      }));
      setIsMembershipCodeModalOpen(false);
    } catch (err) {
      alert('Error issuing book: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReserveBook = async () => {
    if (book.copiesAvailable > 0) {
      alert('Book is available, no need to reserve.');
      return;
    }

    setIsReservationModalOpen(true);
  };

  const handleConfirmReserveBook = async () => {
    if (!membershipCode.trim()) {
      alert('Please enter your membership code.');
      return;
    }

    if (!issueDate || !expiryDate) {
      alert('Please select reservation date and expiry date.');
      return;
    }

    setIsActionLoading(true);

    try {
      const response = await axios.post('https://library-8l38.onrender.com/api/reservation/addreservation', {
        isbn,
        membershipCode,
        issueDate,
        expiryDate,
      });

      toast.success(response.data.message);
      setIsReservationModalOpen(false);
    } catch (err) {
      alert('Error reserving book: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold">
        <TailSpin color="#4fa94d" height={40} width={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg font-semibold">{error}</div>;
  }

  if (!book) {
    return <div className="text-center text-gray-500 text-lg">Book not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">{book.title}</h1>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <img
          src={book.image || '/default-book-image.png'}
          alt={book.title}
          className="w-64 h-80 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Book Details</h2>
          <table className="table-auto w-full text-left">
            <tbody>
              <tr>
                <th className="py-2 px-4 font-medium">ISBN</th>
                <td className="py-2 px-4">{book.isbn}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium">Author</th>
                <td className="py-2 px-4">{book.author}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium">Rack Number</th>
                <td className="py-2 px-4">{book.rackNumber}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium">Category</th>
                <td className="py-2 px-4">{book.category}</td>
              </tr>
              <tr>
                <th className="py-2 px-4 font-medium">Copies Available</th>
                <td className="py-2 px-4">{book.copiesAvailable}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-6 text-lg">{book.description || 'No description available for this book.'}</p>

      <div className="mt-6 flex justify-center gap-4">
        {book.copiesAvailable > 0 ? (
          <button
            onClick={handleIssueBook}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={isActionLoading}
          >
            {isActionLoading ? <TailSpin color="#ffffff" height={20} width={20} /> : 'Issue Book'}
          </button>
        ) : (
          <button
            onClick={handleReserveBook}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            disabled={isActionLoading}
          >
            {isActionLoading ? <TailSpin color="#ffffff" height={20} width={20} /> : 'Reserve Book'}
          </button>
        )}
      </div>

      {/* Membership Code Modal for Issuing Book */}
      {isMembershipCodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Enter Membership Code</h2>
            <input
              type="text"
              placeholder="Membership Code"
              value={membershipCode}
              onChange={(e) => setMembershipCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-between gap-4">
              <div>
                <label className="block mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                />
              </div>
              <div>
                <label className="block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsMembershipCodeModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmIssueBook}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={isActionLoading}
              >
                {isActionLoading ? <TailSpin color="#ffffff" height={20} width={20} /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal for Reserving Book */}
      {isReservationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Enter Membership Code to Reserve</h2>
            <input
              type="text"
              placeholder="Membership Code"
              value={membershipCode}
              onChange={(e) => setMembershipCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-between gap-4">
              <div>
                <label className="block mb-1">Reservation Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                />
              </div>
              <div>
                <label className="block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsReservationModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReserveBook}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
                disabled={isActionLoading}
              >
                {isActionLoading ? <TailSpin color="#ffffff" height={20} width={20} /> : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
