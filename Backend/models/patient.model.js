const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  firstname: String,
  lastname: String,
  patientId: {
    type: String,
    unique: true, // Make the email field optional
  },
  phoneNumber: String,
  email: {
    type: String,
    required: false, // Make the email field optional
  },
  
  age:String,
  address:String,
  dateOfRegistration: {
    type: Date,
    default: Date.now, // Add a default value of the current date and time
  },
});

module.exports = mongoose.model('Patient', patientSchema);