const express = require('express');
const router = express.Router();
const { registerEmployer, loginEmployer, googleLogin, contactEmployee } = require('../controllers/employerController');

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.post('/google-login', googleLogin);
router.post('/contact-employee', contactEmployee)

module.exports = router;
