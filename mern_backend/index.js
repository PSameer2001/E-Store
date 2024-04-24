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

// app.use(cors());
app.use(cors({ origin: 'https://e-store-in.netlify.app', credentials: true }));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

app.get('/setcookie', (req, res) => {
    res.cookie('myCookie', 'value', {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === 'production', // Set secure only in production
      maxAge: 1000 * 60 * 60, // Expires in 1 hour
      sameSite: 'none' // Required for cross-site requests in some browsers
    });
    res.send('Cookie set successfully!');
  });

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
