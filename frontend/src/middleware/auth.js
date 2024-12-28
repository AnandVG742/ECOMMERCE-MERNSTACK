const jwt = require("jsonwebtoken");
require("dotenv").config();

function isAuth(req, res, next) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      req.isAuth = false;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      req.isAuth = false;
      return next();
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    req.isAuth = true;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
}

module.exports = isAuth;
