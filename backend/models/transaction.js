import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({

  transactionId: { type: String, required: true, unique: true },
  isbn: { type: String required: true },
  membershipCode: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  penalty: { type: Number, default: 0 },
});

const transactionModel = mongoose.model.transaction || mongoose.model('transaction',transactionSchema)
export default transactionModel
