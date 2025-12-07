# ✅ CHECKLIST: Deploy EnrutApp Backend a Azure

## 📦 **FASE 1: Preparación del Código (COMPLETADO ✅)**

- [x] Dockerfile creado
- [x] .dockerignore creado
- [x] .env.production.example creado
- [x] main.ts actualizado para Azure (CORS y puerto)
- [x] Health check endpoint agregado
- [x] JWT_SECRET generado

---

## 🔑 **Tu JWT_SECRET generado (guárdalo):**

```
c47ce7c2482786f3505227eb3d1f312e62e9453fddfe8f6a02ef318c4ec0e09f1d66a23231479232cfa596f7cf2a6b478e868b7f185594020523641713f8c046
```

---

## 🚀 **FASE 2: Subir Código a GitHub**

### Paso 1: Agregar archivos nuevos

```bash
cd /Users/haderrenteria/Documents/Proyectos/enrutapp/enrutapp-backend
git add .
git commit -m "feat: Preparar backend para deploy en Azure App Service"
git push origin main
```

---

## ☁️ **FASE 3: Configurar Azure (SIGUE ESTOS PASOS)**

### 📝 **Paso 1: Activar Azure for Students**

1. ✅ Ve a: https://azure.microsoft.com/es-es/free/students/
2. ✅ Haz clic en **"Activar ahora"**
3. ✅ Inicia sesión con tu correo estudiantil
4. ✅ Verifica tu identidad (puede pedir verificación)
5. ✅ Confirma que recibes $100 de crédito

---

### 🗄️ **Paso 2: Crear Base de Datos MySQL**

#### 2.1 Acceder al Portal

- URL: https://portal.azure.com

#### 2.2 Crear MySQL Server

1. En el buscador superior escribe: **"Azure Database for MySQL"**
2. Clic en **"+ Crear"**
3. Selecciona: **"Servidor flexible"**

#### 2.3 Configuración Básica

```
Suscripción: Azure for Students
Grupo de recursos: [Crear nuevo] → "enrutapp-resources"
Nombre del servidor: "enrutapp-mysql" (debe ser único)
Región: "East US" (o la más cercana)
Versión de MySQL: 8.0
```

#### 2.4 Proceso y Almacenamiento

```
Nivel de proceso: Burstable
Tamaño de proceso: B1ms (1 vCore, 2 GiB RAM)
Almacenamiento: 20 GiB
```

⚠️ **IMPORTANTE:** Usa B1ms para ahorrar créditos (~$12/mes)

#### 2.5 Autenticación

```
Método de autenticación: Solo autenticación de MySQL
Nombre de usuario administrador: enrutapp_admin
Contraseña: [Crea una contraseña fuerte y GUÁRDALA]
```

#### 2.6 Redes

```
☑️ Permitir acceso público desde cualquier servicio de Azure
☑️ Agregar dirección IP del cliente actual (tu IP)
```

#### 2.7 Crear y Esperar

- Clic en **"Revisar y crear"**
- Clic en **"Crear"**
- ⏳ Espera 5-10 minutos

#### 2.8 Crear Base de Datos

1. Una vez creado, ve al recurso
2. En el menú lateral: **"Bases de datos"**
3. Clic en **"+ Agregar"**
4. Nombre: `enrutapp_db`
5. Conjunto de caracteres: `utf8mb4`
6. Intercalación: `utf8mb4_unicode_ci`

#### 2.9 Obtener Cadena de Conexión

1. En el menú lateral: **"Cadenas de conexión"**
2. Copia la cadena de **Node.js**
3. Debería verse así:

```
mysql://enrutapp_admin@enrutapp-mysql:TU_CONTRASEÑA@enrutapp-mysql.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED
```

⚠️ **GUARDA ESTA CADENA** - la necesitarás después

---

### 🌐 **Paso 3: Crear App Service**

#### 3.1 Crear Web App

1. En el buscador: **"App Services"**
2. Clic en **"+ Crear"** → **"Aplicación web"**

#### 3.2 Configuración Básica

```
Grupo de recursos: "enrutapp-resources" (el mismo)
Nombre: "enrutapp-backend" (será tu URL)
Publicar: Contenedor
Sistema operativo: Linux
Región: "East US" (la misma que MySQL)
```

#### 3.3 Plan de App Service

```
Plan de Linux: [Crear nuevo] → "enrutapp-plan"
Plan de tarifa: B1 Basic (1.75 GB RAM, 1 vCore)
```

💰 Costo: ~$13/mes (cubierto por tus créditos)

#### 3.4 Contenedor

```
Origen de la imagen: GitHub Actions
```

#### 3.5 Crear

- Clic en **"Revisar y crear"**
- Clic en **"Crear"**
- ⏳ Espera 2-3 minutos

---

### 🔧 **Paso 4: Configurar Variables de Entorno**

#### 4.1 Ir a Configuración

1. Ve a tu App Service "enrutapp-backend"
2. Menú lateral: **"Configuración"**
3. Tab: **"Configuración de la aplicación"**

#### 4.2 Agregar Variables

Clic en **"+ Nueva configuración de aplicación"** para CADA una:

```bash
# 1. Base de datos (USA LA CADENA QUE GUARDASTE)
Nombre: DATABASE_URL
Valor: mysql://enrutapp_admin@enrutapp-mysql:TU_CONTRASEÑA@enrutapp-mysql.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED

# 2. JWT Secret (USA EL QUE GENERAMOS)
Nombre: JWT_SECRET
Valor: c47ce7c2482786f3505227eb3d1f312e62e9453fddfe8f6a02ef318c4ec0e09f1d66a23231479232cfa596f7cf2a6b478e868b7f185594020523641713f8c046

# 3. JWT Expiration
Nombre: JWT_EXPIRES_IN
Valor: 24h

# 4. Node Environment
Nombre: NODE_ENV
Valor: production

# 5. Puerto (Azure lo asigna automáticamente)
Nombre: PORT
Valor: 8080

# 6. CORS (por ahora permite todos, luego cambias)
Nombre: FRONTEND_URL
Valor: *
```

