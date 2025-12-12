# 🚗 Tracking GPS en Tiempo Real - EnrutApp

## Descripción

Sistema de tracking GPS en tiempo real para conductores. Permite ver la ubicación de los conductores desde el panel de administración web y compartir su ubicación desde la app móvil.

## Arquitectura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   App Móvil     │ ◄─────► │    Backend      │ ◄─────► │   Frontend Web  │
│  (Conductor)    │ Socket  │   (NestJS)      │ Socket  │   (Admin)       │
│                 │  .io    │                 │  .io    │                 │
│ - GPS Location  │         │ - WebSocket     │         │ - Mapa Mapbox   │
│ - expo-location │         │   Gateway       │         │ - Tracking UI   │
│ - react-native  │         │ - Tracking      │         │                 │
│   -maps         │         │   Service       │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Componentes Creados

### Backend (NestJS)

- `src/modules/tracking/tracking.module.ts` - Módulo principal
- `src/modules/tracking/tracking.gateway.ts` - WebSocket Gateway con Socket.io
- `src/modules/tracking/tracking.service.ts` - Servicio de gestión de ubicaciones
- `src/modules/tracking/dto/update-location.dto.ts` - DTO de validación
- `src/modules/tracking/interfaces/driver-location.interface.ts` - Interfaces TypeScript

### Mobile (React Native/Expo)

- `components/tracking/DriverMapScreen.tsx` - Pantalla de mapa del conductor
- `hooks/useLocation.ts` - Hook para manejo de ubicación GPS
- `services/socketService.ts` - Cliente Socket.io
- `app/(tabs)/tracking.tsx` - Tab de tracking

### Frontend Web (React)

- `features/tracking/TrackingPage.jsx` - Página principal de tracking
- `features/tracking/components/DriverTrackingMap.jsx` - Componente de mapa
- `features/tracking/components/DriverTrackingModal.jsx` - Modal de ubicación
- `shared/services/socketService.js` - Cliente Socket.io
- `shared/hooks/useDriverTracking.js` - Hook de tracking

## Configuración

### 1. Backend

Las dependencias ya están instaladas:

```bash
cd enrutapp-backend
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

El módulo de tracking ya está registrado en `app.module.ts`.

### 2. Mobile

Las dependencias ya están instaladas:

```bash
cd enrutapp-mobile
npx expo install react-native-maps expo-location socket.io-client
```

**IMPORTANTE**: Para que funcionen los mapas de Google, necesitas:

1. Obtener una API key de Google Cloud Console
2. Habilitar la API de Google Maps
3. Reemplazar en `app.json`:
   - `YOUR_GOOGLE_MAPS_API_KEY_IOS`
   - `YOUR_GOOGLE_MAPS_API_KEY_ANDROID`

### 3. Frontend Web

Las dependencias ya están instaladas:

```bash
cd enrutapp-frontend
npm install socket.io-client
```

## Uso

### Iniciar Backend

```bash
cd enrutapp-backend
npm run start:dev
```

El servidor WebSocket estará disponible en:

- `ws://localhost:3000/tracking`

### Iniciar App Móvil

```bash
cd enrutapp-mobile
npm start
```

El conductor verá:

- Un mapa con su ubicación actual
- Estado de conexión al servidor
- Contador de actualizaciones enviadas
- Botones para centrar mapa y toggle tracking

### Iniciar Frontend Web

```bash
cd enrutapp-frontend
npm run dev
```

El administrador puede:

- Acceder a `/admin/tracking` para ver todos los conductores
- Ver ubicación en tiempo real desde el perfil del conductor

## Eventos WebSocket

### Cliente → Servidor

| Evento                  | Payload                                               | Descripción                |
| ----------------------- | ----------------------------------------------------- | -------------------------- |
| `registerDriver`        | `{ driverId: number }`                                | Registrar conductor        |
| `updateLocation`        | `{ driverId, latitude, longitude, heading?, speed? }` | Actualizar ubicación       |
| `subscribeToDriver`     | `{ driverId: number }`                                | Suscribirse a un conductor |
| `unsubscribeFromDriver` | `{ driverId: number }`                                | Desuscribirse              |
| `getOnlineDrivers`      | -                                                     | Obtener conductores online |
| `getDriverLocation`     | `{ driverId: number }`                                | Obtener última ubicación   |

### Servidor → Cliente

| Evento                 | Payload                               | Descripción              |
| ---------------------- | ------------------------------------- | ------------------------ |
| `locationUpdate`       | `DriverLocation`                      | Broadcast de ubicación   |
| `driverLocationUpdate` | `DriverLocation`                      | Actualización específica |
| `driverOnline`         | `{ driverId: number }`                | Conductor conectado      |
| `driverOffline`        | `{ driverId: number }`                | Conductor desconectado   |
| `stats`                | `{ totalConnections, onlineDrivers }` | Estadísticas             |

## Configuración de Variables de Entorno

### Backend (.env)

```env
PORT=3000
FRONTEND_URL=http://localhost:5173,http://localhost:3001
```

### Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Para dispositivos físicos, usar la IP de tu máquina:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=tu_token_mapbox
```

## Notas de Producción

1. **Redis**: En producción, considera usar Redis para almacenar ubicaciones en lugar de memoria
2. **CORS**: Configura correctamente los orígenes permitidos en el gateway
3. **Autenticación**: Implementar verificación de JWT en las conexiones WebSocket
4. **Rate Limiting**: Limitar la frecuencia de actualizaciones de ubicación
5. **Persistencia**: Guardar historial de ubicaciones en base de datos

## Troubleshooting

### "Conectando al servidor de tracking..." (Frontend Web)

1. **Verificar que el backend esté corriendo**:
   ```bash
   cd enrutapp-backend
   npm run start:dev
   ```
   Debe mostrar "🚀 Tracking Gateway inicializado" en los logs.

2. **Verificar la URL del socket**:
   - El frontend debe conectar a `http://localhost:3000/tracking`
   - Revisa la consola del navegador para ver errores de conexión

3. **CORS**: El gateway está configurado para aceptar cualquier origen en desarrollo

### "GPS Inactivo" o "kCLErrorDomain" (Simulador iOS)

Este error es normal en el **simulador de iOS** porque no tiene GPS físico.

**Solución para simulador**:
1. En el simulador de iOS, ve a: **Features > Location > Apple** (o Custom Location)
2. Esto simula una ubicación GPS

**En dispositivo físico**: Funciona automáticamente.

### "Socket no conectado" (Mobile)

- En **Android Emulator**: Usar `http://10.0.2.2:3000`
- En **iOS Simulator**: Usar `http://localhost:3000`
- En **dispositivo físico**: Usar la IP de tu máquina: `http://192.168.1.X:3000`

Configura en `.env`:
```env
EXPO_PUBLIC_API_URL=http://TU_IP:3000/api
```

### "Permisos de ubicación denegados"

- En iOS: Ir a Configuración > Privacidad > Servicios de ubicación
- En Android: Ir a Configuración > Apps > EnrutApp > Permisos

### "Mapa no carga"

- Verificar API key de Google Maps en `app.json`
- Verificar token de Mapbox en el frontend
