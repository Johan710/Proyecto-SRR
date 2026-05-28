// ============================================================
//  routes/repartidores.js
//  Todas las rutas requieren JWT
//
//  GET    /api/repartidores       → listar
//  GET    /api/repartidores/:id   → detalle
//  POST   /api/repartidores       → crear (solo admin/supervisor)
//  PUT    /api/repartidores/:id   → actualizar
// ============================================================
const express  = require("express");
const { body, param } = require("express-validator");

const db                    = require("../config/db");
const validate              = require("../middleware/validate");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);

// ── Validaciones ──────────────────────────────────────────────
const ESTADOS_REP = ["Disponible", "En ruta", "No disponible"];

const repRules = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("Nombre: 2–100 caracteres"),

  body("telefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .matches(/^[0-9]{7,15}$/).withMessage("Teléfono: solo dígitos, 7–15 caracteres"),

  body("placa")
    .trim()
    .notEmpty().withMessage("La placa es obligatoria")
    .matches(/^[A-Z0-9]{3}-?[0-9]{3}$/).withMessage("Formato de placa inválido (ej: ABC-123)"),

  body("estado")
    .optional()
    .isIn(ESTADOS_REP)
    .withMessage(`Estado debe ser uno de: ${ESTADOS_REP.join(", ")}`),
];

const idRule = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

// ── GET /api/repartidores ─────────────────────────────────────
router.get("/", (req, res) => {
  res.json({ total: db.getAllRepartidores().length, repartidores: db.getAllRepartidores() });
});

// ── GET /api/repartidores/:id ─────────────────────────────────
router.get("/:id", idRule, validate, (req, res) => {
  const rep = db.getRepartidorById(req.params.id);
  if (!rep) return res.status(404).json({ error: "Repartidor no encontrado" });
  res.json(rep);
});

// ── POST /api/repartidores  (admin o supervisor) ──────────────
router.post(
  "/",
  requireRole("admin", "supervisor"),
  repRules,
  validate,
  (req, res) => {
    const { nombre, telefono, placa, estado } = req.body;
    const rep = db.createRepartidor({ nombre, telefono, placa, estado });
    res.status(201).json({ message: "Repartidor creado", repartidor: rep });
  }
);

// ── PUT /api/repartidores/:id  (admin o supervisor) ───────────
router.put(
  "/:id",
  requireRole("admin", "supervisor"),
  [...idRule, ...repRules],
  validate,
  (req, res) => {
    const { nombre, telefono, placa, estado } = req.body;
    const updated = db.updateRepartidor(req.params.id, { nombre, telefono, placa, estado });
    if (!updated) return res.status(404).json({ error: "Repartidor no encontrado" });
    res.json({ message: "Repartidor actualizado", repartidor: updated });
  }
);

module.exports = router;
