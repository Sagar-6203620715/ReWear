const express = require("express");
const Section = require("../models/Section");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all sections
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find({});
    res.json(sections);
  } catch (error) {
    console.error("Failed to get sections", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create section (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const section = new Section({ name });
    const createdSection = await section.save();
    res.status(201).json(createdSection);
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;