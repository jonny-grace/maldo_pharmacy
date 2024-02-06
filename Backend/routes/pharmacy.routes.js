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
router.get('/prescriptions', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const currentUser= await userModel.findOne({username})
    const userId=currentUser._id;
    const pharmacy = await pharmacyModel.findOne({userId})
    const pharmacyName= pharmacy.pharmacyName;

    try {
      const filter = {
        $or: [
          { status: 'waiting' },
          { pharmacyName: pharmacyName, status: 'completed' }
        ]
      };
      
      const prescriptions = await prescriptionModel.find(filter);

      // const prescriptions = await prescriptionModel.find({ status: { $in: ['waiting'] } });
  
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
          const { name, description } = medicine;
          // Add the medicine details to the medicineDetails array
          medicineDetails.push({ name, description });
        }
  
        // Create a new object with the prescription data and the medicine details
        const updatedPrescription = {
        //   patientId: prescription.patientId,
        prescriptionId:prescription._id,
          patientFullName: prescription.patientFullName,
          doctorFullName: prescription.doctorFullName,
          age: prescription.patientAge,
          medicines: medicineDetails,
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
 router.get('/prescription/:Prid',authenticatePharmacy,async (req, res) => {
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
        
        prescriptionId:prescription._id,
        patientFullName: prescription.patientFullName,
        doctorFullName: prescription.doctorFullName,
        patientAge: prescription.patientAge,
        medicines: medicineDetails
       
      };
  res.json(updatedPrescription);
  // await apointmentModel.updateOne({ _id: prescription.apointmentId }, { apointment_active: false });
  // await prescriptionModel.updateOne({ _id: prescription._id }, { status: 'completed' });
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
  });


   
//   router.post('/response/:Prid',async (req, res) => {
//     const prescriptionId=req.params.Prid;
//     try {
//         const { name,price, availablity } = req.body;
//         const prescription = await prescriptionModel.findById( prescriptionId );
//         // const prescriptionId= prescription._id;
//         const medicines = await medicineModel.find({ prescriptionId });
  
//       // Create an array to store the medicine details
//       const medicineDetails = [];

//       // Loop through each medicine
//       for (const medicine of medicines) {

//         //here i want to get the medicine with the medicine name and update the price and availablity of that medicine with the data from the body

//       }

      
//   res.send('prescription updated by pharmacy');
  
//   } catch (err) {
//   res.status(500).json({ message: err.message });
//   }
//   });
   
router.post('/response/:Prid', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const user = await userModel.findOne({ username });
    console.log('user',user)
const userId=user._id;
const pharmacy = await pharmacyModel.findOne({ userId });
const pharmacyName = pharmacy ? pharmacy.pharmacyName : null;
    
    const prescriptionId = req.params.Prid;
    try {
      const medicines = req.body;
      console.log(medicines)
      const prescription = await prescriptionModel.findById(prescriptionId);
  
      if (prescription) {
        // Loop through each medicine in the request body
        for (const medicine of medicines) {
          const { name, price, availablity } = medicine;
  
          // Find the medicine with the specified prescriptionId and name
          const existingMedicine = await medicineModel.findOne({ prescriptionId, name });
  
          if (existingMedicine) {
            // Update the price and availability of the medicine
            existingMedicine.price = price;
            existingMedicine.availablity = availablity;
  
            // Save the updated medicine
            await existingMedicine.save();
          }
        }
        await prescriptionModel.updateOne({ _id: prescriptionId}, { status: 'confirmedByPharmacy',pharmacyName });
        
        res.json({ message: 'Medicines updated successfully' });
      } else {
        res.status(404).json({ message: 'Prescription not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/orders',authenticatePharmacy, async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const user = await userModel.findOne({ username });
const userId=user._id;
const pharmacy = await pharmacyModel.findOne({ userId });
const pharmacyName = pharmacy ? pharmacy.pharmacyName : null;
   
    try {
      const prescriptions = await prescriptionModel.find({ status: { $in: ['completed'] },pharmacyName: pharmacyName});
  
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
          const { name, description,price,availablity } = medicine;
          // Add the medicine details to the medicineDetails array
          medicineDetails.push({ name, description,price,availablity });
        }
  
        // Create a new object with the prescription data and the medicine details
        const updatedPrescription = {
        //   patientId: prescription.patientId,
        //   prescriptionId:prescription._id,
          patientFullName: prescription.patientFullName,
          doctorFullName: prescription.doctorFullName,
          age: prescription.age,
          medicines: medicineDetails,
          paymentStatus:"Paid"
        //   status: prescription.status
        };
  
        // Push the updated prescription object to the array
        updatedPrescriptions.push(updatedPrescription);
      }
  
      res.json(updatedPrescriptions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });






async function authenticatePharmacy(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const user = await userModel.findOne({ username });
    if (!user || user.role !== 'pharmacy') {
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
