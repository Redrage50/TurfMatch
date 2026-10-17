export function StarsDisplay({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= rounded ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export function StarsInput({ value, onChange }) {
  return (
    <span className="stars interactive" role="radiogroup" aria-label="Rate from 1 to 5 stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          role="radio"
          aria-checked={value === i}
          tabIndex={0}
          onClick={() => onChange(i)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(i)}
        >
          {i <= value ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
