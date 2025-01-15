const express = require("express")
const profileRouter = express.Router()
const {validationSignUpData} = require("../utils/Validation")
const bcrypt = require('bcrypt');
const User = require("../models/user");
const { userAuth } = require("../middleware/userAuth")
profileRouter.get("/profile",userAuth, async (req,res)=>{
    //userAuth is sending the userProfile data
    console.log(req.userProfile);
    try {
       //below thing is done in the userAuth
       // const userId = await jwt.verify(req.cookies.token,"Amar@Sarita");
       // console.log(userId._id)
       // const userProfile = await User.findById(userId._id)
       // if(!userProfile){
          // throw new Error("user not found")
       // }
       res.send(req.userProfile)
    } catch (err) {
       res.status(400).send(err.message);
    }
 
 })

 //get single user
 profileRouter.get("/user", async (req, res) => {
    const email = req.body.emailId;
 
    try {
       if (email === null) {
          res.status(400).send("email is empty")
       } else {
          const user = await User.findOne({ emailId: email });
          if (user === null) {
             res.status(404).send("Email Id not found")
          }
          else
             res.send(user)
       }
    } catch (err) {
       res.status(400).send(err.message)
    }
 
 })

 

//get all the users 
profileRouter.get('/allUser', async (req, res) => {
    try {
       const users = await User.find({})
       console.log(typeof (users))
       if (users === null) {
          res.status(400).send("No data in DB")
       } else {
          res.send(users)
       }
    } catch (err) {
       res.status(400).send(err.message)
    }
 
 
 })

 profileRouter.patch("/user/:userId", async (req, res) => {
    try {
       const userId = req.params?.userId;
       const data = req.body;
       const ALLOWED_UPDATES = ["photoUrl", "age", "about", "gender", "skills"];
       const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
       if (!isUpdateAllowed) {
          throw new Error("Data cannot be updated");
       }
       const user = await User.findByIdAndUpdate({ _id: userId }, data, {
          returnDocument: "after",
          runValidators: true
       })
       console.log(user);
       res.send(" user update successful");
 
    } catch (err) {
       res.status(404).send(err.message);
    }
 })
 
 profileRouter.patch("/feed", async (req, res) => {
    try {
       // const userId =  req.params?.userId;
       const data = req.body
       const emailId = req.body.emailId.toLowerCase();
       console.log(emailId)
       // console.log(req.body)
       const ALLOWED_UPDATES = ["photoUrl", "age", "about", "gender", "skills"];
       const isUpdateAllowed = Object.keys(data).every((k) =>
          ALLOWED_UPDATES.includes(k)
       );
       if (!isUpdateAllowed) {
          throw new Error("Update not allowed")
       }
 
       // const existingUser = await User.findOne({ emailId });
       // console.log("Existing User:", existingUser);
       // if (!existingUser) {
       //    return res.status(404).send("No user found with this email ID");
       //  }
 
       const user = await User.findOneAndUpdate({ emailId }, req.body, { returnDocument: "after", runValidators: true })
       if (user == null) {
          res.status(404).send("no response from the user")
       }
       else {
          res.send(user)
          console.log(user)
       }
    } catch (err) {
       res.status(400).send(err.message)
    }
 })

 module.exports = profileRouter