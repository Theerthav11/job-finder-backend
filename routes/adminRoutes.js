const express = require('express');
const { adminLogin, getAdminOverview, getAllEmployees, deleteEmployee, getAllEmployers, deleteEmployer } = require('../controllers/adminController');
const { validateAdminLogin, validateEmployeeId, validateEmployerId, handleValidationErrors } = require('../middleware/validators/adminValidator');
const { authLimiter } = require('../middleware/rateLimiter');
const { verifyAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/login', authLimiter, validateAdminLogin, handleValidationErrors, adminLogin)
router.get('/overview', verifyAdmin, getAdminOverview)
router.get("/employees", verifyAdmin, getAllEmployees);
router.delete("/employees/:id", verifyAdmin, validateEmployeeId, handleValidationErrors, deleteEmployee);
router.get("/employers", verifyAdmin, getAllEmployers);
router.delete("/employers/:id", verifyAdmin, validateEmployerId, handleValidationErrors, deleteEmployer);


module.exports = router;