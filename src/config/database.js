const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://kumaramar472:Amar%405123@cluster0.6psvb.mongodb.net/devTinder")
}

// connectDB().then(()=>{
//     console.log("Database connection established")
// }).catch((err)=>{
//     console.log("error while connecting to DB")
// })

module.exports = connectDB;