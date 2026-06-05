# 🍽️ ShareMeal
 
**ShareMeal** es una plataforma integral de donación de alimentos que conecta a donantes con voluntarios para reducir el desperdicio de comida y combatir el hambre en las comunidades. La aplicación facilita la coordinación fluida entre los restaurantes/donantes que desean compartir sus excedentes y los voluntarios que ayudan a distribuirlos a quienes más lo necesitan.
 
---
 
## ✨ Características Principales
 
- **🔐 Autenticación y Autorización:** Registro e inicio de sesión seguros con control de acceso basado en roles (Donante / Voluntario).
- **📦 Gestión de Donaciones:** Creación, visualización y administración de donaciones de alimentos con soporte para fotografías.
- **🧠 Algoritmo de Emparejamiento (Matchmaking):** Sistema inteligente para conectar donaciones con los voluntarios más adecuados y cercanos basados en puntuación y experiencia.
- **📊 Analíticas en Tiempo Real:** Seguimiento de platos servidos, donaciones activas y el impacto general en la comunidad.
- **⭐ Sistema de Calificación:** Los donantes pueden evaluar a los voluntarios tras completar exitosamente una entrega.
- **📸 Subida de Imágenes:** Soporte para adjuntar múltiples fotografías por donación para mayor transparencia.
---
 
## 🛠️ Stack Tecnológico
 
### Backend
 
| Componente | Tecnología |
|---|---|
| Entorno | Node.js |
| Framework | Express.js |
| Base de Datos | MySQL (a través del ORM Prisma) |
| Autenticación | JWT (JSON Web Tokens) |
| Seguridad de Contraseñas | bcrypt |
| Gestión de Archivos | Multer |
| Control de Tráfico | express-rate-limit |
 
### Frontend
 
| Componente | Tecnología |
|---|---|
| Framework | React Native |
| Plataforma | Expo |
| Librería UI | React Native Paper |
| Navegación | React Navigation (Stack & Bottom Tabs) |
| Gestión de Estado | React Context API |
| Almacenamiento Local | AsyncStorage |
| Cámara/Galería | Expo Image Picker |
| Iconos | Expo Vector Icons, Material Icons |
 
---
 
## 📁 Estructura del Proyecto
 
```text
ShareMeal/
├── backend/
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación JWT
│   │   └── authorisation.js     # Autorización basada en roles
│   ├── prisma/
│   │   ├── schema.prisma        # Esquema de la base de datos
│   │   └── migrations/          # Migraciones de la base de datos
│   ├── src/
│   │   ├── auth/                # Rutas y controladores de autenticación
│   │   ├── users/               # Gestión general de usuarios
│   │   ├── donations/           # Operaciones CRUD de donaciones
│   │   ├── volunteers/          # Funciones específicas para voluntarios
│   │   ├── donors/              # Funciones específicas para donantes
│   │   ├── matching/            # Algoritmo de emparejamiento inteligente
│   │   └── analytics/           # Estadísticas y métricas
│   └── server.js                # Archivo principal de Express
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  # Contexto global de autenticación
    │   ├── navigation/
    │   │   └── TabNavigator.jsx # Navegación inferior (Bottom tabs)
    │   └── screens/
    │       ├── Splash/          # Pantalla de carga (Splash screen)
    │       ├── Login/           # Pantalla de inicio de sesión
    │       ├── Register/        # Pantalla de registro
    │       ├── Home/            # Panel principal (Home)
    │       ├── Donate/          # Pantallas de donación
    │       ├── Volunteer/       # Panel del voluntario
    │       └── Profile/         # Perfil de usuario
    └── assets/                  # Imágenes, fuentes y recursos estáticos
```
 
---
 
## 🚀 Guía de Inicio
 
### Requisitos Previos
 
- Node.js (v14 o superior)
- Base de datos MySQL en ejecución
- Expo CLI (para el frontend)
- npm o yarn
### Configuración del Backend
 
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
 
2. Instala las dependencias:
   ```bash
   npm install
   ```
 
3. Configura las variables de entorno — crea un archivo `.env` en la raíz de la carpeta `backend`:
   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/sharemeal"
   JWT_SECRET="tu-clave-secreta-aqui"
   PORT=3000
   ```
 
4. Prepara la Base de Datos (Prisma):
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
 
5. Inicia el servidor:
   ```bash
   npm run dev    # Modo desarrollo (con nodemon)
   # o
   npm start      # Modo producción
   ```
 
### Configuración del Frontend
 
1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```
 
2. Instala las dependencias:
   ```bash
   npm install
   ```
 
3. Inicia el servidor de desarrollo de Expo:
   ```bash
   npm start
   # o
   expo start
   ```
 
4. Ejecuta en tu plataforma preferida:
   ```bash
   npm run ios      # Emulador de iOS
   npm run android  # Emulador de Android
   npm run web      # Navegador Web
   ```
 
---
 
## 🔧 Funcionalidades del Backend
 
### Autenticación y Autorización
 
- **Registro de Usuarios:** Creación de cuentas con correo, contraseña, nombre, teléfono y rol.
- **Inicio de Sesión:** Autenticación protegida mediante JWT.
- **Control de Acceso (RBAC):** Permisos separados para Donantes y Voluntarios.
- **Seguridad:** Encriptado de contraseñas usando bcrypt.
### Gestión de Donaciones
 
