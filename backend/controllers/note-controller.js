const Note = require("../models/note");
const { cloudinary } = require("../config/cloudinary");

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    console.error("Get Notes Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching notes",
    });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    console.log("User:", req.user);

    const { title, text } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let file = null;

    if (req.file) {
      file = {
        originalname: req.file.originalname,
        filename: req.file.filename, // Cloudinary public_id
        mimetype: req.file.mimetype,
        url: req.file.path, // Cloudinary secure URL
      };
    }

    const note = await Note.create({
      title,
      text,
      author: req.user.userId,
      file,
    });

    const populatedNote = await Note.findById(note._id).populate(
      "author",
      "username"
    );

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: populatedNote,
    });
  } catch (err) {
    console.error("Create Note Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Error creating note",
    });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Allow only owner to delete
    if (note.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Delete file from Cloudinary
    if (note.file && note.file.filename) {
      try {
        await cloudinary.uploader.destroy(note.file.filename, {
          resource_type: "auto",
        });
      } catch (cloudErr) {
        console.error("Cloudinary Delete Error:", cloudErr.message);
      }
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (err) {
    console.error("Delete Note Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Error deleting note",
    });
  }
};