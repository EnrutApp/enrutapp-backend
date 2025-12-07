# 🚌 EnrutApp Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" />
</p>

<p align="center">
  Sistema de gestión de transporte y rutas construido con <strong>NestJS</strong>, <strong>Prisma ORM</strong> y <strong>PostgreSQL</strong>
</p>

<p align="center">
  <a href="https://github.com/EnrutApp/enrutapp-backend/actions/workflows/ci.yml">
    <img src="https://github.com/EnrutApp/enrutapp-backend/actions/workflows/ci.yml/badge.svg" alt="CI/CD Pipeline" />
  </a>
  <a href="https://codecov.io/gh/EnrutApp/enrutapp-backend">
    <img src="https://codecov.io/gh/EnrutApp/enrutapp-backend/branch/main/graph/badge.svg" alt="Coverage" />
  </a>
  <img src="https://img.shields.io/badge/NestJS-11.0.10-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6.17.1-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Node.js-18%20%7C%2020%20%7C%2022-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/github/license/EnrutApp/enrutapp-backend" alt="License" />
</p>

---

## 📋 Descripción

**EnrutApp Backend** es una API RESTful robusta y escalable para la gestión integral de servicios de transporte. Proporciona funcionalidades completas para:

- 🔐 **Autenticación y Autorización** con JWT
- 👥 **Gestión de Usuarios** y roles (Admin, Conductor, Usuario)
- 🚍 **Gestión de Vehículos** y conductores
- 🗺️ **Rutas y Ubicaciones**
- 📦 **Encomiendas** y reservas
- 💰 **Módulo Financiero**
- ⏰ **Control de Turnos**

El proyecto sigue una **arquitectura modular profesional** basada en las mejores prácticas de NestJS y Clean Architecture.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.x
- MySQL >= 8.0
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/EnrutApp/enrutapp-backend.git
cd enrutapp-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar en modo desarrollo
npm run start:dev
```

La API estará disponible en **http://localhost:3000/api**

📚 **Documentación Swagger**: http://localhost:3000/api/docs

---

## 🔑 Obtener JWT Token para Probar

### Método 1: Usar Swagger UI (Más Fácil) ⭐

1. Abre **http://localhost:3000/api/docs**
2. Ve a la sección **"Auth"**
3. Haz clic en **`POST /api/auth/login`**
4. Haz clic en **"Try it out"**
5. Ingresa las credenciales:
   ```json
   {
     "correo": "admin@enrutapp.com",
     "contrasena": "admin123"
   }
   ```
6. Copia el `access_token` de la respuesta
7. Haz clic en el botón **"Authorize" 🔓** (arriba a la derecha)
8. Pega el token y haz clic en **"Authorize"**

### Método 2: Con cURL

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@enrutapp.com","contrasena":"admin123"}'
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov

# Tests en modo watch
npm run test:watch
```

## 📦 Scripts Disponibles

| Script                  | Descripción                             |
| ----------------------- | --------------------------------------- |
| `npm run start`         | Inicia la aplicación en modo producción |
| `npm run start:dev`     | Inicia con hot-reload para desarrollo   |
| `npm run start:debug`   | Inicia en modo debug                    |
| `npm run build`         | Compila el proyecto TypeScript          |
| `npm run lint`          | Ejecuta ESLint                          |
| `npm run format`        | Formatea el código con Prettier         |
| `npm run test`          | Ejecuta tests unitarios                 |
| `npm run test:e2e`      | Ejecuta tests end-to-end                |
| `npm run prisma:studio` | Abre Prisma Studio (GUI de BD)          |

## 🛠️ Stack Tecnológico

### Core

- **NestJS** v11.0.10 - Framework backend progresivo
- **TypeScript** v5.9.3 - Tipado estático
- **Node.js** v24.10.0 - Runtime de JavaScript

### Base de Datos

- **Prisma ORM** v6.17.1 - ORM moderno para TypeScript
- **MySQL** v8.0+ - Base de datos relacional

### Autenticación y Seguridad

- **Passport JWT** - Estrategia de autenticación
- **bcryptjs** - Hash de contraseñas
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de datos

### Testing

- **Jest** v30.2.0 - Framework de testing
- **Supertest** - Testing de endpoints HTTP

### Desarrollo

- **ESLint** v9.38.0 - Linter de código
- **Prettier** - Formateador de código
- **TypeScript ESLint** v8.46.1 - Reglas de TypeScript

## 🌐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Aplicación
NODE_ENV=development
PORT=3000

# Base de Datos
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/enrutapp"

# JWT
JWT_SECRET="tu_secreto_super_seguro_aqui"
JWT_EXPIRES_IN="24hrs"

```

## 📁 Estructura del Proyecto

```
src/
├── main.ts                      # Punto de entrada de la aplicación
├── app.module.ts                # Módulo raíz
│
├── common/                      # 🔧 Código compartido
│   ├── decorators/             # Decoradores personalizados
│   ├── filters/                # Filtros de excepción
│   ├── guards/                 # Guards globales
│   ├── interceptors/           # Interceptores
│   ├── interfaces/             # Interfaces compartidas
│   └── pipes/                  # Pipes de validación
│
├── config/                      # ⚙️ Configuración
│   ├── app.config.ts
│   ├── jwt.config.ts
│   └── database.config.ts
│
├── database/                    # 🗄️ Base de datos
│   ├── database.module.ts
│   └── prisma.service.ts
│
└── modules/                     # 📦 Módulos de negocio
    ├── auth/                   # Autenticación
    └── usuarios/               # Gestión de usuarios
```

### Convenciones de Commits

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato (no afectan el código)
refactor: Refactorización de código
test: Añadir o modificar tests
chore: Cambios en build o herramientas
```

## 🤝 Desarrollo

Esta es una guía rápida. Para más detalles, consulta [CONTRIBUTING.md](CONTRIBUTING.md).

### Flujo de trabajo

```bash
# 1. Crear branch
git checkout -b feature/nombre

# 2. Desarrollar y verificar
npm run lint:check
npm run test

# 3. Commit y push
git commit -m "feat: descripción"
git push origin feature/nombre

# 4. Crear PR en GitHub
```

### Convenciones de Commits

```
feat: Nueva característica
fix: Corrección de bug
refactor: Refactorización
chore: Mantenimiento
docs: Documentación
test: Tests
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **EnrutApp Team** - Desarrollo y mantenimiento

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/) - Framework principal
- [Prisma](https://www.prisma.io/) - ORM excepcional
- Todos los contribuidores del proyecto

---

<p align="center">
  Hecho con ❤️ por el equipo de EnrutApp
</p>