#### 4.3 Guardar

- Clic en **"Guardar"** arriba
- Confirma el reinicio

---

### 🔗 **Paso 5: Conectar con GitHub**

#### 5.1 Centro de Implementación

1. En tu App Service, menú lateral: **"Centro de implementación"**
2. Origen: **"GitHub"**
3. Clic en **"Autorizar"** (permite acceso a tu GitHub)

#### 5.2 Configurar Repositorio

```
Organización: [Tu usuario de GitHub]
Repositorio: enrutapp-backend
Rama: main
```

#### 5.3 Configurar Build

```
Tipo de compilación: Dockerfile
Ruta del Dockerfile: /Dockerfile
```

#### 5.4 Guardar

- Clic en **"Guardar"**
- Azure creará automáticamente:
  - Workflow de GitHub Actions
  - Secretos en tu repositorio
  - Iniciará el primer deploy

⏳ **Espera 5-10 minutos** para el primer deploy

---

### 🗃️ **Paso 6: Ejecutar Migraciones de Prisma**

#### Opción A: Desde tu computadora (RECOMENDADO)

```bash
# 1. Ir a tu proyecto
cd /Users/haderrenteria/Documents/Proyectos/enrutapp/enrutapp-backend

# 2. Crear archivo .env.production temporal
echo 'DATABASE_URL="mysql://enrutapp_admin@enrutapp-mysql:TU_CONTRASEÑA@enrutapp-mysql.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED"' > .env.production

# 3. Instalar dotenv-cli si no lo tienes
npm install -g dotenv-cli

# 4. Ejecutar migraciones
dotenv -e .env.production -- npx prisma migrate deploy

# 5. (Opcional) Ejecutar seeds
dotenv -e .env.production -- npm run seed

# 6. Eliminar archivo temporal
rm .env.production
```

#### Opción B: Desde Azure Cloud Shell

1. En Azure Portal, clic en icono **Cloud Shell** (>\_) arriba derecha
2. Ejecuta:

```bash
git clone https://github.com/TU_USUARIO/enrutapp-backend.git
cd enrutapp-backend
npm install
export DATABASE_URL="TU_CADENA_DE_CONEXION"
npx prisma migrate deploy
npm run seed
```

---

### ✅ **Paso 7: Verificar el Deploy**

#### 7.1 Monitorear Deploy

1. Ve a **"Centro de implementación"**
2. Verás el estado del deploy de GitHub Actions
3. También puedes ver en: https://github.com/TU_USUARIO/enrutapp-backend/actions

#### 7.2 Ver Logs

1. Menú lateral: **"Registros de App Service"**
2. Activa: **"Registro de aplicaciones (sistema de archivos)"**
3. Ve a: **"Secuencia de registro"**

#### 7.3 Probar la API

Tu URL será: `https://enrutapp-backend.azurewebsites.net`

Prueba estos endpoints:

```
✅ https://enrutapp-backend.azurewebsites.net/api
✅ https://enrutapp-backend.azurewebsites.net/api/health
✅ https://enrutapp-backend.azurewebsites.net/api/docs
✅ https://enrutapp-backend.azurewebsites.net/api/ciudades
```

---

## 🎉 **¡LISTO! Tu API está en producción**

### 📊 URLs Importantes:

- 🌐 **API Base:** `https://enrutapp-backend.azurewebsites.net/api`
- 📚 **Swagger Docs:** `https://enrutapp-backend.azurewebsites.net/api/docs`
- 🔧 **Azure Portal:** https://portal.azure.com

---

## 💰 **Monitorear Costos**

### Configurar Alertas de Presupuesto:

1. En Azure Portal: **"Cost Management + Billing"**
2. **"Budgets"** → **"+ Add"**
3. Configura alertas en: $10, $25, $50, $75

### Costos Estimados:

- App Service B1: ~$13/mes
- MySQL B1ms: ~$12/mes
- **Total: ~$25/mes**
- Con $100 de crédito = **~4 meses gratis**

---

## 🔄 **Deploys Automáticos**

Cada vez que hagas `git push origin main`:

1. ✅ GitHub Actions se ejecuta automáticamente
2. ✅ Construye la imagen Docker
3. ✅ La despliega en Azure
4. ✅ Tu API se actualiza (~5 minutos)

---

## 🆘 **Solución de Problemas Comunes**

### ❌ La aplicación no inicia

1. Revisa logs en **"Secuencia de registro"**
2. Verifica que `DATABASE_URL` esté correcta
3. Verifica que el puerto sea `8080`

### ❌ Error de conexión a MySQL

1. MySQL Server → **"Redes"**
2. Activa: **"Permitir acceso a servicios de Azure"**
3. Verifica: `?ssl-mode=REQUIRED` en la cadena de conexión

### ❌ GitHub Actions falla

1. Ve a: https://github.com/TU_USUARIO/enrutapp-backend/actions
2. Revisa los logs del workflow
3. Verifica que el Dockerfile esté en la raíz

---

## 📞 **Recursos de Ayuda**

- 📚 Docs Azure: https://docs.microsoft.com/azure
- 💬 Stack Overflow: https://stackoverflow.com/questions/tagged/azure
- 🎓 Azure Students: https://azure.microsoft.com/es-es/free/students/

---

**¡Éxito con tu deploy! 🚀**

Si tienes algún problema, revisa la guía completa en: `azure-deploy.md`
