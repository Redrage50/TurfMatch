import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { SPORTS, positionsFor } from "../data/sports";

const TEAM_AVATARS = ["🦁", "🐯", "🦅", "🐺", "🔥", "⚡", "🛡️", "⚔️"];

export default function TeamEnroll() {
  const { user, linkProfile } = useAuth();
  const { addTeam } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sport: "Football",
    area: "",
    membersCount: "",
    existingCount: "",
    skill: "Beginner",
    bio: "",
    contactPhone: "",
    avatar: TEAM_AVATARS[0],
  });
  const [lookingFor, setLookingFor] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSportChange(sport) {
    setForm({ ...form, sport });
    setLookingFor([]); // positions differ per sport, so reset selection
  }

  function togglePosition(pos) {
    setLookingFor((prev) => (prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.area || !form.membersCount || form.existingCount === "" || !form.contactPhone) {
      setError("Please fill in team name, area, target size, current players, and a contact phone number.");
      return;
    }
    const target = Number(form.membersCount);
    const existing = Number(form.existingCount);
    if (existing > target) {
      setError("Players you already have can't be more than your target squad size.");
      return;
    }
    const phonePattern = /^(\+?91[-\s]?)?[6-9]\d{9}$/;
    if (!phonePattern.test(form.contactPhone.replace(/\s+/g, ""))) {
      setError("Please enter a valid 10-digit Indian phone number (e.g. 98765 43210).");
      return;
    }
    if (lookingFor.length === 0) {
      setError("Select at least one position you're recruiting for.");
      return;
    }
    const newTeam = addTeam({ ...form, membersCount: target, existingCount: existing, lookingFor });
    linkProfile(newTeam.id);
    setSuccess(true);
    setTimeout(() => navigate("/my-team"), 1200);
  }

  return (
    <div className="page-container page-main">
      <div className="auth-wrap card" style={{ maxWidth: 560 }}>
        <h2 className="form-title">Team Enrollment</h2>
        <p className="form-sub">
          Register your squad and list the positions you need — your team card will show up on the
          matchmaking tab of the recruitment page.
        </p>

        {error && <div className="form-alert error">{error}</div>}
        {success && <div className="form-alert success">Team created! Redirecting to your team page...</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Team emblem</label>
            <div className="check-grid">
              {TEAM_AVATARS.map((a) => (
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
            <label htmlFor="name">Team name</label>
            <input id="name" name="name" required placeholder="e.g. Andheri Falcons" value={form.name} onChange={handleChange} />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="area">Home area in Mumbai</label>
              <input id="area" name="area" required placeholder="e.g. Powai" value={form.area} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="membersCount">Target squad size</label>
              <input id="membersCount" name="membersCount" type="number" min="1" max="30" required value={form.membersCount} onChange={handleChange} placeholder="e.g. 11" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="existingCount">Players you already have</label>
            <input
              id="existingCount"
              name="existingCount"
              type="number"
              min="0"
              max="30"
              required
              value={form.existingCount}
              onChange={handleChange}
              placeholder="e.g. 7"
            />
            <p className="text-sm text-muted" style={{ marginTop: 2 }}>
              We'll work out your open spots as (target − players you have − players recruited
              through the app).
            </p>
          </div>

          <div className="field">
            <label htmlFor="contactPhone">Captain's contact number</label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              required
              placeholder="e.g. 98765 43210"
              value={form.contactPhone}
              onChange={handleChange}
            />
            <p className="text-sm text-muted" style={{ marginTop: 2 }}>
              Only shown to a player after you accept their request to join — so they can call you
              to confirm.
            </p>
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
            <label>Recruiting for roles</label>
            <div className="check-grid">
              {positionsFor(form.sport).map((pos) => (
                <div
                  key={pos}
                  className={"check-pill" + (lookingFor.includes(pos) ? " selected" : "")}
                  onClick={() => togglePosition(pos)}
                >
                  {pos}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="skill">Team skill level</label>
            <select id="skill" name="skill" value={form.skill} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Pro</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="bio">Short description</label>
            <textarea id="bio" name="bio" placeholder="Playing schedule, home turf, team vibe..." value={form.bio} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-8">
            Create Team Profile
          </button>
        </form>
      </div>
    </div>
  );
}
