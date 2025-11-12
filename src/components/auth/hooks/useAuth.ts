// src/hooks/useAuth.ts
import { useEffect, useState } from "react";

export interface User {
  avatar_url: null;
  id: number;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("token");
      const flag = localStorage.getItem("isAuthenticated") === "true";
      const raw = localStorage.getItem("user");

      if (token && flag && raw) {
        try {
          const u = JSON.parse(raw);
          const [firstName = "", lastName = ""] = (u.name || "").split(" ");
          setUser({ ...u, firstName, lastName });
          setIsAuthenticated(true);
        } catch (e) {
          logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    updateAuth();
    window.addEventListener("authStateChange", updateAuth);
    return () => window.removeEventListener("authStateChange", updateAuth);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.dispatchEvent(new Event("authStateChange"));
  };

  return { user, isAuthenticated, logout };
}