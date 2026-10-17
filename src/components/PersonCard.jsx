import { StarsDisplay } from "./StarRating";

export default function PersonCard({ entity, type, actionLabel, onRecruit, onRate }) {
  const isPlayer = type === "player";
  const label = actionLabel || (isPlayer ? "Recruit" : "Request Match");
  return (
    <div className="person-card">
      <div className="person-top">
        <div className="avatar-circle">{entity.avatar || (isPlayer ? "🧑" : "👥")}</div>
        <div>
          <div className="person-name">{entity.name}</div>
          <div className="person-meta">
            {entity.area}, Mumbai {isPlayer ? `• Age ${entity.age}` : `• ${entity.membersCount} members`}
          </div>
        </div>
      </div>

      <div className="tag-row">
        <span className="tag">{entity.sport}</span>
        {isPlayer ? (
          <span className="tag tag-position">{entity.position}</span>
        ) : (
          entity.lookingFor.map((pos) => (
            <span key={pos} className="tag tag-position">
              Needs {pos}
            </span>
          ))
        )}
        <span className="tag">{entity.skill}</span>
      </div>

      <p className="person-bio">{entity.bio}</p>

      <div className="person-footer">
        <span className="rating-inline">
          <StarsDisplay value={entity.rating} /> {entity.rating || "New"} {entity.ratingsCount ? `(${entity.ratingsCount})` : ""}
        </span>
        <div className="flex gap-8">
          <button className="btn btn-ghost btn-sm" onClick={() => onRate(entity, type)}>
            Rate
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onRecruit(entity, type)}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
