export const SPORTS = ["Football", "Cricket", "Basketball", "Badminton", "Tennis"];

// Position/role options per sport — used for solo recruitment and team "looking for" needs.
export const POSITIONS_BY_SPORT = {
  Football: ["Goalkeeper", "Defender", "Midfielder", "Striker"],
  Cricket: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
  Basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  Badminton: ["Singles Specialist", "Doubles Specialist"],
  Tennis: ["Singles Specialist", "Doubles Specialist"],
};

export function positionsFor(sport) {
  return POSITIONS_BY_SPORT[sport] || [];
}
