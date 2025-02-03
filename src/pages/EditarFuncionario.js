import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  cargoService,
  gestorService,
  funcionarioService,
} from "../services/apiFuncionario";
import Notification from "../components/Notification";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Navbar from "../components/Navbar";

function EditarFuncionario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const viewOnly = location.state?.viewOnly || false;
  const funcionarioData = location.state?.funcionario || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      cargoId: "",
      gestorId: "",
      dataNascimento: "",
      documento: "",
    },
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
  const [notification, setNotification] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [touchedFields, setTouchedFields] = useState({
    nome: false,
    email: false,
    cargoId: false,
    dataNascimento: false,
    documento: false,
    gestorId: false,
    telefones: false,
  });

  // Referências para os campos
  const nomeRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const cargoRef = React.useRef(null);
  const dataNascimentoRef = React.useRef(null);
  const documentoRef = React.useRef(null);
  const gestorRef = React.useRef(null);
  const telefoneRef = React.useRef(null);

  // Função para carregar gestores baseado no cargo
  const carregarGestores = async (cargoId) => {
    if (!cargoId) return;

    try {
      setCarregandoGestores(true);
      const cargoSelecionado = cargos.find((c) => c.id === Number(cargoId));
      if (cargoSelecionado) {
        if (cargoSelecionado.level === 1) {
          // Se for Diretor (level 1), define apenas o Sys Admin
          setValue("gestorId", "1");
          setGestores([{ gestorId: "1", nome: "Sys Admin" }]);
        } else {
          // Para outros cargos, carrega a lista normal de gestores
          const response = await gestorService.getGestores(
            cargoSelecionado.level
          );
          setGestores(response.filter((gestor) => gestor.nome !== "Sys Admin"));
        }
        setErroGestores(null);
      }
    } catch (error) {
      setErroGestores("Erro ao carregar gestores");
      console.error(error);
    } finally {
      setCarregandoGestores(false);
    }
  };

  // Carregar cargos primeiro
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

  // Carregar dados do funcionário
  useEffect(() => {
    const carregarDados = async () => {
      if (id === "novo") {
        if (funcionarioData) {
          // Formatando a data se existir
          const dataNascimento = funcionarioData.dataNascimento
            ? funcionarioData.dataNascimento.split("T")[0]
            : "";

          setValue("nome", funcionarioData.nome || "");
          setValue("email", funcionarioData.email || "");
          setValue("cargoId", funcionarioData.cargoId?.toString() || "");
          setValue("gestorId", funcionarioData.gestorId?.toString() || "");
          setValue("dataNascimento", dataNascimento);
          setValue("documento", funcionarioData.documento || "");

          // Ajuste no carregamento dos telefones
          if (
            funcionarioData.telefone &&
            Array.isArray(funcionarioData.telefone)
          ) {
            setTelefones(funcionarioData.telefone);
          } else if (
            funcionarioData.telefones &&
            Array.isArray(funcionarioData.telefones)
          ) {
            setTelefones(funcionarioData.telefones);
          } else {
            setTelefones([""]);
          }

          // Carregar gestores se tiver cargo
          if (funcionarioData.cargoId && cargos.length > 0) {
            await carregarGestores(funcionarioData.cargoId);
          }
        }
      } else {
        try {
          setCarregando(true);
          const funcionario = await funcionarioService.getFuncionarioById(id);

          setValue("nome", funcionario.nome || "");
          setValue("email", funcionario.email || "");
          setValue("cargoId", funcionario.cargoId?.toString() || "");
          setValue("gestorId", funcionario.gestorId?.toString() || "");
          setValue(
            "dataNascimento",
            funcionario.dataNascimento?.split("T")[0] || ""
          );
          setValue("documento", funcionario.documento || "");

          // Ajuste no carregamento dos telefones
          if (funcionario.telefone && Array.isArray(funcionario.telefone)) {
            setTelefones(funcionario.telefone);
          } else if (
            funcionario.telefones &&
            Array.isArray(funcionario.telefones)
          ) {
            setTelefones(funcionario.telefones);
          } else {
            setTelefones([""]);
          }

          // Carregar gestores se tiver cargo
          if (funcionario.cargoId && cargos.length > 0) {
            await carregarGestores(funcionario.cargoId);
          }
        } catch (error) {
          setErro("Erro ao carregar dados do funcionário");
          console.error(error);
        } finally {
          setCarregando(false);
        }
      }
    };

    carregarDados();
  }, [id, funcionarioData, cargos.length, setValue]);

  // Função para lidar com a mudança de cargo
  const handleCargoChange = async (event) => {
    const cargoId = event.target.value;
    setValue("cargoId", cargoId);
    setValue("gestorId", ""); // Limpar gestor selecionado inicialmente
    setGestores([]); // Limpar lista de gestores

    if (!cargoId) {
      setGestores([]);
      return;
    }

    try {
      setCarregandoGestores(true);
      const cargoSelecionado = cargos.find((c) => c.id === Number(cargoId));
      if (cargoSelecionado) {
        if (cargoSelecionado.level === 1) {
          // Se for Diretor (level 1), define apenas o Sys Admin
          setValue("gestorId", "1");
          setGestores([{ gestorId: "1", nome: "Sys Admin" }]);
        } else {
          // Para outros cargos, carrega a lista normal de gestores
          const response = await gestorService.getGestores(
            cargoSelecionado.level
          );
          setGestores(response.filter((gestor) => gestor.gestorId > 1));
        }
        setErroGestores(null);
      }
    } catch (error) {
      setErroGestores("Erro ao carregar gestores");
      console.error(error);
    } finally {
      setCarregandoGestores(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo alterado: ${name}, Valor: ${value}`);

    setValue(name, value);
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar apenas o campo alterado
    const fieldErrors = {};

    switch (name) {
      case "nome":
        if (!value) {
          fieldErrors.nome = "Nome é obrigatório";
        } else if (value.length < 3) {
          fieldErrors.nome = "Nome deve ter no mínimo 3 caracteres";
        }
        break;

      case "email":
        if (!value) {
          fieldErrors.email = "Email é obrigatório";
        } else if (!isValidEmail(value)) {
          fieldErrors.email = "Email inválido";
        }
        break;

      case "cargoId":
        if (!value) {
          fieldErrors.cargoId = "Cargo é obrigatório";
        }
        break;

      case "dataNascimento":
        if (!value) {
          fieldErrors.dataNascimento = "Data de Nascimento é obrigatória";
        } else if (!isValidAge(value)) {
          fieldErrors.dataNascimento = "Funcionário deve ter no mínimo 18 anos";
        }
        break;

      case "documento":
        if (!value) {
          fieldErrors.documento = "Documento é obrigatório";
        }
        break;

      case "gestorId":
        if (!value) {
          fieldErrors.gestorId = "Gestor é obrigatório";
        }
        break;

      default:
        break;
    }

    // setErrors((prev) => ({
    //   ...prev,
    //   [name]: fieldErrors[name],
    // }));
  };

  const handleTelefoneChange = (value, country, index) => {
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

  // Função para validar email
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Função para validar idade mínima
  const isValidAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    // Se ainda não chegou no mês do aniversário ou
    // se está no mês mas não chegou no dia
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 18;
  };

  // Função de validação
  const validateForm = () => {
    const values = getValues();
    const newErrors = {};

    // Validar Nome
    if (!values.nome) {
      newErrors.nome = "Nome é obrigatório";
    } else if (values.nome.length < 3) {
      newErrors.nome = "Nome deve ter no mínimo 3 caracteres";
    }

    // Validar Email
    if (!values.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!isValidEmail(values.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar Cargo
    if (!values.cargoId) {
      newErrors.cargoId = "Cargo é obrigatório";
    }

    // Validar Data de Nascimento
    if (!values.dataNascimento) {
      newErrors.dataNascimento = "Data de Nascimento é obrigatória";
    } else if (!isValidAge(values.dataNascimento)) {
      newErrors.dataNascimento = "Funcionário deve ter no mínimo 18 anos";
    }

    // Validar Documento
    if (!values.documento) {
      newErrors.documento = "Documento é obrigatório";
    }

    // Validar Gestor
    if (!values.gestorId) {
      newErrors.gestorId = "Gestor é obrigatório";
    }

    // Validar Telefones
    const telefonesValidos = telefones.filter((tel) => tel.length > 1);
    if (telefonesValidos.length === 0) {
      newErrors.telefones = "Pelo menos um telefone é obrigatório";
    }

    return newErrors;
  };

  // Função para focar no primeiro campo com erro
  const focusFirstError = (errors) => {
    if (errors.nome) {
      nomeRef.current?.focus();
    } else if (errors.email) {
      emailRef.current?.focus();
    } else if (errors.cargoId) {
      cargoRef.current?.focus();
    } else if (errors.dataNascimento) {
      dataNascimentoRef.current?.focus();
    } else if (errors.documento) {
      documentoRef.current?.focus();
    } else if (errors.gestorId) {
      gestorRef.current?.focus();
    } else if (errors.telefones) {
      telefoneRef.current?.focus();
    }
  };

  // Definir o initialFormData antes do resetForm
  const initialFormData = {
    nome: "",
    email: "",
    cargoId: "",
    gestorId: "",
    dataNascimento: "",
    documento: "",
  };

  // Função para limpar o formulário
  const resetForm = () => {
    // Ao invés de usar setValue(initialFormData)
    Object.keys(initialFormData).forEach((key) => {
      setValue(key, initialFormData[key]);
    });

    setTelefones([""]);
    setTouchedFields({
      nome: false,
      email: false,
      cargoId: false,
      dataNascimento: false,
      documento: false,
      gestorId: false,
      telefones: false,
    });
  };

  const onSubmit = async (data) => {
    // Validação dos telefones
    if (!telefones.some((tel) => tel && tel.trim())) {
      toast.error("Pelo menos um telefone é obrigatório");
      return;
    }

    // Remove telefones vazios antes de enviar
    const telefonesValidos = telefones.filter((tel) => tel && tel.trim());

    try {
      setSalvando(true);
      const dadosParaEnviar = {
        ...data,
        telefone: telefonesValidos,
      };

      if (id === "novo") {
        await funcionarioService.createFuncionario(dadosParaEnviar);
        toast.success("Funcionário cadastrado com sucesso!");
      } else {
        await funcionarioService.updateFuncionario(id, dadosParaEnviar);
        toast.success("Funcionário atualizado com sucesso!");
      }
      navigate("/funcionarios", { state: { recarregar: true } });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erro ao salvar funcionário. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  const handleCancel = () => {
    navigate("/funcionarios", {
      state: {
        recarregar: true,
      },
    });
  };

  // Função para verificar se deve mostrar erro
  const shouldShowError = (fieldName) => {
    // Se o campo não foi tocado e não houve tentativa de submit, não mostra erro
    if (!touchedFields[fieldName] && Object.keys(errors).length === 0) {
      return false;
    }

    // Verifica se o campo está vazio ou tem erro específico
    return errors[fieldName] ? true : false;
  };

  // Função para verificar se deve mostrar erro nos telefones
  const shouldShowTelefoneError = () => {
    // Se os telefones não foram tocados e não houve tentativa de submit, não mostra erro
    if (!touchedFields.telefones && Object.keys(errors).length === 0) {
      return false;
    }

    // Verifica se tem erro de telefones
    return errors.telefones ? true : false;
  };

  // Componente para mostrar mensagem de erro
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <div className="text-danger small mt-1">{error}</div>;
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
    <>
      <Navbar />
      <div className="container-fluid pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">
            {id === "novo"
              ? "Novo Funcionário"
              : viewOnly
              ? "Visualizar dados do Funcionário"
              : "Editar Funcionário"}
          </h4>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nome ? "is-invalid" : ""
                    }`}
                    id="nome"
                    disabled={viewOnly}
                    {...register("nome", { required: "Nome é obrigatório" })}
                  />
                  {errors.nome && (
                    <div className="invalid-feedback">
                      {errors.nome.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    disabled={viewOnly}
                    {...register("email", {
                      required: "Email é obrigatório",
                      validate: {
                        validEmail: (value) =>
                          isValidEmail(value) || "Email inválido",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="cargoId" className="form-label">
                    Cargo
                  </label>
                  <select
                    className={`form-select ${
                      errors.cargoId ? "is-invalid" : ""
                    }`}
                    id="cargoId"
                    disabled={viewOnly}
                    {...register("cargoId", {
                      required: "Cargo é obrigatório",
                      onChange: handleCargoChange,
                    })}
                  >
                    <option value="">Selecione um cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>
                        {cargo.name}
                      </option>
                    ))}
                  </select>
                  {errors.cargoId && (
                    <div className="invalid-feedback">
                      {errors.cargoId.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="gestorId" className="form-label">
                    Gestor
                  </label>
                  <select
                    className={`form-select ${
                      errors.gestorId ? "is-invalid" : ""
                    }`}
                    id="gestorId"
                    disabled={
                      viewOnly ||
                      !getValues("cargoId") ||
                      cargos.find((c) => c.id === Number(getValues("cargoId")))
                        ?.level === 1
                    }
                    {...register("gestorId", {
                      required: "Gestor é obrigatório",
                    })}
                  >
                    {cargos.find((c) => c.id === Number(getValues("cargoId")))
                      ?.level === 1 ? (
                      <option value="1">-</option>
                    ) : (
                      <>
                        <option value="">Selecione um gestor</option>
                        {gestores
                          .sort((a, b) => a.nome.localeCompare(b.nome))
                          .map((gestor) => (
                            <option
                              key={gestor.gestorId}
                              value={gestor.gestorId}
                            >
                              {gestor.nome}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                  {errors.gestorId && (
                    <div className="invalid-feedback">
                      {errors.gestorId.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="dataNascimento" className="form-label">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      errors.dataNascimento ? "is-invalid" : ""
                    }`}
                    id="dataNascimento"
                    disabled={viewOnly}
                    {...register("dataNascimento", {
                      required: "Data de Nascimento é obrigatória",
                      validate: {
                        validAge: (value) =>
                          isValidAge(value) ||
                          "Funcionário deve ter no mínimo 18 anos",
                      },
                    })}
                  />
                  {errors.dataNascimento && (
                    <div className="invalid-feedback">
                      {errors.dataNascimento.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="documento" className="form-label">
                    Documento
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.documento ? "is-invalid" : ""
                    }`}
                    id="documento"
                    disabled={viewOnly}
                    {...register("documento", {
                      required: "Documento é obrigatório",
                    })}
                  />
                  {errors.documento && (
                    <div className="invalid-feedback">
                      {errors.documento.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="telefones" className="form-label">
                    Telefones
                  </label>
                  {telefones.map((telefone, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <PhoneInput
                        country={"br"}
                        value={telefone}
                        onChange={(value) =>
                          handleTelefoneChange(value, null, index)
                        }
                        disabled={viewOnly}
                        inputClass={`form-control ${
                          !telefones.some((tel) => tel && tel.trim())
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {!viewOnly && (
                        <div className="d-flex gap-1">
                          {telefones.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-icon"
                              onClick={() => removerTelefone(index)}
                              title="Remover Telefone"
                            >
                              <i className="material-icons">remove</i>
                            </button>
                          )}
                          {index === telefones.length - 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-icon"
                              onClick={adicionarTelefone}
                              title="Adicionar Telefone"
                            >
                              <i className="material-icons">add</i>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {!telefones.some((tel) => tel && tel.trim()) && (
                    <div className="invalid-feedback d-block">
                      Pelo menos um telefone é obrigatório
                    </div>
                  )}
                </div>
              </div>

              {!viewOnly && (
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
                    disabled={viewOnly}
                  >
                    SALVAR
                  </button>
                </div>
              )}

              {viewOnly && (
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/funcionarios")}
                  >
                    VOLTAR
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditarFuncionario;
