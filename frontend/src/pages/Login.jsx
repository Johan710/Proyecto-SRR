// ============================================================
//  pages/Login.jsx  –  Conectado al backend con JWT
// ============================================================
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import logo     from '../assets/logo.png';
import truckLogo from '../assets/truck.png';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const body = await res.json();

      if (!res.ok) {
        // Muestra el error del servidor (credenciales, validación, etc.)
        const msg = body.detalles
          ? body.detalles.map((d) => d.mensaje).join(", ")
          : body.error || "Error al iniciar sesión";
        setApiError(msg);
        return;
      }

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", body.token);
      localStorage.setItem("user",  JSON.stringify(body.user));

      navigate("/dashboard");
    } catch (err) {
      setApiError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo SSPR" className="logo" />
        </div>

        <div className="card">
          <h1 className="title">
            SSPR <br />
            Sistema de seguimiento de Pedidos y Rutas
          </h1>

          <div className="subtitle">Inicio de Sesión</div>

          {/* Error del API */}
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Correo"
                {...register("email", { required: "El email es obligatorio" })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            <div className="truck-area">
              <img src={truckLogo} alt="Camión" />
            </div>

            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
