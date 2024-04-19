const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyAdminToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.jwtAdminToken;
    if (accessToken) {
      const verifieduser = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      if (verifieduser) {
        const user = await User.findOne({ _id: verifieduser.id });
        req.authAdmin = user;
        req.authAdminToken = accessToken;
        next();
      } else {
        throw new Error("Admin not Verified");
      }
    } else {
        // throw new Error("No Access Token");
    }
  } catch (error) {
    console.log(error)
  }
};

module.exports = { verifyAdminToken };
