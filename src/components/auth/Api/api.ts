// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api"                                   // ← usa o proxy do Vite (converte pra /users)
    : import.meta.env.VITE_API_URL,            // ← https://portal-nexion.fly.dev/users (direto)

  timeout: 12000,
  withCredentials: true,                      // ← essencial pro seu cookie HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador opcional (pra JWT futuro)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador de erros + logout automático em 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Erro de conexão. Tente novamente.";

    if (error.response?.status === 401) {
      localStorage.clear();
      window.dispatchEvent(new Event("authStateChange"));
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;