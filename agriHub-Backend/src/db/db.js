const mongoose = require('mongoose')

require('dotenv').config();
const MongoDB = process.env.MONGO_URI

function connectDB(){
    mongoose.connect(`${MongoDB}`)
    .then(() => {
        console.log("MongoDB Connected Successfully 🎉");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    })
}

module.exports = connectDB;