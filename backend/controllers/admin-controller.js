const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const { cloudinary } = require("../config/cloudinary");

const ADMIN = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN.username || password !== ADMIN.password) {
    return res.json({ success: false, message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { admin: true, username: ADMIN.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({ success: true, token });
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Delete file from Cloudinary — don't let this block note deletion
    if (note.file && note.file.filename) {
      try {
        await cloudinary.uploader.destroy(note.file.filename, { resource_type: "auto" });
      } catch (cloudErr) {
        console.log("Cloudinary delete warning:", cloudErr.message);
      }
    }

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Admin delete note error:", err);
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
};
