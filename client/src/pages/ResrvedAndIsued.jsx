import { useState } from 'react';
import axios from 'axios';

const YourBooks = () => {
  const [membershipCode, setMembershipCode] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setMemberData(null);

    try {
      const response = await axios.get(`https://library-8l38.onrender.com/api/reservation/reservations/${membershipCode}`);
      setMemberData(response.data);
    } catch (err) {
      setError('Error fetching member data. Please check your membership code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Your Books</h1>

      <div className="mb-4">
        <label htmlFor="membershipCode" className="block text-lg font-medium text-gray-700 mb-2">Enter Membership Code To get Your Issued And Reserved Book</label>
        <input
          type="text"
          id="membershipCode"
          value={membershipCode}
          onChange={(e) => setMembershipCode(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
          placeholder="Enter your membership code"
        />
        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="text-red-500 text-center">{error}</div>}

      {memberData && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Issued Books</h2>
          {memberData.issuedBooks && memberData.issuedBooks.length > 0 ? (
            <ul>
              {memberData.issuedBooks.map((book) => (
                <li key={book.transactionId} className="mb-2">
                  <strong>{book.title}</strong> (Issued on: {new Date(book.issueDate).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>No books issued.</p>
          )}

          <h2 className="text-xl font-semibold mt-6 mb-4">Reserved Books</h2>
          {memberData.reservedBooks && memberData.reservedBooks.length > 0 ? (
            <ul>
              {memberData.reservedBooks.map((book) => (
                <li key={book.reservationId} className="mb-2">
                  <strong>{book.title}</strong> (Reserved)
                </li>
              ))}
            </ul>
          ) : (
            <p>No books reserved.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default YourBooks;
