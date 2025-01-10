   const express = require('express');
   const app = express();

//this function is called req handler 
   app.use("/test",(req,res)=>{
    res.send("Hello Amar ")
   })

   app.listen(3000,()=>{
    console.log("Server is running on 3000")
   })  