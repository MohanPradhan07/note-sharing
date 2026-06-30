import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:3000/api";

export default function AuthPage() {
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  // mode: "login" | "register" | "admin"
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setMsg({ text: "", type: "" });
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      return setMsg({ text: "Please enter username and password.", type: "error" });
    }

    setLoading(true);
    setMsg({ text: "", type: "" });

    const endpoint =
      mode === "admin" ? "/admin/login"
      : mode === "login" ? "/auth/login"
      : "/auth/register";

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (!data.success) {
        setMsg({ text: data.message || "Something went wrong.", type: "error" });
      } else if (mode === "admin") {
        adminLogin(data.token);
        navigate("/admin");
      } else if (mode === "login") {
        login(data.token);
        navigate("/notes");
      } else {
        // register success
        setMsg({ text: "Registered! Please log in.", type: "success" });
        switchMode("login");
      }
    } catch {
      setMsg({ text: "Network error. Is the server running?", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const titles = { login: "Login", register: "Create Account", admin: "Admin Login" };

  return (
    <div className="auth-card">
      <h2>{titles[mode]}</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        autoComplete={mode === "register" ? "new-password" : "current-password"}
      />

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
      </button>

      <p className={`auth-msg ${msg.type}`}>{msg.text}</p>

      {mode !== "admin" && (
        <>
          <button className="btn-link" onClick={() => switchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
          <button className="btn-admin" onClick={() => switchMode("admin")}>
            Admin Login
          </button>
        </>
      )}

      {mode === "admin" && (
        <button className="btn-link" onClick={() => switchMode("login")}>
          ← Back to User Login
        </button>
      )}
    </div>
  );
}
