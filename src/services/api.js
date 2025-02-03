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
