const Admin = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const path = require("path");
const { generateToken } = require("../middlewares/jwtToken");
const { sendEmail } = require("../components/VerificationAuth/sendEmail");
const round = Number(process.env.round);
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/categoryModel");
const Contact = require("../models/contactModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Register a Admin
const addAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findUser = await Admin.findOne({ email: email });

    if (!findUser) {
      const hashPassword = await bcrypt.hash(password, round);

      const adminDetail = new Admin({
        name: name,
        email: email,
        password: hashPassword,
        cpassword: password,
        phone: "",
        address: "",
        isAdmin: 1,
        isSuperAdmin: false,
      });

      await adminDetail.save();
      return res.status(201).json({ message: "success" });
    } else {
      return res.json({ message: "Admin Already Exist" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
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

    const findUser = await Admin.findOne({ email: email });

    if (findUser && (await bcrypt.compare(password, findUser.password))) {
      if (findUser.isAdmin || findUser.isSuperAdmin) {
        const token = generateToken(findUser?._id);
      
          res.cookie("jwtAdminToken", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          });
       

        return res.json({
          authAdmin: {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            phone: findUser.phone,
            address: findUser.address,
            isAdmin: findUser.isAdmin,
            isSuperAdmin: findUser.isSuperAdmin,
          },
          message: "success",
        });
      } else {
        return res.json({
          message: "Credentials Does Not Match For Admin",
        });
      }
    } else {
      return res.json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// Get Admin data
const getAdminData = async (req, res) => {
  const accessToken = req.cookies?.jwtAdminToken;
  if (accessToken) {
    const verifieduser = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (verifieduser) {
      const admin = await Admin.findOne({ _id: verifieduser.id });

      if (admin.isAdmin || admin.isSuperAdmin) {
        const adminData = {
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          address: admin.address,
          isAdmin: admin.isAdmin,
          isSuperAdmin: admin.isSuperAdmin,
        };
        return res.json({ adminData });
      } else {
        return res.json({ adminData: "" });
      }
    } else {
      return res.json({ adminData: "" });
    }
  } else {
    return res.json({ adminData: "" });
  }
};

// Logout Admin
const logOutAdmin = async (req, res) => {
  try {
    res.clearCookie("jwtAdminToken");
    // res.cookie('jwtToken', {maxAge: 1});
    res.json({ message: "logout" });
  } catch (e) {
    console.log(e);
  }
};

// get a1l User
const getallUserData = async (req, res) => {
  const UserData = await Admin.find({ isAdmin: 0, isSuperAdmin: false }).sort({
    name: -1,
  });
  const userdata = [];

  UserData.forEach((data) => {
    var usersData = {
      id: data._id,
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      password: data.password,
      cpassword: data.cpassword,
      isAdmin: data.isAdmin,
      isSuperAdmin: data.isSuperAdmin,
      verified: data.verified,
    };

    userdata.push(usersData);
  });

  return res.json(userdata);
};

// get a1l Admin
const getallAdminData = async (req, res) => {
  const AdminData = await Admin.find({ isAdmin: 1, isSuperAdmin: false }).sort({
    name: -1,
  });
  const admindata = [];

  AdminData.forEach((data) => {
    var adminData = {
      id: data._id,
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      password: data.password,
      cpassword: data.cpassword,
      isAdmin: data.isAdmin,
      isSuperAdmin: data.isSuperAdmin,
      verified: data.verified,
    };

    admindata.push(adminData);
  });

  return res.json(admindata);
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  const { id } = req.body;

  Admin.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Delete Admin
const deleteUser = async (req, res) => {
  const { id } = req.body;

  Admin.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Admin
const editAdmin = async (req, res) => {
  try {
    const { name, email, password, editId } = req.body;
    const findUser = await Admin.findOne({ _id: editId });

    const hashPassword = await bcrypt.hash(password, round);

    const update = await Admin.findOneAndUpdate(
      { _id: findUser._id },
      {
        $set: {
          name: name,
          email: email,
          password: hashPassword,
          cpassword: password,
        },
      }
    );

    if (update) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getdashBoardData = async (req, res) => {
  const UserCount = await Admin.countDocuments({
    isAdmin: 0,
    isSuperAdmin: false,
  });
  const AdminCount = await Admin.countDocuments({
    isAdmin: 1,
    isSuperAdmin: false,
  });
  const SuperAdminCount = await Admin.countDocuments({ isSuperAdmin: true });
  const CategoryCount = await Category.countDocuments({});
  const ProductCount = await Product.countDocuments({});
  const CouponCount = await Coupon.countDocuments({});

  // Contact
  const TotalContactCount = await Contact.countDocuments({});
  const ResolvedContactCount = await Contact.countDocuments({ status: "1" });
  const NotResolvedContactCount = await Contact.countDocuments({ status: "0" });

  // Order
  const TotalOrderCount = await Order.countDocuments({});
  const DeliveredOrderCount = await Order.countDocuments({
    deliveryStatus: "Delivered",
  });
  const NotDeliveredOrderCount = await Order.countDocuments({
    deliveryStatus: "Not Delivered",
  });

  var array = [
    { count: UserCount, title: "Total User", redirect: "/admin/users" },
    { count: AdminCount, title: "Total Sub Admin", redirect: "/admin/allAdmin" },
    { count: SuperAdminCount, title: "Total Super Admin", redirect: "" },
    { count: CategoryCount, title: "Total Category", redirect: "/admin/category" },
    { count: ProductCount, title: "Total Products", redirect: "" },
    { count: CouponCount, title: "Total Coupons", redirect: "/admin/coupons" },
  ];

  var contactdata = [
    {
      count: TotalContactCount,
      title: "Total Ticket",
      redirect: "/admin/support",
    },
    { count: ResolvedContactCount, title: "Ticket Resolved", redirect: "" },
    {
      count: NotResolvedContactCount,
      title: "Ticket Not Resolved",
      redirect: "",
    },
  ];

  var orderdata = [
    {
      count: TotalOrderCount,
      title: "Total Orders",
      redirect: "/admin/orders",
    },
    { count: DeliveredOrderCount, title: "Delivered Orders", redirect: "" },
    {
      count: NotDeliveredOrderCount,
      title: "Undelivered Orders",
      redirect: "",
    },
  ];

  return res.json({
    dashboard: array,
    contactdata: contactdata,
    orderdata: orderdata,
  });
};

module.exports = {
  loginAdmin,
  getAdminData,
  logOutAdmin,
  getallUserData,
  getallAdminData,
  addAdmin,
  deleteAdmin,
  deleteUser,
  editAdmin,
  getdashBoardData,
};
