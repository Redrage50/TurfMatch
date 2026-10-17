import { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { mumbaiCenter } from "../data/turfs";
import { SPORTS } from "../data/sports";
import TurfMap from "../components/TurfMap";
import TurfCard from "../components/TurfCard";
import BookingModal from "../components/BookingModal";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { turfs, bookings, addBooking } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [sport, setSport] = useState("all");
  const [sort, setSort] = useState("rating");
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [bookingTurf, setBookingTurf] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  const areas = useMemo(() => ["all", ...new Set(turfs.map((t) => t.area))], [turfs]);

  const filtered = useMemo(() => {
    let list = turfs.filter((t) => {
      const matchesQuery =
        !query ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.area.toLowerCase().includes(query.toLowerCase());
      const matchesArea = area === "all" || t.area === area;
      const matchesSport = sport === "all" || t.sports.includes(sport);
      return matchesQuery && matchesArea && matchesSport;
    });
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "price-low") list = [...list].sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (sort === "price-high") list = [...list].sort((a, b) => b.pricePerHour - a.pricePerHour);
    return list;
  }, [turfs, query, area, sport, sort]);

  function handleBookClick(turf) {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingTurf(turf);
  }

  function handleConfirmBooking(details) {
    // Defensive re-check: don't let a slot be double-booked even if the modal's
    // snapshot of availability was stale (e.g. someone else booked it moments ago).
    const alreadyTaken = bookings.some(
      (b) =>
        b.turfId === details.turfId &&
        b.date === details.date &&
        b.slot === details.slot &&
        b.status !== "cancelled"
    );
    if (alreadyTaken) {
      alert("Sorry, that slot was just booked by someone else. Please pick another slot.");
      return;
    }
    addBooking({ ...details, userId: user.id });
    setBookingTurf(null);
    setConfirmed(details);
    setTimeout(() => setConfirmed(null), 4000);
  }

  return (
    <div>
      <section className="hero">
        <div className="page-container hero-inner">
          <span className="hero-eyebrow">● Mumbai · Live Availability</span>
          <h1 className="hero-title">
            Book a turf. <span className="accent">Kick off in minutes.</span>
          </h1>
          <p className="hero-sub">
            Search football turfs across Mumbai, check them on the map, and lock in a slot —
            then find players or a team to fill your line-up.
          </p>

          <div className="search-bar">
            <div className="search-field">
              <label htmlFor="q">Search</label>
              <input
                id="q"
                placeholder="Turf name or area (e.g. Andheri)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="search-field" style={{ maxWidth: 200 }}>
              <label htmlFor="area">Area</label>
              <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === "all" ? "All Mumbai" : a}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-field" style={{ maxWidth: 170 }}>
              <label htmlFor="sport">Sport</label>
              <select id="sport" value={sport} onChange={(e) => setSport(e.target.value)}>
                <option value="all">All sports</option>
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-field" style={{ maxWidth: 180 }}>
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container page-main">
        {confirmed && (
          <div className="form-alert success">
            Booked {confirmed.turfName} on {confirmed.date} at {confirmed.slot}. Now go{" "}
            <a href="/recruitment" style={{ textDecoration: "underline" }}>
              find players or a team
            </a>{" "}
            for the match.
          </div>
        )}

        <TurfMap
          turfs={filtered}
          center={mumbaiCenter}
          selectedId={selectedTurf?.id}
          onSelect={(t) => setSelectedTurf(t)}
        />

        <div className="section-head">
          <h2 className="section-title">Turfs in Mumbai</h2>
          <span className="section-count">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No turfs match your search</h3>
            <p>Try a different area or clear your search.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((t) => (
              <TurfCard key={t.id} turf={t} onBook={handleBookClick} />
            ))}
          </div>
        )}
      </div>

      {bookingTurf && (
        <BookingModal
          turf={bookingTurf}
          bookings={bookings}
          onClose={() => setBookingTurf(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
