const express = require("express");
const Course =require("../models/Course");
const {protect,admin}=require("../middleware/authMiddleware");


const router =express.Router();


router.get("/",protect,admin,async (req,res)=>{
  try{
    const courses=await Course.find({});
    res.json(courses);
  }catch(error){
    console.error(error);
    res.status(500).json({message:"server error"});
  }
});

module.exports=router;