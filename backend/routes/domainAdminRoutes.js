const express = require("express");
const Domain =require("../models/Domain");
const {protect,admin}=require("../middleware/authMiddleware");


const router =express.Router();


router.get("/",protect,admin,async (req,res)=>{
  try{
    const domains = await Domain.find({});
    res.json(domains);

  }catch(error){
    console.error(error);
    res.status(500).json({message:"server error"});
  }
});

module.exports=router;