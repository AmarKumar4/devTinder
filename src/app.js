const express = require('express');
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user");

// it  will run on every req 
app.use(express.json())
app.post('/signup', async (req, res) => {

   // const user1 = new User({
   // firstName:"Aakash",
   // lastName:"kumar",
   // emailId:"kumaraakash55@gmail.com",
   // password: "Aakash1234",
   //  age: 32,
   // gender:"Male"
   // });
   console.log(req.body)
   const users = new User(req.body)

   try {
      await users.save();
      res.send("User added successfully!")
   } catch (err) {
      res.status(400).send("error saving the user" + err.message)
   }

})

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
      res.send(400).send(err.message)
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
