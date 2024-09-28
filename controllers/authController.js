const fs = require("fs");

async function getUsers() {
  try {
    const data = await fs.readFileSync("./db.json", "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData.users;
  } catch (error) {
    throw error;
  }
}

class authController {
  async login(req, res) {
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
  }
}

module.exports = new authController();
