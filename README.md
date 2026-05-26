# TaskManager App

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2-ff6384)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicación web para gestión de tareas con autenticación JWT, panel de administración y estadísticas visuales. Diseño minimalista inspirado en Notion y Linear.

**Demo en producción:** https://task-manager-app-black-nine.vercel.app

---

## Capturas de pantalla

### Login
Pantalla centrada con formulario limpio de usuario y contraseña. Enlace directo a la página de registro. Fondo gris claro con tarjeta blanca redondeada.

### Registro
Formulario de tres campos (usuario, correo y contraseña) con validación de longitud mínima. Misma estética que login.

### Dashboard
Vista principal con cuatro tarjetas de estadísticas (total, pendientes, en progreso, completadas). Dos gráficas de barras de Recharts: tareas por estado y tareas por prioridad. Barra de progreso general al pie.

### Tareas
Tabla completa con todas las tareas del usuario. Badges de colores para estado y prioridad. Botones de editar y eliminar por fila. Botón de "Nueva tarea" en el encabezado. Modales flotantes para crear, editar y confirmar eliminación.

### Administración (solo ADMIN)
Panel con dos pestañas: "Todas las tareas" y "Usuarios". La pestaña de tareas muestra el propietario de cada tarea. La de usuarios permite cambiar el rol (USER/ADMIN) y eliminar usuarios vía modales de confirmación.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16 | Framework principal con App Router |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos utilitarios |
| Recharts | 2 | Gráficas de estadísticas |
| React Context API | — | Estado global de autenticación |

---

## Arquitectura

```
task-manager-app/
├── app/
│   ├── layout.tsx         # Layout raíz con AuthProvider
│   ├── page.tsx           # Redirección automática
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── tasks/page.tsx     # CRUD de tareas
│   ├── admin/page.tsx     # Panel ADMIN
│   └── dashboard/page.tsx # Estadísticas
├── components/
│   ├── AppLayout.tsx      # Sidebar + AuthGuard
│   ├── AuthGuard.tsx      # Protección de rutas
│   ├── Modal.tsx          # Modal reutilizable
│   ├── Sidebar.tsx        # Navegación lateral
│   ├── StatusBadge.tsx    # Badges de estado/prioridad
│   └── TaskForm.tsx       # Formulario de tareas
├── context/
│   └── AuthContext.tsx    # JWT en memoria (no localStorage)
├── lib/
│   └── api.ts             # Cliente HTTP para la API REST
└── types/
    └── index.ts           # Tipos TypeScript compartidos
```

---

## Backend

El frontend consume la API REST desplegada en Railway:

- **API Base URL:** `https://task-api-production-bd4c.up.railway.app`
- **Documentación Swagger:** [https://task-api-production-bd4c.up.railway.app/swagger-ui/index.html](https://task-api-production-bd4c.up.railway.app/swagger-ui/index.html)
- **Repositorio backend:** [https://github.com/EstefaniaMarloz/task-api](https://github.com/EstefaniaMarloz/task-api)

### Endpoints utilizados

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Inicia sesión, retorna JWT |
| POST | `/api/auth/register` | Registra un usuario nuevo |
| GET | `/api/tasks` | Lista tareas propias (USER) o todas (ADMIN) |
| POST | `/api/tasks` | Crea una tarea |
| PUT | `/api/tasks/{id}` | Actualiza una tarea |
| DELETE | `/api/tasks/{id}` | Elimina una tarea |
| GET | `/api/users` | Lista usuarios (solo ADMIN) |
| PATCH | `/api/users/{id}/role` | Cambia el rol de un usuario (solo ADMIN) |
| DELETE | `/api/users/{id}` | Elimina un usuario (solo ADMIN) |

---

## Cómo correrlo localmente

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/EstefaniaMarloz/task-manager-app.git
cd task-manager-app

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

---

## Notas de seguridad

- El JWT se guarda **en memoria** (React Context), no en `localStorage` ni `sessionStorage`.
- Al cerrar o recargar la página la sesión expira automáticamente.
- Las rutas protegidas redirigen a `/login` si no hay sesión activa.
- El panel `/admin` solo es accesible para usuarios con rol `ADMIN`.

---

## Contacto

**Francisca Estefania Martinez Lozano**

- LinkedIn: [https://www.linkedin.com/in/estefaniaml](https://www.linkedin.com/in/estefaniaml)
- GitHub: [https://github.com/EstefaniaMarloz](https://github.com/EstefaniaMarloz)
