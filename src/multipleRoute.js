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


// Middleware for all routes starting with "/api"
app.use('/api', (req, res, next) => {
  console.log('Middleware triggered');
  next();
});

app.get('/api/users', (req, res) => {
  res.send('Users endpoint');
});

app.get('/api/products', (req, res) => {
  res.send('Products endpoint');
});

// Handle all methods for the "/info" route
app.use('/info', (req, res) => {
    res.send(`HTTP Method: ${req.method}`);
  });

app.listen(3000,()=>{
    console.log("port running on 3000")
})