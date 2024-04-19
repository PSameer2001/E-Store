const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Auth_email,
    pass: process.env.Auth_pass,
  },
});

transporter.verify((err, succ) => {
  if (err) {
    console.log(err);
  } else {
    console.log(succ);
  }
});

module.exports = { transporter };
