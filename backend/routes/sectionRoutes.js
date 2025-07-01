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

// Update section (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const section = await Section.findById(req.params.id);
    if (section) {
      section.name = name || section.name;
      const updatedSection = await section.save();
      res.json(updatedSection);
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete section (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (section) {
      await section.deleteOne();
      res.json({ message: 'Section removed' });
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;