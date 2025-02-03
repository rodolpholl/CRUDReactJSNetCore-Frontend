import { configureApi } from "./api";

const api = configureApi(
  process.env.REACT_APP_AUTH_URL || "http://localhost:9001/api"
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });

      if (response.status === 200) {
        // Armazena os dados do usuário no localStorage
        localStorage.setItem("usuarioLogado", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("usuarioLogado");
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
