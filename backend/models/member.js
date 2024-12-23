import mongoose from "mongoose";
const memberSchema = new mongoose.Schema({
  membershipCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Undergraduate', 'Postgraduate', 'Research Scholar', 'Faculty'], 
    required: true 
  },
  issuedBooks: { 
    type: [String], 
    default: [], 
    validate: {
      validator: function(issuedBooks) {
        const limits = {
          Undergraduate: 2,
          Postgraduate: 4,
          'Research Scholar': 6,
          Faculty: 10,
        };
        return issuedBooks.length <= limits[this.category];
      },
      message: 'Issued books exceed the limit for the membership category.',
    },
  },
});


const memberModel = mongoose.model.member || mongoose.model('member',memberSchema)
export default memberModel
