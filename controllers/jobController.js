// controllers/jobController.js
const Job = require('../models/Job');
const { successResponse } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');

const createJob = async (req, res, next) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    return successResponse(res, { job: newJob }, 'Job posted successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find();
    return successResponse(res, { jobs }, 'Jobs fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getJobsByEmployer = async (req, res, next) => {
  try {
    const { employerId } = req.params;
    const jobs = await Job.find({ employer: employerId });
    return successResponse(res, { jobs }, 'Jobs fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getJob = async(req, res, next) => {
  try{
    const { id } = req.params;
    const job = await Job.findOne({ _id: id });
    
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    
    return successResponse(res, { job }, 'Job fetched successfully');
  }catch(err){
    next(err);
  }
}

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedJob) {
      throw new NotFoundError('Job not found');
    }
    
    return successResponse(res, { job: updatedJob }, 'Job updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    
    if (!deletedJob) {
      throw new NotFoundError('Job not found');
    }
    
    return successResponse(res, null, 'Job deleted successfully');
  } catch (err) {
    next(err);
  }
};

const markInterest = async(req, res, next) => {
  try {
    const { jobId, employeeId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (!job.interested.includes(employeeId)) {
      job.interested.push(employeeId);
      await job.save();
    }

    return successResponse(res, null, 'Interest marked successfully');
  } catch (error) {
    next(error);
  }
}

const getInterestedEmployees = async(req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate("interested");

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return successResponse(res, { employees: job.interested }, 'Interested employees fetched successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createJob,
  getAllJobs,
  getJobsByEmployer,
  updateJob,
  deleteJob,
  getJob,
  markInterest,
  getInterestedEmployees
};
