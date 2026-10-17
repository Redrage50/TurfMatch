import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { mumbaiCenter } from "../data/turfs";
import { SPORTS } from "../data/sports";

const SURFACES = [
  "Artificial Turf",
  "FIFA Grade Turf",
  "Synthetic Grass",
  "Natural Grass",
  "Wooden Court",
  "Hard Court",
  "Clay Court",
  "Concrete Court",
];

const emptyForm = {
  name: "",
  area: "",
  lat: mumbaiCenter.lat,
  lng: mumbaiCenter.lng,
  pricePerHour: "",
  size: "5-a-side",
  surface: "Artificial Turf",
  image: "",
  slotsText: "06:00, 07:00, 18:00, 19:00, 20:00",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { turfs, addTurf, removeTurf } = useData();

  const [form, setForm] = useState(emptyForm);
  const [sports, setSports] = useState(["Football"]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const myTurfs = useMemo(() => turfs.filter((t) => t.addedBy === user.id), [turfs, user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleSport(sport) {
    setSports((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name || !form.area || !form.pricePerHour) {
      setError("Please fill in turf name, area, and price per hour.");
      return;
    }
    if (sports.length === 0) {
      setError("Select at least one sport this turf supports.");
      return;
    }
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("Latitude and longitude must be numbers.");
      return;
    }

    const slots = form.slotsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addTurf({
      name: form.name,
      area: form.area,
      lat,
      lng,
      sports,
      pricePerHour: Number(form.pricePerHour),
      size: form.size,
      surface: form.surface,
      image: form.image || undefined,
      slots: slots.length ? slots : ["06:00", "07:00", "18:00", "19:00"],
      rating: 0,
      addedBy: user.id,
    });

    setForm(emptyForm);
    setSports(["Football"]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  function handleDelete(turfId) {
    if (confirm("Remove this turf listing?")) {
      removeTurf(turfId);
    }
  }

  return (
    <div className="page-container page-main">
      <h2 className="section-title">Turf Admin Dashboard</h2>
      <p className="text-muted text-sm mt-8">
        Add a new turf listing — it appears immediately on the home page map and search for
        everyone in Mumbai.
      </p>

      <div className="grid-2 mt-24">
        <div className="card">
          <h3 className="form-title" style={{ fontSize: 20 }}>
            Add a New Turf
          </h3>
          <p className="form-sub">All fields except image are required.</p>

          {error && <div className="form-alert error">{error}</div>}
          {success && <div className="form-alert success">Turf added! It's now live on the home page.</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Turf name</label>
              <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Goregaon Green Turf" />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="area">Area in Mumbai</label>
                <input id="area" name="area" required value={form.area} onChange={handleChange} placeholder="e.g. Goregaon East" />
              </div>
              <div className="field">
                <label htmlFor="pricePerHour">Price per hour (₹)</label>
                <input id="pricePerHour" name="pricePerHour" type="number" min="0" required value={form.pricePerHour} onChange={handleChange} placeholder="1200" />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="lat">Latitude</label>
                <input id="lat" name="lat" type="number" step="0.0001" required value={form.lat} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="lng">Longitude</label>
                <input id="lng" name="lng" type="number" step="0.0001" required value={form.lng} onChange={handleChange} />
              </div>
            </div>
            <p className="text-sm text-muted" style={{ marginTop: -10, marginBottom: 16 }}>
              Tip: right-click the spot on Google Maps and copy the coordinates shown.
            </p>

            <div className="field">
              <label>Sports supported (select all that apply)</label>
              <div className="check-grid">
                {SPORTS.map((s) => (
                  <div
                    key={s}
                    className={"check-pill" + (sports.includes(s) ? " selected" : "")}
                    onClick={() => toggleSport(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="size">Turf / court size</label>
                <select id="size" name="size" value={form.size} onChange={handleChange}>
                  <option>5-a-side</option>
                  <option>6-a-side</option>
                  <option>7-a-side</option>
                  <option>11-a-side</option>
                  <option>Indoor Court</option>
                  <option>Full Court</option>
                  <option>Half Court</option>
                  <option>Practice Nets</option>
                  <option>Court</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="surface">Surface</label>
                <select id="surface" name="surface" value={form.surface} onChange={handleChange}>
                  {SURFACES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="slotsText">Available time slots (comma separated)</label>
              <input id="slotsText" name="slotsText" value={form.slotsText} onChange={handleChange} placeholder="06:00, 07:00, 18:00, 19:00" />
            </div>

            <div className="field">
              <label htmlFor="image">Photo URL (optional)</label>
              <input id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-8">
              Add Turf
            </button>
          </form>
        </div>

        <div>
          <h3 className="form-title" style={{ fontSize: 20 }}>
            Your Listings
          </h3>
          <p className="form-sub">{myTurfs.length} turf{myTurfs.length === 1 ? "" : "s"} added by you.</p>

          {myTurfs.length === 0 ? (
            <div className="empty-state">
              <h3>No turfs added yet</h3>
              <p>Use the form to list your first turf.</p>
            </div>
          ) : (
            myTurfs.map((t) => (
              <div key={t.id} className="match-row">
                <div>
                  <strong>{t.name}</strong>
                  <div className="text-sm text-muted mono">
                    {t.area} • ₹{t.pricePerHour}/hr • {t.sports.join(", ")}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t.id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
