import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ListarFuncionarios from "./pages/ListarFuncionarios";
import EditarFuncionario from "./pages/EditarFuncionario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona a rota raiz para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota de login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route path="/funcionarios" element={<ListarFuncionarios />} />
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
    </BrowserRouter>
  );
}

export default App;
