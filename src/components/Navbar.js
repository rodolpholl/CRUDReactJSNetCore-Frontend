import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/apiAuth";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado") || "{}"
  );

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-main">
      <div className="container-fluid">
        <div className="navbar-content">
          <div className="user-menu-container">
            <div
              className="user-profile"
              onClick={() => setShowMenu(!showMenu)}
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar">
                <i className="material-icons">account_circle</i>
              </div>
              <span className="user-name">
                {usuarioLogado.name || "Usuário"}
              </span>
              <i className="material-icons">arrow_drop_down</i>
            </div>

            {showMenu && (
              <div className="user-menu">
                <div className="user-info">
                  <div className="info-item">
                    <span className="info-label">Nome:</span>
                    <span className="info-value">{usuarioLogado.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{usuarioLogado.email}</span>
                  </div>
                </div>
                <div className="menu-divider"></div>
                <div
                  className="menu-item"
                  onClick={() => navigate("/alterar-senha")}
                >
                  <i className="material-icons">settings</i>
                  <span>Alterar Senha</span>
                </div>
                <div className="menu-item" onClick={handleLogout}>
                  <i className="material-icons">logout</i>
                  <span>Sair</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
