import React, { useState, useCallback } from "react";
import TabelaFuncionarios from "../components/TabelaFuncionarios";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import Navbar from "../components/Navbar";

function ListarFuncionarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = React.useState(0);
  const [searchTerm, setSearchTerm] = useState(() => {
    const saved = localStorage.getItem("searchTerm");
    return saved || "";
  });
  const [addDesativados, setAddDesativados] = useState(() => {
    const saved = localStorage.getItem("addDesativados");
    return saved ? JSON.parse(saved) : false;
  });

  const tableRef = React.useRef(searchTerm);
  const addDesativadosRef = React.useRef(addDesativados);

  const debouncedSearch = useCallback(
    debounce((term, desativado) => {
      if (term === "" || term.length >= 2) {
        setKey((prev) => prev + 1);
        tableRef.current = term;
        addDesativadosRef.current = Boolean(desativado);
        localStorage.setItem("searchTerm", term);
      }
    }, 1000),
    []
  );

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === "" || term.length >= 2) {
      debouncedSearch(term, addDesativados);
    }
  };

  const handleAddDesativadosChange = (event) => {
    const checked = event.target.checked;
    setAddDesativados(checked);
    addDesativadosRef.current = checked;
    localStorage.setItem("addDesativados", JSON.stringify(checked));
    debouncedSearch(searchTerm, checked);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAddDesativados(false);
    tableRef.current = "";
    addDesativadosRef.current = false;
    localStorage.removeItem("searchTerm");
    localStorage.removeItem("addDesativados");
    setKey((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (location.state?.recarregar) {
      setKey((prev) => prev + 1);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const adicionarClickHandler = () => {
    navigate("/funcionarios/editar/novo");
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Cadastro de Funcionários</h4>
          <div className="d-flex gap-3 align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="addDesativados"
                checked={addDesativados}
                onChange={handleAddDesativadosChange}
              />
              <label className="form-check-label" htmlFor="addDesativados">
                Incluir funcionários desativados
              </label>
            </div>
            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar funcionário..."
                aria-label="Pesquisar funcionário"
                value={searchTerm}
                onChange={handleSearch}
              />
              {(searchTerm || addDesativados) && (
                <button
                  type="button"
                  className="btn btn-link btn-sm text-muted"
                  onClick={clearFilters}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <i className="material-icons">clear</i>
                </button>
              )}
            </div>
            <Link
              to="/funcionarios/editar/novo"
              className="btn btn-primary d-flex align-items-center"
            >
              <span className="material-icons me-2">add</span>
              ADICIONAR
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <TabelaFuncionarios
                  key={key}
                  searchTerm={tableRef.current}
                  addDesativados={addDesativadosRef.current}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListarFuncionarios;
