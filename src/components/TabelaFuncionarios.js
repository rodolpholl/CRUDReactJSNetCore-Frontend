import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { funcionarioService } from "../services/api";
import { toast } from "react-toastify";

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
      selector: (row) => row.cargo?.name || row.cargoName,
      sortable: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Gestor",
      selector: (row) => row.gestor?.nome || row.gestorName,
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
        <div className="d-flex gap-2">
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
      width: "120px",
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
    </>
  );
}

export default TabelaFuncionarios;
