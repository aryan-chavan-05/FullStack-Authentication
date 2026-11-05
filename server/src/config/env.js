import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI have an error")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000
}

export default config;