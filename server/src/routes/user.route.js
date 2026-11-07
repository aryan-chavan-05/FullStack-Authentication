import express from "express";
import { login, logout, register } from "../controllers/user.controller.js";

const route = express.Router();

route.post("/register",register);


route.post("/login",login);


route.get("/logout",logout);


// route.get("/logout-All");


// route.get("/rotate-token",);


// route.get("/verify",);

export default route;
