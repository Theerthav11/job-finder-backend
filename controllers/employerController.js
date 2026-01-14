const Employer = require('../models/Employer');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
const Job = require('../models/Job');
const { handleGoogleAuth } = require('../utils/googleAuth');
const { sendShortlistEmail } = require('../utils/emailService');
const { successResponse, errorResponse } = require('../utils/response');
const { ConflictError, AuthenticationError, NotFoundError, ServerError } = require('../utils/errors');

dotenv.config()

const registerEmployer = async (req, res, next) => {
  try {
    const { name, email, phone, age, gender, password } = req.body;

    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = new Employer({
      name,
      email,
      phone,
      age,
      gender,
      password: hashedPassword
    });

    await newEmployer.save();
    return successResponse(res, null, 'Employer registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

const loginEmployer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const employer = await Employer.findOne({ email });
    if (!employer) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    return successResponse(res, {
      token,
      employer: {
        id: employer._id,
        name: employer.name,
        email: employer.email
      }
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    const employer = await handleGoogleAuth(Employer, token, {
      phone: '',
      age: 18,
      gender: 'other'
    });

    const jwtToken = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    return successResponse(res, {
      token: jwtToken,
      employer: {
        id: employer._id,
        name: employer.name,
        email: employer.email
      }
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const contactEmployee = async (req, res, next) => {
  try {
    const { userId, jobId } = req.body;

    // Populate the interested employees
    const job = await Job.findById(jobId).populate("interested", "fullname email phone");

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Find the specific employee from the interested list
    const employee = job.interested.find(emp => emp._id.toString() === userId);

    if (!employee) {
      throw new NotFoundError('Employee is not interested in this job');
    }

    // Send email using utility
    await sendShortlistEmail(employee, job);

    return successResponse(res, null, 'Contact email sent successfully');
  } catch (err) {
    next(err);
  }
};


module.exports = { registerEmployer, loginEmployer, googleLogin, contactEmployee };
