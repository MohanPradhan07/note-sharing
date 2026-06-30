import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminPage() {
  const { adminToken, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) navigate("/");
  }, [adminToken, navigate]);

  useEffect(() => {
    if (adminToken) loadNotes();
  }, [adminToken]);

  async function loadNotes() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/notes`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      setAllNotes(Array.isArray(data) ? data : []);
    } catch {
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`${API}/admin/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setAllNotes((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert(data.message || "Failed to delete.");
      }
    } catch {
      alert("Network error.");
    }
  }

  function handleLogout() {
    adminLogout();
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
      <header className="admin-header">
        <div className="logo">🛡️ Admin Panel</div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="admin-main">
        <h2>All Notes ({allNotes.length})</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="🔎 Search notes by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="loading">Loading notes...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">
            {search ? "No notes match your search." : "No notes in the system."}
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
                    href={`${API}/uploads/${note.file.filename}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View File
                  </a>
                )}
                {note.createdAt && (
                  <p className="date">{formatDate(note.createdAt)}</p>
                )}
                <button className="btn-delete" onClick={() => deleteNote(note._id)}>
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
