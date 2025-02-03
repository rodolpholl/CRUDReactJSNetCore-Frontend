import { configureApi } from "./api";
import { decodeToken } from "../utils/jwtUtils";

const api = configureApi(
  process.env.REACT_APP_AUTH_URL || "http://localhost:9001/api"
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });

      if (response.status === 200 && response.data.token) {
        // Decodifica o token para obter as informações do usuário
        const userData = decodeToken(response.data.token);
        console.log(userData);
        // Armazena o token
        localStorage.setItem("token", response.data.token);

        // Armazena os dados do usuário decodificados do token
        if (userData) {
          localStorage.setItem("usuarioLogado", JSON.stringify(userData));
        }
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");
  },

  alterarSenha: async (dados) => {
    try {
      const response = await api.patch("/alterar-password", dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
