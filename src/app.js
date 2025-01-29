const express = require('express');
const app = express();
const connectDB = require("./config/database")
const User = require("./models/user");
const bcrypt = require('bcrypt');

const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const { userAuth } = require("./middleware/userAuth")
const cors = require("cors")
const authRouter = require("./routes/auth") 
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
// it  will run on every req 
// app.options('*', cors()); // This will handle preflight (OPTIONS) requests for all routes
const allowedOrigin = 'http://localhost:5173'; // Your frontend URL

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Include POST and PATCH
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow cookies or credentials
}));
// app.use(cors({
//    origin:"http://localhost:5173",
//    credentials:true,
// }))
app.options('*', (req, res) => {
   res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS'); // Include all methods here
   res.header('Access-Control-Allow-Origin', allowedOrigin); // Match the origin
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
   res.sendStatus(204); // No content
});
app.use(express.json())
app.use(cookieParser()); 
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);

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
