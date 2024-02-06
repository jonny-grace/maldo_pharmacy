const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const doctorModel = require("../models/doctor.model");
const pharmacyModel = require("../models/pharmacy.model");
const patientModel = require("../models/patient.model");
const apointmentModel = require("../models/apointment.model");
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


//Registration for Patients
router.post('/register/patient', authenticateReception, async (req, res) => {
  try {
    const { firstname, lastname, username, age, address, phoneNumber, email } = req.body;

    if (!firstname || !lastname || !username|| !age || !address  || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    // Check if the username already exists
  const existingUsername = await userModel.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ message: 'Username should be unique' });
  }


  // Find the highest patientId in the collection
  const highestPatient = await patientModel.findOne({}, { patientId: 1 }).sort({ patientId: -1 });
  let nextPatientId = 1;
  if (highestPatient) {
    const highestPatientId = highestPatient.patientId;
    const currentNumber = parseInt(highestPatientId.split('-')[1]);
    if (!isNaN(currentNumber)) {
      nextPatientId = currentNumber + 1;
    }
  }

  // Generate the new patientId with the desired format
  const formattedPatientId = `PID-${nextPatientId.toString().padStart(4, '0')}`;

   
    // Create a new user account for the doctor
    const password = formattedPatientId; // Use email as the default password
    const role = 'patient';
    const user = new userModel({
      
      username,
      email,
      
      role,
      password,
    });

    // Save the user in the users table
    await user.save();

    // Create a new doctor
    const patient = new patientModel({
      userId: user._id,
      firstname,
      lastname,
      patientId:formattedPatientId,
      phoneNumber,
      age,
      address,
      email

    });

    // Save the doctor in the doctors table
    await patient.save();

    return res.status(200).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

// Get all Patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await patientModel.find();

    const patientsWithAppointment = await Promise.all(
      patients.map(async (patient) => {
        const appointment = await apointmentModel.findOne({
          patientId: patient.patientId,
          apointment_active: true
        });
        // return (appointment);
    
        if(appointment){
          return {
            ...patient.toObject(),
            hasAppointment: appointment.apointment_active
          };
        }else{
          return {
            ...patient.toObject(),
            hasAppointment: false
          };
        }
        
      })
    );

    res.json({ patients: patientsWithAppointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 // Get single Patient
router.get('/patient/:id',async (req, res) => {
    try {
        const patient = await patientModel.findOne({ patientId: req.params.id });
    res.json(patient);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
    });
 //Get all Doctors
 router.get('/doctors', async (req, res) => {
        try {
          const doctorId = await userModel.find({ role: 'doctor' }, { firstname: 1, lastname: 1, _id: 1 });
          const doctors= await doctorModel.find({userId:doctorId},{ firstname: 1, lastname: 1,speciality:1,userId:1 });
          res.json(doctors);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
 //Get single Doctor
router.get('/doctor/:id', async (req, res) => {
        try {
          const doctors = await userModel.findOne({ role: 'doctor',_id: req.params.id }, { firstname: 1, lastname: 1, _id: 1 });
          res.json(doctors);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
//Create appoinyment
router.post('/create/appointment', async (req, res) => {
  try {
    const { PID, doctorId  } = req.body;

    console.log(doctorId)
    const doctor = await doctorModel.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the patient with the provided PID is available
    const patient = await patientModel.findOne({ patientId: PID });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Assuming you have an appointmentModel for creating appointments
    const appointment = await apointmentModel.create({
      patientId: PID,
      doctorId
    });

    res.send({message:'successfully appointed',doctor});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update the status us the prescription to completed after print
router.put('/prescription/:prescriptionId', async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    // Update the prescription status
    const updatedPrescription = await prescriptionModel.findByIdAndUpdate(
      prescriptionId,
      { status },
      { new: true }
    );

    res.json({ message: 'Prescription status updated successfully', prescription: updatedPrescription });
  } catch (error) {
    console.error('Error updating prescription status:', error);
    res.status(500).json({ error: 'An error occurred while updating the prescription status' });
  }
});
// get Prescriptions
// Get all Patients
router.get('/prescriptions', async (req, res) => {
  try {
    const prescriptions = await prescriptionModel.find({
      $or: [
        { status: { $in: ['assigned', 'waiting', 'confirmedByPharmacy'] } },
        { status: 'completed', pharmacyName: { $ne: '' } }
      ]
    });
    // Create an array to store the updated prescriptions with medicines
    const updatedPrescriptions = [];

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Get the prescription ID
      const prescriptionId = prescription._id;

      // Find the medicines associated with the prescription using the prescriptionId
      const medicines = await medicineModel.find({ prescriptionId });

      // Create an array to store the medicine details
      const medicineDetails = [];

      // Loop through each medicine
      for (const medicine of medicines) {
        // Extract the relevant medicine details
        const { name, description ,price,availablity} = medicine;
        // Add the medicine details to the medicineDetails array
        medicineDetails.push({ name, description,price,availablity });
      }

      // Create a new object with the prescription data and the medicine details
      const updatedPrescription = {
        PID: prescription.patientId,
        prescriptionId:prescription._id,
        patientName: prescription.patientFullName,
        doctorName: prescription.doctorFullName,
        age: prescription.age,
        medicines: medicineDetails,
        pharmacy:prescription.pharmacyName,
        status: prescription.status
      };

      // Push the updated prescription object to the array
      updatedPrescriptions.push(updatedPrescription);
    }

    res.json(updatedPrescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  // Get single Priscription
  router.get('/print/:Prid',async (req, res) => {
    const prescriptionId=req.params.Prid;
    try {
        const prescription = await prescriptionModel.findById( prescriptionId );
        // const prescriptionId= prescription._id;
        const medicines = await medicineModel.find({ prescriptionId });
  

   
      // Create an array to store the medicine details
      const medicineDetails = [];

      // Loop through each medicine
      for (const medicine of medicines) {
        // Extract the relevant medicine details
        const { name, description } = medicine;
        // Add the medicine details to the medicineDetails array
        medicineDetails.push({ name, description });
      }

      const updatedPrescription = {
        patientId: prescription.patientId,
        prescriptionId:prescription._id,
       
        patientFullName: prescription.patientFullName,
        doctorFullName: prescription.doctorFullName,
        age: prescription.age,
        medicines: medicineDetails
       
      };

  res.json(updatedPrescription);
  await apointmentModel.updateOne({ _id: prescription.apointmentId }, { apointment_active: false });
  await prescriptionModel.updateOne({ _id: prescription._id }, { status: 'completed' });
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
  });


  router.get('/confirm/:Prid',async (req, res) => {
    const prescriptionId=req.params.Prid;
    try {
      const prescription = await prescriptionModel.findOne({ _id: prescriptionId, status: 'confirmedByPharmacy' });
        // const prescriptionId= prescription._id;
        const medicines = await medicineModel.find({ prescriptionId });
  

   
      // Create an array to store the medicine details
      const medicineDetails = [];

      // Loop through each medicine
      for (const medicine of medicines) {
        // Extract the relevant medicine details
        const { name, description ,price} = medicine;
        // Add the medicine details to the medicineDetails array
        medicineDetails.push({ name, description,price });
      }

      const updatedPrescription = {
        patientId: prescription.patientId,
        prescriptionId:prescription._id,
       
        patientFullName: prescription.patientFullName,
        doctorFullName: prescription.doctorFullName,
        age: prescription.age,
        medicines: medicineDetails,
        paymentStatus:"Paid"
       
      };

  res.json(updatedPrescription);
  await apointmentModel.updateOne({ _id: prescription.apointmentId }, { apointment_active: false });
  await prescriptionModel.updateOne({ _id: prescription._id }, { status: 'completed' });
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
  });

  
// Get single Priscription
router.get('/prescription/:Prid', async (req, res) => {
  const prescriptionId = req.params.Prid;
  
  try {
    const prescription = await prescriptionModel.findById(prescriptionId);
  
    // Find medicines with the prescriptionId from the medicines table
    const medicines = await medicineModel.find({ prescriptionId: prescriptionId });
  
    const response = {
      prescription: prescription,
      medicines: medicines
    };
  
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//send prescription to patient
  router.get('/order/:Prid',async (req, res) => {
    const prescriptionId=req.params.Prid;
    try {
        const prescription = await prescriptionModel.findById( prescriptionId );

    await prescriptionModel.updateOne({ _id: prescriptionId}, { status: 'waiting' });
    res.json({medicine:"medicine request sent to pharmacy",prescription})
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
    });

async function authenticateReception(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const user = await userModel.findOne({ username });
    if (!user || user.role !== 'reception') {
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
