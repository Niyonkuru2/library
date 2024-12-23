import Reservation from '../models/reservation.js'
import Transaction from '../models/transaction.js'
import Book from '../models/book.js'
import Member from '../models/member.js'

const createReservation = async (req, res) => {
  try {
    const { isbn, membershipCode,issueDate, expiryDate } = req.body;

    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.copiesAvailable > 0) {
      return res.status(400).json({ message: 'Book is available, no need to reserve' });
    }

    // Check if the member exists
    const member = await Member.findOne({ membershipCode });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if the book is already reserved by the same member
    const existingReservation = await Reservation.findOne({ isbn, membershipCode, returnDate: null });
    if (existingReservation) {
      return res.status(400).json({ message: 'You have already reserved this book' });
    }

    // Create the reservation
    const newReservation = new Reservation({
      isbn,
      membershipCode,
      issueDate,
      expiryDate,
    });

    // Save the reservation
    await newReservation.save();

    res.status(201).json({ message: 'Book reserved successfully', reservation: newReservation });
  } catch (error) {
    console.error("Error in createReservation:", error); 
    res.status(500).json({ error: error.message });
  }
};

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a reservation by ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reservations by member
const getReservationsByMember = async (req, res) => {
  try {
    const reservations = await Reservation.find({ membershipCode: req.params.membershipCode, returnDate: null });
    if (!reservations.length) {
      return res.status(404).json({ message: 'No active reservations found for this member' });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const returnReservedBook = async (req, res) => {
  try {
    const { reservationId, returnDate } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the reservation has expired
    const currentDate = new Date();
    if (currentDate > new Date(reservation.expiryDate)) {
      return res.status(400).json({ message: 'Reservation has expired' });
    }

    // Mark the reservation as returned (returnDate set)
    reservation.returnDate = returnDate;
    await reservation.save();

    // Notify the member that the book is available

    res.status(200).json({ message: 'Reservation returned successfully', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a reservation
const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // Find and remove the reservation
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const issuedAndReservedBook = async (req, res) => {
  const { membershipCode } = req.params;

  try {
    // Log to verify membershipCode
    console.log('Querying for membershipCode:', membershipCode);
    
    // Query reservations by membershipCode
    const reservedBooks = await Reservation.find({ membershipCode })
      .populate('isbn', 'title')  // Ensure population of the 'isbn' field
      .exec();

    // Query transactions for issued books
    const issuedBooks = await Transaction.find({ membershipCode, returnDate: null })
      .populate('isbn', 'title')  // Ensure population of the 'isbn' field
      .exec();

    res.status(200).json({
      reservedBooks: reservedBooks.map(book => ({
        title: book.isbn.title,
        reservationId: book.reservationId,
        issueDate: book.issueDate,
        expiryDate: book.expiryDate
      })),
      issuedBooks: issuedBooks.map(book => ({
        title: book.isbn.title,
        transactionId: book.transactionId,
        issueDate: book.issueDate,
        dueDate: book.dueDate,
        penalty: book.penalty
      }))
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Error fetching member\'s books.' });
  }
};
export {createReservation,getAllReservations,getReservationById,returnReservedBook,cancelReservation,getReservationsByMember,issuedAndReservedBook}
