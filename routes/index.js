const Router = require("express");
const router = new Router();

const authRouter = require("./authRouter");
const cardRouter = require("./cardRouter");

router.post("/login", authRouter);
router.get("/card", cardRouter);

module.exports = router;
