const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const path = require("path");
const { generateToken } = require("../middlewares/jwtToken");
const { sendEmail } = require("../components/VerificationAuth/sendEmail");
const round = Number(process.env.round);
const { v4: uuidv4 } = require("uuid");

// Register a User
const addUser = async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    // if (!validator.isStrongPassword(password)) {
    //   return res.send({ message: "Password too weak" });
    // }

    if (!name) {
      return res.json({ message: "Please Enter Name" });
    }

    if (!email) {
      return res.json({ message: "Please Enter Email" });
    }

    if (!password) {
      return res.json({ message: "Please Enter Password" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid Email" });
    }

    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      if (password === cpassword) {
        const hashPassword = await bcrypt.hash(password, round);

        const userDetail = new User({
          name: name,
          email: email,
          password: hashPassword,
          cpassword: cpassword,
          phone: "",
          address: "",
        });

        // Hash password before register
        // UserSchema.pre('save', async function (next) {
        //   this.password = await bcrypt.hash(this.password, round);
        //   next();
        // });

        const result = await userDetail.save();

        if (result) {
          const pathname = path.join(__dirname, "../views/VerifyEmailUI.ejs");
          const currentUser = await User.findOne({ email: email });
          const uniqueStr = uuidv4();
          sendEmail(
            currentUser.email,
            currentUser.id,
            currentUser.name,
            "Verify Email",
            "Welcome",
            pathname
          );
        }

        return res.status(201).json({ message: "success" });
      } else {
        return res.json({ message: "Password not match" });
      }
    } else {
      return res.json({ message: "User Already Exist" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// verify Email
const verifyEmail = async (req, res) => {
  const { email, Id } = req.params;

  const findUser = await User.findOne({ email: email, id: Id });

  if (findUser) {
    if (!findUser.verified) {
      await User.findOneAndUpdate({ _id: Id }, { $set: { verified: true } });
    }

    res.render(path.join(__dirname, "../views/successVerification.ejs"), {
      email,
      name: findUser.name,
    });
  } else {
    res.send("User not Exist");
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({ message: "Please Enter Email" });
    }

    if (!password) {
      return res.json({ message: "Please Enter Password" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid Email" });
    }

    // Match password before login
    // UserSchema.methods.isPasswordMatched = async function (enteredPassword) {
    //   return await bcrypt.compare(enteredPassword, this.password);
    // }

    const findUser = await User.findOne({ email: email });

    if (findUser && (await bcrypt.compare(password, findUser.password))) {
      if (findUser.verified) {
        const token = generateToken(findUser?._id);
        res.cookie("jwtToken", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({
          authUser: {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            phone: findUser.phone,
            address: findUser.address,
            isAdmin: findUser.isAdmin,
            isSuperAdmin: findUser.isSuperAdmin,
            token: token
          },
          message: "success",
        });
      } else {
        return res.json({
          message: "Email Not Verified",
        });
      }
    } else {
      return res.json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// GetUser
const getUserData = async (req, res) => {
  const accessToken = req.cookies?.jwtToken;
  if (accessToken) {
    const verifieduser = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (verifieduser) {
      const user = await User.findOne({ _id: verifieduser.id });
      const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        imageUrl: user.imageUrl
      };
      return res.json({ userData });
    } else {
      return res.json({ userData: "" });
    }
  } else {
    return res.json({ userData: "" });
  }
};

// Check User Exist
const SendOtp = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    var min = 100000;
    var max = 999999;
    const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;
    await User.findOneAndUpdate({ id: user.id }, { $set: { Otp: randomOTP } });

    const pathname = path.join(__dirname, "../views/otpVerification.ejs");
    sendEmail(
      user.email,
      randomOTP,
      user.name,
      "Verify OTP",
      "Welcome",
      pathname
    );
    return res.json({ message: "exists" });
  } else {
    return res.json({ message: "User Not Exist" });
  }
};

// Forget Password
const forgetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email) {
      return res.json({ message: "Please Enter Email" });
    }

    if (!password) {
      return res.json({ message: "Please Enter Password" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid Email" });
    }

    if (!otp) {
      return res.json({ message: "Please Enter OTP" });
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.json({ message: "User Not Exist" });
    }

    if (Number(otp) !== findUser.Otp) {
      return res.json({ message: "Invalid OTP" });
    }

    const hashPassword = await bcrypt.hash(password, round);
    const upd_pass = await User.findOneAndUpdate(
      { id: findUser.id },
      { $set: { Otp: "", password: hashPassword, cpassword: password } }
    );

    if (upd_pass) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Update Password
const updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    const findUser = await User.findOne({ email });

    const verifyCurrentPassword = await bcrypt.compare(
      currentPassword,
      findUser.password
    );

    if (verifyCurrentPassword) {
      const hashPassword = await bcrypt.hash(newPassword, round);
      const upd_pass = await User.findOneAndUpdate(
        { _id: findUser._id },
        { $set: { password: hashPassword, cpassword: confirmNewPassword } }
      );
      return res.json({ message: "success" });
    } else {
      return res.json({ message: "Invalid Current Password" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const findUser = await User.findOne({ email });
   
    const update = await User.findOneAndUpdate(
      { _id: findUser.id },
      { $set: { name: name, phone: phone, address: address } }
    );

    if (update) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Update User
const updateProfilePhoto = async (req, res) => {
    const { email, imageUrl } = req.body;
    const findUser = await User.findOne({ email });
    const update = await User.findOneAndUpdate(
      { _id: findUser.id },
      { $set: { imageUrl: imageUrl } }
    );

    if (update) {
      return res.json({ message: "success", file:imageUrl });
    }
};

// Email Verification
const SendEmailVerification = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (user.verified) {
      return res.json({ message: "verified" });
    } else {
      const pathname = path.join(__dirname, "../views/VerifyEmailUI.ejs");
      sendEmail(
        user.email,
        user._id,
        user.name,
        "Verify Email",
        "Welcome",
        pathname
      );
      return res.json({ message: "success" });
    }
  } else {
    return res.json({ message: "User Not Exist" });
  }
};

// Logout User
const logOut = async (req, res) => {
  try {
    res.clearCookie("jwtToken");
    // res.cookie('jwtToken', {maxAge: 1});
    res.json({ message: "logout" });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  addUser,
  loginUser,
  getUserData,
  logOut,
  verifyEmail,
  SendOtp,
  forgetPassword,
  SendEmailVerification,
  updateUser,
  updatePassword,
  updateProfilePhoto
};
