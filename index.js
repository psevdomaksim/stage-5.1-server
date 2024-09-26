const cors = require("cors");
const express = require("express");
const fs = require("fs");
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

async function getUsers() {
  try {
    const data = await fs.readFileSync("./db.json", "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData.users;
  } catch (error) {
    throw error;
  }
}

app.get("/cards", async (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, jsonString) => {
    if (err) {
      res.status(500).json({ message: "Error reading db.json file: " + err });
    } else {
      const data = JSON.parse(jsonString);
      return res.send(data.cards);
    }
  });
});

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  let users = [];
  try {
    users = await getUsers();
  } catch (error) {
    return res.status(500).json({ message: "Error reading user data" });
  }

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  if (password !== user.password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  return res.status(200).json(user);
};

app.post("/login", login);

//Avoid CORS issue
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Start the server only if this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`JSON Server is running on port ` + PORT);
  });
}



module.exports = { app, login };
