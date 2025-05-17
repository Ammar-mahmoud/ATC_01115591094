const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Too short name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) throw new Error('Email already in use');
      })
    ),

  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty().withMessage('Password confirmation is required'),

  check('gender')
    .optional()
    .isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),

  validatorMiddleware,
];


exports.loginValidator = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  check('password')
    .notEmpty().withMessage('Password is required'),

  validatorMiddleware,
];
