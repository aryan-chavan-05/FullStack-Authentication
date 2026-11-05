import mongoose from "mongoose";
import config from "./env.js"

const connectDB = async () => {
    try{
        await mongoose.connect(config.MONGO_URI);

        console.log("Database Connected Successfully");
    }
    catch(error){
        console.error(`MongoDB connection error: ${error.message}`)
        process.exit(1);
    }
}

export default connectDB;