const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validator(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("password is not strong");
            }

        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "other","transgender"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/09/20/03/24/skeleton-6639547_1280.png"
    },
    about: {
        type: String,
        default: "THis is the default about the user"

    }, 
    skills: {
        type: [String],
    }
}, {
    timestamps: true
});

//compound index
//it will run fast to find on the basis of fromUserId
//ex - userSchema.find("Amar") 
//not fast for userSchema.find({firstName: "Amar" , lastName:"kumar"})
// for this we have to write (1 means ascending order and -1 means decending  order)
userSchema.index({firstName:1, lastName:-1})
userSchema.index({firstName: 1});
userSchema.methods.passwordValidate = async function (userInputPassword) {
    const user = this;
    const hashPassword = user.password;
    // console.log(hashPassword);
    // console.log(userInputPassword+ "user input")
    const verifyPassword = await bcrypt.compare(userInputPassword, hashPassword);
    // console.log(verifyPassword)
    return verifyPassword;
}

userSchema.methods.getJwt = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
    return token;
}
const User = mongoose.model("User", userSchema);
module.exports = User;
// or we can also write module.exports = mongoose.model("User",userSchema)