import { createContext, useContext, useEffect, useState } from "react";
import { store, uid } from "../utils/store";

const AuthContext = createContext(null);

// Roles: "player" | "captain" | "admin"
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => store.get("session", null));

  useEffect(() => {
    store.set("session", user);
  }, [user]);

  function getUsers() {
    return store.get("users", []);
  }

  function register({ name, email, password, role }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = {
      id: uid("user"),
      name,
      email,
      password, // demo only — never store plaintext passwords in production
      role: role || "player",
      profileId: null, // linked player/team profile id, set after enrollment
      createdAt: new Date().toISOString(),
    };
    store.set("users", [...users, newUser]);
    const { password: _pw, ...safeUser } = newUser;
    setUser(safeUser);
    return safeUser;
  }

  function login({ email, password }) {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Invalid email or password.");
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    return safeUser;
  }

  function logout() {
    setUser(null);
  }

  function linkProfile(profileId) {
    if (!user) return;
    const users = getUsers();
    const updated = users.map((u) => (u.id === user.id ? { ...u, profileId } : u));
    store.set("users", updated);
    setUser({ ...user, profileId });
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, linkProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
