export const decodeToken = (token) => {
  try {
    // Pega a parte do payload do token (segunda parte)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const claims = JSON.parse(jsonPayload);

    // Mapeia as claims para o formato esperado
    return {
      id: claims[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      name: claims[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      email:
        claims[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};