- **Crear Donación:** Los donantes pueden publicar tipo de comida, cantidad, dirección, zona, horario preferido, múltiples fotos e incluso sugerir un voluntario.
- **Visualizar Donaciones:** Filtros y ordenamiento por zona, estado (`available`, `accepted`, `completed`, `cancelled`), horario y fecha de creación.
- **Aceptar Donación:** Los voluntarios pueden reclamar las donaciones disponibles.
- **Completar Donación:** Los voluntarios marcan las entregas como finalizadas.
### Sistema de Emparejamiento (Matchmaking)
 
- **Asignación de Voluntarios:** Algoritmo que puntúa a los voluntarios basándose en su calificación promedio (estrellas) y experiencia previa.
- **Sugerencias Automáticas:** El sistema auto-asigna al mejor voluntario disponible al momento de crear la donación.
### Analíticas y Estadísticas
 
- **Métricas de la Plataforma:** Total de platos servidos, donaciones activas, completadas y estadísticas por zona.
- **Métricas del Donante/Voluntario:** Historial completo de impacto personal y tareas.
### Sistema de Calificaciones
 
- Los donantes evalúan a los voluntarios (1 a 5 estrellas) tras completar una entrega, con opción a dejar comentarios. Esta calificación alimenta el sistema de Matchmaking.
---
 
## 📱 Funcionalidades del Frontend
 
### Interfaz de Usuario (UI/UX)
 
- Diseño limpio usando React Native Paper (Material Design).
- **Navegación Intuitiva:** Transiciones suaves entre el Home, panel de Donaciones, panel de Voluntariado y Perfil.
- **Notificaciones Simuladas (Toasts):** Alertas en tiempo real sobre cambios de estado en las donaciones y confirmaciones de acciones.
- **Modales Elegantes:** Cuadros de diálogo personalizados para confirmación de cancelaciones y sistema de calificación flotante.
### Pantallas Principales
 
- **Home:** Dashboard dinámico con saludos según la hora del día, métricas globales de la app y botones de acción rápida.
- **Donante (Dashboard):** Lista de donaciones realizadas, estado en tiempo real, botón para cancelar envíos y modal para calificar al voluntario al finalizar.
- **Crear Donación (Formulario):** Inputs validados, selector de imágenes, campos de dirección y notas adicionales.
- **Voluntario (Dashboard):** Pestañas divididas entre "Donaciones Disponibles" y "Mis Tareas". Incluye filtros por zona, tipo de comida y empaque.
---
 
## 📡 Documentación de la API
 
### URL Base
 
```
http://localhost:3000/api/v1
```
 
### 🔑 Autenticación
 
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de usuario. Body: `{ name, email, password, phone?, role }` |
| `POST` | `/auth/login` | Inicio de sesión. Body: `{ email, password }` |
 
### 📦 Donaciones
 
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/donations` | Crear donación (requiere token). Body: `{ foodType, approxQuantity, quantityUnit?, area, pickupAddress, preferredPickupTime?, contactNumber?, photos?, suggestedVolunteerId? }` |
| `GET` | `/donations` | Listar donaciones. Query params: `area`, `status`, `sort`, `page`, `limit`, `donorId` |
| `PUT` | `/donations/:id/cancel` | Cancelar una donación (requiere token) |
| `POST` | `/donations/:id/accept` | Aceptar donación (requiere token — rol: Voluntario) |
| `POST` | `/donations/:id/complete` | Completar donación (requiere token — rol: Voluntario) |
 
### 👤 Usuarios y Perfiles
 
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/users/profile` | Obtener perfil del usuario autenticado |
| `PUT` | `/users/profile` | Actualizar perfil del usuario |
| `GET` | `/volunteers/dashboard` | Dashboard del voluntario (requiere token) |
| `GET` | `/donors/profile` | Perfil del donante (requiere token) |
 
### ⭐ Calificaciones
 
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/donors/ratings` | Calificar voluntario (requiere token — rol: Donante). Body: `{ donationId, rating (1-5), comment? }` |
 
### 📊 Analíticas
 
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/analytics/metrics` | Métricas globales de la plataforma (requiere token) |
| `GET` | `/analytics/donor/:donorId` | Métricas por donante (requiere token) |
 
---
 
## 🗄️ Esquema de Base de Datos
 
| Modelo | Campos Principales |
|---|---|
| `User` | `id` (UUID), `name`, `email`, `phone`, `password`, `role`, `createdAt` |
| `Donation` | `id` (UUID), `donorId`, `foodType`, `approxQuantity`, `quantityUnit`, `area`, `pickupAddress`, `status`, `suggestedVolunteerId`, fechas de control |
| `DonationPhoto` | `id`, `donationId`, `url` |
| `Acceptance` | `id` (UUID), `donationId`, `volunteerId`, `status`, fechas de control |
| `Rating` | `id` (UUID), `donationId`, `donorId`, `volunteerId`, `rating`, `comment` |
 
---
 
## 📦 Dependencias Principales
 
### Backend
 
| Paquete | Descripción |
|---|---|
| `express` | Framework web para Node.js |
| `@prisma/client` | Cliente ORM para conexión a la base de datos |
| `bcrypt` | Encriptación segura de contraseñas |
| `jsonwebtoken` | Generación y validación de tokens JWT |
| `multer` | Manejo y subida de archivos e imágenes |
 
### Frontend
 
| Paquete | Descripción |
|---|---|
| `react-native` / `expo` | Frameworks de desarrollo móvil multiplataforma |
| `react-native-paper` | Componentes visuales basados en Material Design |
| `@react-navigation/...` | Librerías para manejo de rutas y pestañas |
| `@react-native-async-storage/async-storage` | Almacenamiento local del token de sesión |
| `react-native-toast-message` | Alertas visuales y notificaciones tipo toast |
| `expo-image-picker` | Acceso a galería y cámara del dispositivo |