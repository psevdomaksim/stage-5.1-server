const cors = require("cors");
const express = require("express");
const router = require("./routes/index");

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", router);

//Avoid CORS issue
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", (req, res) => {
  res.send("server is running.");
});

// Start the server only if this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`JSON Server is running on port ` + PORT);
  });
}

module.exports = { app };
