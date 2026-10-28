import mongoose from "mongoose";
import config from "./env.js"

function connectDB(){
    try{
        mongoose.connect(config.MONGO_URI);

        console.log("DATABASE connected successfully");
    }
    catch(err){
        console.error("Database have an error: ",err);
    }
}

export default connectDB;