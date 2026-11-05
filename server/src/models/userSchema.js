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
        select: false, // if we use find by id and GET the user info the password field will not display
        validate: {
            validator: function(value) {
                if (!this.isModified || !this.isModified('password')) {
                    return true; 
                }
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        } // we used validator function bcz when user updates the password the hash algo and regex won't throw an error while updating
    },
    verified:{
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("user",userSchema);

export default userModel;