import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Recruitment from "./pages/Recruitment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlayerEnroll from "./pages/PlayerEnroll";
import TeamEnroll from "./pages/TeamEnroll";
import Matches from "./pages/Matches";
import AdminDashboard from "./pages/AdminDashboard";
import MyTeam from "./pages/MyTeam";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/enroll/player"
          element={
            <ProtectedRoute>
              <PlayerEnroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enroll/team"
          element={
            <ProtectedRoute>
              <TeamEnroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-team"
          element={
            <ProtectedRoute roles={["captain"]}>
              <MyTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <footer className="site-footer">
        TurfMatch — Mumbai · Solo & team matchmaking, turf booking, and player ratings in one place.
      </footer>
    </div>
  );
}
