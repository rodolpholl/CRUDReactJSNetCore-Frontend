import React from "react";
import TabelaFuncionarios from "../components/TabelaFuncionarios";
import { useNavigate, useLocation } from "react-router-dom";

function ListarFuncionarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (location.state?.recarregar) {
      setKey((prev) => prev + 1);
      // Limpa o state para não recarregar novamente
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const adicionarClickHandler = () => {
    navigate("/funcionarios/editar/novo");
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-end">
            <button
              className="btn btn-primary btn-sm d-flex align-items-center"
              onClick={adicionarClickHandler}
            >
              <i className="material-icons me-2">add</i>
              Adicionar
            </button>
          </div>
          <div className="card-body">
            <TabelaFuncionarios key={key} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListarFuncionarios;
