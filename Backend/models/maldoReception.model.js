const mongoose = require('mongoose');


const receptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    firstname: String,
    lastname: String,
    phoneNumber:String,
    email: {
      type: String,
      unique: true,
    },
  });

  module.exports = mongoose.model('Reception', receptionSchema);
  
  