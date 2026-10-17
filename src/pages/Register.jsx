import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "player", label: "Player", icon: "🧑‍🦱" },
  { value: "captain", label: "Team Captain", icon: "🧢" },
  { value: "admin", label: "Turf Admin", icon: "🛠️" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "player" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      register(form);
      if (form.role === "player") navigate("/enroll/player");
      else if (form.role === "captain") navigate("/enroll/team");
      else navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-container page-main">
      <div className="auth-wrap card">
        <h2 className="form-title">Create your account</h2>
        <p className="form-sub">Choose a role — this decides what you can do on TurfMatch.</p>

        {error && <div className="form-alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>I am a...</label>
            <div className="role-select">
              {ROLES.map((r) => (
                <div
                  key={r.value}
                  className={"role-option" + (form.role === r.value ? " selected" : "")}
                  onClick={() => setForm({ ...form, role: r.value })}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Aarav Shah" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required minLength={4} value={form.password} onChange={handleChange} placeholder="At least 4 characters" />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-8">
            Create account
          </button>
        </form>

        <p className="text-sm text-muted mt-16">
          Already have an account? <Link to="/login" style={{ color: "var(--turf-green)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
