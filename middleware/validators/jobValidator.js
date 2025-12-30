const { body, param, validationResult } = require('express-validator');

const validateJobCreation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  
  body('minSalary')
    .notEmpty().withMessage('Minimum salary is required')
    .isInt({ min: 0 }).withMessage('Minimum salary must be a positive number'),
  
  body('maxSalary')
    .notEmpty().withMessage('Maximum salary is required')
    .isInt({ min: 0 }).withMessage('Maximum salary must be a positive number')
    .custom((value, { req }) => {
      if (parseInt(value) < parseInt(req.body.minSalary)) {
        throw new Error('Maximum salary must be greater than minimum salary');
      }
      return true;
    }),
  
  body('qualification')
    .notEmpty().withMessage('Qualification is required')
    .isIn(['pg', 'ug', 'diploma', 'plustwo', 'sslc']).withMessage('Invalid qualification'),
  
  body('age')
    .notEmpty().withMessage('Age requirement is required')
    .isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  
  body('vacancies')
    .notEmpty().withMessage('Number of vacancies is required')
    .isInt({ min: 1 }).withMessage('Vacancies must be at least 1'),
  
  body('shift')
    .notEmpty().withMessage('Shift is required')
    .isIn(['day', 'night', 'any']).withMessage('Invalid shift value'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Company name must be between 2 and 200 characters'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 500 }).withMessage('Address must be between 5 and 500 characters'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  
  body('whatsapp')
    .trim()
    .notEmpty().withMessage('WhatsApp number is required')
    .matches(/^[0-9]{10}$/).withMessage('WhatsApp number must be 10 digits'),
  
  body('jobDescription')
    .trim()
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Job description must be between 10 and 2000 characters'),
  
  body('employer')
    .notEmpty().withMessage('Employer ID is required')
    .isMongoId().withMessage('Invalid employer ID'),
];

const validateJobUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid job ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  
  body('minSalary')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum salary must be a positive number'),
  
  body('maxSalary')
    .optional()
    .isInt({ min: 0 }).withMessage('Maximum salary must be a positive number'),
  
  body('qualification')
    .optional()
    .isIn(['pg', 'ug', 'diploma', 'plustwo', 'sslc']).withMessage('Invalid qualification'),
  
  body('shift')
    .optional()
    .isIn(['day', 'night', 'any']).withMessage('Invalid shift value'),
];

const validateJobId = [
  param('id')
    .isMongoId().withMessage('Invalid job ID'),
];

const validateMarkInterest = [
  body('jobId')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid job ID'),
  
  body('employeeId')
    .notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid employee ID'),
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
  validateJobCreation,
  validateJobUpdate,
  validateJobId,
  validateMarkInterest,
  handleValidationErrors
};
