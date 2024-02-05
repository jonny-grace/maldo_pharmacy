const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
      },
    firstname: String,
    lastname: String,
    speciality: String,
    phoneNumber:String,
    email: {
      type: String,
    
    },
  });
  module.exports = mongoose.model('Doctor', doctorSchema);
  
  