import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { SPORTS, positionsFor } from "../data/sports";

const AVATARS = ["🧑", "🧑🏻", "🧑🏽", "🧑🏾", "👩", "👩🏽", "👨", "👨🏾"];

export default function PlayerEnroll() {
  const { user, linkProfile } = useAuth();
  const { addPlayer } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    sport: "Football",
    position: positionsFor("Football")[0],
    area: "",
    age: "",
    skill: "Beginner",
    bio: "",
    avatar: AVATARS[0],
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSportChange(sport) {
    setForm({ ...form, sport, position: positionsFor(sport)[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.area || !form.age) {
      setError("Please fill in your name, area, and age.");
      return;
    }
    const newPlayer = addPlayer({ ...form, age: Number(form.age) });
    linkProfile(newPlayer.id);
    setSuccess(true);
    setTimeout(() => navigate("/recruitment"), 1200);
  }

  return (
    <div className="page-container page-main">
      <div className="auth-wrap card" style={{ maxWidth: 560 }}>
        <h2 className="form-title">Solo Player Enrollment</h2>
        <p className="form-sub">
          Fill this out once and your profile appears on the recruitment page so teams and other
          players can find and recruit you.
        </p>

        {error && <div className="form-alert error">{error}</div>}
        {success && <div className="form-alert success">Profile created! Redirecting to recruitment...</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Choose an avatar</label>
            <div className="check-grid">
              {AVATARS.map((a) => (
                <div
                  key={a}
                  className={"check-pill" + (form.avatar === a ? " selected" : "")}
                  style={{ fontSize: 18 }}
                  onClick={() => setForm({ ...form, avatar: a })}
                >
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="area">Area in Mumbai</label>
              <input id="area" name="area" required placeholder="e.g. Andheri" value={form.area} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="age">Age</label>
              <input id="age" name="age" type="number" min="10" max="70" required value={form.age} onChange={handleChange} />
            </div>
          </div>

          <div className="field">
            <label>Sport</label>
            <div className="check-grid">
              {SPORTS.map((s) => (
                <div
                  key={s}
                  className={"check-pill" + (form.sport === s ? " selected" : "")}
                  onClick={() => handleSportChange(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Preferred role / position</label>
            <div className="check-grid">
              {positionsFor(form.sport).map((pos) => (
                <div
                  key={pos}
                  className={"check-pill" + (form.position === pos ? " selected" : "")}
                  onClick={() => setForm({ ...form, position: pos })}
                >
                  {pos}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="skill">Skill level</label>
            <select id="skill" name="skill" value={form.skill} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Pro</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="bio">Short bio</label>
            <textarea id="bio" name="bio" placeholder="Playing style, availability, favourite turf..." value={form.bio} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-8">
            Create My Player Profile
          </button>
        </form>
      </div>
    </div>
  );
}
