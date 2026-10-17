import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      login(form);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-container page-main">
      <div className="auth-wrap card">
        <h2 className="form-title">Welcome back</h2>
        <p className="form-sub">Log in to book turfs, recruit players, and manage your matches.</p>

        {error && <div className="form-alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-8">
            Log in
          </button>
        </form>

        <p className="text-sm text-muted mt-16">
          New here? <Link to="/register" style={{ color: "var(--turf-green)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
