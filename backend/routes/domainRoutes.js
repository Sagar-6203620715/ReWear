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

// @route   GET /api/domains
// @desc    Get all domains
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/domains called");
    const domains = await Domain.find().populate("section", "name");
    res.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
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
// @desc    Delete domain (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    await domain.deleteOne();
    res.json({ message: "Domain removed" });
  } catch (error) {
    console.error("Error deleting domain:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
