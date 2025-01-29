const express = require('express');
const { userAuth } = require('../middleware/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();
const USER_SAFE_DATA ="firstName lastName age gender photoUrl about skills"
//get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.userProfile;
        const data = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["_id","photoUrl","about","age","gender","firstName", "lastName"]).populate("toUserId", "firstName lastName")
        // console.log(loggedInUser._id)
        if (data) {
            res.send(data)
            console.log(data)
        }
        else {
            res.send("no pending req")
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
})

//who accepted the request 
//fromUserId   =>  toUserId
//Rohit send =>  dhoni  ==accepted
//dhoni send to  => virat == accepted
// dhoni have accepted two connection i.e we have to check dhoni in both field i.e fromUserId and toUserId and status - accepted
userRouter.get("/user/connections", userAuth, async (req, res) => { 
    try {
        const loggedInUser = req.userProfile;
        console.log("Hello")
        const connectionData = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id,  },
                { toUserId: loggedInUser._id }
            ],
            status: "accepted",

        }).populate("fromUserId",USER_SAFE_DATA)

        const data = connectionData.map((row)=>{
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
              }
              return row.fromUserId;
    })

        res.json({ data })
    } catch (err) {
        return res.status(400).send("Error in accepted " + err.message);
    }
})

//User should see all the user cards except 
//1- his own card
// 2- his connection
// 3- ignored people
// 4- already sent the connection request 

userRouter.get("/feed",userAuth, async(req,res)=>{
    try {

//feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

//feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

//feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

//feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)

//skip = (page-1)*limit;
const page = req.query.page || 1;
let limit= req.query.limit || 10;
limit = limit >50 ? 50: limit;
const skip = (page-1)*limit;
        const loggedInUser = req.userProfile;
        const connectioRequests = await ConnectionRequest.find({
            $or: [{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
        }).select("fromUserId toUserId status").populate("fromUserId", "firstName").populate("toUserId","firstName")        

        // const userData = await User.find();
        const hideUsersFromFeed = new Set();
        //now we will make a set of users to whom we have to avoid and the own also have to avoid 
        connectioRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId).toString();
            hideUsersFromFeed.add(req.toUserId).toString();  
        }); 
        //now we will filter the User so that it will show only those people user didn't send req or accepted 
        const freshFeedUser =await User.find({
            $and: [
                { _id: {$nin:Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ] 
        }).select(USER_SAFE_DATA).limit(page).skip(skip)
        // res.json({message: `user with data `,dataAmar:freshFeedUser})
        res.send(freshFeedUser).status(200)
        // const hideUserFromFeed =  userData.map(async (req)=>{
        //     // console.log(req._id);
        //     console.log("Hi " +req._id.toString());
        //     // const data = await loggedInUserData._id;
        //     console.log("Dating " +loggedInUserData);
        //     // console.log(loggedInUserData._id.toString());
            
            
        //     // if(req._id === loggedInUserData.fromUserId._id || req._id === loggedInUserData.toUserId._id )
        //   return "Hi"
        // // else return req;
        // })
        // // console.log(filterData)
        // res.send(loggedInUserData);
    } catch (err) {
        res.send("Error in feeding"+ err.message);
    }
})
module.exports = userRouter; 