import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";
import logo from '../assets/logo.png';
import truckLogo from '../assets/truck.png';
import mapsImg from '../assets/maps.png';

function Rute() {

    const { orders } = useContext(OrderContext);
    const [filter, setFilter] = useState("Todos");

    const filteredOrders =
	filter === "Todos"
    ? orders
    : orders.filter(
        (order) => order.status === filter
	);

	const getBadgeClass = (status) => {

		switch (status) {

			case "Pendiente":
				return "bg-warning text-dark";

			case "En tránsito":
				return "bg-primary";

			case "Entregado":
				return "bg-success";

			default:
				return "bg-secondary";
		}
	};
	return (
		<div className="dashboard">

			<aside className="sidebar">
				<div className="sidebar-top">

					<ul className="sidebar-menu">
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-layout-dashboard" aria-hidden="true">
								<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect>
								<rect width="7" height="9" x="14" y="12" rx="1"></rect>
								<rect width="7" height="5" x="3" y="16" rx="1"></rect>
							</svg>
							<Link to="/dashboard">
								<span>Dashboard</span>
							</Link>
						</li>
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package" aria-hidden="true">
								<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
								<path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline>
								<path d="m7.5 4.27 9 5.15"></path>
							</svg>
							<Link to="/tracking">
								<span>Pedidos</span>
							</Link>
						</li>
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users" aria-hidden="true">
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
								<path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
								<circle cx="9" cy="7" r="4"></circle>
							</svg>
							<Link to="/repartor">
								<span>Repartidores</span>
							</Link>
						</li>
						<li className="active">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-route" aria-hidden="true">
								<circle cx="6" cy="19" r="3"></circle>
								<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
								<circle cx="18" cy="5" r="3"></circle>
							</svg>
							<Link to="/rute">
								<span>Ruta</span>
							</Link>
						</li>
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-settings" aria-hidden="true">
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
					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-user-round" aria-hidden="true">
						<path d="M17.925 20.056a6 6 0 0 0-11.851.001"></path>
						<circle cx="12" cy="11" r="4"></circle>
						<circle cx="12" cy="12" r="10"></circle>
					</svg>
					<div>
						<h6>{JSON.parse(localStorage.getItem("user") || "{}").nombre || "Usuario"}</h6>
					</div>
				</div>

			</aside>

			<main className="content">
				<div className="detail-topbar">

					<h2>
						Detalle del Pedido #A1203
					</h2>

					<button className="back-btn">

						<i className="bi bi-arrow-left"></i>
						<Link to="/tracking">
							<span>Volver al listado</span>
						</Link>

					</button>

				</div>
				
				<div className="actions">
					{/*<div className="search-box">
						<i className="bi bi-search"></i>
						<input type="text" placeholder="ID, Repartidor, Destino..." />
					</div>*/}

					<div className="actions-right">

						{/*<button className="notification-btn">
							<i className="bi bi-bell"></i>
							<span>Notificaciones</span>
						</button>

						<button className="add-btn">
							<Link to="/create-order">
								+ Agregar un nuevo pedido
							</Link>
						</button>*/}

					</div>

				</div>
				
				<div className="detail-card">

					<div className="detail-grid">
						<div>
							<strong>Cliente:</strong> Ana Torres
						</div>
						<div>
							<strong>Estado:</strong> En tránsito
						</div>
						<div>
							<strong>Repartidor:</strong> Steven Enciso
						</div>
						<div>
							<strong>Origen:</strong> Cali
						</div>
						<div>
							<strong>Destino:</strong> Barranquilla
						</div>
						<div>
							<strong>Vehículo:</strong> Camión (ID: ABC-123)
						</div>
					</div>
				</div>
				
				<div className="detail-body">
					
					<div className="timeline">
						
						<div className="timeline-item">
							<div className="timeline-date">
								Null
							</div>
							<div className="timeline-icon">
								<i className="bi bi-hand-index-thumb"></i>
							</div>
							<div className="timeline-content">
								<h6>Pedido Entregado</h6>
								<p>
									Descripción: Null
								</p>
							</div>
						</div>
						
						<div className="timeline-item active">
							<div className="timeline-date">
								26/04/2026 - 09:00
							</div>
							<div className="timeline-icon">
								<i className="bi bi-truck"></i>
							</div>
							<div className="timeline-content">
								<h6>En Ruta</h6>
								<p>
									Descripción: Cerca a portal 80
								</p>
							</div>
						</div>
						
						<div className="timeline-item">
							<div className="timeline-date">
								24/04/2026 - 08:00
							</div>
							<div className="timeline-icon">
								<i className="bi bi-box-seam"></i>
							</div>
							<div className="timeline-content">
								<h6>Asignado</h6>
								<p>
									Descripción: Norbert L. aceptó el pedido
								</p>
							</div>
						</div>
						
						<div className="timeline-item">
							<div className="timeline-date">
								24/04/2026 - 07:00
							</div>
							<div className="timeline-icon">
								<i className="bi bi-file-earmark-text"></i>
							</div>
							<div className="timeline-content">
								<h6>Creado</h6>
								<p>
									Descripción: Pedido registrado por el sistema.
								</p>
							</div>
						</div>
					</div>
					
					<div className="map-card">
						<img src={mapsImg} alt="Mapa" />
					</div>
				</div>
				
				<div className="truck-footer">
					<img src={truckLogo} alt="Camión" />
				</div>
				
			</main>
		</div>
    
	);
}

export default Rute;