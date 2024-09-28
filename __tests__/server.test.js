const fs = require("fs");
const { login } = require("../controllers/authController");

jest.mock("fs");

describe("Login Route", () => {
  // Mock users from the db.json file
  const mockDb = {
    users: [
      {
        id: 1,
        username: "john",
        password: "password123",
      },
    ],
  };

  // Mock request and response objects
  const mockReq = (body) => ({ body });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if username and password are missing", async () => {
    const req = mockReq({});
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username and password are required",
    });
  });

  it("should return 500 if there is an error reading the users file", async () => {
    // Simulate an error when reading the file
    fs.readFileSync.mockImplementation(() => {
      throw new Error("Error reading file");
    });

    const req = mockReq({ username: "john", password: "password123" });
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error reading user data",
    });
  });

  it("should return 401 if the username is invalid", async () => {
    // Mock the file reading to return our mock users
    fs.readFileSync.mockReturnValue(JSON.stringify(mockDb));

    const req = mockReq({ username: "invalidUser", password: "password123" });
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid username or password",
    });
  });

  it("should return 401 if the password is invalid", async () => {
    // Mock the file reading to return our mock users
    fs.readFileSync.mockReturnValue(JSON.stringify(mockDb));

    const req = mockReq({ username: "john", password: "wrongpassword" });
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid username or password",
    });
  });

  it("should return 200 and the user data if username and password are correct", async () => {
    // Mock the file reading to return our mock users
    fs.readFileSync.mockReturnValue(JSON.stringify(mockDb));

    const req = mockReq({ username: "john", password: "password123" });
    const res = mockRes();

    await login(req, res);

    // Check if status 200 was called
    expect(res.status).toHaveBeenCalledWith(200);
    // Check if the user object was returned
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: "john",
      password: "password123",
    });
  });
});
