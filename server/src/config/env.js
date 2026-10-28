import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_URI){
    throw new ERROR("MONGO_URI have an error")
}

if(!process.env.PORT){
    throw new ERROR("PORT have an error")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT
}

export default config;