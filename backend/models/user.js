import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  image: { type: String, required: false },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
