import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  cargoService,
  gestorService,
  funcionarioService,
} from "../services/api";

function EditarFuncionario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargoId: "",
    gestorId: "",
    dataNascimento: "",
    documento: "",
  });
  const [telefones, setTelefones] = useState([""]);
  const [cargos, setCargos] = useState([]);
  const [gestores, setGestores] = useState([]);
  const [carregandoCargos, setCarregandoCargos] = useState(true);
  const [erroCargos, setErroCargos] = useState(null);
  const [carregandoGestores, setCarregandoGestores] = useState(false);
  const [erroGestores, setErroGestores] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (id !== "novo" && location.state?.funcionario) {
      const funcionario = location.state.funcionario;
      setFormData({
        nome: funcionario.nome || "",
        email: funcionario.email || "",
        cargoId: funcionario.cargoId || "",
        gestorId: funcionario.gestorId || "",
        dataNascimento: funcionario.dataNascimento || "",
        documento: funcionario.documento || "",
      });
      setTelefones(funcionario.telefone || [""]);
    }
  }, [id, location]);

  // Carregar cargos
  useEffect(() => {
    const buscarCargos = async () => {
      try {
        setCarregandoCargos(true);
        const response = await cargoService.getCargos();
        setCargos(response);
        setErroCargos(null);
      } catch (error) {
        setErroCargos("Erro ao carregar cargos");
        console.error(error);
      } finally {
        setCarregandoCargos(false);
      }
    };

    buscarCargos();
  }, []);

  // Carregar gestores quando o cargo mudar
  useEffect(() => {
    const buscarGestores = async () => {
      if (!formData.cargoId) {
        setGestores([]);
        return;
      }

      try {
        setCarregandoGestores(true);
        const cargoSelecionado = cargos.find(
          (c) => c.id === Number(formData.cargoId)
        );
        if (cargoSelecionado) {
          const response = await gestorService.getGestores(
            cargoSelecionado.level
          );
          setGestores(response);
          setErroGestores(null);
        }
      } catch (error) {
        setErroGestores("Erro ao carregar gestores");
        console.error(error);
      } finally {
        setCarregandoGestores(false);
      }
    };

    buscarGestores();
  }, [formData.cargoId, cargos]);

  // Carregar dados do funcionário
  useEffect(() => {
    const carregarFuncionario = async () => {
      if (id === "novo") return;

      try {
        setCarregando(true);
        const funcionario = await funcionarioService.getFuncionarioById(id);
        setFormData({
          nome: funcionario.nome || "",
          email: funcionario.email || "",
          cargoId: funcionario.cargoId || "",
          gestorId: funcionario.gestorId || "",
          dataNascimento: funcionario.dataNascimento?.split("T")[0] || "",
          documento: funcionario.documento || "",
        });
        setTelefones(funcionario.telefone || [""]);
      } catch (error) {
        setErro("Erro ao carregar dados do funcionário");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };

    carregarFuncionario();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTelefoneChange = (index, value) => {
    const novosTelefones = [...telefones];
    novosTelefones[index] = value;
    setTelefones(novosTelefones);
  };

  const adicionarTelefone = () => {
    setTelefones([...telefones, ""]);
  };

  const removerTelefone = (index) => {
    const novosTelefones = telefones.filter((_, i) => i !== index);
    setTelefones(novosTelefones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = {
      ...formData,
      telefone: telefones.filter((tel) => tel.trim() !== ""),
    };

    console.log("Dados a serem salvos:", dados);
    // Aqui você pode adicionar a chamada para sua API

    navigate(-1);
  };

  const handleCancel = () => {
    navigate("/funcionarios", {
      state: {
        recarregar: true,
      },
    });
  };

  if (carregando) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            {erro}
          </div>
          <button className="btn btn-outline-secondary" onClick={handleCancel}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">
          {id === "novo" ? "Novo Funcionário" : "Editar Funcionário"}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Nome e Email */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            {/* Cargo e Data de Nascimento */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Cargo</label>
              {erroCargos ? (
                <div className="alert alert-danger py-2">{erroCargos}</div>
              ) : (
                <select
                  name="cargoId"
                  value={formData.cargoId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                  disabled={carregandoCargos}
                >
                  <option value="">Selecione um cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.name}
                    </option>
                  ))}
                </select>
              )}
              {carregandoCargos && (
                <div className="text-muted mt-1">
                  <small>Carregando cargos...</small>
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            {/* Documento e Gestor */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Documento (CPF/RG)</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            {/* Gestor */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Gestor</label>
              {erroGestores ? (
                <div className="alert alert-danger py-2">{erroGestores}</div>
              ) : (
                <select
                  name="gestorId"
                  value={formData.gestorId}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={carregandoGestores || !formData.cargoId}
                >
                  <option value="">
                    {!formData.cargoId
                      ? "Selecione um cargo primeiro"
                      : "Selecione um gestor"}
                  </option>
                  {gestores.map((gestor) => (
                    <option key={gestor.id} value={gestor.id}>
                      {gestor.nome}
                    </option>
                  ))}
                </select>
              )}
              {carregandoGestores && (
                <div className="text-muted mt-1">
                  <small>Carregando gestores...</small>
                </div>
              )}
            </div>

            {/* Telefones */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Telefones</label>
              {telefones.map((telefone, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) =>
                      handleTelefoneChange(index, e.target.value)
                    }
                    className="form-control"
                    placeholder={`Telefone ${index + 1}`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removerTelefone(index)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={adicionarTelefone}
                >
                  Adicionar Telefone
                </button>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              {/* Coluna vazia para manter o alinhamento */}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary me-2">
              Salvar
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarFuncionario;
