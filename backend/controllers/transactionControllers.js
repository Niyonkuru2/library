import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/transaction.js';
import Book from '../models/book.js'; 
import Member from '../models/member.js';

const createTransaction = async (req, res) => {
  try {
    const { isbn, membershipCode, issueDate, dueDate } = req.body;

    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.json({ success: false, message: 'Book not found' });
    }

    // Check if the member exists
    const member = await Member.findOne({ membershipCode });
    if (!member) {
      return res.json({success: false, message: 'Member not found' });
    }

    // Check if the member has reached the maximum issue limit
    if (member.issuedBooks.length >= getMaxIssuedBooks(member.category)) {
      return res.json({ success: false, message: 'You has already issued the maximum number of books Subscribe to get more package' });
    }

    // Generate a unique transactionId
    const transactionId = uuidv4();  // Generate a unique transaction ID

    // Create new transaction
    const newTransaction = new Transaction({
      transactionId, 
      isbn,
      membershipCode,
      issueDate,
      dueDate,
      penalty: 0,
    });
    
    book.copiesAvailable -= 1;
    await book.save();

    member.issuedBooks.push(isbn);
    await member.save();
    await newTransaction.save();

    res.json({ success: true, message: 'Book issued successfully', transaction: newTransaction });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('isbn', 'title')
      .populate('membershipCode', 'name');

    if (!transaction) {
      return res.json({ success: false, message: 'Transaction not found' });
    }
    res.status(200).json({
      success: true,
      transaction: {
        ...transaction.toObject(),
        bookTitle: transaction.isbn.title, 
        memberName: transaction.membershipCode.name,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const returnBook = async (req, res) => {
  try {
    const { transactionId, returnDate } = req.body;

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.json({success:false, message: 'Transaction not found' });
    }
    const overdueDays = calculateOverdueDays(transaction.dueDate, returnDate);
    let penalty = 0;
    if (overdueDays > 0) {
      penalty = overdueDays * 1;
    }

    // Update the transaction with return date and penalty
    transaction.returnDate = returnDate;
    transaction.penalty = penalty;
    await transaction.save();

    // Update book availability
    const book = await Book.findOne({ isbn: transaction.isbn });
    book.copiesAvailable += 1;
    await book.save();

    // Update member issued books
    const member = await Member.findOne({ membershipCode: transaction.membershipCode });
    member.issuedBooks = member.issuedBooks.filter(isbn => isbn !== transaction.isbn);
    await member.save();

    res.res.json({success:true, message: 'Book returned successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get the max books a member can issue based on category
const getMaxIssuedBooks = (category) => {
  const limits = {
    Undergraduate: 2,
    Postgraduate: 4,
    'Research Scholar': 6,
    Faculty: 10,
  };
  return limits[category] || 0;
};

// Helper function to calculate overdue days
const calculateOverdueDays = (dueDate, returnDate) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const timeDifference = returned - due;
  return timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 3600 * 24)) : 0;
};

export {createTransaction,getAllTransactions,returnBook,getTransactionById}
