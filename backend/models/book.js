import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  isbn: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  rackNumber: { type: String, required: true },
  copiesAvailable: { type: Number, required: true },
  lastIssuedDate: { type: Date, default: null },
  image: { type: String, required: false }, 
  category: { 
    type: String, 
    required: true, 
    enum: ['All', 'Fiction', 'Non-Fiction', 'History', 'Biography','Science'],
    default: 'All' 
  },
  description:{ type: String, required: true },
});

const bookModel = mongoose.models.book || mongoose.model('book', BookSchema);

export default bookModel;
