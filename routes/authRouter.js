const Router = require("express");
const router = new Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/signup", AuthController.signup);
router.post("/refresh",authMiddleware, AuthController.refresh );

module.exports = router;
