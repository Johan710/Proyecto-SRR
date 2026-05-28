// ============================================================
//  server.js  –  Punto de entrada del backend SSPR
// ============================================================
require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const authRoutes       = require("./routes/auth");
const ordersRoutes     = require("./routes/orders");
const repartidoresRoutes = require("./routes/repartidores");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ─────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());          // parsear JSON en el body
app.use(express.urlencoded({ extended: true }));

// ── Ruta de salud (útil para Render / Railway) ────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SSPR API funcionando 🚛",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Rutas de la API ──────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/orders",       ordersRoutes);
app.use("/api/repartidores", repartidoresRoutes);

// ── Manejo de rutas no encontradas ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ── Manejo global de errores ─────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Error interno:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app; // exportar para tests
