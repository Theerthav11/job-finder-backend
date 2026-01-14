const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { handleGoogleAuth } = require('../utils/googleAuth');
const { successResponse, errorResponse } = require('../utils/response');
const { ConflictError, AuthenticationError, NotFoundError } = require('../utils/errors');

const registerEmployee = async (req, res, next) => {
  try {
    const { fullname, email, phone, age, gender, qualification, password } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      throw new ConflictError('Email already registered');
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

    return successResponse(res, null, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    return successResponse(res, {
      token,
      employee: {
        id: employee._id,
        name: employee.fullname,
        email: employee.email
      }
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    const employee = await handleGoogleAuth(Employee, token, {
      phone: '',
      age: 18,
      gender: 'other',
      qualification: 'graduate'
    });

    const jwtToken = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    return successResponse(res, {
      token: jwtToken,
      employee: {
        id: employee._id,
        name: employee.fullname,
        email: employee.email
      }
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const filterOptions = async(req, res, next) => {
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

    return successResponse(res, { categories, locations, salaryRanges }, 'Filters fetched successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = { registerEmployee, loginEmployee, googleLogin, filterOptions };
