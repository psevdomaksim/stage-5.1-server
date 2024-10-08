const Router = require("express");
const router = new Router();
const CardController = require("../controllers/cardController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/",authMiddleware, CardController.getCards);

module.exports = router;
