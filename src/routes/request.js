const { userAuth } = require("../middleware/userAuth")
const express = require("express")
const requestRouter = express.Router()

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
    res.send(req.userProfile.firstName + " Send you the Req");
 })

 module.exports = requestRouter;