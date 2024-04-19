const mongoose= require("mongoose");
require('dotenv').config()
const DB = process.env.DB

mongoose.set('strictQuery', true);
mongoose.connect(DB)
.then(() => {
    console.log("Connection Successful")
}).catch((e) => {
    console.log(e)
})