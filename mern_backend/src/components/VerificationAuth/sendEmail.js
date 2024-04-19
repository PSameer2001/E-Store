const { transporter } = require("./Transporter");
const ejs = require("ejs");
require("dotenv").config();

const sendEmail = async (email, uniqueStr, name, subject, text, pathname) => {
  const html = await ejs.renderFile(pathname, {
    email,
    uniqueStr,
    name,
  });

  transporter.sendMail({
    from: process.env.Auth_email,
    to: email,
    subject: subject,
    text: text,
    html: html,
  });
};

module.exports = { sendEmail };
