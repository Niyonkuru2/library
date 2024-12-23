import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reportType: { type: String, enum: ['overdue', 'unused'], required: true },
  bookTitle: { type: String, required: true },
  dueDate: { type: Date },
  lastIssued: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const reportModel = mongoose.models.report || mongoose.model('report', ReportSchema);

export default reportModel;
