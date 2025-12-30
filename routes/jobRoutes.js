// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobsByEmployer,
  updateJob,
  deleteJob,
  getJob,
  markInterest,
  getInterestedEmployees
} = require('../controllers/jobController');
const { validateJobCreation, validateJobUpdate, validateJobId, validateMarkInterest, handleValidationErrors } = require('../middleware/validators/jobValidator');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, validateJobCreation, handleValidationErrors, createJob); // POST /api/jobs
router.get('/', getAllJobs); // GET /api/jobs
router.get('/employer/:employerId', getJobsByEmployer); // GET /api/jobs/employer/:employerId
router.put('/:id', verifyToken, validateJobUpdate, handleValidationErrors, updateJob); // PUT /api/jobs/:id
router.get('/:id', validateJobId, handleValidationErrors, getJob); // GET /api/jobs/:id
router.delete('/:id', verifyToken, validateJobId, handleValidationErrors, deleteJob); // DELETE /api/jobs/:id
router.post("/interest", verifyToken, validateMarkInterest, handleValidationErrors, markInterest);
router.get("/:jobId/interested-employees", verifyToken, validateJobId, handleValidationErrors, getInterestedEmployees);

module.exports = router;
