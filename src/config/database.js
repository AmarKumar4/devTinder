const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

// connectDB().then(()=>{
//     console.log("Database connection established")
// }).catch((err)=>{
//     console.log("error while connecting to DB")
// })

module.exports = connectDB;