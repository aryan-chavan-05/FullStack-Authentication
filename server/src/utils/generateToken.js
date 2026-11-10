import jwt from "jsonwebtoken";
import config from "../config/env.js";

export const generateAccessToken = (user, session) => jwt.sign({
    id: user._id,
    sessionId: session._id
}, config.JWT_SECRET, {
    expiresIn: "15m"
});

export const generateRefreshToken = (user) => jwt.sign({
    id: user._id,
    email: user.email
}, config.JWT_SECRET, {
    expiresIn: "7d"
});
