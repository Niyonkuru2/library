import validator from "validator";
import userModel from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import memberModel from "../models/member.js";
import nodemailer from 'nodemailer';

// Function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN);
}

// Function to send notification
const sendNotification = async (email, title, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: title,
      text: message
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const isValid = validator.matches(password, specialChars);

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }
    if (!isValid) {
      return res.json({ success: false, message: "Include special characters in your password" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    // Save the user
    const user = await newUser.save();

    // Generate membership code
    const membershipCode = `M${user._id.toString().slice(-5)}`;

    // Create a member record linked to the user
    const newMember = new memberModel({
      membershipCode,
      name: user.name,
      category: 'Undergraduate', 
    });

    // Save the member record
    await newMember.save();

    // Send the membership code as a notification
    await sendNotification(user.email, 'Membership Code Assigned', `Your membership code to use on HyperBook Library is: ${membershipCode}`);

    // Generate JWT token for the user
    const token = createToken(user._id);

    res.json({ success: true, message: "User created and membership code assigned", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Endpoint to request a password reset
const requestResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const token = createToken(user._id);
    const resetLink = `${process.env.FRONTEND_URL}reset-password/${token}`;

    // Send the reset link via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    res.send({
      success: true,
      message: 'Password reset link sent'
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
}

// Endpoint to reset the password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const isValid = validator.matches(newPassword, specialChars);

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }
    if (newPassword.length <= 8) {
      return res.json({ success: false, message: "Your password must be greater than 8 characters" });
    }
    if (!isValid) {
      return res.json({ success: false, message: "Include special characters in your password" });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.send({ message: 'Password updated successfully', success: true });
  } catch (error) {
    res.send({ message: 'Invalid or expired token', success: false });
  }
}

export { registerUser, loginUser,requestResetPassword, resetPassword }
