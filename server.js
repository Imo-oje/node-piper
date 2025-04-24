const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8000;

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.use(express.static(uploadDir));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", upload.array("files"), (req, res) => {
  res.send("Files uploaded successfully!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
