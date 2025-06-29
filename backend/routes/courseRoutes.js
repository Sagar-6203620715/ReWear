const express = require("express");
const Course = require("../models/Course");
const { protect ,admin} = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/", protect,admin, async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      duration,
      affiliate_link,
      rating,
      domain,
      section,
      dimensions,
      weight,
    } = req.body;

    // Basic validation (optional but recommended)
    if (!name || !price || !domain || !section) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const course = new Course({
      name,
      price,
      image,
      duration,
      affiliate_link,
      rating,
      domain,
      section,
      user: req.user._id, // admin user from token
      dimensions,
      weight,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).send("Server error");
  }
});


router.put("/:id",protect,admin,async(req,res)=>{
  try{
    const {
      name,
      price,
      image,
      duration,
      affiliate_link,
      rating,
      domain,
      section,
      dimensions,
      weight,
    }=req.body;

    const  course=await Course.findById(req.params.id);
    

    if(course){
      course.name=name||course.name;
      course.price=price||course.price;
      course.image=image||course.image;
      course.duration=duration||course.duration;
      course.affiliate_link=affiliate_link||course.affiliate_link;
      course.rating=rating||course.rating;
      course.domain=domain||course.domain;
      course.section=section||course.section;
      course.dimensions=dimensions||course.dimensions;
      course.weight=weight||course.weight;


      const updatedCourse=await course.save();
      res.json(updatedCourse);      
    }else{
      res.status(404).json({message:"product not fond"});
    }

  }catch(error){
    console.error(error);
    res.status(500).send("server error");
  }
});


router.delete("/:id",protect,admin,async(req,res)=>{
  try{
    const course=await Course.findById(req.params.id);
    if(course){
      await course.deleteOne();
      res.json({message:"product removed"});
    }else{
      res.status(404).json({message:"course not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).send("server error");
  }
});


router.get("/", async (req, res) => {
  try {
    const { search, sortBy, domain } = req.query;
    let query = {};
    let sort = {};

    if (domain) {
      query.domain = domain;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Sort logic
    switch (sortBy) {
      case "priceLow":
        sort.price = 1;
        break;
      case "priceHigh":
        sort.price = -1;
        break;
      case "ratingHigh":
        sort.rating = -1;
        break;
      case "ratingLow":
        sort.rating = 1;
        break;
      case "durationLow":
      case "durationHigh":
        const allCourses = await Course.find(query).populate("domain section user", "name");
        const getTotalMonths = (d) => d.years * 12 + d.months;
    
        const sorted = allCourses.sort((a, b) => {
          const aDur = getTotalMonths(a.duration);
          const bDur = getTotalMonths(b.duration);
          return sortBy === "durationLow" ? aDur - bDur : bDur - aDur;
        });
    
        return res.json(sorted);
    
      default:
        sort.createdAt = -1;
    }
    

    const courses = await Course.find(query)
      .sort(sort)
      .populate("domain section user", "name");

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Server error");
  }
});


router.get("/:id",async (req,res)=>{
  try{
    const course = await Course.findById(req.params.id)
  .populate("domain section user", "name");

    if(course){
      res.json(course);
    }else{
      res.status(404).json({message:"product not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).send("server error");
  }
})



module.exports = router;
