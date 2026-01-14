const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const Job = require("../models/Job");
const Employee = require("../models/Employee");
const Employer = require("../models/Employer");
const { successResponse } = require('../utils/response');
const { AuthenticationError } = require('../utils/errors');

dotenv.config()

const adminLogin = async(req, res, next) =>{
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username !== adminUsername || password !== adminPassword) {
      throw new AuthenticationError('Invalid username or password');
    }

    const token = jwt.sign({ id: adminUsername }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return successResponse(res, { token }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

// Admin Overview Controller
const getAdminOverview = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalEmployers = await Employer.countDocuments();

    return successResponse(res, {
      totalJobs,
      totalEmployees,
      totalEmployers,
    }, 'Overview fetched successfully');
  } catch (err) {
    next(err);
  }
};

// Get all employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    return successResponse(res, { employees }, 'Employees fetched successfully');
  } catch (err) {
    next(err);
  }
};

// Delete employee
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    return successResponse(res, null, 'Employee deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Get all employers
const getAllEmployers = async (req, res, next) => {
  try {
    const employers = await Employer.find();
    return successResponse(res, { employers }, 'Employers fetched successfully');
  } catch (err) {
    next(err);
  }
};

// Delete employer by ID
const deleteEmployer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Employer.findByIdAndDelete(id);
    return successResponse(res, null, 'Employer deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { adminLogin, getAdminOverview, getAllEmployees, deleteEmployee, getAllEmployers, deleteEmployer }