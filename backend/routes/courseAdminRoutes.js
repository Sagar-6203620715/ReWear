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

// Create a course (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    console.log("Creating course with data:", req.body);
    console.log("User ID:", req.user._id);
    
    const { name, price, image, duration, affiliate_link, rating, domain, section, dimensions, weight } = req.body;
    if (!name || !price || !domain || !section) {
      console.log("Missing required fields:", { name: !!name, price: !!price, domain: !!domain, section: !!section });
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Validate that domain and section exist
    const Domain = require("../models/Domain");
    const Section = require("../models/Section");
    
    const domainExists = await Domain.findById(domain);
    const sectionExists = await Section.findById(section);
    
    if (!domainExists) {
      console.log("Domain not found:", domain);
      return res.status(400).json({ message: "Domain not found" });
    }
    
    if (!sectionExists) {
      console.log("Section not found:", section);
      return res.status(400).json({ message: "Section not found" });
    }

    // Set default image if none provided
    const imageData = image ? {
      url: image,
      altText: name
    } : {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      altText: name
    };

    console.log("Image data:", imageData);

    const courseData = { 
      name, 
      price, 
      image: imageData, 
      duration, 
      affiliate_link, 
      rating, 
      domain, 
      section, 
      dimensions, 
      weight,
      user: req.user._id // Set the user from the authenticated user
    };

    console.log("Final course data:", courseData);

    const course = new Course(courseData);
    console.log("Course model created, attempting to save...");
    
    const createdCourse = await course.save();
    console.log("Course saved successfully:", createdCourse._id);
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: "Server error" });
  }
});

// Update a course (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, price, image, duration, affiliate_link, rating, domain, section, dimensions, weight } = req.body;
    const course = await Course.findById(req.params.id);
    if (course) {
      course.name = name || course.name;
      course.price = price || course.price;
      
      // Handle image update
      if (image) {
        course.image = {
          url: image,
          altText: name || course.name
        };
      }
      
      course.duration = duration || course.duration;
      course.affiliate_link = affiliate_link || course.affiliate_link;
      course.rating = rating || course.rating;
      course.domain = domain || course.domain;
      course.section = section || course.section;
      course.dimensions = dimensions || course.dimensions;
      course.weight = weight || course.weight;
      
      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a course (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.json({ message: "Course removed" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Test endpoint to check course creation
router.post("/test", async (req, res) => {
  try {
    console.log("Test course creation with data:", req.body);
    
    const { name, price, image, duration, affiliate_link, rating, domain, section } = req.body;
    
    // Create a test user ID (you'll need to replace this with a real user ID from your database)
    const testUserId = "507f1f77bcf86cd799439011"; // This is a sample MongoDB ObjectId
    
    const imageData = image ? {
      url: image,
      altText: name
    } : {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      altText: name
    };

    const courseData = { 
      name: name || "Test Course", 
      price: price || 0, 
      image: imageData, 
      duration: duration || { years: 0, months: 0 }, 
      affiliate_link: affiliate_link || "https://example.com", 
      rating: rating || 0, 
      domain: domain || "507f1f77bcf86cd799439011", 
      section: section || "507f1f77bcf86cd799439011", 
      user: testUserId
    };

    console.log("Test course data:", courseData);

    const course = new Course(courseData);
    const createdCourse = await course.save();
    console.log("Test course saved successfully:", createdCourse._id);
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error("Test course creation error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports=router;