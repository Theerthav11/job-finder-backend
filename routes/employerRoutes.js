const express = require('express');
const router = express.Router();
const { registerEmployer, loginEmployer, googleLogin, contactEmployee } = require('../controllers/employerController');
const { validateRegistration, validateLogin, validateGoogleLogin, handleValidationErrors } = require('../middleware/validators/employerValidator');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth');

router.post('/register', registerLimiter, validateRegistration, handleValidationErrors, registerEmployer);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, loginEmployer);
router.post('/google-login', authLimiter, validateGoogleLogin, handleValidationErrors, googleLogin);
router.post('/contact-employee', verifyToken, contactEmployee)

module.exports = router;
