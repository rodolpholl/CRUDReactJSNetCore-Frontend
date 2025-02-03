import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListarFuncionarios from "./pages/ListarFuncionarios";
import EditarFuncionario from "./pages/EditarFuncionario";

function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid">
        <Routes>
          {/* Redireciona a rota raiz para /funcionarios */}
          <Route path="/" element={<Navigate to="/funcionarios" replace />} />

          {/* Rota para listar funcionários */}
          <Route path="/funcionarios" element={<ListarFuncionarios />} />

          {/* Rota para editar/criar funcionário */}
          <Route
            path="/funcionarios/editar/:id"
            element={<EditarFuncionario />}
          />
        </Routes>
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
      </div>
    </BrowserRouter>
  );
}

export default App;
