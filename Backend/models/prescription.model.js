const mongoose = require('mongoose');


const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: 'Patient',
  },
  patientFullName: String,
  patientAge: String,
  apointmentId:{
    type:String,
    ref:"Apointment"
  },
  doctorFullName: String,// Update to an array of medicineSchema
  assignedDate: Date,
  status: String,
  pharmacyName:{
    type:String,
    default:''
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);