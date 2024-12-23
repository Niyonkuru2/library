import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['undergraduate', 'postgraduate', 'research', 'faculty'],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  });
const subscriptionModel = mongoose.model.duration || mongoose.model('subscribe',subscriptionSchema)
export default subscriptionModel
