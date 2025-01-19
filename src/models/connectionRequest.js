const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
     type: mongoose.Schema.Types.ObjectId,
     ref:"User",   // reference to the User Collection 
    required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:{
            values: ["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        }
    }

},
{timestamps: true}

)

// to check that user is not sending the request to yourself
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    // to check fromUserId is the same as toUserId 
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

//mongoose.model(<collection_name>, <schema>);
const ConnectionRequestModel  = new mongoose.model(
"ConnectionRequest", connectionRequestSchema
);

module.exports= ConnectionRequestModel ;