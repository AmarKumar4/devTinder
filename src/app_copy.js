const express = require('express');
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user");
const bcrypt = require('bcrypt');
const {validationSignUpData} = require("./utils/Validation")
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
 const {userAuth} = require("./middleware/userAuth")
// it  will run on every req 
app.use(express.json())
app.use(cookieParser());
app.post("/login",async (req,res)=>{
   const {emailId, password} = req.body
   
   try {
      const userFound = await User.findOne({emailId});
   if(!userFound){
      throw new Error("No credentials found")
   }

   else{
      const userPassword = userFound.password;
      const isPasswordValidate = await userFound.passwordValidate(password);
      if(!isPasswordValidate){
         throw new Error("wrong password")
      }
      else{
         // this code is also code but as per the industry and clearity will write in the schema model
         // const token = jwt.sign({_id :userFound._id},"Amar@Sarita",{expiresIn:60*60})
         const token = await userFound.getJwt();
         // res.cookie("token","qwertyuiopasdfghjklzxcvbnm")
         res.cookie("token",token,{ expires: new Date(Date.now() + 900000)});
         res.status(200).send("Welcome");
         console.log(token);
      }
   }
      // res.send(emailFound);
   } catch (error) {
     res.status(404).send(error.message)
   }
})

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

app.get("/profile",userAuth, async (req,res)=>{
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

app.get("/sendConnectionRequest",userAuth, async(req,res)=>{
   res.send(req.userProfile.firstName + " Send you the Req");
})
app.post('/signup', async (req, res) => {

   // const user1 = new User({
   // firstName:"Aakash",
   // lastName:"kumar",
   // emailId:"kumaraakash55@gmail.com",
   // password: "Aakash1234",
   //  age: 32,
   // gender:"Male"
   // });
   const {firstName,lastName,emailId,password} = req.body;
   console.log(req.body);
   //const users = new User(req.body);
  
   try {
      validationSignUpData(req);
      const passwordHash = await bcrypt.hash(password,10);
      const user1 = new User({
         firstName,
         lastName,
         emailId,
         password:passwordHash
      })
      // await users.save();
      await user1.save();
      res.send("User added successfully!")
   } catch (err) {
      res.status(400).send("error saving the user" + err.message)
   }

})
//get single user
app.get("/user", async (req, res) => {
   const email = req.body.emailId;

   try {
      if (email === null) {
         res.status(400).send("email is empty")
      } else {
         const user = await User.findOne({ emailId: email });
         if(user === null){
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
app.get('/allUser', async (req,res)=>{
   try{
      const users = await User.find({})
      console.log(typeof(users))
      if(users === null){
         res.status(400).send("No data in DB")
      } else{
         res.send(users)
      }
   }catch(err){
      res.status(400).send(err.message)
   }
 
   
})

app.patch("/feeds", async (req,res)=>{
   try {
      // const userId =  req.params?.userId;
      const data = req.body
      const emailId = req.body.emailId.toLowerCase();
      console.log(emailId)
      // console.log(req.body)
      const ALLOWED_UPDATES = ["photoUrl","age","about","gender","skills"];
      const isUpdateAllowed = Object.keys(data).every((k)=>
         ALLOWED_UPDATES.includes(k)
      );
      if(!isUpdateAllowed){
         throw new Error ("Update not allowed")
      }

      // const existingUser = await User.findOne({ emailId });
      // console.log("Existing User:", existingUser);
      // if (!existingUser) {
      //    return res.status(404).send("No user found with this email ID");
      //  }
   
      const user =  await User.findOneAndUpdate({emailId},req.body,{ returnDocument: "after",runValidators: true})
     if(user == null){
      res.status(404).send("no response from the user")
     }
     else{
      res.send(user)
      console.log(user)
     }
   } catch (err) {
      res.status(400).send(err.message)
   }
})

app.patch("/user/:userId", async (req,res)=>{
   try {
      const userId = req.params?.userId;
      const data = req.body;
      const ALLOWED_UPDATES = ["photoUrl","age","about","gender","skills"];
      const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k))
      if(!isUpdateAllowed){
         throw new Error("Data cannot be updated");
      }
      const user = await User.findByIdAndUpdate({_id:userId},data,{
         returnDocument : "after",
         runValidators : true
      })
      console.log(user);
      res.send(" user update successful");

   } catch (err) {
      res.status(404).send(err.message);
   }
})

connectDB().then(() => {
   console.log("Database connection established")
   app.listen(3000, () => {
      console.log("server is running on 3000")
   })
}).catch((err) => {
   console.log("error while connecting to DB")
})
