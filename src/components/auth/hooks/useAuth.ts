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
          // Preserva firstName e lastName se já existirem no objeto salvo
          // Só faz split do name se firstName/lastName não estiverem definidos
          const hasFirstName = u.firstName && u.firstName.trim() !== "";
          const hasLastName = u.lastName && u.lastName.trim() !== "";

          let firstName = u.firstName || "";
          let lastName = u.lastName || "";

          // Só faz split do name se não tiver firstName/lastName salvos
          if (!hasFirstName && !hasLastName && u.name) {
            const [fn = "", ln = ""] = u.name.split(" ");
            firstName = fn;
            lastName = ln;
          }

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

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("authStateChange"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.dispatchEvent(new Event("authStateChange"));
  };

  return { user, isAuthenticated, login, logout };
}