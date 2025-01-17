const validator = require("validator")
const validationSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error(" Name is not valid");

    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
}

const validateEditProfileData =(req)=>{
const allowedFields = [  "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
]
const isEditAllowed= Object.keys(req.body).every((fields)=> allowedFields.includes(fields));
console.log(isEditAllowed);
return isEditAllowed;
}


module.exports ={
    validationSignUpData,
    validateEditProfileData
}