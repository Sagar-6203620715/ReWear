const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 9000;

app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Coursify API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
