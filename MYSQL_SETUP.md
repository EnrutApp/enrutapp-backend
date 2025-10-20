# Configuración de MySQL Workbench para EnrutApp Backend

## ✅ Cambios realizados

1. **Schema de Prisma actualizado** (`prisma/schema.prisma`):
   - Cambiado de PostgreSQL a MySQL
   - Creados los modelos: `Usuarios`, `Roles`, `TiposDoc`
   - Establecidas las relaciones entre las tablas
   - Configurados los tipos de datos según MySQL

2. **Dependencias instaladas**:
   - Agregado `mysql2` como driver para MySQL

3. **Archivo .env actualizado**:
   - Configurado para conexión MySQL local

## 🔧 Pasos para configurar MySQL Workbench

### 1. Crear la base de datos

En MySQL Workbench, ejecuta:

```sql
CREATE DATABASE enrutapp_db;
```

### 2. Configurar el archivo .env

Edita el archivo `.env` con tus credenciales de MySQL:

```
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/enrutapp_db"
```

**Ejemplo típico:**

```
DATABASE_URL="mysql://root:tu_contraseña_mysql@localhost:3306/enrutapp_db"
```

### 3. Ejecutar las migraciones

Una vez configurada la conexión, ejecuta:

```bash
npx prisma migrate dev --name init
```

### 4. Ver la base de datos en Prisma Studio (opcional)

```bash
npx prisma studio
```

## 📊 Estructura de las tablas creadas

### Usuarios

- `idUsuario` (VARCHAR(36), PK)
- `idRol` (VARCHAR(36), FK → Roles)
- `tipoDoc` (VARCHAR(36), FK → TiposDoc)
- `numDocumento` (VARCHAR(20), UNIQUE)
- `nombre` (VARCHAR(100))
- `telefono` (VARCHAR(20))
- `correo` (VARCHAR(100), UNIQUE)
- `contrasena` (VARCHAR(255))
- `direccion` (VARCHAR(255))
- `ciudad` (VARCHAR(100))
- `estado` (BOOLEAN)

### Roles

- `idRol` (VARCHAR(36), PK)
- `nombreRol` (VARCHAR(50), UNIQUE)
- `descripcion` (TEXT, opcional)
- `estado` (BOOLEAN)

### TiposDoc

- `idTipoDoc` (VARCHAR(36), PK)
- `nombreTipoDoc` (VARCHAR(50), UNIQUE)

## 🚀 Próximos pasos

1. Configura tu base de datos MySQL
2. Actualiza las credenciales en `.env`
3. Ejecuta `npx prisma migrate dev --name init`
4. ¡Comienza a desarrollar tu aplicación!

## 📝 Notas importantes

- Los IDs están configurados como VARCHAR(36) para soportar UUIDs
- Las relaciones están establecidas correctamente entre las tablas
- El campo `descripcion` en Roles es opcional (nullable)
- Todos los campos están tipados según las especificaciones de MySQL
