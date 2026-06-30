const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const { getAllNotes, createNote, deleteNote } = require("../controllers/note-controller");

const upload = multer({ storage });

router.get("/", auth, getAllNotes);
router.post("/", auth, upload.single("file"), createNote);
router.delete("/:id", auth, deleteNote);

module.exports = router;
