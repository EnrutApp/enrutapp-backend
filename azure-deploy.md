# 🚀 Guía de Deploy: EnrutApp Backend en Azure

Esta guía te llevará paso a paso para desplegar tu backend de EnrutApp en Azure App Service usando GitHub Student Pack.

---

## 📋 **Prerequisitos**

- ✅ Cuenta de Azure for Students activada
- ✅ Repositorio de GitHub con tu código
- ✅ Git instalado localmente

---

## 🎯 **PASO 1: Activar Azure for Students**

1. Ve a: https://azure.microsoft.com/es-es/free/students/
2. Haz clic en **"Activar ahora"**
3. Inicia sesión con tu correo institucional (.edu o similar)
4. Verifica tu identidad de estudiante
5. ✅ Recibirás $100 de crédito + servicios gratuitos

---

## 🗄️ **PASO 2: Crear Base de Datos MySQL**

### 2.1 Ir al Portal de Azure

1. Ve a: https://portal.azure.com
2. Inicia sesión con tu cuenta de estudiante

### 2.2 Crear Azure Database for MySQL

1. En el buscador superior, escribe: **"Azure Database for MySQL"**
2. Haz clic en **"+ Crear"**
3. Selecciona **"Servidor flexible"** (más económico)

### 2.3 Configuración del servidor

```
Grupo de recursos: Crear nuevo → "enrutapp-resources"
Nombre del servidor: "enrutapp-mysql-server" (debe ser único globalmente)
Región: "East US" o la más cercana a ti
Versión de MySQL: 8.0
Proceso y almacenamiento: "Burstable, B1ms" (1 vCore, 2GB RAM) ← IMPORTANTE para ahorrar créditos
```

### 2.4 Autenticación

```
Nombre de usuario administrador: enrutapp_admin
Contraseña: [Crea una contraseña fuerte y guárdala]
```

### 2.5 Redes

```
☑️ Permitir acceso público desde cualquier servicio de Azure
☑️ Agregar dirección IP del cliente actual
```

### 2.6 Crear

1. Haz clic en **"Revisar y crear"**
2. Espera 5-10 minutos mientras se crea

### 2.7 Crear la base de datos

1. Una vez creado el servidor, ve a **"Bases de datos"**
2. Haz clic en **"+ Agregar"**
3. Nombre: `enrutapp_db`
4. Conjunto de caracteres: `utf8mb4`
5. Intercalación: `utf8mb4_unicode_ci`

### 2.8 Obtener cadena de conexión

1. Ve a **"Cadenas de conexión"** en el menú lateral
2. Copia la cadena de conexión de **Node.js**
3. Debería verse así:

```
mysql://enrutapp_admin@enrutapp-mysql-server:TU_CONTRASEÑA@enrutapp-mysql-server.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED
```

---

## 🌐 **PASO 3: Crear App Service (Backend)**

### 3.1 Crear Web App

1. En el buscador, escribe: **"App Services"**
2. Haz clic en **"+ Crear"** → **"Aplicación web"**

### 3.2 Configuración básica

```
Grupo de recursos: "enrutapp-resources" (el mismo de antes)
Nombre: "enrutapp-backend" (será tu URL: enrutapp-backend.azurewebsites.net)
Publicar: "Contenedor"
Sistema operativo: "Linux"
Región: "East US" (la misma que la base de datos)
```

### 3.3 Plan de App Service

```
Plan de Linux: Crear nuevo → "enrutapp-plan"
Plan de tarifa: "B1 Basic" (1.75GB RAM) ← Gratis con créditos de estudiante
```

### 3.4 Contenedor

```
Origen de la imagen: "GitHub Actions" ← IMPORTANTE
```

### 3.5 Crear

1. Haz clic en **"Revisar y crear"**
2. Haz clic en **"Crear"**
3. Espera 2-3 minutos

---

## 🔧 **PASO 4: Configurar Variables de Entorno**

### 4.1 Ir a Configuración

1. Ve a tu App Service recién creado
2. En el menú lateral, busca **"Configuración"**
3. Haz clic en **"Configuración de la aplicación"**

### 4.2 Agregar variables de entorno

Haz clic en **"+ Nueva configuración de aplicación"** para cada una:

```bash
# Base de datos
DATABASE_URL = mysql://enrutapp_admin@enrutapp-mysql-server:TU_CONTRASEÑA@enrutapp-mysql-server.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED

# JWT (genera uno nuevo con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET = [GENERA_UN_SECRET_FUERTE_AQUI]
JWT_EXPIRES_IN = 24h

# Servidor
NODE_ENV = production
PORT = 8080

# SMTP (opcional por ahora, puedes configurarlo después)
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = tu-email@gmail.com
SMTP_PASS = tu-contraseña-de-aplicacion
SMTP_FROM = EnrutApp <noreply@enrutapp.com>

# CORS (URL de tu frontend, por ahora usa *)
FRONTEND_URL = *
```

### 4.3 Guardar

1. Haz clic en **"Guardar"** arriba
2. Confirma el reinicio de la aplicación

---

## 🔗 **PASO 5: Conectar con GitHub**

### 5.1 Subir código a GitHub

Si aún no lo has hecho:

```bash
cd /Users/haderrenteria/Documents/Proyectos/enrutapp/enrutapp-backend
git add .
git commit -m "Preparar para deploy en Azure"
git push origin main
```

### 5.2 Configurar GitHub Actions en Azure

