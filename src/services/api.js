import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Adicione um interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erro na resposta:", error.response.data);
    } else if (error.request) {
      console.error("Erro na requisição:", error.request);
    } else {
      console.error("Erro:", error.message);
    }
    return Promise.reject(error);
  }
);

export const funcionarioService = {
  getFuncionarios: async (pageIndex, pageCount) => {
    try {
      const response = await api.get(`/${pageIndex}/${pageCount}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      throw error;
    }
  },

  getFuncionarioById: async (id) => {
    try {
      const response = await api.get(`?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error);
      throw error;
    }
  },
};

export const cargoService = {
  getCargos: async () => {
    try {
      const response = await api.get("/cargos");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cargos:", error);
      throw error;
    }
  },
};

export const gestorService = {
  getGestores: async (level) => {
    try {
      const response = await api.get(`/gestores/${level}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar gestores:", error);
      throw error;
    }
  },
};

export default api;
