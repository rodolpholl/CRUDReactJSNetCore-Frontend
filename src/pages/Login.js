import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Aqui você implementaria a chamada real de autenticação
      console.log("Login com:", data);
      // Simular login bem-sucedido
      navigate("/funcionarios");
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2 className="app-title">Gestor de Funcionários</h2>
          <p className="welcome-text">Bem-vindo, faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-3">
            <div className="input-with-icon">
              <i className="material-icons input-icon">email</i>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                {...register("email", {
                  required: "Email é obrigatório",
                })}
              />
              {errors.email && (
                <i className="material-icons error-icon">error</i>
              )}
            </div>
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group mb-4">
            <div className="input-with-icon">
              <i className="material-icons input-icon">lock</i>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Senha"
                {...register("password", {
                  required: "Senha é obrigatória",
                })}
              />
              {errors.password && (
                <i className="material-icons error-icon">error</i>
              )}
            </div>
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            <span>ACESSAR</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
