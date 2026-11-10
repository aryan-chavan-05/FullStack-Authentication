import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import errorHandling from "./middleware/errorHandling.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/user", userRoute);

app.use(errorHandling);

export default app;