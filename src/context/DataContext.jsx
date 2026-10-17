import { createContext, useContext, useState } from "react";
import { seedOnce, seedAndMerge, store, uid } from "../utils/store";
import { seedPlayers, seedTeams } from "../data/recruitment";
import { mumbaiTurfs } from "../data/turfs";

const DataContext = createContext(null);

// Normalizes records saved by an older version of the app (single `sport` string on
// turfs, no `sport` field on players/teams) so existing localStorage data doesn't break
// after this update introduces multi-sport turfs and per-sport recruitment.
function migrateTurf(t) {
  if (Array.isArray(t.sports)) return t;
  return { ...t, sports: t.sport ? [t.sport] : ["Football"] };
}
function migratePerson(p) {
  if (p.sport) return p;
  return { ...p, sport: "Football" };
}
function migrateTeamRoster(t) {
  const withRoster = Array.isArray(t.roster) ? t : { ...t, roster: [] };
  return typeof withRoster.existingCount === "number" ? withRoster : { ...withRoster, existingCount: 0 };
}

export function DataProvider({ children }) {
  const [players, setPlayers] = useState(() => seedAndMerge("players", seedPlayers).map(migratePerson));
  const [teams, setTeams] = useState(() =>
    seedAndMerge("teams", seedTeams).map(migratePerson).map(migrateTeamRoster)
  );
  const [bookings, setBookings] = useState(() => seedOnce("bookings", []));
  const [ratings, setRatings] = useState(() => seedOnce("ratings", []));
  const [connections, setConnections] = useState(() => seedOnce("connections", []));
  const [turfs, setTurfs] = useState(() => seedAndMerge("turfs", mumbaiTurfs).map(migrateTurf));

  function addTurf(turf) {
    const newTurf = {
      id: uid("t"),
      rating: 0,
      slots: [],
      image:
        "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=800&auto=format&fit=crop",
      ...turf,
    };
    const next = [...turfs, newTurf];
    setTurfs(next);
    store.set("turfs", next);
    return newTurf;
  }

  function updateTurf(turfId, updates) {
    const next = turfs.map((t) => (t.id === turfId ? { ...t, ...updates } : t));
    setTurfs(next);
    store.set("turfs", next);
  }

  function removeTurf(turfId) {
    const next = turfs.filter((t) => t.id !== turfId);
    setTurfs(next);
    store.set("turfs", next);
  }

  function addConnection(connection) {
    const newConnection = {
      id: uid("cx"),
      status: "pending", // pending | accepted | declined | rated
      createdAt: new Date().toISOString(),
      ...connection,
    };
    const next = [...connections, newConnection];
    setConnections(next);
    store.set("connections", next);
    return newConnection;
  }

  function updateConnectionStatus(connectionId, status) {
    const next = connections.map((c) => (c.id === connectionId ? { ...c, status } : c));
    setConnections(next);
    store.set("connections", next);
  }

  function markConnectionRated(connectionId) {
    updateConnectionStatus(connectionId, "rated");
  }

  function addPlayer(player) {
    const newPlayer = { id: uid("p"), rating: 0, ratingsCount: 0, ...player };
    const next = [...players, newPlayer];
    setPlayers(next);
    store.set("players", next);
    return newPlayer;
  }

  function addTeam(team) {
    const newTeam = { id: uid("team"), rating: 0, ratingsCount: 0, existingCount: 0, roster: [], ...team };
    const next = [...teams, newTeam];
    setTeams(next);
    store.set("teams", next);
    return newTeam;
  }

  function addTeamMember(teamId, member) {
    const next = teams.map((t) => {
      if (t.id !== teamId) return t;
      const roster = t.roster || [];
      // avoid adding the same underlying player twice
      if (member.id && roster.some((m) => m.id === member.id)) return t;
      return { ...t, roster: [...roster, { ...member, joinedAt: new Date().toISOString() }] };
    });
    setTeams(next);
    store.set("teams", next);
  }

  function removeTeamMember(teamId, memberId) {
    const next = teams.map((t) =>
      t.id === teamId ? { ...t, roster: (t.roster || []).filter((m) => m.id !== memberId) } : t
    );
    setTeams(next);
    store.set("teams", next);
  }

  function addBooking(booking) {
    const newBooking = { id: uid("bk"), status: "confirmed", createdAt: new Date().toISOString(), ...booking };
    const next = [...bookings, newBooking];
    setBookings(next);
    store.set("bookings", next);
    return newBooking;
  }

  function cancelBooking(bookingId) {
    const next = bookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b));
    setBookings(next);
    store.set("bookings", next);
  }

  function rateEntity({ targetType, targetId, stars, comment, byUserId }) {
    const newRating = {
      id: uid("rt"),
      targetType, // "player" | "team"
      targetId,
      stars,
      comment,
      byUserId,
      createdAt: new Date().toISOString(),
    };
    const nextRatings = [...ratings, newRating];
    setRatings(nextRatings);
    store.set("ratings", nextRatings);

    // recompute aggregate rating for the target
    const relevant = nextRatings.filter(
      (r) => r.targetType === targetType && r.targetId === targetId
    );
    const avg = relevant.reduce((s, r) => s + r.stars, 0) / relevant.length;

    if (targetType === "player") {
      const next = players.map((p) =>
        p.id === targetId ? { ...p, rating: Math.round(avg * 10) / 10, ratingsCount: relevant.length } : p
      );
      setPlayers(next);
      store.set("players", next);
    } else {
      const next = teams.map((t) =>
        t.id === targetId ? { ...t, rating: Math.round(avg * 10) / 10, ratingsCount: relevant.length } : t
      );
      setTeams(next);
      store.set("teams", next);
    }
    return newRating;
  }

  return (
    <DataContext.Provider
      value={{
        turfs,
        players,
        teams,
        bookings,
        ratings,
        connections,
        addPlayer,
        addTeam,
        addTeamMember,
        removeTeamMember,
        addBooking,
        cancelBooking,
        rateEntity,
        addConnection,
        markConnectionRated,
        updateConnectionStatus,
        addTurf,
        updateTurf,
        removeTurf,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
