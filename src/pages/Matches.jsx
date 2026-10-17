import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import RateEntityModal from "../components/RateEntityModal";

function statusLabel(c) {
  if (c.status === "rated") return "Rated";
  if (c.type === "join") {
    if (c.status === "accepted") return "Accepted";
    if (c.status === "declined") return "Declined";
    return "Pending";
  }
  if (c.type === "team") return "Request Sent";
  return "Recruited";
}

export default function Matches() {
  const { user } = useAuth();
  const {
    bookings,
    connections,
    players,
    teams,
    rateEntity,
    markConnectionRated,
    cancelBooking,
    updateConnectionStatus,
    addTeamMember,
  } = useData();
  const [rateFor, setRateFor] = useState(null); // connection

  const isCaptain = user.role === "captain";
  const isPlayer = user.role === "player";

  const myBookings = useMemo(() => bookings.filter((b) => b.userId === user.id), [bookings, user]);

  // Captain's own outbound recruitment activity
  const recruitedPlayers = useMemo(
    () => connections.filter((c) => c.type === "player" && c.byUserId === user.id),
    [connections, user]
  );
  const teamChallenges = useMemo(
    () => connections.filter((c) => c.type === "team" && c.byUserId === user.id),
    [connections, user]
  );
  // Requests other players have sent to join the captain's own team
  const incomingJoinRequests = useMemo(
    () => connections.filter((c) => c.type === "join" && c.targetId === user.profileId),
    [connections, user]
  );

  // Player's outbound join requests to teams
  const myJoinRequests = useMemo(
    () => connections.filter((c) => c.type === "join" && c.byUserId === user.id),
    [connections, user]
  );

  function handleCancel(bookingId) {
    if (confirm("Cancel this booking?")) {
      cancelBooking(bookingId);
    }
  }

  function handleAcceptJoin(c) {
    updateConnectionStatus(c.id, "accepted");
    const player = c.requesterProfileId ? findPlayer(c.requesterProfileId) : null;
    addTeamMember(user.profileId, {
      id: player ? player.id : c.id,
      name: c.requesterName || (player && player.name) || "Player",
      position: player ? player.position : null,
      avatar: player ? player.avatar : "🧑",
      sport: player ? player.sport : undefined,
      source: "joined",
    });
  }

  function findPlayer(id) {
    return players.find((p) => p.id === id);
  }
  function findTeam(id) {
    return teams.find((t) => t.id === id);
  }

  function openRate(connection, entity, type) {
    setRateFor({ connection, entity, type });
  }

  function submitRating({ stars, comment }) {
    const { connection, entity, type } = rateFor;
    rateEntity({ targetType: type, targetId: entity.id, stars, comment, byUserId: user.id });
    markConnectionRated(connection.id);
    setRateFor(null);
  }

  return (
    <div className="page-container page-main">
      <h2 className="section-title">My Matches</h2>
      <p className="text-muted text-sm mt-8">
        Your turf bookings{isCaptain && ", recruitment activity, and incoming join requests"}
        {isPlayer && " and the teams you've requested to join"}.
      </p>

      {/* Turf bookings — everyone */}
      <div className="section-head" style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 18 }}>Turf Bookings</h3>
        <span className="section-count">{myBookings.length}</span>
      </div>
      {myBookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Head to the home page to book a turf slot.</p>
        </div>
      ) : (
        myBookings
          .slice()
          .reverse()
          .map((b) => (
            <div key={b.id} className="match-row">
              <div>
                <strong>{b.turfName}</strong>
                <div className="text-sm text-muted mono">
                  {b.date} • {b.slot} {b.sport ? `• ${b.sport}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className={"badge" + (b.status === "cancelled" ? " badge-amber" : "")}>
                  {b.status === "cancelled" ? "Cancelled" : "Confirmed"}
                </span>
                {b.status !== "cancelled" && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(b.id)}>
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          ))
      )}

      {/* Captain-only sections */}
      {isCaptain && (
        <>
          <div className="section-head" style={{ marginTop: 36 }}>
            <h3 style={{ fontSize: 18 }}>Recruited Solo Players</h3>
            <span className="section-count">{recruitedPlayers.length}</span>
          </div>
          {recruitedPlayers.length === 0 ? (
            <div className="empty-state">
              <h3>No players recruited yet</h3>
              <p>Visit the recruitment page to line up solo players for your team.</p>
            </div>
          ) : (
            recruitedPlayers
              .slice()
              .reverse()
              .map((c) => {
                const entity = findPlayer(c.targetId);
                if (!entity) return null;
                return (
                  <div key={c.id} className="match-row">
                    <div>
                      <strong>{entity.name}</strong>
                      <div className="text-sm text-muted mono">
                        {entity.sport} • {entity.position}
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className={"badge" + (c.status === "rated" ? " badge-amber" : "")}>{statusLabel(c)}</span>
                      {c.status !== "rated" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openRate(c, entity, "player")}>
                          Rate after match
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}

          <div className="section-head" style={{ marginTop: 36 }}>
            <h3 style={{ fontSize: 18 }}>Team Match Requests Sent</h3>
            <span className="section-count">{teamChallenges.length}</span>
          </div>
          {teamChallenges.length === 0 ? (
            <div className="empty-state">
              <h3>No match requests yet</h3>
              <p>Challenge another team from the Team Matchmaking tab.</p>
            </div>
          ) : (
            teamChallenges
              .slice()
              .reverse()
              .map((c) => {
                const entity = findTeam(c.targetId);
                if (!entity) return null;
                return (
                  <div key={c.id} className="match-row">
                    <div>
                      <strong>{entity.name}</strong>
                      <div className="text-sm text-muted mono">
                        {entity.sport} • {entity.area}
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className={"badge" + (c.status === "rated" ? " badge-amber" : "")}>{statusLabel(c)}</span>
                      {c.status !== "rated" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openRate(c, entity, "team")}>
                          Rate after match
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}

          <div className="section-head" style={{ marginTop: 36 }}>
            <h3 style={{ fontSize: 18 }}>Join Requests to Your Team</h3>
            <span className="section-count">{incomingJoinRequests.length}</span>
          </div>
          {!user.profileId ? (
            <div className="empty-state">
              <h3>No team profile yet</h3>
              <p>Enroll your team so players can find and request to join it.</p>
            </div>
          ) : incomingJoinRequests.length === 0 ? (
            <div className="empty-state">
              <h3>No join requests yet</h3>
              <p>When a player requests to join your team, it'll show up here.</p>
            </div>
          ) : (
            incomingJoinRequests
              .slice()
              .reverse()
              .map((c) => (
                <div key={c.id} className="match-row">
                  <div>
                    <strong>{c.requesterName || "A player"}</strong>
                    <div className="text-sm text-muted mono">wants to join your team</div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span
                      className={
                        "badge" + (c.status === "declined" ? " badge-amber" : c.status === "accepted" ? "" : " badge-amber")
                      }
                    >
                      {statusLabel(c)}
                    </span>
                    {c.status === "pending" && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => updateConnectionStatus(c.id, "declined")}>
                          Decline
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleAcceptJoin(c)}>
                          Accept
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
          )}
        </>
      )}

      {/* Player-only section */}
      {isPlayer && (
        <>
          <div className="section-head" style={{ marginTop: 36 }}>
            <h3 style={{ fontSize: 18 }}>Teams You've Requested to Join</h3>
            <span className="section-count">{myJoinRequests.length}</span>
          </div>
          {myJoinRequests.length === 0 ? (
            <div className="empty-state">
              <h3>No join requests yet</h3>
              <p>Visit the Find a Team page to request to join a team.</p>
            </div>
          ) : (
            myJoinRequests
              .slice()
              .reverse()
              .map((c) => {
                const entity = findTeam(c.targetId);
                if (!entity) return null;
                return (
                  <div key={c.id} className="match-row">
                    <div>
                      <strong>{entity.name}</strong>
                      <div className="text-sm text-muted mono">
                        {entity.sport} • {entity.area}
                      </div>
                      {c.status === "accepted" && entity.contactPhone && (
                        <div className="text-sm mt-8">
                          <span className="text-muted">Call the captain to confirm: </span>
                          <a href={`tel:${entity.contactPhone}`} style={{ color: "var(--turf-green)", fontWeight: 700 }}>
                            {entity.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-8">
                      <span className={"badge" + (c.status !== "accepted" ? " badge-amber" : "")}>{statusLabel(c)}</span>
                      {c.status !== "rated" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openRate(c, entity, "team")}>
                          Rate after match
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </>
      )}

      {rateFor && (
        <RateEntityModal
          entity={rateFor.entity}
          type={rateFor.type}
          onClose={() => setRateFor(null)}
          onSubmit={submitRating}
        />
      )}
    </div>
  );
}
