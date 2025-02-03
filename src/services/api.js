import axios from "axios";
import { setupInterceptors } from "./interceptors";

const createApi = (
  baseURL = process.env.REACT_APP_API_URL || "http://localhost:9000/api"
) => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor de requisição para adicionar o token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      // Não adiciona o token na rota de login
      if (token && !config.url.includes("/login")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApi();

export const setupApi = (navigate) => {
  setupInterceptors(api, navigate);
};

export const configureApi = (baseURL) => {
  return createApi(baseURL);
};

export default api;
