const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const doctorModel = require("../models/doctor.model");
const pharmacyModel = require("../models/pharmacy.model");
const patientModel = require("../models/patient.model");
const apointmentModel = require("../models/apointment.model");
const { default: mongoose } = require("mongoose");
const prescriptionModel = require("../models/prescription.model");
const medicineModel = require("../models/medicine.model");

const secretKey = 'your_secret_key';
// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "secretkey");
    req.user = decoded;
    res.send(req.user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};



// Get all assigned apointments
router.get('/appointments',authenticateDoctor, async (req, res) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const username = decoded.username;
    // Get the doctor 
    const doctor = await userModel.findOne({ username });

    if(!doctor) {
      return res.status(404).json({message: 'Doctor not found'})
    }

    const doctorId = doctor._id;

    // Find all appointments for this doctor
    const appointments = await apointmentModel.find({ doctorId, healed:false });
    const doctorDetail= await doctorModel.findOne({userId:doctorId})

    // Group appointments by doctorId
    const appointmentsByDoctor = {};

    for(const appointment of appointments) {

      const { patientId } = appointment;

      // Find patient 
      const patient = await patientModel.findOne({ patientId });

      if(!patient) {
        return res.status(404).json({message: 'Patient not found'})  
      }


      // Extract required fields
      const patientDetails = {
        firstName: patient.firstname,
        lastName: patient.lastname,
        age: patient.age  
      };

      

      // Create appointment object
      const appointmentData = {
        appointmentId: appointment._id,
        patient: patientDetails
      }

      // Add to group 
      if(!appointmentsByDoctor[doctorId]) {
        appointmentsByDoctor[doctorId] = {
      doctor: {
        firstName: doctorDetail.firstname, 
        lastName: doctorDetail.lastname  
      },
      appointments: []
    };
      }

      appointmentsByDoctor[doctorId].appointments.push(appointmentData);

    }

    res.json(appointmentsByDoctor);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});
    // Get single Patient
 router.get('/appointment/:id', authenticateDoctor, async (req, res) => {
  const id=req.params.id
    try {
        const apointment = await apointmentModel.findOne({_id:id  });
        const patientId=apointment.patientId;
        const doctorId=apointment.doctorId;
        const patient = await patientModel.findOne({ patientId }, { firstname: 1, lastname: 1, age: 1 });
        const doctor = await doctorModel.findOne({ userId:doctorId },{ firstname: 1, lastname: 1,speciality:1});

      if(!patient) {
        return res.status(404).json({message: 'Patient not found'})  
      }
      if(!doctor) {
        return res.status(404).json({message: 'Patient not found'})  
      }

      const apointmentData={
        patient,
        doctor
      }
    res.json(apointmentData);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
    });
    
    router.post('/create/prescription', async (req, res) => {
      try {
        const { patientId, pfirstname, plastname, dfirstname, dlastname, patientAge, medicines, apointmentId } = req.body;
    
        // Concatenate patient full name
        const patientFullName = pfirstname + ' ' + plastname;
    
        // Concatenate doctor full name
        const doctorFullName = dfirstname + ' ' + dlastname;
    
        // Create a new Prescription instance
        const prescription = new prescriptionModel({
          apointmentId,
          patientId,
          patientFullName,
          doctorFullName,
          patientAge,
          status: 'assigned'
        });
    
        // Save the prescription to the database
        await prescription.save();
    
        // Create an array to store the medicine IDs
        const medicineIds = [];
    
        // Loop through the medicines array and save each medicine to the Medicine table
        for (const medicine of medicines) {
          const { name, description } = medicine;
    
          // Create a new Medicine instance
          const medicineObj = new medicineModel({
            prescriptionId: prescription._id, // Set the prescription ID
            name,
            description
          });
    
          // Save the medicine to the database
          await medicineObj.save();
    
        }
    
        
        await apointmentModel.updateOne({ _id: apointmentId }, { healed: true });
    
        res.json({ message: 'Prescription created successfully' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });







async function authenticateDoctor(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const user = await userModel.findOne({ username });
    if (!user || user.role !== 'doctor') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Forbidden' });
  }
}





router.post("/logout", verifyToken, (req, res) => {
  res.json({ message: "Logout successful" });
});
module.exports = router;
