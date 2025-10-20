# Configuración CORS para Producción

## Desarrollo (Actual)

```typescript
// main.ts - Configuración actual para desarrollo
app.enableCors({
  origin: true, // Permitir todos los orígenes durante desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
});
```

## Producción (Cambiar antes de desplegar)

```typescript
// main.ts - Configuración para producción
app.enableCors({
  origin: [
    'https://tudominio.com',
    'https://www.tudominio.com',
    'https://app.tudominio.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
});
```

## Usando Variables de Entorno (Recomendado)

```typescript
// main.ts - Configuración usando variables de entorno
app.enableCors({
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS?.split(',')
      : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
});
```

## Variables de Entorno (.env)

```env
# Desarrollo
NODE_ENV=development

# Producción
NODE_ENV=production
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com,https://app.tudominio.com
```

## ⚠️ Recordatorio

- **Cambiar antes de desplegar a producción**
- **No dejar `origin: true` en producción** (riesgo de seguridad)
- **Usar HTTPS en producción**
