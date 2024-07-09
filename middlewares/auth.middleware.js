require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) return res.sendStatus(403);
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
  });

  next();
};

module.exports = {
  authenticateToken,
};
