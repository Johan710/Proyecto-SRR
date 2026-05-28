// ============================================================
//  middleware/authMiddleware.js
//  Verifica que el request traiga un JWT válido
// ============================================================
const jwt = require("jsonwebtoken");

/**
 * Middleware que protege rutas privadas.
 * Espera el header:  Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 1. ¿Viene el header?
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Acceso denegado. Token no proporcionado.",
    });
  }

  // 2. Extraer el token
  const token = authHeader.split(" ")[1];

  // 3. Verificar y decodificar
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, rol }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado. Inicia sesión de nuevo." });
    }
    return res.status(403).json({ error: "Token inválido." });
  }
};

/**
 * Middleware de autorización por rol.
 * Uso:  router.delete("/...", verifyToken, requireRole("admin"), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.rol)) {
    return res.status(403).json({
      error: `Acceso restringido. Se requiere rol: ${roles.join(" o ")}.`,
    });
  }
  next();
};

module.exports = { verifyToken, requireRole };
