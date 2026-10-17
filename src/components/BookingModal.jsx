import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

export default function BookingModal({ turf, bookings, onClose, onConfirm }) {
  const [slot, setSlot] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sport, setSport] = useState(turf.sports[0]);

  const bookedSlots = useMemo(() => {
    return new Set(
      (bookings || [])
        .filter((b) => b.turfId === turf.id && b.date === date && b.status !== "cancelled")
        .map((b) => b.slot)
    );
  }, [bookings, turf.id, date]);

  // If the selected slot becomes unavailable (date changed, or someone else just took it),
  // clear the selection so the person can't submit a stale choice.
  useEffect(() => {
    if (slot && bookedSlots.has(slot)) {
      setSlot(null);
    }
  }, [bookedSlots, slot]);

  function handleConfirm() {
    if (!slot || bookedSlots.has(slot)) return;
    onConfirm({ turfId: turf.id, turfName: turf.name, date, slot, sport });
  }

  return (
    <Modal title={`Book ${turf.name}`} onClose={onClose}>
      <div className="text-muted text-sm">{turf.area}, Mumbai • ₹{turf.pricePerHour}/hr</div>

      {turf.sports.length > 1 && (
        <div className="field mt-16">
          <label htmlFor="sport">Sport</label>
          <select id="sport" value={sport} onChange={(e) => setSport(e.target.value)}>
            {turf.sports.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field mt-16">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="field">
        <label>Available slots</label>
        <div className="slot-grid">
          {turf.slots.map((s) => {
            const isBooked = bookedSlots.has(s);
            return (
              <button
                type="button"
                key={s}
                disabled={isBooked}
                title={isBooked ? "Already booked for this date" : undefined}
                className={"slot-btn" + (slot === s ? " selected" : "") + (isBooked ? " booked" : "")}
                onClick={() => !isBooked && setSlot(s)}
              >
                {s}
                {isBooked ? " (Booked)" : ""}
              </button>
            );
          })}
        </div>
        {turf.slots.every((s) => bookedSlots.has(s)) && (
          <p className="text-sm text-muted mt-8">
            All slots are booked for this date — try another date.
          </p>
        )}
      </div>

      <div className="modal-close-row">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary btn-sm" disabled={!slot} onClick={handleConfirm}>
          Confirm Booking
        </button>
      </div>
    </Modal>
  );
}
