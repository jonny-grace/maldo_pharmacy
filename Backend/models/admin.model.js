const { string } = require('joi');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
      },
    firstname: String,
    lastname:String,
  email: String,
  phoneNumber:String
  });
  module.exports = mongoose.model('Admin', adminSchema);
  