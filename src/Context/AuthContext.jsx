/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Demo accounts used by the frontend-only access model
const DEFAULT_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", name: "Admin" },
  { id: 2, username: "viewer", password: "viewer123", role: "viewer", name: "Viewer" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("user")));
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const effectiveRole = user?.role || "viewer";

  const login = (username, password) => {
    setError(null);
    
    // Match against the demo account list
    const foundUser = DEFAULT_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
        loginTime: new Date().toISOString(),
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } else {
      setError("Invalid username or password");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const hasRole = (requiredRoles) => {
    if (!isAuthenticated || !user) return false;
    if (typeof requiredRoles === "string") return effectiveRole === requiredRoles;
    return requiredRoles.includes(effectiveRole);
  };

  const isAdmin = () => effectiveRole === "admin";

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    role: effectiveRole,
    login,
    logout,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
