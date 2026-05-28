// ============================================================
//  config/db.js
//  Base de datos en memoria  (simula MongoDB / PostgreSQL)
//  En un proyecto real, aquí iría la conexión a tu BD real.
// ============================================================
const bcrypt = require("bcryptjs");

// ── Usuarios ─────────────────────────────────────────────────
const SALT = bcrypt.genSaltSync(10);

const users = [
  {
    id: 1,
    email: "admin@sspr.com",
    password: bcrypt.hashSync("admin123", SALT),
    nombre: "Administrador",
    rol: "admin",
  },
  {
    id: 2,
    email: "supervisor@sspr.com",
    password: bcrypt.hashSync("super123", SALT),
    nombre: "Supervisor López",
    rol: "supervisor",
  },
  {
    id: 3,
    email: "conductor@sspr.com",
    password: bcrypt.hashSync("conductor123", SALT),
    nombre: "Carlos Conductor",
    rol: "conductor",
  },
];

// ── Pedidos (orders) ─────────────────────────────────────────
let orders = [
  {
    id: 1,
    origen: "Bogotá",
    destino: "Medellín",
    cliente: "Carlos Pérez",
    descripcion: "Paquete electrónico",
    estado: "Pendiente",
    creadoEn: new Date("2025-05-01").toISOString(),
  },
  {
    id: 2,
    origen: "Cali",
    destino: "Barranquilla",
    cliente: "Ana Torres",
    descripcion: "Documentos importantes",
    estado: "En tránsito",
    creadoEn: new Date("2025-05-03").toISOString(),
  },
  {
    id: 3,
    origen: "Bogotá",
    destino: "Bucaramanga",
    cliente: "Pedro Gómez",
    descripcion: "Ropa y calzado",
    estado: "Entregado",
    creadoEn: new Date("2025-05-05").toISOString(),
  },
];
let nextOrderId = 4;

// ── Repartidores ─────────────────────────────────────────────
let repartidores = [
  {
    id: 1,
    nombre: "Juan Rodríguez",
    telefono: "3001234567",
    placa: "ABC-123",
    estado: "Disponible",
    creadoEn: new Date("2025-04-15").toISOString(),
  },
  {
    id: 2,
    nombre: "María González",
    telefono: "3109876543",
    placa: "XYZ-456",
    estado: "En ruta",
    creadoEn: new Date("2025-04-20").toISOString(),
  },
];
let nextRepartidorId = 3;

// ── Helpers ───────────────────────────────────────────────────
const db = {
  // Users
  findUserByEmail: (email) =>
    users.find((u) => u.email === email.toLowerCase()),

  // Orders
  getAllOrders: () => [...orders],
  getOrderById: (id) => orders.find((o) => o.id === Number(id)),
  createOrder: (data) => {
    const order = {
      id: nextOrderId++,
      ...data,
      estado: data.estado || "Pendiente",
      creadoEn: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },
  updateOrder: (id, data) => {
    const idx = orders.findIndex((o) => o.id === Number(id));
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], ...data };
    return orders[idx];
  },
  deleteOrder: (id) => {
    const idx = orders.findIndex((o) => o.id === Number(id));
    if (idx === -1) return false;
    orders.splice(idx, 1);
    return true;
  },

  // Repartidores
  getAllRepartidores: () => [...repartidores],
  getRepartidorById: (id) =>
    repartidores.find((r) => r.id === Number(id)),
  createRepartidor: (data) => {
    const rep = {
      id: nextRepartidorId++,
      ...data,
      estado: data.estado || "Disponible",
      creadoEn: new Date().toISOString(),
    };
    repartidores.push(rep);
    return rep;
  },
  updateRepartidor: (id, data) => {
    const idx = repartidores.findIndex((r) => r.id === Number(id));
    if (idx === -1) return null;
    repartidores[idx] = { ...repartidores[idx], ...data };
    return repartidores[idx];
  },
};

module.exports = db;
