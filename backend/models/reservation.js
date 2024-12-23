import mongoose from "mongoose";
const reservationSchema = new mongoose.Schema({
  isbn: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  reservationId: {
    type: String,
    default: () => `RES-${Date.now()}`,
  },
  membershipCode: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
});

const reservationModel = mongoose.model.reservation || mongoose.model('reservation',reservationSchema)
export default reservationModel
