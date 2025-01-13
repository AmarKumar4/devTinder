const mongoose = require('mongoose')

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
        trim: true
    },
    password: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
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

const User = mongoose.model("User", userSchema);
module.exports = User;
// or we can also write module.exports = mongoose.model("User",userSchema)