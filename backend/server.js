require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// ----------------- Connect DB -----------------
connectDB(process.env.MONGODB_URL);

// ----------------- Middleware -----------------
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------- Routes -----------------
app.use("/api/auth", require("./routes/auth-routes"));
app.use("/api/admin", require("./routes/admin-routes"));
app.use("/api/notes", require("./routes/note-routes"));

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
