import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ListarFuncionarios from "./pages/ListarFuncionarios";
import EditarFuncionario from "./pages/EditarFuncionario";
import AlterarSenha from "./pages/AlterarSenha";
import PrivateRoute from "./components/PrivateRoute";
import { setupApi } from "./services/api";

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    setupApi(navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Redireciona a rota raiz para /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota de login */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route
        path="/funcionarios"
        element={
          <PrivateRoute>
            <ListarFuncionarios />
          </PrivateRoute>
        }
      />
      <Route
        path="/funcionarios/editar/:id"
        element={
          <PrivateRoute>
            <EditarFuncionario />
          </PrivateRoute>
        }
      />
      <Route
        path="/alterar-senha"
        element={
          <PrivateRoute>
            <AlterarSenha />
          </PrivateRoute>
        }
      />

      {/* Rota para qualquer outro caminho não definido */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
