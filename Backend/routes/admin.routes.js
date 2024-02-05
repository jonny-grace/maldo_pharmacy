const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const doctorModel = require("../models/doctor.model");
const maldoReceptionModel = require("../models/maldoReception.model");
const pharmacyModel = require("../models/pharmacy.model");

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

const secretKey = 'your_secret_key';
//User login route


//Registration for doctors
router.post('/register/doctor', authenticateAdmin, async (req, res) => {
  try {
    const { firstname, lastname, username, speciality, phoneNumber, email } = req.body;

    // Validate input
    if (!firstname || !lastname || !username || !speciality || !phoneNumber || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user account for the doctor
    const password = email; // Use email as the default password
    const role = 'doctor';
    const user = new userModel({
     
      username,
      email,
      role,
      password,
    });

    // Save the user in the users table
    await user.save();

    // Create a new doctor
    const doctor = new doctorModel({
      userId: user._id,
      speciality,
      firstname,
      lastname,
      phoneNumber,
      email
    });

    // Save the doctor in the doctors table
    await doctor.save();

    return res.status(200).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});


//Registration for reception
router.post('/register/reception', authenticateAdmin, async (req, res) => {
  try {
    const { firstname, lastname, username, phoneNumber, email } = req.body;

    // Validate input
    if (!firstname || !lastname || !username || !phoneNumber || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user account for the doctor
    const password = email; // Use email as the default password
    const role = 'reception';
    const user = new userModel({
     
      username,
      email,
      role,
      password,
    });

    // Save the user in the users table
    await user.save();

    // Create a new doctor
    const reception = new maldoReceptionModel({
      userId: user._id,
      firstname,
      lastname,
      email,
      phoneNumber,
      
    });

    // Save the doctor in the doctors table
    await reception.save();

    return res.status(200).json({ message: 'Reception registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

//Pharmacy Registration
router.post('/register/pharmacy', authenticateAdmin, async (req, res) => {
  try {
    const { firstname, lastname, pharmacyName, address, Licence_no, username, phoneNumber, email } = req.body;

    // Validate input
    if (!firstname || !lastname || !username  ||!pharmacyName  ||!address  ||!Licence_no  || !phoneNumber || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user account for the doctor
    const password = email; // Use email as the default password
    const role = 'pharmacy';
    const user = new userModel({
     
      username,
      email,
      role,
      password,
    });

    // Save the user in the users table
    await user.save();

    // Create a new doctor
    const pharmacy = new pharmacyModel({
      userId: user._id,
      firstname,
      lastname,
      email,
      pharmacyName,
      phoneNumber,
      address,
      Licence_no
    });

    // Save the doctor in the doctors table
    await pharmacy.save();

    return res.status(200).json({ message: 'Pharmacy registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});
// Middleware for authenticating the admin
async function authenticateAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded email belongs to a user with the admin role
    const username = decoded.username;
    const role=decoded.role;
    const user = await userModel.findOne({ username });
    if (!user || user.role !== 'admin') {
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
