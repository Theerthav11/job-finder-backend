const { body, param, validationResult } = require('express-validator');

const validateAdminLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const validateEmployeeId = [
  param('id')
    .isMongoId().withMessage('Invalid employee ID'),
];

const validateEmployerId = [
  param('id')
    .isMongoId().withMessage('Invalid employer ID'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateAdminLogin,
  validateEmployeeId,
  validateEmployerId,
  handleValidationErrors
};
