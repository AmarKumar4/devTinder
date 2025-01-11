   const express = require('express');
   const app = express();
   
//this function is called req handler 
//and this will match all the HTTP method
   app.use("/test",(req,res)=>{
    res.send("Hello Amar ")
   });

   //this will only handle GET call to /user
   app.get("/user",(req,res)=>{
    res.send({ firstName:"amar", lastName:"kumar" })
   });

   app.post("/data",(req,res) => {
      res.send("Data save successfully ")
   })
//order of th code is matter 
/*
  app.use("/",(req,res)=>{
    res.send("Hello 123")
   })

     app.use("/hello",(req,res)=>{
    res.send("Hello testing")
   })

   if we run the code (localhost:3000/hello)then the output is Hello 123
   if we run the code (localhost:3000/)then the output is Hello 123
   because "the order matter" , the code comes from above and it will see "/" which matches the first one it will only execute the first one
   so always keep the shorter in the last

play with routes  , /hello, / , /test
  app.use("/",(req,res)=>{
    res.send("Hello testing")
   })

   app.use("/hello",(req,res)=>{
    res.send("Hello Developer")
   })
*/
 


   app.listen(3000,()=>{
    console.log("Server is running on 3000")
   })  