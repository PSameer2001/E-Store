const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.headers?.jwtToken;
    if (accessToken) {
      const verifieduser = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      if (verifieduser) {
        const user = await User.findOne({ _id: verifieduser.id });
        req.authUser = user;
        req.authToken = accessToken;
        next();
      } else {
        throw new Error("User not Verified");
      }
    } else {
        throw new Error("No Access Token");
    }
  } catch (error) {
    console.log(error)
  }
};

module.exports = { verifyToken };
