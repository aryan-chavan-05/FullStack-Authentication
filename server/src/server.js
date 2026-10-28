import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js"

connectDB();

app.listen(config.PORT,()=>{
    console.log("Server is running on port 5000")
})