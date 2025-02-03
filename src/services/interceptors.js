import { toast } from "react-toastify";

export const setupInterceptors = (api, navigate) => {
  // Interceptor de resposta
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Tratamento de erros específicos
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Não autorizado - redirecionar para login
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            navigate("/login");
            break;
          case 403:
            // Proibido - sem permissão
            toast.error("Você não tem permissão para realizar esta ação.");
            break;
          case 404:
            // Não encontrado
            toast.error("Recurso não encontrado.");
            break;
          case 422:
            // Erro de validação
            const validationErrors = error.response.data?.errors;
            if (validationErrors) {
              Object.values(validationErrors).forEach((error) => {
                toast.error(error);
              });
            } else {
              toast.error("Erro de validação nos dados enviados.");
            }
            break;
          case 500:
            // Erro interno do servidor
            toast.error(
              "Erro interno do servidor. Tente novamente mais tarde."
            );
            break;
          default:
            // Outros erros
            toast.error(
              error.response.data?.message ||
                "Ocorreu um erro. Tente novamente mais tarde."
            );
        }
      } else if (error.request) {
        // Erro de rede
        toast.error(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        // Erro na configuração da requisição
        toast.error("Erro ao processar sua requisição.");
      }

      return Promise.reject(error);
    }
  );

  return api;
};
