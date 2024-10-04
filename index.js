require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("./routes/index");
const sequelize = require("./db");

const app = express();
app.use(express.json());
app.use(cookieParser());

const whitelist = [
  "http://localhost:3000",
  "https://react-app-brown-pi.vercel.app/",
];
const corsOptions = {
  origin: (origin, cb) => {
    if (whitelist.indexOf(origin) > -1) {
      cb(null, true);
    } else {
      cb(new Error("Forbidden by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api", router);

//Avoid CORS issue
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/", (req, res) => {
  res.send("server is running.");
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(process.env.PORT, () =>
      console.log(`server started listening on ${process.env.PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
