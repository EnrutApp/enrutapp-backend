#!/bin/bash

# Script de despliegue personalizado para Azure App Service
# Este script se ejecuta durante el deployment en Azure

set -e

echo "=== Iniciando script de despliegue personalizado ==="

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --production=false

# 2. Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# 3. Compilar la aplicación
echo "🏗️  Compilando aplicación NestJS..."
npm run build

# 4. Verificar que dist existe
if [ -d "dist" ]; then
    echo "✅ Carpeta dist generada correctamente"
    ls -la dist/
else
    echo "❌ ERROR: La carpeta dist no se generó"
    exit 1
fi

echo "=== Despliegue completado exitosamente ==="