1. En tu App Service, ve a **"Centro de implementación"**
2. Origen: **"GitHub"**
3. Haz clic en **"Autorizar"** y permite el acceso
4. Selecciona:
   - Organización: Tu usuario de GitHub
   - Repositorio: `enrutapp-backend`
   - Rama: `main`
5. Tipo de compilación: **"Dockerfile"**
6. Ruta del Dockerfile: `/Dockerfile`
7. Haz clic en **"Guardar"**

### 5.3 Azure creará automáticamente

- ✅ Un archivo `.github/workflows/azure-deploy.yml` en tu repo
- ✅ Secretos de GitHub para autenticación
- ✅ Iniciará el primer deploy automáticamente

---

## 🚀 **PASO 6: Ejecutar Migraciones de Prisma**

### 6.1 Opción A: Desde tu computadora (Recomendado)

```bash
# 1. Crear archivo .env.production con la DATABASE_URL de Azure
echo 'DATABASE_URL="mysql://enrutapp_admin@enrutapp-mysql-server:TU_CONTRASEÑA@enrutapp-mysql-server.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED"' > .env.production

# 2. Ejecutar migraciones
npx dotenv -e .env.production -- npx prisma migrate deploy

# 3. (Opcional) Ejecutar seeds
npx dotenv -e .env.production -- npm run seed
```

### 6.2 Opción B: Desde Azure Cloud Shell

1. En Azure Portal, haz clic en el icono de **Cloud Shell** (>\_) arriba a la derecha
2. Ejecuta:

```bash
# Clonar tu repo
git clone https://github.com/TU_USUARIO/enrutapp-backend.git
cd enrutapp-backend

# Instalar dependencias
npm install

# Configurar DATABASE_URL
export DATABASE_URL="mysql://enrutapp_admin@enrutapp-mysql-server:TU_CONTRASEÑA@enrutapp-mysql-server.mysql.database.azure.com:3306/enrutapp_db?ssl-mode=REQUIRED"

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Ejecutar seeds
npm run seed
```

---

## ✅ **PASO 7: Verificar el Deploy**

### 7.1 Monitorear el deploy

1. Ve a **"Centro de implementación"** en tu App Service
2. Verás el progreso del deploy de GitHub Actions
3. Espera 5-10 minutos para el primer deploy

### 7.2 Verificar logs

1. Ve a **"Registros de App Service"** en el menú lateral
2. Activa **"Registro de aplicaciones (sistema de archivos)"**
3. Ve a **"Secuencia de registro"** para ver logs en tiempo real

### 7.3 Probar la API

1. Tu URL será: `https://enrutapp-backend.azurewebsites.net`
2. Prueba estos endpoints:
   - `https://enrutapp-backend.azurewebsites.net/api` → Debe responder
   - `https://enrutapp-backend.azurewebsites.net/api/docs` → Swagger UI
   - `https://enrutapp-backend.azurewebsites.net/api/ciudades` → Lista de ciudades

---

## 🎉 **¡LISTO! Tu API está en producción**

### URLs importantes:

- 🌐 API Base: `https://enrutapp-backend.azurewebsites.net/api`
- 📚 Documentación: `https://enrutapp-backend.azurewebsites.net/api/docs`
- 🔧 Portal Azure: https://portal.azure.com

---

## 🔄 **Deploys Automáticos**

Ahora cada vez que hagas `git push` a la rama `main`:

1. ✅ GitHub Actions se ejecutará automáticamente
2. ✅ Construirá la imagen Docker
3. ✅ La desplegará en Azure
4. ✅ Tu API se actualizará (tarda ~5 minutos)

---

## 💰 **Monitorear Costos**

### Configurar alertas de presupuesto:

1. En Azure Portal, busca **"Cost Management + Billing"**
2. Ve a **"Budgets"**
3. Haz clic en **"+ Add"**
4. Configura alertas en $10, $25, $50, $75

### Costos estimados con plan B1:

- App Service B1: ~$13/mes
- MySQL Flexible B1ms: ~$12/mes
- **Total: ~$25/mes** (cubierto por tus $100 de crédito = 4 meses gratis)

---

## 🛠️ **Comandos Útiles**

### Ver logs en tiempo real:

```bash
az webapp log tail --name enrutapp-backend --resource-group enrutapp-resources
```

### Reiniciar la aplicación:

```bash
az webapp restart --name enrutapp-backend --resource-group enrutapp-resources
```

### Ver variables de entorno:

```bash
az webapp config appsettings list --name enrutapp-backend --resource-group enrutapp-resources
```

---

## 🆘 **Solución de Problemas**

### La aplicación no inicia:

1. Verifica logs en **"Secuencia de registro"**
2. Revisa que `DATABASE_URL` esté correcta
3. Verifica que el puerto sea `8080`

### Error de conexión a MySQL:

1. Ve a MySQL Server → **"Redes"**
2. Asegúrate de tener activado: **"Permitir acceso a servicios de Azure"**
3. Verifica que la cadena de conexión tenga `?ssl-mode=REQUIRED`

### GitHub Actions falla:

1. Ve a tu repositorio en GitHub → **"Actions"**
2. Revisa los logs del workflow
3. Verifica que el Dockerfile esté en la raíz del proyecto

---

## 📞 **Soporte**

Si tienes problemas:

1. 📚 Documentación Azure: https://docs.microsoft.com/azure
2. 💬 Stack Overflow: https://stackoverflow.com/questions/tagged/azure
3. 🎓 Azure for Students: https://azure.microsoft.com/es-es/free/students/

---

**¡Éxito con tu deploy! 🚀**
