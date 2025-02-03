import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../services/apiAuth";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import PasswordStrengthBar from "react-password-strength-bar";

function AlterarSenha() {
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [forcaSenha, setForcaSenha] = useState(0);
  const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado") || "{}"
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: usuarioLogado.email || "",
    },
  });

  const novaSenha = watch("novaSenha");

  const scoreWords = ["muito fraca", "fraca", "razoável", "boa", "forte"];

  const onChangeScore = (score) => {
    setForcaSenha(score);
  };

  const onSubmit = async (data) => {
    if (forcaSenha < 2) {
      toast.error("A senha precisa ser pelo menos razoável");
      return;
    }

    try {
      setSalvando(true);
      await authService.alterarSenha(data);
      toast.success("Senha alterada com sucesso!");
      navigate("/funcionarios");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erro ao alterar senha. Verifique os dados e tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Alterar Senha</h4>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      {...register("email", {
                        required: "Email é obrigatório",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido",
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="senhaAtual" className="form-label">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.senhaAtual ? "is-invalid" : ""
                      }`}
                      id="senhaAtual"
                      {...register("senhaAtual", {
                        required: "Senha atual é obrigatória",
                      })}
                    />
                    {errors.senhaAtual && (
                      <div className="invalid-feedback">
                        {errors.senhaAtual.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="novaSenha" className="form-label">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.novaSenha ? "is-invalid" : ""
                      }`}
                      id="novaSenha"
                      {...register("novaSenha", {
                        required: "Nova senha é obrigatória",
                        validate: {
                          forcaSenha: () =>
                            forcaSenha >= 2 ||
                            "A senha deve ser pelo menos razoável",
                        },
                      })}
                    />
                    {novaSenha && (
                      <PasswordStrengthBar
                        password={novaSenha}
                        scoreWords={scoreWords}
                        shortScoreWord="muito curta"
                        onChangeScore={onChangeScore}
                        minLength={8}
                      />
                    )}
                    {errors.novaSenha && (
                      <div className="invalid-feedback">
                        {errors.novaSenha.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmarSenha" className="form-label">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.confirmarSenha ? "is-invalid" : ""
                      }`}
                      id="confirmarSenha"
                      {...register("confirmarSenha", {
                        required: "Confirmação de senha é obrigatória",
                        validate: (value) =>
                          value === novaSenha || "As senhas não são idênticas",
                      })}
                    />
                    {errors.confirmarSenha && (
                      <div className="invalid-feedback">
                        {errors.confirmarSenha.message}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/funcionarios")}
                    >
                      CANCELAR
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={salvando}
                    >
                      {salvando ? "SALVANDO..." : "SALVAR"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlterarSenha;
