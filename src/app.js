   const express = require('express');
   const app = express();
   const connectDB =require("./config/database")


   connectDB().then(()=>{
      console.log("Database connection established")
      app.listen(3000,()=>{
         console.log("server is running on 3000")
      })
  }).catch((err)=>{
      console.log("error while connecting to DB")
  })
 