import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="page-container navbar-inner">
        <div className="brand">
          <span className="brand-dot" />
          TurfMatch <span style={{ color: "var(--turf-green-light)" }}>MUM</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Book a Turf
          </NavLink>
          <NavLink to="/recruitment" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            {user?.role === "player" ? "Find a Team" : "Find Players & Teams"}
          </NavLink>
          {user && user.role === "player" && (
            <NavLink to="/enroll/player" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Player Enroll
            </NavLink>
          )}
          {user && user.role === "captain" && !user.profileId && (
            <NavLink to="/enroll/team" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Team Enroll
            </NavLink>
          )}
          {user && user.role === "captain" && user.profileId && (
            <NavLink to="/my-team" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              My Team
            </NavLink>
          )}
          {user && user.role !== "admin" && (
            <NavLink to="/matches" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              My Matches
            </NavLink>
          )}
          {user && user.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              Add Turf
            </NavLink>
          )}
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="chip">{user.role}</span>
              <span className="text-sm" style={{ opacity: 0.85 }}>{user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--chalk)", borderColor: "var(--line)" }} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm" style={{ color: "var(--chalk)", borderColor: "var(--line)" }}>
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
