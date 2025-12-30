const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,
  age: Number,
  gender: String,
  password: String, // hashed
  googleId: String, // Google OAuth ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employer', employerSchema);
