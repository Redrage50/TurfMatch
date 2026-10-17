import { useState } from "react";
import Modal from "./Modal";
import { StarsInput } from "./StarRating";

export default function RateEntityModal({ entity, type, onClose, onSubmit }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ stars, comment });
  }

  return (
    <Modal title={`Rate ${entity.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p className="text-muted text-sm mt-8">
          {type === "player" ? "How was this player after your match?" : "How was this team after your match?"}
        </p>
        <div className="mt-16">
          <StarsInput value={stars} onChange={setStars} />
        </div>
        <div className="field mt-16">
          <label htmlFor="comment">Comment (optional)</label>
          <textarea
            id="comment"
            placeholder="Good positioning, showed up on time, great teamwork..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="modal-close-row">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Submit Rating
          </button>
        </div>
      </form>
    </Modal>
  );
}
