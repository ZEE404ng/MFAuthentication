import {Router} from "express";
import passport from "passport";
import { register, login, authStatus, logout, setup2fa, verify2fa, reset2fa } from "../controllers/authController.js";

const router = Router();

//Registration 
 router.post("/register", register);
//Login
 router.post("/login", passport.authenticate("local"), login);
//Auth status
 router.get("/status", authStatus);
//Logout
 router.post("/logout", logout);

 
 //2Fa Setup
 router.post("/2fa/setup",(req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized"})
 }, setup2fa);

 //verify
 router.post("/2fa/verify",(req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized"})
 }, verify2fa);

 //reset
 router.post("/2fa/reset",(req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized"})
 }, reset2fa);


 export default router;
 