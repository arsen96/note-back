const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../db/models/Users')
require('dotenv').config({path:'./config.env'})
const verifyJWTToken = require('./tokenMiddleware');

const sekretkeyToken = "dev";
const maxAge = 1 * 24 * 60 * 60;


router.get("/", (req,res) => {
    res.status(200).json({msg:"hey"});
 })

 router.get("/test", (req,res) => {
    res.status(200).json({msg:"ceci est un test"});
 })


router.post("/register",async (req,res) => {
    const {email,password} = req.body;
    try{
        const createdUser = await User.create({email,password});
        const token  = jwt.sign({id:createdUser._id,role:'user'},sekretkeyToken, {expiresIn:maxAge})
        res.cookie("note_user",token,{
            httpOnly:false,
            secure:true,
            sameSite:'lax',
            maxAge:maxAge * 1000
        })
        res.status(200).json(token);
    }catch(err){
        const errors = errHandler(err)
        res.status(400).json(errors);
    }
})

router.post("/login",async (req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token  = jwt.sign({id:user._id,role:'user'},sekretkeyToken, {expiresIn:maxAge * 1000})
        res.cookie("note_user",token,{
            httpOnly:false,
            secure:true,
            sameSite:'None',
            maxAge:3600000
        })
        res.status(200).json({user});
    }catch(err){
        const errors = errHandler(err)
        // console.log("errors",errors)
        res.status(400).json(errors);
    }
})

router.post("/changepwd",verifyJWTToken,async (req,res) => {
    const {currentPassword,newPassword} = req.body;
    const data = {
        user_id:req.user_id,
        currentPassword,
        newPassword
    }
    try{
        const user = await User.changepwd(data);
        res.status(200).json({user});
    }catch(err){
        const errors = errHandler(err)
        res.status(400).json(errors);
    }
})

router.get("/logout",async (req,res) => {
    res.clearCookie("note_user");
    res.status(200).json(true);
})



const errHandler = (err) => {
    if(err.code === 11000){
        err.email = "Cette adresse email existe déja";
    }
    if(err.message == "Mot de passe incorrecte"){
        err.password = "Le mot de passe utilisateur est incorrecte"
    }
    if(err.message == "Utilisateur non trouvé"){
        err.email = "Adresse mail non trouvé"
    }

    if(err.message == "Mot de passe actuel incorrecte"){
        err.currentPassword = "Mot de passe actuel incorrecte"
    }

    return err
}




module.exports = router;