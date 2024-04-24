const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const nodemailer = require("nodemailer");
const db = require("./src/config/conn");
const ejs = require("ejs");
const path = require("path");
const userRouter = require("./src/routes/userRouter");
const adminRouter = require("./src/routes/adminRouter");
const categoryRouter = require("./src/routes/categoryRouter");
const productRouter = require("./src/routes/productRouter");
const sectionRouter = require("./src/routes/sectionRouter");
const cartRouter = require("./src/routes/cartRouter");
const couponRouter = require("./src/routes/couponRouter");
const orderRouter = require("./src/routes/orderRouter");
const contactRouter = require("./src/routes/contactRouter");
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://e-store-cvz4.onrender.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(cors());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use(userRouter);
app.use(adminRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(sectionRouter);
app.use(cartRouter);
app.use(couponRouter);
app.use(orderRouter);
app.use(contactRouter);

app.listen(port, () => console.log(`Website listening on port ${port}!`));
