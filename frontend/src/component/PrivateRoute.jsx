// ============================================================
//  components/PrivateRoute.jsx
//  Protege rutas privadas: si no hay token válido → redirige a /
// ============================================================
import { Navigate } from "react-router-dom";

/**
 * Verifica que exista un token en localStorage Y que no esté expirado.
 * Si falla cualquiera de las dos condiciones, manda al login.
 */
function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Decodificar el payload (parte central del JWT, en base64)
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp está en segundos; Date.now() en milisegundos
    if (payload.exp * 1000 < Date.now()) {
      // Token expirado: limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
    return true;
  } catch {
    // Token malformado
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
