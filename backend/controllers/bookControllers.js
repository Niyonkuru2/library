import Book from '../models/book.js'

import {v2 as cloudinary} from 'cloudinary'

//create book
const createBook = async (req, res) => {
  try {
    const { isbn, title, author, rackNumber, copiesAvailable, lastIssuedDate, category,description } = req.body;

    if (!isbn || !title || !author || !rackNumber || !copiesAvailable || !category || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const validCategories = ['All', 'Fiction', 'Non-Fiction', 'History', 'Biography','Science'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category selected." });
    }
    const exists = await Book.findOne({isbn});
    
    if(exists){
       return res.status(400).json({error:"Existing Book with this ISBN Please try another"});
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }
    const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
    const imageUrl = imageUpload.secure_url;
    const newBook = new Book({
      isbn,
      title,
      author,
      rackNumber,
      copiesAvailable,
      lastIssuedDate: lastIssuedDate ? new Date(lastIssuedDate) : null, // Parse to Date
      category,
      description, 
      image: imageUrl,

    });

    // Save the book to the database
    await newBook.save();

    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a book by ISBN
const getBookByIsbn = async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, rackNumber, copiesAvailable, image, lastIssuedDate, category,description } = req.body;

    let imageUrl = null;
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
      imageUrl = imageUpload.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    // Validate the category
    const validCategories = ['All', 'Fiction', 'Non-Fiction', 'History', 'Biography','Science'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category selected." });
    }

    // Find and update the book by ISBN
    const updatedBook = await Book.findOneAndUpdate(
      { isbn: req.params.isbn },
      {
        title,
        author,
        rackNumber,
        copiesAvailable,
        description,
        image: imageUrl,
        lastIssuedDate: lastIssuedDate ? new Date(lastIssuedDate) : null,
        category: category || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a book by ISBN
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({ isbn: req.params.isbn });
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export  {createBook,getAllBooks,getBookByIsbn,updateBook,deleteBook}