require("dotenv").config();
const jwt = require("jsonwebtoken");

const getAuthToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};


module.exports = {
  getAuthToken
};
