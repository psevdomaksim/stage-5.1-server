const Router = require("express");
const router = new Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {signupValidation} = require("../validations/signupValidation");
const {loginValidation} = require("../validations/loginValidation");

router.post("/login",loginValidation, AuthController.login);
router.post("/signup",signupValidation, AuthController.signup);
router.post("/logout",  AuthController.logout);
router.post("/refresh",authMiddleware, AuthController.refresh );

module.exports = router;
