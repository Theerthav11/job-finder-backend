const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerEmployee = async (req, res) => {
  try {
    const { fullname, email, phone, age, gender, qualification, password } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      fullname,
      email,
      phone,
      age,
      gender,
      qualification,
      password: hashedPassword,
    });

    await newEmployee.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginEmployee = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const employee = await Employee.findOne({ email });
      if (!employee) {
        return res.status(404).send("Employee not found");
      }
  
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(401).send("Invalid password");
      }

      const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

      res.status(200).json({
        message: "Login successful",
        token,
        employee: {
          id: employee._id,
          name: employee.fullname,
          email: employee.email
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  };

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let employee = await Employee.findOne({ email });

    if (!employee) {
      // Create new employee with Google data
      employee = new Employee({
        fullname: name,
        email,
        googleId,
        phone: '', // Will need to be filled later
        age: 18, // Default value
        gender: 'other', // Default value
        qualification: 'graduate', // Default value
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
      });
      await employee.save();
    }

    const jwtToken = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.status(200).json({
      token: jwtToken,
      employee: {
        id: employee._id,
        name: employee.fullname,
        email: employee.email
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

  const filterOptions = async(req, res) => {
    try {
      const categories = await Job.distinct('title');
      const locations = await Job.distinct('location');
      
      const salaries = await Job.find({}, 'minSalary maxSalary');
      const salaryRanges = [];
  
      salaries.forEach(job => {
        const range = `₹${job.minSalary} - ₹${job.maxSalary}`;
        if (!salaryRanges.includes(range)) {
          salaryRanges.push(range);
        }
      });
      res.json({ categories, locations, salaryRanges });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to fetch filters'});
    }
  }

module.exports = { registerEmployee, loginEmployee, googleLogin, filterOptions };
