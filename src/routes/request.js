const { userAuth } = require("../middleware/userAuth")
const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router()
const User = require("../models/user")


requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
    res.send(req.userProfile.firstName + " Send you the Req");
})


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        //accept the req 
        const fromUserId = req.userProfile;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //to check the status is malware  or not
        const allowedStatus = ["ignored", "interested"]

        if (!allowedStatus.includes(status)) {
            // return res.status(400).send(status + " is either ignored or interested")
            throw new Error(status + " - is wrong input it should be  either ignored or interested")
        }

        //to check we are sending the req to person (is person exist);
        const isPersonExist = await User.findById(toUserId);
        console.log(isPersonExist);
        if (!isPersonExist) {
            throw new Error("User you are sending the req is not on our platform i.e in DB")
        }

        //once send not be sent again check in DB already exist or not

        // const existingConnectionRequest = await connectionRequest.findOne()
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const isReqSentAgain = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if (isReqSentAgain) {

            // return res.status(400).send("req already sent")
            throw new Error("req already sent")
        }

        const data = await connectionRequest.save()
        if (data) {
            res.send(data)
        }

    } catch (err) {
        res.status(400).send("Error in RequestRouter send - " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.userProfile
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        console.log(requestId)
        console.log(loggedInUser._id.toString())
        console.log(connectionRequest)
        if (!connectionRequest) {
            return res
                .status(404)
                .json({ message: "Connection request not found" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        //    console.log(data)
        if (data) {
            return res.json({ message: "Connection accepted " + status, data })
        }

    } catch (err) {
        res.status(400).json({ message: "error is " + err.message })
    }
    //validate the status 
    //logged in status
    //loggedInId = toUserId
    // status = Interested
    //request Id should be valid
})
module.exports = requestRouter; 