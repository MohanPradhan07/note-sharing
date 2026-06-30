import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function NotesPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("notes");
  const [allNotes, setAllNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [uploadMsg, setUploadMsg] = useState({ text: "", type: "" });
  const [uploading, setUploading] = useState(false);

  const currentUserId = token ? parseJwt(token)?.userId : null;

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (token) loadNotes();
  }, [token]);

  async function loadNotes() {
    setLoadingNotes(true);
    try {
      const res = await fetch(`${API}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllNotes(Array.isArray(data) ? data : []);
    } catch {
      setAllNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setUploadMsg({ text: "", type: "" });
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadMsg({ text: "Note uploaded successfully!", type: "success" });
        e.target.reset();
        loadNotes();
        setTimeout(() => setView("notes"), 1200);
      } else {
        setUploadMsg({ text: data.message || "Upload failed.", type: "error" });
      }
    } catch {
      setUploadMsg({ text: "Network error.", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAllNotes((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch {
      alert("Network error.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  const filtered = allNotes.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="main-header">
        <div className="logo">📘 NoteShare</div>
        <nav>
          <button className={view === "notes" ? "active" : ""} onClick={() => setView("notes")}>
            Notes
          </button>
          <button className={view === "upload" ? "active" : ""} onClick={() => setView("upload")}>
            Upload
          </button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {view === "notes" && (
        <section className="notes-section">
          <input
            type="text"
            className="search-bar"
            placeholder="🔎 Search notes by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loadingNotes ? (
            <p className="loading">Loading notes...</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">
              {search ? "No notes match your search." : "No notes yet. Be the first to upload!"}
            </p>
          ) : (
            <div className="notes-grid">
              {filtered.map((note) => (
                <div key={note._id} className="note-card">
                  <h3>{note.title}</h3>
                  {note.text && <p>{note.text}</p>}
                  <p className="meta">
                    <b>By:</b> {note.author?.username || "Unknown"}
                  </p>
                  {note.file && (
                    <a
                      href={`http://localhost:3000/uploads/${note.file.filename}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                       View 
                    </a>
                  )}
                  {note.createdAt && <p className="date">{formatDate(note.createdAt)}</p>}

                  {note.author?._id === currentUserId && (
                    <button className="btn-delete" onClick={() => handleDelete(note._id)}>
                      🗑️ Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {view === "upload" && (
        <div className="upload-card">
          <h2>Upload a Note</h2>
          <form onSubmit={handleUpload}>
            <input type="text" name="title" placeholder="Title" required />
            <textarea name="text" placeholder="Description (optional)" />
            <input type="file" name="file" required />
            <button className="btn-primary" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Note"}
            </button>
          </form>
          {uploadMsg.text && (
            <p className={`upload-msg ${uploadMsg.type}`}>{uploadMsg.text}</p>
          )}
        </div>
      )}
    </>
  );
}
