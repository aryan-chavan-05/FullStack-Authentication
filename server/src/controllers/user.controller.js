import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import crypto from "crypto";
import userModel from "../models/userSchema.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import sessionModel from "../models/sessionSchema.js";

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict"
};

export const register = async (req , res) => {
    const {username , email , password} = req.body ?? {};

    if (typeof username !== "string" || !username.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password) {
        return res.status(400).json({
            message: "Fill the input correctly"
        })
    }

    const hashPassword = await bcrypt.hash(password , 10);

    const createUser = await userModel.create({
        username,
        email,
        password: hashPassword
    })

    res.status(200).json({
        message: "User registered successfully",
        user:{
            username: createUser.username,
            email: createUser.email
        }
    })
}


export const login = async (req , res) => {
    const {email , password} = req.body ?? {};

    if (typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = await userModel.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if(!user){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }

    const passCompare = await bcrypt.compare(password , user.password);

    if(!passCompare){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const refreshToken = generateRefreshToken(user);
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        userId: user._id,
        refreshTokenHash: refreshTokenHash,
        ip: req.ip || "unknown",
        userAgent: req.get("user-agent") || "unknown",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    const accessToken = generateAccessToken(user, session);

    res.cookie("refreshToken", refreshToken, {
        ...refreshTokenCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Login successfully",
        user:{
            id: user._id,
            email: user.email
        },
        accessToken
    })
}
export const logout = async (req, res) => {

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    if (typeof decoded === "string" || !decoded.id) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await sessionModel.updateOne({
        userId: decoded.id,
        refreshTokenHash,
        revoked: false
    }, {
        $set: { revoked: true }
    });

    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    return res.status(200).json({
      message: "Logout successfully",
    });
}