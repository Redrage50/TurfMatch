import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { StarsDisplay } from "../components/StarRating";

export default function MyTeam() {
  const { user } = useAuth();
  const { teams, removeTeamMember } = useData();

  const team = useMemo(() => teams.find((t) => t.id === user.profileId), [teams, user]);

  if (!team) {
    return (
      <div className="page-container page-main">
        <div className="empty-state">
          <h3>You haven't enrolled a team yet</h3>
          <p className="mt-8">
            Create your team profile to start recruiting players and see your roster here.
          </p>
          <Link to="/enroll/team" className="btn btn-primary btn-sm mt-16">
            Enroll Your Team
          </Link>
        </div>
      </div>
    );
  }

  const roster = team.roster || [];
  const targetSize = team.membersCount || 0;
  const existingCount = team.existingCount || 0;
  const filledCount = existingCount + roster.length;
  const emptySpots = Math.max(targetSize - filledCount, 0);

  function handleRemove(memberId, name) {
    if (confirm(`Remove ${name} from your team?`)) {
      removeTeamMember(team.id, memberId);
    }
  }

  return (
    <div className="page-container page-main">
      <div className="card" style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="avatar-circle" style={{ width: 64, height: 64, fontSize: 30 }}>
          {team.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2 className="form-title" style={{ marginBottom: 4 }}>
            {team.name}
          </h2>
          <p className="text-muted text-sm">
            {team.area}, Mumbai • {team.sport} • {team.skill}
          </p>
          <div className="rating-inline mt-8">
            <StarsDisplay value={team.rating} /> {team.rating || "New"}{" "}
            {team.ratingsCount ? `(${team.ratingsCount} ratings)` : ""}
          </div>
          {team.bio && <p className="person-bio mt-8">{team.bio}</p>}
          <div className="tag-row mt-16">
            {(team.lookingFor || []).map((pos) => (
              <span key={pos} className="tag tag-position">
                Recruiting: {pos}
              </span>
            ))}
          </div>
          {team.contactPhone && (
            <p className="text-sm text-muted mt-16">
              Captain contact: <span className="mono">{team.contactPhone}</span> (shown to players
              once you accept their join request)
            </p>
          )}
        </div>
        <Link to="/recruitment" className="btn btn-accent btn-sm">
          Recruit More Players
        </Link>
      </div>

      <div className="section-head" style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 18 }}>Team Roster</h3>
        <span className="section-count">
          {filledCount} / {targetSize || "—"} spots filled
        </span>
      </div>
      <p className="text-muted text-sm" style={{ marginTop: -8 }}>
        {existingCount} player{existingCount === 1 ? "" : "s"} you already had, {roster.length}{" "}
        recruited through the app, {emptySpots} open spot{emptySpots === 1 ? "" : "s"}.
      </p>

      <div className="roster-grid">
        {existingCount > 0 && (
          <div className="roster-member">
            <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: 18 }}>
              👥
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {existingCount} existing player{existingCount === 1 ? "" : "s"}
              </div>
              <div className="text-sm text-muted">Already on your team before joining TurfMatch</div>
            </div>
          </div>
        )}

        {roster.map((m) => (
          <div key={m.id} className="roster-member">
            <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: 18 }}>
              {m.avatar || "🧑"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
              <div className="text-sm text-muted">{m.position || "Member"}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => handleRemove(m.id, m.name)}>
              Remove
            </button>
          </div>
        ))}

        {Array.from({ length: emptySpots }).map((_, i) => (
          <div key={`empty-${i}`} className="roster-empty">
            Empty Spot — <Link to="/recruitment" style={{ color: "var(--turf-green)", fontWeight: 700, marginLeft: 4 }}>Recruit a player</Link>
          </div>
        ))}

        {roster.length === 0 && existingCount === 0 && emptySpots === 0 && (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <h3>No roster target set</h3>
            <p>Your target squad size is 0 — recruit players and they'll show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
