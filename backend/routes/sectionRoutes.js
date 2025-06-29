router.get("/", async (req, res) => {
  try {
    const sections = await Section.find({});
    res.json(sections);
  } catch (error) {
    console.error("Failed to get sections", error);
    res.status(500).json({ message: "Server error" });
  }
});
