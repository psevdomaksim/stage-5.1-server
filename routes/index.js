const Router = require("express");
const router = new Router();

const authRouter = require("./authRouter");
const cardRouter = require("./cardRouter");

router.use("/auth", authRouter);
router.use("/card", cardRouter);

module.exports = router;
