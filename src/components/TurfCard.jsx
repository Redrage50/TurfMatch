import { StarsDisplay } from "./StarRating";

export default function TurfCard({ turf, onBook }) {
  return (
    <div className="ticket-card">
      <img src={turf.image} alt={turf.name} className="ticket-image" loading="lazy" />
      <div className="ticket-body">
        <div className="ticket-title-row">
          <div>
            <div className="ticket-title">{turf.name}</div>
            <div className="ticket-area">{turf.area}, Mumbai</div>
          </div>
          <span className="badge">{turf.size}</span>
        </div>

        <div className="tag-row">
          {turf.sports.map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
          <span className="tag">{turf.surface}</span>
        </div>

        <div className="ticket-stub-divider" />

        <div className="ticket-stats">
          <span className="rating-inline">
            <StarsDisplay value={turf.rating} /> {turf.rating}
          </span>
          <span className="ticket-price">₹{turf.pricePerHour}/hr</span>
        </div>
      </div>
      <div className="ticket-footer">
        <button className="btn btn-primary btn-sm w-full" onClick={() => onBook(turf)}>
          Book Slot
        </button>
      </div>
    </div>
  );
}
