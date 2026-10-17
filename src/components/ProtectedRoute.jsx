import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="page-container page-main">
        <div className="empty-state">
          <h3>Not available for your role</h3>
          <p>This page is restricted to: {roles.join(", ")}.</p>
        </div>
      </div>
    );
  }
  return children;
}
