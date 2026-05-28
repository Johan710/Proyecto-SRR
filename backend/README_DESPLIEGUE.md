# SSPR Backend — Guía de QA, Seguridad y Despliegue
*Persona 4: QA, Seguridad y Despliegue (DevOps)*

---

## 📁 Estructura del proyecto

```
Proyecto-SRR/
├── backend/
│   ├── config/
│   │   └── db.js                  ← Base de datos en memoria
│   ├── middleware/
│   │   ├── authMiddleware.js      ← Verificación JWT + roles
│   │   └── validate.js            ← Manejo de errores de validación
│   ├── routes/
│   │   ├── auth.js                ← POST /api/auth/login
│   │   ├── orders.js              ← CRUD /api/orders
│   │   └── repartidores.js        ← CRUD /api/repartidores
│   ├── .env.example               ← Variables de entorno (plantilla)
│   ├── package.json
│   ├── render.yaml                ← Config de despliegue en Render
│   └── server.js                  ← Punto de entrada
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── OrderContext.jsx   ← Actualizado: llama al backend
│   │   └── pages/
│   │       └── Login.jsx          ← Actualizado: login real con JWT
│   └── .env                       ← VITE_API_URL=https://tu-app.render.com
└── SSPR_API.postman_collection.json
```

---

## 🔐 Seguridad implementada

### JWT (JSON Web Tokens)

| Aspecto | Detalle |
|---|---|
| Librería | `jsonwebtoken` |
| Hash de contraseñas | `bcryptjs` (salt rounds: 10) |
| Duración del token | 2 horas (configurable con `JWT_EXPIRES_IN`) |
| Header esperado | `Authorization: Bearer <token>` |
| Errores manejados | Token ausente → 401, expirado → 401, inválido → 403 |

### Control de acceso por roles

| Rol | Puede hacer |
|---|---|
| `admin` | Todo (incluye DELETE) |
| `supervisor` | GET/POST/PUT en pedidos y repartidores |
| `conductor` | Solo GET |

### Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@sspr.com | admin123 | admin |
| supervisor@sspr.com | super123 | supervisor |
| conductor@sspr.com | conductor123 | conductor |

---

## ✅ Validaciones implementadas

### POST /api/auth/login
- `email`: obligatorio, formato válido, normalizado
- `password`: obligatorio, mínimo 6 caracteres

### POST /PUT /api/orders
- `origen`: obligatorio, 3–100 caracteres
- `destino`: obligatorio, 3–100 caracteres, **≠ origen**
- `cliente`: obligatorio, 2–100 caracteres
- `descripcion`: obligatorio, 5–300 caracteres
- `estado`: opcional, debe ser uno de: `Pendiente | En tránsito | Entregado | Cancelado`

### POST/PUT /api/repartidores
- `nombre`: obligatorio, 2–100 caracteres
- `telefono`: obligatorio, solo dígitos, 7–15 caracteres
- `placa`: obligatorio, formato `ABC-123`
- `estado`: opcional, debe ser: `Disponible | En ruta | No disponible`

---

## 🚀 Instalación local

```bash
# 1. Ir a la carpeta del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
cp .env.example .env
# Edita .env y cambia JWT_SECRET por una clave segura

# 4. Correr el servidor
npm run dev        # Con nodemon (recarga automática)
npm start          # Producción
```

El servidor queda en: `http://localhost:3000`

---

## ☁️ Despliegue en Render (paso a paso)

### 1. Sube el proyecto a GitHub
```bash
git add .
git commit -m "feat: backend con JWT, validaciones y rutas protegidas"
git push origin main
```

### 2. Crear Web Service en Render
1. Ir a [https://render.com](https://render.com) → **New → Web Service**
2. Conectar tu repositorio de GitHub
3. Configurar:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Runtime:** Node

### 3. Variables de entorno en Render
En *Settings → Environment*, agrega:

| Variable | Valor |
|---|---|
| `JWT_SECRET` | una clave larga y aleatoria |
| `JWT_EXPIRES_IN` | `2h` |
| `FRONTEND_URL` | URL de tu frontend en Netlify/Vercel |
| `NODE_ENV` | `production` |

### 4. Obtener el link en vivo
Render genera una URL del tipo:
`https://sspr-backend.onrender.com`

### 5. Conectar el frontend
En `frontend/.env`:
```
VITE_API_URL=https://sspr-backend.onrender.com
```

> ⚠️ **Nota Render plan gratuito:** el servidor entra en reposo tras 15 min de inactividad. La primera petición puede tardar ~30 segundos en despertar.

---

## 🧪 Pruebas con Postman

### Importar la colección
1. Abrir Postman
2. **Import** → seleccionar `SSPR_API.postman_collection.json`
3. Ir a la colección → **Variables** → pegar la URL del servidor en `base_url`

### Flujo de prueba recomendado

```
1. Auth → Login (admin)           → guarda el token automáticamente
2. Pedidos → GET todos            → verifica 200 + lista de pedidos
3. Pedidos → POST crear pedido    → verifica 201 + pedido nuevo
4. Pedidos → POST validación      → verifica 400 + detalle de errores
5. Pedidos → PATCH cambiar estado → verifica 200 + estado actualizado
6. Auth → Login (conductor)       → obtener token con rol limitado
7. Pedidos → DELETE               → verifica 403 (sin permiso)
8. Auth → Sin token               → verifica 401
```

---

## 📋 Tabla de rutas de la API

| Método | Ruta | Autenticación | Rol mínimo | Descripción |
|---|---|---|---|---|
| GET | `/` | No | — | Health check |
| POST | `/api/auth/login` | No | — | Iniciar sesión |
| GET | `/api/auth/me` | JWT | Cualquiera | Info del usuario actual |
| GET | `/api/orders` | JWT | Cualquiera | Listar pedidos |
| GET | `/api/orders/:id` | JWT | Cualquiera | Detalle de pedido |
| POST | `/api/orders` | JWT | Cualquiera | Crear pedido |
| PUT | `/api/orders/:id` | JWT | Cualquiera | Actualizar pedido |
| PATCH | `/api/orders/:id/estado` | JWT | Cualquiera | Cambiar estado |
| DELETE | `/api/orders/:id` | JWT | **admin** | Eliminar pedido |
| GET | `/api/repartidores` | JWT | Cualquiera | Listar repartidores |
| GET | `/api/repartidores/:id` | JWT | Cualquiera | Detalle de repartidor |
| POST | `/api/repartidores` | JWT | admin/supervisor | Crear repartidor |
| PUT | `/api/repartidores/:id` | JWT | admin/supervisor | Actualizar repartidor |
