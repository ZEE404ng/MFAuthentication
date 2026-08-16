import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            isMfaActive: false,
        })
        console.log("New User: ", newUser);
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
        } catch (error) {
        res.status(500).json({ error: "Error registering user", message: error });
    }
};
export const login = async (req, res) => {
    try{
    console.log("The authenticated user is: ", req.user);
    res.status(200).json({
        message: "User logged in successfully",
        username: req.user.username,
        isMfaActive: req.user.isMfaActive,
    })}
    catch(error){
        res.status(500).json({message: "The login function isnt working"})
    }
    };
export const authStatus = async (req, res) => {
    if(req.user){
        res.status(200).json({
            message: "User logged in successfully",
        username: req.user.username,
        isMfaActive: req.user.isMfaActive,
        });
    } else{
        res.status(401).json({message: "Unauthorized user"})
    }
};
export const logout = async (req, res) => {
    if(!req.user)
        res.status(401).json({message: "Unauthorized user"})
        req.logout((err) => {
            if(err) return res.status(200).json({message: "User not logged in"})
            else{
                res.status(200).json({message: "Logged out successfully"})
            }
            });
    
};
export const setup2fa = async (req, res) => {
    try {
        console.log("The req.user is: ",  req.user);
        const user = req.user;
        var secret = speakeasy.generateSecret();
        console.log("the secret object is: ", secret);
        user.twoFactorSecret = secret.base32;
        user.isMfaActive = true;
        await user.save();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.username}`,
            issuer: "FullMFA.com",
            encoding: "base32",
        });
            const qrImageURL = await qrCode.toDataURL(url);
            res.status(200).json({
                secret: secret.base32, 
                qrCode: qrImageURL,
            });
    } catch (error) {
        res.status(500).json({ error: "Error setting up 2fa", message: error.message, stack: error.stack });    
    }
};
export const verify2fa = async (req, res) => {
    const {token} = req.body;
    const user = req.user;

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
    });
    if(verified){
        const jwtToken = jwt.sign(
            {username: user.username}, 
            process.env.jwt_SECRET, {expiresIn: "1h"}
        );
        res,status(200).json({
            message: "2FA verified successfully",
            token: jwtToken,
        })
    }else{
        res.status(400).json({message: "Invalid 2fa token"})
    }
};
export const reset2fa = async (req, res) => {
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.isMfaActive = false
        await user.save();
        res.status(200).json({message: "2fa reset successful"});
    } catch (error) {
        res.status(500).json({error: "Error resetting 2fs", message: error})
    }
};




