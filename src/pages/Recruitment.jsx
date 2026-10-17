import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SPORTS, positionsFor } from "../data/sports";
import PersonCard from "../components/PersonCard";
import RateEntityModal from "../components/RateEntityModal";
import Modal from "../components/Modal";

export default function Recruitment() {
  const { players, teams, rateEntity, addConnection, addTeamMember } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isPlayerRole = user?.role === "player";

  const [tab, setTab] = useState("solo"); // solo | team — only relevant for captains/guests
  const [sport, setSport] = useState("Football");
  const [position, setPosition] = useState("all");
  const [area, setArea] = useState("all");
  const [rateTarget, setRateTarget] = useState(null); // { entity, type }
  const [recruitInfo, setRecruitInfo] = useState(null); // { message }

  const positions = positionsFor(sport);

  // Reset the position filter whenever the sport changes, since positions differ per sport.
  useEffect(() => {
    setPosition("all");
  }, [sport]);

  const areas = useMemo(
    () => ["all", ...new Set([...players.map((p) => p.area), ...teams.map((t) => t.area)])],
    [players, teams]
  );

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchSport = p.sport === sport;
      const matchPos = position === "all" || p.position === position;
      const matchArea = area === "all" || p.area === area;
      return matchSport && matchPos && matchArea;
    });
  }, [players, sport, position, area]);

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchSport = t.sport === sport;
      const matchPos = position === "all" || t.lookingFor.includes(position);
      const matchArea = area === "all" || t.area === area;
      return matchSport && matchPos && matchArea;
    });
  }, [teams, sport, position, area]);

  function requireAuth() {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  }

  function handleRecruitPlayer(entity) {
    if (!requireAuth()) return;
    if (!user.profileId) {
      navigate("/enroll/team");
      return;
    }
    addConnection({ type: "player", targetId: entity.id, targetName: entity.name, byUserId: user.id });
    addTeamMember(user.profileId, {
      id: entity.id,
      name: entity.name,
      position: entity.position,
      avatar: entity.avatar,
      sport: entity.sport,
      source: "recruited",
    });
    setRecruitInfo({
      message: `${entity.name} has been added to your team roster.`,
    });
  }

  function handleChallengeTeam(entity) {
    if (!requireAuth()) return;
    addConnection({ type: "team", targetId: entity.id, targetName: entity.name, byUserId: user.id });
    setRecruitInfo({ message: `A match request has been sent to ${entity.name}.` });
  }

  function handleRequestJoin(entity) {
    if (!requireAuth()) return;
    addConnection({
      type: "join",
      targetId: entity.id,
      targetName: entity.name,
      byUserId: user.id,
      requesterName: user.name,
      requesterProfileId: user.profileId || null,
    });
    setRecruitInfo({
      message: `Your request to join ${entity.name} has been sent to their captain.`,
    });
  }

  function handleRate(entity, type) {
    if (!requireAuth()) return;
    setRateTarget({ entity, type });
  }

  function submitRating({ stars, comment }) {
    rateEntity({
      targetType: rateTarget.type,
      targetId: rateTarget.entity.id,
      stars,
      comment,
      byUserId: user.id,
    });
    setRateTarget(null);
  }

  return (
    <div className="page-container page-main">
      <div className="section-head" style={{ marginTop: 8 }}>
        <div>
          <h2 className="section-title">{isPlayerRole ? "Find a Team" : "Find Players & Teams"}</h2>
          <p className="text-muted text-sm mt-8">
            {isPlayerRole
              ? "Browse teams recruiting for your position and request to join. Rate them once you've played together."
              : "Recruit solo players by the position you're short on, or challenge another team to a match. Rate them once you've played."}
          </p>
        </div>
        {!isPlayerRole && (
          <div className="tabs">
            <button className={"tab-btn" + (tab === "solo" ? " active" : "")} onClick={() => setTab("solo")}>
              Solo Players
            </button>
            <button className={"tab-btn" + (tab === "team" ? " active" : "")} onClick={() => setTab("team")}>
              Team Matchmaking
            </button>
          </div>
        )}
      </div>

      <div className="tabs" style={{ marginTop: 4 }}>
        {SPORTS.map((s) => (
          <button key={s} className={"tab-btn" + (sport === s ? " active" : "")} onClick={() => setSport(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="filter-row">
        <button className={"filter-pill" + (position === "all" ? " active" : "")} onClick={() => setPosition("all")}>
          All roles
        </button>
        {positions.map((pos) => (
          <button
            key={pos}
            className={"filter-pill" + (position === pos ? " active" : "")}
            onClick={() => setPosition(pos)}
          >
            {pos}
          </button>
        ))}
      </div>

      <div className="search-field" style={{ maxWidth: 220, marginTop: 6 }}>
        <label htmlFor="area-filter" className="text-sm text-muted" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 11 }}>
          Area
        </label>
        <select
          id="area-filter"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          style={{ border: "1.5px solid var(--line-soft)", borderRadius: 8, padding: "9px 12px", marginTop: 4 }}
        >
          {areas.map((a) => (
            <option key={a} value={a}>
              {a === "all" ? "All Mumbai" : a}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 24 }}>
        {isPlayerRole ? (
          filteredTeams.length === 0 ? (
            <div className="empty-state">
              <h3>No teams found</h3>
              <p>Try a different role, area, or sport.</p>
            </div>
          ) : (
            <div className="grid">
              {filteredTeams.map((t) => (
                <PersonCard
                  key={t.id}
                  entity={t}
                  type="team"
                  actionLabel="Request to Join"
                  onRecruit={handleRequestJoin}
                  onRate={handleRate}
                />
              ))}
            </div>
          )
        ) : tab === "solo" ? (
          filteredPlayers.length === 0 ? (
            <div className="empty-state">
              <h3>No players found</h3>
              <p>Try a different role, area, or sport.</p>
            </div>
          ) : (
            <div className="grid">
              {filteredPlayers.map((p) => (
                <PersonCard
                  key={p.id}
                  entity={p}
                  type="player"
                  actionLabel="Recruit"
                  onRecruit={handleRecruitPlayer}
                  onRate={handleRate}
                />
              ))}
            </div>
          )
        ) : filteredTeams.length === 0 ? (
          <div className="empty-state">
            <h3>No teams found</h3>
            <p>Try a different role need, area, or sport.</p>
          </div>
        ) : (
          <div className="grid">
            {filteredTeams.map((t) => (
              <PersonCard
                key={t.id}
                entity={t}
                type="team"
                actionLabel="Request Match"
                onRecruit={handleChallengeTeam}
                onRate={handleRate}
              />
            ))}
          </div>
        )}
      </div>

      {rateTarget && (
        <RateEntityModal
          entity={rateTarget.entity}
          type={rateTarget.type}
          onClose={() => setRateTarget(null)}
          onSubmit={submitRating}
        />
      )}

      {recruitInfo && (
        <Modal title="Request sent!" onClose={() => setRecruitInfo(null)}>
          <p className="text-sm">
            {recruitInfo.message} You'll find it under <strong>My Matches</strong>, where you can
            track its status and rate them after you play.
          </p>
          <div className="modal-close-row">
            <button className="btn btn-primary btn-sm" onClick={() => setRecruitInfo(null)}>
              Got it
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
