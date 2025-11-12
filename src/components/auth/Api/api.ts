// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // cookies serão enviados
});

// Intercepta erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Erro na conexão com o servidor";
    return Promise.reject(new Error(message));
  }
);

export default api;