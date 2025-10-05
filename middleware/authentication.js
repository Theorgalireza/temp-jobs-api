const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const authorization = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer")) {
    throw new UnauthenticatedError("No Token Is Provided.");
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = payload;
    req.user = { userId, name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route.");
  }
};

module.exports = {authorization};
