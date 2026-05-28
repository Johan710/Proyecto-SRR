import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login       from "./pages/Login";
import Dashboard   from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import Tracking    from "./pages/Tracking";
import Repartor    from "./pages/Repartor";
import Rute        from "./pages/Rute";
import PrivateRoute from "./component/PrivateRoute";

import OrderProvider from "./context/OrderContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta pública: login */}
        <Route path="/" element={<Login />} />

        {/* Rutas privadas: requieren sesión activa */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/create-order" element={
          <PrivateRoute>
            <OrderProvider>
              <CreateOrder />
            </OrderProvider>
          </PrivateRoute>
        } />

        <Route path="/tracking" element={
          <PrivateRoute>
            <OrderProvider>
              <Tracking />
            </OrderProvider>
          </PrivateRoute>
        } />

        <Route path="/repartor" element={
          <PrivateRoute><Repartor /></PrivateRoute>
        } />

        <Route path="/rute" element={
          <PrivateRoute><Rute /></PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
