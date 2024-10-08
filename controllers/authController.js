const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

class AuthController {
  #generateJwt(user) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    return { accessToken, refreshToken };
  }

  // Login method
  login = async (req, res, next) => {
    try {
      const user = req.user; // Assuming you just want to return the username
      const { accessToken, refreshToken } = this.#generateJwt(user);

      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  };

  // Signup method
  signup = async (req, res, next) => {
    try {
      const { username, password, firstname, lastname, age } = req.body;

      const hashPassword = await bcrypt.hash(password, 9);

      const user = await User.create({
        username,
        password: hashPassword,
        firstname,
        lastname,
        age,
      });

      const { accessToken, refreshToken } = this.#generateJwt(user);

      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      const errors = JSON.parse(error.message);
      return res.status(400).json({ errors });
    }
  };

  logout = async (req, res) => {
    return res.status(200).json({ message: "Logged out successfully." });
  };

  // Refresh method
  refresh = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const { accessToken, refreshToken } = this.#generateJwt(user);

      return res.json({ accessToken, refreshToken });
    });
  };
}

module.exports = new AuthController();
