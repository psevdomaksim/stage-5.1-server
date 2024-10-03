const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const accessToken = authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res
            .status(403)
            .json({ message: "Refresh token not provided" });
        }

        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
          (err, userFromRefresh) => {
            if (err) {
              return res.status(403).json({ message: "Invalid refresh token" });
            }

            const newAccessToken = jwt.sign(
              {
                id: userFromRefresh.id,
                username: userFromRefresh.username,
                firstname: userFromRefresh.firstname,
                lastname: userFromRefresh.lastname,
                age: userFromRefresh.age,
              },
              process.env.JWT_ACCESS_SECRET,
              {
                expiresIn: "15m",
              }
            );
            res.setHeader("Authorization", `Bearer ${newAccessToken}`);
            req.user = userFromRefresh;
            return next();
          }
        );
      } else {
        return res.status(403).json({ message: "Invalid access token" });
      }
    } else {
      req.user = user;
      next();
    }
  });
};
