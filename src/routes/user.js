const express = require('express');
const { userAuth } = require('../middleware/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();
const USER_SAFE_DATA ="firstName lastName age gender photoUrl about skills"
//get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.userProfile;
        const data = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", "firstName lastName")
        // console.log(loggedInUser._id)
        if (data) {
            res.send(data)
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

//should not show the accepted , ignored 

module.exports = userRouter; 