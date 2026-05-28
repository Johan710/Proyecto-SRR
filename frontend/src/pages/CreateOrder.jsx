import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

import logo from '../assets/logo.png'
import truckLogo from '../assets/truck.png'

function CreateOrder() {

    const { addOrder } = useContext(OrderContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	const onSubmit = async (data) => {
		setLoading(true);
		setApiError("");

		try {
			await addOrder({
				origen:      data.origen.trim(),
				destino:     data.destino.trim(),
				cliente:     data.cliente.trim(),
				descripcion: data.descripcion.trim(),
			});
			navigate("/tracking");
		} catch (err) {
			setApiError(err.message || "Error al crear el pedido");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="dashboard">

			<aside className="sidebar">
				<div className="sidebar-top">

					<ul className="sidebar-menu">
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard" aria-hidden="true">
								<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect>
								<rect width="7" height="9" x="14" y="12" rx="1"></rect>
								<rect width="7" height="5" x="3" y="16" rx="1"></rect>
							</svg>
							<Link to="/dashboard">
								<span>Dashboard</span>
							</Link>
						</li>
						<li className="active">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package" aria-hidden="true">
								<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
								<path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline>
								<path d="m7.5 4.27 9 5.15"></path>
							</svg>
							<Link to="/tracking">
								<span>Pedidos</span>
							</Link>
						</li>
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users" aria-hidden="true">
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
								<path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
								<circle cx="9" cy="7" r="4"></circle>
							</svg>
							<Link to="/repartor">
								<span>Repartidores</span>
							</Link>
						</li>
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-route" aria-hidden="true">
								<circle cx="6" cy="19" r="3"></circle>
								<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
								<circle cx="18" cy="5" r="3"></circle>
							</svg>
							<Link to="/rute">
								<span>Ruta</span>
							</Link>
						</li>
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings" aria-hidden="true">
								<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
								<circle cx="12" cy="12" r="3"></circle>
							</svg>
							<Link to="../">
								<span>Salir</span>
							</Link>
						</li>
					</ul>

				</div>

				<div className="sidebar-user">
					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round" aria-hidden="true">
						<path d="M17.925 20.056a6 6 0 0 0-11.851.001"></path>
						<circle cx="12" cy="11" r="4"></circle>
						<circle cx="12" cy="12" r="10"></circle>
					</svg>
					<div>
						<h6>{JSON.parse(localStorage.getItem("user") || '{}').nombre || "Usuario"}</h6>
					</div>
				</div>

			</aside>

			<main className="content">
				<div className="topbar">
					<h2>Crear Pedido</h2>
					<img className="top-logo" src={logo} alt="Logo" />
				</div>

				{apiError && (
					<div className="alert alert-danger" role="alert">{apiError}</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-3">
						<input
							type="text"
							className={`form-control ${errors.origen ? "is-invalid" : ""}`}
							{...register("origen", { required: "El origen es obligatorio", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
							placeholder="Origen"
						/>
						{errors.origen && <div className="invalid-feedback">{errors.origen.message}</div>}
					</div>

					<div className="mb-3">
						<input
							type="text"
							className={`form-control ${errors.destino ? "is-invalid" : ""}`}
							{...register("destino", { required: "El destino es obligatorio", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
							placeholder="Destino"
						/>
						{errors.destino && <div className="invalid-feedback">{errors.destino.message}</div>}
					</div>

					<div className="mb-3">
						<input
							type="text"
							className={`form-control ${errors.cliente ? "is-invalid" : ""}`}
							{...register("cliente", { required: "El cliente es obligatorio", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
							placeholder="Cliente"
						/>
						{errors.cliente && <div className="invalid-feedback">{errors.cliente.message}</div>}
					</div>

					<div className="mb-3">
						<textarea
							className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
							{...register("descripcion", { required: "La descripción es obligatoria", minLength: { value: 5, message: "Mínimo 5 caracteres" } })}
							placeholder="Descripción"
						/>
						{errors.descripcion && <div className="invalid-feedback">{errors.descripcion.message}</div>}
					</div>

					<button type="submit" className="btn btn-success w-100" disabled={loading}>
						{loading ? "Creando pedido..." : "Crear Pedido"}
					</button>
				</form>

				<div className="truck-footer">
					<img src={truckLogo} alt="Camión" />
				</div>

			</main>
		</div>
	);
}

export default CreateOrder;
