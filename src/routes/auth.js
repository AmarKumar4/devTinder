const express = require("express")
const authRouter = express.Router()
const {validationSignUpData} = require("../utils/Validation")
const bcrypt = require('bcrypt');
const User = require("../models/user");

authRouter.post('/signup', async (req, res) => {

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

 authRouter.post("/login",async (req,res)=>{
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

 module.exports = authRouter;