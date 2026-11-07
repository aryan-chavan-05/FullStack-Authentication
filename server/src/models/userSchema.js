import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        maxlength: 30,
        minlength: 2
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        select: false, 
    },
    verified:{
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("user",userSchema);

export default userModel;