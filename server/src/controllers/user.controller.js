import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import userModel from "../models/userSchema.js";

export const register = async (req , res) => {
   try{
    const {username , email , password} = req.body;

    if(!username || !email || !password ){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const hashPassword = await bcrypt.hash(password , 10);

    const createUser = await userModel.create({
        username,
        email,
        password: hashPassword
    })

    const token = await jwt.sign({
        id: createUser._id,
        email: createUser.email
    }, config.JWT_SECRET ,
    {
        expiresIn: "7d"
    })

    if(!token){
        return res.status(404).json({
            message: "Register Again"
        })
    }

    res.cookie("token", token , {
        httpOnly: true,
        secure: config.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
    })

    res.status(200).json({
        message: "User registered successfully",
        user:{
            username: createUser.username,
            email: createUser.email
        }
    })
   }
   catch(error){
    console.error(`Registration Api Have Error: ${error.message}`)
    return res.status(500).json({
        message: "Internal server error"
    })
   }
}

export const login = async (req , res) => {
    try{
    const {email , password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

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

    if(!user.verified){
        user.verified = true;
        await user.save();
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, config.JWT_SECRET,{
        expiresIn: "7d"
    })

    if(!token){
        return res.status(404).json({
            message: "Login Again"
        })
    }

    res.cookie("token", token);

    res.status(200).json({
        message: "Login successfully",
        user:{
            id: user._id,
            email: user.email
        }
    })
    }
    catch(error){
        console.error(`Login have an error: ${error.message}`)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);

      const identifier = decoded._id || decoded.email || decoded.username;

      if (identifier) {
        await userModel.findOneAndUpdate(
          {
            $or: [
              { email: identifier },
              { username: identifier },
              ...(identifier.toString().match(/^[0-9a-fA-F]{24}$/) ? [{ _id: identifier }] : [])
            ]
          },
          { verified: false }
        );
      }
    } catch (jwtErr) {
      console.warn("Invalid or expired token during logout:", jwtErr.message);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};