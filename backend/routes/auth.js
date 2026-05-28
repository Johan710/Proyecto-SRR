// ============================================================
//  routes/auth.js
//  POST /api/auth/login   → devuelve JWT
//  GET  /api/auth/me      → info del usuario autenticado
// ============================================================
const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const { body } = require("express-validator");

const db               = require("../config/db");
const validate         = require("../middleware/validate");
const { verifyToken }  = require("../middleware/authMiddleware");

const router = express.Router();

// ── Reglas de validación para el login ───────────────────────
const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("El email es obligatorio")
    .isEmail().withMessage("Formato de email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // 2. Verificar contraseña (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // 3. Generar JWT
    const payload = { id: user.id, email: user.email, rol: user.rol };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    });

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ── GET /api/auth/me  (ruta protegida) ────────────────────────
router.get("/me", verifyToken, (req, res) => {
  const user = db.findUserByEmail(req.user.email);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  res.json({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
  });
});

module.exports = router;
