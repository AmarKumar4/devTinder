   const express = require('express');
   const app = express();
   const connectDB =require("./config/database")
   const User  = require("./models/user");

   app.post('/signup', async(req,res)=>{

      const user1 = new User({
         firstName:"Aakash",
         lastName:"kumar",
         emailId:"kumaraakash55@gmail.com",
         password: "Aakash1234",
         // age: 32,
         gender:"Male"
      });
   
      try{
         await user1.save();
         res.send("User added successfully!")
      }catch(err){
         res.status(400).send("error saving the user"+ err.message)
      }
   
   })
  

   connectDB().then(()=>{
      console.log("Database connection established")
      app.listen(3000,()=>{
         console.log("server is running on 3000")
      })
  }).catch((err)=>{
      console.log("error while connecting to DB")
  })
 