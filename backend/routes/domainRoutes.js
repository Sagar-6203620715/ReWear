const express = require("express");
const Domain = require("../models/Domain");
const Section = require("../models/Section");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/domains
// @desc    Create a new domain (admin only)
router.post("/", protect, admin, async (req, res) => {
  const { name, section } = req.body;

  if (!name || !section) {
    return res.status(400).json({ message: "Name and section are required" });
  }

  try {
    const domainExists = await Domain.findOne({ name });
    if (domainExists) {
      return res.status(400).json({ message: "Domain already exists" });
    }

    const domain = new Domain({ name, section });
    const createdDomain = await domain.save();
    res.status(201).json(createdDomain);
  } catch (error) {
    console.error("Error creating domain:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/domains?section=Tech
// @desc    Get domains (optionally filtered by section)
router.get("/", async (req, res) => {
  try {
    const { section } = req.query;
    const query = {};

    if (section) {
      // Find section ID by name
      const sectionDoc = await Section.findOne({ name: section });
      if (!sectionDoc) {
        return res.status(404).json({ message: "Section not found" });
      }
      query.section = sectionDoc._id;
    }

    const domains = await Domain.find(query).populate("section", "name");
    res.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// @route GET /api/domains/search?query=web
// @desc Search domains by name
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const matchedDomains = await Domain.find({
      name: { $regex: query, $options: "i" },
    }).populate("section", "name");

    res.json(matchedDomains);
  } catch (error) {
    console.error("Error searching domains:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// @route   PUT /api/domains/:id
// @desc    Update domain (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  const { name, section } = req.body;

  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    domain.name = name || domain.name;
    domain.section = section || domain.section;

    const updatedDomain = await domain.save();
    res.json(updatedDomain);
  } catch (error) {
    console.error("Error updating domain:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/domains/:id
// @desc    Delete domain and all associated courses (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // Import Course model
    const Course = require("../models/Course");

    // Find and delete all courses associated with this domain
    const coursesToDelete = await Course.find({ domain: req.params.id });
    console.log(`Found ${coursesToDelete.length} courses to delete for domain: ${domain.name}`);

    if (coursesToDelete.length > 0) {
      const deleteResult = await Course.deleteMany({ domain: req.params.id });
      console.log(`Deleted ${deleteResult.deletedCount} courses for domain: ${domain.name}`);
    }

    // Delete the domain
    await domain.deleteOne();
    console.log(`Domain "${domain.name}" deleted successfully`);

    res.json({ 
      message: `Domain "${domain.name}" and ${coursesToDelete.length} associated courses removed successfully`,
      deletedCourses: coursesToDelete.length
    });
  } catch (error) {
    console.error("Error deleting domain:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
