import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { funcionarioService } from "../services/api";

function TabelaFuncionarios() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },
    {
      name: "E-mail",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo,
      sortable: true,
    },
    {
      name: "Gestor",
      selector: (row) => row.gestor || "-",
      sortable: true,
    },
    {
      name: "Ações",
      cell: (row) => (
        <div className="actions-buttons">
          <button
            className="btn btn-link btn-sm text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.id);
            }}
            title="Editar"
          >
            <i className="material-icons">edit</i>
          </button>
          <button
            className="btn btn-link btn-sm text-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            title="Excluir"
          >
            <i className="material-icons">delete</i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const funcionarios = await funcionarioService.getFuncionarios(1, 100);
      setData(funcionarios);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar funcionários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate(`/funcionarios/editar/${row.id}`, { state: { funcionario: row } });
  };

  const handleEdit = (id) => {
    const funcionario = data.find((f) => f.id === id);
    navigate(`/funcionarios/editar/${id}`, { state: { funcionario } });
  };

  const handleDelete = (id) => {
    console.log("Excluir funcionário:", id);
    // Implementar lógica de exclusão
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
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
    <DataTable
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 20, 50, 100]}
      highlightOnHover
      pointerOnHover
      onRowClicked={handleRowClick}
      selectableRows={false}
      customStyles={customStyles}
      noDataComponent="Nenhum registro encontrado"
      progressComponent={
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      }
    />
  );
}

export default TabelaFuncionarios;
