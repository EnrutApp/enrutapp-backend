# Patch de BD (Google Login + Perfil incompleto Cliente)

Si ves el error:

- `PrismaClientKnownRequestError P2022`
- `column Usuarios.perfilCompleto does not exist`

significa que tu BD **no tiene** las columnas nuevas que el backend/Prisma ahora espera.

## ¿Por qué Prisma pide reset?

Porque Prisma detectó **drift** (tu BD real no coincide con el historial de migraciones local). Para poder volver a ejecutar todas las migraciones desde cero, Prisma propone `migrate reset`, que **borra y recrea** el esquema.

- En **DEV** puede estar bien.
- En **PROD / STAGING con datos**: NO usar reset.

## Opción segura (sin borrar datos): aplicar SQL manual

1. Abre tu gestor de BD (Azure Query Editor, pgAdmin, DBeaver, psql, etc.) apuntando a la misma BD de `DATABASE_URL`.
2. Ejecuta el script:

- `scripts/sql/20251211_add_usuario_perfilCompleto_authProvider_nullable_cliente.sql`

Esto:

- Agrega `perfilCompleto` y `authProvider`.
- Hace nullable `tipoDoc`, `numDocumento`, `telefono`, `direccion`, `idCiudad`.

## Después

- Reinicia el backend.
- Prueba login normal y login con Google.

> Nota: El drift de migraciones puede seguir existiendo (historial vs BD). Este patch es para desbloquear ejecución.
