// ============================================================
//  context/OrderContext.jsx  –  Conectado al backend con JWT
// ============================================================
import { createContext, useState, useEffect, useCallback } from "react";

export const OrderContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/** Devuelve el header Authorization con el token guardado */
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

function OrderProvider({ children }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // ── Cargar pedidos al montar ─────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_URL}/api/orders`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar pedidos");
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Crear pedido ─────────────────────────────────────────
  const addOrder = async (newOrder) => {
    const res  = await fetch(`${API_URL}/api/orders`, {
      method:  "POST",
      headers: authHeader(),
      body:    JSON.stringify(newOrder),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear pedido");
    setOrders((prev) => [...prev, data.order]);
    return data.order;
  };

  // ── Cambiar estado de un pedido ──────────────────────────
  const updateOrderStatus = async (id, estado) => {
    const res  = await fetch(`${API_URL}/api/orders/${id}/estado`, {
      method:  "PATCH",
      headers: authHeader(),
      body:    JSON.stringify({ estado }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al actualizar estado");
    setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
    return data.order;
  };

  return (
    <OrderContext.Provider
      value={{ orders, loading, error, fetchOrders, addOrder, updateOrderStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
