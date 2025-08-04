const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for yatra creation
const validateYatra = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .escape(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .escape(),
  
  body('category')
    .optional()
    .isIn(['business', 'leisure', 'adventure', 'family', 'romantic', 'educational', 'other'])
    .withMessage('Invalid category selected'),
  
  body('destination')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Destination must be less than 255 characters')
    .escape(),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date in ISO format (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        throw new Error('Date cannot be in the past');
      }
      return true;
    }),
  
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['planned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status selected')
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateYatra,
  handleValidationErrors
}; 