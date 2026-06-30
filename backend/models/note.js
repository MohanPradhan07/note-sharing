const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: String,
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  file: {
    originalname: String,
    filename: String,   // Cloudinary public_id (used to delete)
    mimetype: String,
    url: String,        // Cloudinary secure URL (used to view)
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
