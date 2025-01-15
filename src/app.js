const express = require('express');
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user");
const bcrypt = require('bcrypt');

const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const { userAuth } = require("./middleware/userAuth")

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
// it  will run on every req 
app.use(express.json())
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


// app.get("/profile", async (req,res)=>{
//    console.log(req.cookies);
//    try {
//       const userId = await jwt.verify(req.cookies.token,"Amar@Sarita");
//       console.log(userId._id)
//       const userProfile = await User.findById(userId._id)
//       if(!userProfile){
//          throw new Error("user not found")
//       }
//       res.send(userProfile)
//    } catch (err) {
//       res.status(400).send(err.message);
//    }

// })










connectDB().then(() => {
   console.log("Database connection established")
   app.listen(3000, () => {
      console.log("server is running on 3000")
   })
}).catch((err) => {
   console.log("error while connecting to DB")
})
