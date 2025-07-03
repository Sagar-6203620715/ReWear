const express = require("express");
const Course = require("../models/Course");
const { protect ,admin} = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const Review = require('../models/Review');

const router = express.Router();

// Get all courses - MUST BE FIRST
router.get("/", async (req, res) => {
  try {
    const { search, sortBy, domain, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = {};
    let sort = {};

    if (domain) {
      query.domain = domain;
    }

    if (search) {
      // Search across multiple fields: course name, meta title, and meta keywords
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { metaTitle: { $regex: search, $options: "i" } },
        { metaKeywords: { $regex: search, $options: "i" } }
      ];
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
    

    let courses;
    
    if (search) {
      // Use aggregation to search across course fields and populated domain names
      const pipeline = [
        {
          $lookup: {
            from: 'domains',
            localField: 'domain',
            foreignField: '_id',
            as: 'domainInfo'
          }
        },
        {
          $lookup: {
            from: 'sections',
            localField: 'section',
            foreignField: '_id',
            as: 'sectionInfo'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { metaTitle: { $regex: search, $options: "i" } },
              { metaKeywords: { $regex: search, $options: "i" } },
              { 'domainInfo.name': { $regex: search, $options: "i" } }
            ]
          }
        },
        {
          $addFields: {
            domain: { $arrayElemAt: ['$domainInfo', 0] },
            section: { $arrayElemAt: ['$sectionInfo', 0] },
            user: { $arrayElemAt: ['$userInfo', 0] }
          }
        },
        {
          $project: {
            domainInfo: 0,
            sectionInfo: 0,
            userInfo: 0
          }
        }
      ];

      // Add domain filter if specified (before the search match)
      if (domain) {
        pipeline.splice(0, 0, { $match: { domain: new mongoose.Types.ObjectId(domain) } });
      }

      // Add sorting
      if (Object.keys(sort).length > 0) {
        pipeline.push({ $sort: sort });
      }

      courses = await Course.aggregate(pipeline);
    } else {
      // Regular query for non-search cases
      courses = await Course.find(query)
        .sort(sort)
        .populate("domain section user", "name")
        .skip(skip)
        .limit(parseInt(limit));
    }

    // Get total count for pagination
    const totalCount = await Course.countDocuments(query);
    
    res.json({
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCourses: totalCount,
        hasNextPage: skip + courses.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Server error");
  }
});

// Track affiliate link click and update revenue - MUST BE BEFORE /:id
router.post("/:id/click", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Increment clicks and revenue ($1 per click)
    course.clicks += 1;
    course.revenue += 1;
    course.lastClicked = new Date();
    
    await course.save();
    
    res.json({ 
      message: "Click tracked successfully",
      clicks: course.clicks,
      revenue: course.revenue
    });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get courses by domain
router.get("/domain/:domainId", async (req, res) => {
  try {
    const courses = await Course.find({ domain: req.params.domainId })
      .populate("domain")
      .populate("section");
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single course
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

// Add a review to a course
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;
    const user = req.user._id;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    // Prevent duplicate reviews
    const existing = await Review.findOne({ course: courseId, user });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this course.' });
    }
    const review = new Review({ course: courseId, user, rating, comment });
    await review.save();
    
    // Update course rating
    const course = await Course.findById(courseId);
    if (course) {
      const reviews = await Review.find({ course: courseId });
      const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
      course.rating = Math.round(avgRating * 10) / 10;
      course.numReviews = reviews.length;
      await course.save();
    }
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a course
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
