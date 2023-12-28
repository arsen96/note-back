const express = require("express");
const router = express.Router();
const Notes = require('../db/models/Notes')
const Tags = require('../db/models/Tags')
require('dotenv').config({path:'./config.env'})
const verifyJWTToken = require('./tokenMiddleware');

router.get("/notes",verifyJWTToken,async (req,res) => {
    try{
        const notes = await Notes.find({userId:req.user_id});
        res.status(200).json(notes);
    }catch(err){
        res.status(400).json(err);
    }
})

router.post("/updateNote",async (req,res) => {
    try{
        const {data} = req.body;
        data.createdAt = undefined;
        const currentNote = await Notes.findByIdAndUpdate(data._id,data,{new:true});
        res.status(200).json(currentNote);
    }catch(err){
        console.log("errerr updateNote",err)
        res.status(400).json(err);
    }
})

router.post("/createNote",verifyJWTToken,async (req,res) => {
    try{
        const {data} = req.body;
        data.createdAt = undefined;
        data.userId = req.user_id;
        const currentNote = await Notes.create(data);
        res.status(200).json(currentNote);
    }catch(err){
        console.log("errerr createNote",err)
        res.status(400).json(err);
    }
})

router.post("/createTag",verifyJWTToken,async (req,res) => {
    try{
        const {data} = req.body;
        data.userId = req.user_id;
        console.log("datadata",data)
        const tag = await Tags.create(data);
        res.status(200).json(tag);
    }catch(err){
        console.log("errerr createTag",err)
        res.status(400).json(err);
    }
})

router.get("/tags",verifyJWTToken,async (req,res) => {
    try{
        const tags = await Tags.find({userId:req.user_id});
        res.status(200).json(tags);
    }catch(err){
        console.log("errerr getTags",err)
        res.status(400).json(err);
    }
})

router.get("/deleteTag",async (req,res) => {
    try{
        const {id} = req.query;
         await Tags.findByIdAndDelete(id);
        res.status(200).json(true);
    }catch(err){
        console.log("errerr getTags",err)
        res.status(400).json(err);
    }
})

module.exports = router;