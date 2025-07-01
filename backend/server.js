const express = require("express");
const app = express();

const PORT = process.env.PORT || 9000;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Coursify API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
