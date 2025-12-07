# ==========================================
# 🚌 EnrutApp Backend - Dockerfile
# ==========================================
# Multi-stage build para optimizar el tamaño de la imagen

# ==========================================
# STAGE 1: Build
# ==========================================
FROM node:20-alpine AS builder

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build de la aplicación
RUN npm run build

# ==========================================
# STAGE 2: Production
# ==========================================
FROM node:20-alpine AS production

# Instalar dependencias necesarias
RUN apk add --no-cache openssl dumb-init

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Generar Prisma Client en producción
RUN npx prisma generate

# Copiar build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Crear directorio para uploads
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Usar usuario no-root por seguridad
USER node

# Exponer puerto (Azure usa PORT env variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]
