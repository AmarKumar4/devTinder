const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token not exist")
        }
        const userId = await jwt.verify(token, "Amar@Sarita")
        const userProfile = await User.findById(userId._id);
        if (!userProfile) {
            throw new Error("User does not exist ");
        }
        req.userProfile = userProfile;
        
    }
    catch (err) {
        res.status(400).send(err.message)
        return;
    }
    next();
}

module.exports = { userAuth };