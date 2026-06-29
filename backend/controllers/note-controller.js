const Note = require("../models/note");

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
};

exports.deleteNote = async (req, res) => {
  const fs = require("fs");
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Only the author can delete their own note
    if (note.author.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (note.file && note.file.path) {
      fs.unlink(note.file.path, (err) => { if (err) console.log("File delete error:", err); });
    }

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, text } = req.body;
    let file = null;

    if (req.file) {
      file = {
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        path: req.file.path,
      };
    }

    const note = await Note.create({ title, text, author: req.user.userId, file });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating note" });
  }
};
