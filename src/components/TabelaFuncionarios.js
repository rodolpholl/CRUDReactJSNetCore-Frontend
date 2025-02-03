import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { funcionarioService } from "../services/apiFuncionario";
import { toast } from "react-toastify";
import { authService } from "../services/apiAuth";

function TabelaFuncionarios({ searchTerm, addDesativados }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const pageSize = [25, 50, 75, 100];
  const [totalRows, setTotalRows] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(pageSize[0] || 25);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [operacaoConfirmada, setOperacaoConfirmada] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [copied, setCopied] = useState(false);

  const columns = [
    {
      name: "Status",
      width: "80px",
      cell: (row) => (
        <span className={`badge ${row.active ? "bg-success" : "bg-danger"}`}>
          {row.active ? "Ativo" : "Inativo"}
        </span>
      ),
      noWrap: true,
    },
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
      grow: 3,
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Telefone(s)",
      selector: (row) => row.telefone,
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo,
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Gestor",
      selector: (row) => row.gestor,
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Documento",
      selector: (row) => row.documento,
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Ações",
      cell: (row) => (
        <div className="d-flex gap-1">
          <button
            className={`btn btn-sm ${
              row.active ? "btn-outline-primary" : "btn-outline-info"
            }`}
            onClick={() =>
              navigate(`/funcionarios/editar/${row.id}`, {
                state: {
                  funcionario: row,
                  viewOnly: !row.active,
                },
              })
            }
          >
            <i className="material-icons">
              {row.active ? "edit" : "visibility"}
            </i>
          </button>

          {row.active && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleResetPassword(row)}
              title="Resetar Senha do Usuário"
            >
              <i className="material-icons">lock_open</i>
            </button>
          )}

          <button
            className={`btn btn-sm ${
              row.active ? "btn-outline-danger" : "btn-outline-secondary"
            }`}
            onClick={() => handleDelete(row)}
          >
            <i className="material-icons">
              {row.active ? "delete" : "more_horiz"}
            </i>
          </button>
        </div>
      ),
      width: "150px",
      allowOverflow: true,
      noWrap: true,
    },
  ];

  const fetchFuncionarios = async (page, perPage) => {
    try {
      setLoading(true);
      const response = await funcionarioService.getFuncionarios(
        page,
        perPage,
        searchTerm,
        addDesativados
      );
      console.log("Resposta da API:", response);
      const funcionarios = response.items || response;
      setData(funcionarios);
      setTotalRows(response.total || funcionarios.length);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      setError("Erro ao carregar funcionários");
      toast.error("Erro ao carregar funcionários. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios(pageIndex, pageCount);
  }, [pageIndex, pageCount, searchTerm, addDesativados]);

  const handlePageChange = (page) => {
    console.log("Mudando para página:", page);
    setPageIndex(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    console.log("Mudando para", newPerPage, "itens por página");
    setPageCount(newPerPage);
    setPageIndex(1);
  };

  const handleRowClick = (row) => {
    navigate(`/funcionarios/editar/${row.id}`, { state: { funcionario: row } });
  };

  const handleEdit = (id) => {
    const funcionario = data.find((f) => f.id === id);
    navigate(`/funcionarios/editar/${id}`, { state: { funcionario } });
  };

  const handleDelete = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowModal(true);
  };

  const handleDesativar = async () => {
    try {
      setLoading(true);
      await funcionarioService.desativarFuncionario(selectedFuncionario.id);
      toast.success("Funcionário desativado com sucesso!");
      fetchFuncionarios(pageIndex, pageCount);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao desativar funcionário:", error);
      toast.error("Erro ao desativar funcionário. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = () => {
    setOperacaoConfirmada("excluir");
    setShowConfirmModal(true);
  };

  const handleReativar = async () => {
    try {
      setLoading(true);
      await funcionarioService.reativarFuncionario(selectedFuncionario.id);
      toast.success("Funcionário reativado com sucesso!");
      fetchFuncionarios(pageIndex, pageCount);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao reativar funcionário:", error);
      toast.error("Erro ao reativar funcionário. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarExclusao = async () => {
    try {
      setLoading(true);
      await funcionarioService.deleteFuncionario(selectedFuncionario.id);
      toast.success("Funcionário excluído com sucesso!");
      fetchFuncionarios(pageIndex, pageCount);
      setShowConfirmModal(false);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      toast.error("Erro ao excluir funcionário. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowResetModal(true);
  };

  const confirmResetPassword = async () => {
    try {
      setLoading(true);
      const newPassword = await authService.resetarSenha(
        selectedFuncionario.id
      );
      toast.success("Senha resetada com sucesso!");
      setShowResetModal(false);
      setNewPassword(newPassword);
      setShowNewPasswordModal(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erro ao resetar senha. Tente novamente."
      );
    } finally {
      setLoading(false);
      setSelectedFuncionario(null);
    }
  };

  const handleCloseNewPasswordModal = () => {
    setShowNewPasswordModal(false);
    setNewPassword(null);
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      toast.success("Senha copiada!");

      // Reset do estado de copiado após 2 segundos
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Erro ao copiar senha");
    }
  };

  const customStyles = {
    table: {
      style: {
        minWidth: "100%",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        wordBreak: "break-word",
      },
    },
  };

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationPerPage={pageCount}
        paginationDefaultPage={pageIndex}
        paginationRowsPerPageOptions={pageSize}
        noDataComponent={loading ? null : "Nenhum registro encontrado"}
        customStyles={customStyles}
        responsive
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 300px)"
      />

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Operação</h5>
              </div>
              <div className="modal-body">
                {selectedFuncionario?.active ? (
                  <p>
                    ATENÇÃO! Esta operação pode ser irreversível para o
                    funcionário <strong>{selectedFuncionario?.nome}</strong>.
                    Você poderá <b>excluí-lo</b> ou <b>desativá-lo</b>. Qual
                    operação deverá ser realizada?
                  </p>
                ) : (
                  <p>
                    ATENÇÃO! O funcionário{" "}
                    <strong>{selectedFuncionario?.nome}</strong> encontra-se{" "}
                    <b>desativado</b>. Qual operação deverá ser realizada?
                  </p>
                )}
              </div>
              <div className="modal-footer">
                {selectedFuncionario?.active ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning text-white"
                      onClick={handleDesativar}
                    >
                      DESATIVAR
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleExcluir}
                    >
                      EXCLUIR
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleReativar}
                    >
                      REATIVAR
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleExcluir}
                    >
                      EXCLUIR
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Exclusão</h5>
              </div>
              <div className="modal-body">
                <p>
                  ATENÇÃO! Essa operação será irreversível. Deseja prosseguir?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmarExclusao}
                >
                  SIM
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  NÃO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reset de Senha */}
      <div
        className={`modal fade ${showResetModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Reset de Senha</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowResetModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Essa operação irá resetar a senha do funcionário{" "}
                <strong>{selectedFuncionario?.nome}</strong>. Deseja realmente
                prosseguir?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Não
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmResetPassword}
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal exibindo a nova senha */}
      <div
        className={`modal fade ${showNewPasswordModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nova Senha Gerada</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseNewPasswordModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                A senha de usuário do funcionário{" "}
                <strong>{selectedFuncionario?.nome}</strong> foi resetada. A
                nova senha é:
              </p>
              <div className="alert alert-info text-center position-relative">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <strong>{newPassword}</strong>
                  <button
                    className={`btn btn-sm btn-link text-${
                      copied ? "success" : "primary"
                    } p-0 ms-2`}
                    onClick={handleCopyPassword}
                    title="Copiar senha"
                  >
                    <i className="material-icons" style={{ fontSize: "20px" }}>
                      {copied ? "check" : "content_copy"}
                    </i>
                  </button>
                </div>
              </div>
              <p className="text-muted small mt-3">
                Em condições normais, essa senha seria enviada por email ou
                algum outro instrumento de push. Para fins de teste, vamos
                exibí-la para uso e validação.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCloseNewPasswordModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TabelaFuncionarios;
