const express = require('express');
const app = express();

app.use("/userData", (req,res,next)=>{
    console.log("phase 1")
    next()
},(req,res,next)=>{
    console.log("phase 2");
    next();
}, (req,res,next)=>{
    console.log("phase 3");
    next();
    res.send("will got error")
},(req,res,next)=>{
    console.log("Phase 4")
    res.send("Hi ")
})

app.listen(3000,()=>{
    console.log("port running on 3000")
})