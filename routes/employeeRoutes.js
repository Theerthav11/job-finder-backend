const express = require('express');
const router = express.Router();
const { registerEmployee, loginEmployee, googleLogin, filterOptions } = require('../controllers/employeeController');

router.post('/register', registerEmployee);
router.post('/login', loginEmployee);
router.post('/google-login', googleLogin);
router.get('/filters', filterOptions);


module.exports = router;
