const Router = require("express");
const router = new Router();
const cardController = require("../controllers/cardController");

router.get("/card", cardController.getCards);

module.exports = router;
