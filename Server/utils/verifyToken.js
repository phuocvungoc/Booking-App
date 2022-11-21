const jwt = require("jsonwebtoken");
const createError = require("../utils/error.js");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return next(createError.createError(401, "You are not authenticated!"));
  }

  const token = authorizationHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(createError.createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

exports.verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError.createError(403, "You are not authorized!"));
    }
  });
};

exports.verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError.createError(403, "You are not authorized!"));
    }
  });
};
