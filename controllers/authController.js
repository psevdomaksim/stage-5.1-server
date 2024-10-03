const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/models");

const generateJwt = (id, username, firstname, lastname, age) => {
  const accessToken = jwt.sign(
    { id, username, firstname, lastname, age },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { id, username, firstname, lastname, age },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return { accessToken, refreshToken };
};

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      const errors = {};

      if (!user) {
        errors.username = "User with this username is not found";
      } else {
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
          errors.password = "Wrong password";
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const { accessToken, refreshToken } = generateJwt(
        user.id,
        user.username,
        user.firstname,
        user.lastname,
        user.age
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json({ accessToken });
    } catch (e) {
      console.log(e);
    }
  }

  async signup(req, res, next) {
    try {
      const { username, password, repeatedPassword, firstname, lastname, age } =
        req.body;

      //Validation
      const errors = {};

      if (!username) {
        errors.username = "Username is required";
      }
      if (!password) {
        errors.password = "Password is required";
      }

      if (username.length < 3) {
        errors.username = "Username must contain 3 symbols or more";
      }

      if (password.length < 4) {
        errors.password = "Password must contain 4 symbols or more";
      }

      if (password !== repeatedPassword) {
        errors.repeatedPassword = "Passwords should be the same";
      }

      if (firstname?.length < 3) {
        errors.firstname = "Firstname must contain 3 symbols or more";
      }

      if (lastname?.length < 3) {
        errors.lastname = "Lastname must contain 3 symbols or more";
      }

      if (typeof age !== 'number' || age == 0) {
        errors.age = "Age must be a number and can't be zero";
      }

      const candidate = await User.findOne({ where: { username } });
      if (candidate) {
        errors.username = "An account with this username is already exist";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const hashPassword = await bcrypt.hash(password, 9);
      const user = await User.create({
        username,
        password: hashPassword,
        firstname,
        lastname,
        age,
      });
      const { accessToken, refreshToken } = generateJwt(
        user.id,
        user.username,
        user.firstname,
        user.lastname,
        user.age
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json({ accessToken });
    } catch (e) {
      console.log(e);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
      });

      return res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (e) {
      console.log(e);
    }
  }

  async refresh(req, res) {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const { accessToken, refreshToken } = generateJwt(
        user.id,
        user.username,
        user.firstname,
        user.lastname,
        user.age
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ accessToken });
    });
  }
}

module.exports = new AuthController();
