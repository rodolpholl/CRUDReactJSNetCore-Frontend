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
  getFuncionarios: async (
    pageIndex,
    pageCount,
    filter = "",
    addDesativados = false
  ) => {
    try {
      let url = `/${pageIndex}/${pageCount}?addDesativados=${addDesativados}`;
      const params = [];

      if (filter) params.push(`filter=${filter}`);

      if (params.length > 0) {
        url += `&${params.join("&")}`;
      }

      const response = await api.get(url);
      let result = response.data.filter((item) => item.id > 1);
      return result;
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

  createFuncionario: async (funcionario) => {
    try {
      const response = await api.post("/", funcionario);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      throw error;
    }
  },

  updateFuncionario: async (id, funcionario) => {
    try {
      const response = await api.put(`/${id}`, funcionario);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      throw error;
    }
  },

  deleteFuncionario: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      throw error;
    }
  },

  desativarFuncionario: async (id) => {
    try {
      const response = await api.patch(`/${id}/desativar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao desativar funcionário:", error);
      throw error;
    }
  },

  reativarFuncionario: async (id) => {
    try {
      const response = await api.patch(`/${id}/reativar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao reativar funcionário:", error);
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
