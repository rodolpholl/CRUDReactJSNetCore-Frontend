import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-main">
      <div className="container-fluid">
        <div className="navbar-content">
          <h4 className="navbar-title">Cadastro de Funcionários</h4>
          <div className="navbar-search">
            <div
              className="input-group input-group-outline"
              style={{ width: "250px" }}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Pesquisar..."
                style={{ height: "31px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
