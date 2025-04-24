const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 8000;
const baseDir = require("os").homedir(); // Operating system's home directory

// Index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API: List PC files and folders
app.get("/api/list", (req, res) => {
  const dir = path.resolve(baseDir, req.query.path || ".");

  if (!dir.startsWith(baseDir)) {
    return res.status(403).send("Access denied");
  }

  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).send("Failed to read directory");

    const files = entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));

    res.json({ path: dir, files });
  });
});

app.use("/static", express.static(baseDir)); // For file download

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
