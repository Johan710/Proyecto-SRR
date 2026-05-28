// ============================================================
//  routes/orders.js
//  Todas las rutas requieren JWT
//
//  GET    /api/orders          → listar todos los pedidos
//  GET    /api/orders/:id      → detalle de un pedido
//  POST   /api/orders          → crear pedido (con validaciones)
//  PUT    /api/orders/:id      → actualizar pedido completo
//  PATCH  /api/orders/:id/estado → cambiar solo el estado
//  DELETE /api/orders/:id      → eliminar pedido (solo admin)
// ============================================================
const express  = require("express");
const { body, param } = require("express-validator");

const db                    = require("../config/db");
const validate              = require("../middleware/validate");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Todas las rutas de /orders requieren autenticación ────────
router.use(verifyToken);

// ── Validaciones reutilizables ────────────────────────────────
const ESTADOS_VALIDOS = ["Pendiente", "En tránsito", "Entregado", "Cancelado"];

const orderRules = [
  body("origen")
    .trim()
    .notEmpty().withMessage("El origen es obligatorio")
    .isLength({ min: 3, max: 100 }).withMessage("Origen: 3–100 caracteres"),

  body("destino")
    .trim()
    .notEmpty().withMessage("El destino es obligatorio")
    .isLength({ min: 3, max: 100 }).withMessage("Destino: 3–100 caracteres")
    .custom((val, { req }) => {
      if (val.toLowerCase() === (req.body.origen || "").toLowerCase()) {
        throw new Error("El destino no puede ser igual al origen");
      }
      return true;
    }),

  body("cliente")
    .trim()
    .notEmpty().withMessage("El cliente es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("Cliente: 2–100 caracteres"),

  body("descripcion")
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria")
    .isLength({ min: 5, max: 300 }).withMessage("Descripción: 5–300 caracteres"),

  body("estado")
    .optional()
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`Estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`),
];

const estadoRule = [
  body("estado")
    .notEmpty().withMessage("El estado es obligatorio")
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`Estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`),
];

const idRule = [
  param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),
];

// ── GET /api/orders ──────────────────────────────────────────
router.get("/", (req, res) => {
  let orders = db.getAllOrders();

  // Filtro opcional por estado: /api/orders?estado=Pendiente
  if (req.query.estado) {
    orders = orders.filter(
      (o) => o.estado.toLowerCase() === req.query.estado.toLowerCase()
    );
  }

  res.json({ total: orders.length, orders });
});

// ── GET /api/orders/:id ──────────────────────────────────────
router.get("/:id", idRule, validate, (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json(order);
});

// ── POST /api/orders ─────────────────────────────────────────
router.post("/", orderRules, validate, (req, res) => {
  const { origen, destino, cliente, descripcion, estado } = req.body;
  const order = db.createOrder({ origen, destino, cliente, descripcion, estado });
  res.status(201).json({ message: "Pedido creado exitosamente", order });
});

// ── PUT /api/orders/:id ──────────────────────────────────────
router.put("/:id", [...idRule, ...orderRules], validate, (req, res) => {
  const { origen, destino, cliente, descripcion, estado } = req.body;
  const updated = db.updateOrder(req.params.id, {
    origen, destino, cliente, descripcion, estado,
  });
  if (!updated) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json({ message: "Pedido actualizado", order: updated });
});

// ── PATCH /api/orders/:id/estado ─────────────────────────────
router.patch("/:id/estado", [...idRule, ...estadoRule], validate, (req, res) => {
  const updated = db.updateOrder(req.params.id, { estado: req.body.estado });
  if (!updated) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json({ message: "Estado actualizado", order: updated });
});

// ── DELETE /api/orders/:id  (solo admin) ─────────────────────
router.delete("/:id", idRule, validate, requireRole("admin"), (req, res) => {
  const deleted = db.deleteOrder(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json({ message: "Pedido eliminado correctamente" });
});

module.exports = router;
