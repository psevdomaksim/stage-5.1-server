const { check, body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");

const loginValidation = [
  // Validation rules
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must contain 3 symbols or more"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must contain 4 symbols or more"),

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

    const { username, password } = req.body;
    const customErrors = {};

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        customErrors.username = "Authorization error";
      } else {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
          customErrors.password = "Wrong password";
        }
      }

      if (Object.keys(customErrors).length > 0) {
        return res.status(400).json({ errors: customErrors });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

module.exports = {
  loginValidation,
};
