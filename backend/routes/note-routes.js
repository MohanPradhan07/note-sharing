const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getAllNotes, createNote, deleteNote } = require("../controllers/note-controller");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/", auth, getAllNotes);
router.post("/", auth, upload.single("file"), createNote);
router.delete("/:id", auth, deleteNote);

module.exports = router;
