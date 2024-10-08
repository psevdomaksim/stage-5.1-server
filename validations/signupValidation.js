const { check, validationResult } = require("express-validator");
const { User } = require("../models/models");

const signupValidation = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must contain at least 3 characters"),

  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must contain at least 4 characters")
    .matches(/(?=.*[a-zA-Z])/)
    .withMessage("Password must contain at least one letter")
    .matches(/(?=.*\d)/)
    .withMessage("Password must contain at least one number"),

  check("repeatedPassword").custom((repeatedPassword, { req }) => {
    if (repeatedPassword !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),

  check("firstname")
    .isLength({ min: 3 })
    .withMessage("First name must contain at least 3 characters"),

  check("lastname")
    .isLength({ min: 3 })
    .withMessage("Last name must contain at least 3 characters"),

  check("age")
    .isNumeric()
    .withMessage("Age must be a number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Age must be greater than zero");
      }
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().reduce((acc, err) => {
          const key = err.path;
          acc[key] = err.msg;
          return acc;
        }, {}),
      });
    }

    const { username } = req.body;

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res
          .status(400)
          .json({ errors: { username: "Username already exists" } });
      }

      next();
    } catch (e) {
      return res.status(500).json(e);
    }
  },
];

module.exports = {
  signupValidation,
};
