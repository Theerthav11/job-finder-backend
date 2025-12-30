const express = require('express');
const router = express.Router();
const { registerEmployee, loginEmployee, googleLogin, filterOptions } = require('../controllers/employeeController');
const { validateRegistration, validateLogin, validateGoogleLogin, handleValidationErrors } = require('../middleware/validators/employeeValidator');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, validateRegistration, handleValidationErrors, registerEmployee);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, loginEmployee);
router.post('/google-login', authLimiter, validateGoogleLogin, handleValidationErrors, googleLogin);
router.get('/filters', filterOptions);


module.exports = router;
