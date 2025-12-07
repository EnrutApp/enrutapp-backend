import { Injectable, Logger } from '@nestjs/common';
import { DriverLocation, DriverConnection } from './interfaces';

/**
 * Servicio para gestionar el tracking de conductores
 * Almacena las ubicaciones en memoria (en producción usar Redis)
 */
@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  // Almacenamiento en memoria de ubicaciones de conductores
  private driverLocations: Map<string, DriverLocation> = new Map();

  // Almacenamiento de conexiones activas
  private driverConnections: Map<string, DriverConnection> = new Map();

  /**
   * Registra la conexión de un conductor
   */
  registerConnection(driverId: string, socketId: string): void {
    const connection: DriverConnection = {
      driverId,
      socketId,
      connectedAt: new Date(),
      lastUpdate: new Date(),
    };
    this.driverConnections.set(driverId, connection);
    this.logger.log(`🚗 Conductor ${driverId} conectado (socket: ${socketId})`);
  }

  /**
   * Elimina la conexión de un conductor
   */
  removeConnection(socketId: string): string | null {
    for (const [driverId, connection] of this.driverConnections.entries()) {
      if (connection.socketId === socketId) {
        this.driverConnections.delete(driverId);
        // Marcar la ubicación como offline
        const location = this.driverLocations.get(driverId);
        if (location) {
          location.isOnline = false;
          this.driverLocations.set(driverId, location);
        }
        this.logger.log(`🚗 Conductor ${driverId} desconectado`);
        return driverId;
      }
    }
    return null;
  }

  /**
   * Actualiza la ubicación de un conductor
   */
  updateLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    socketId: string,
    heading?: number,
    speed?: number,
  ): DriverLocation {
    const location: DriverLocation = {
      driverId,
      latitude,
      longitude,
      heading,
      speed,
      timestamp: new Date(),
      socketId,
      isOnline: true,
    };

    this.driverLocations.set(driverId, location);

    // Actualizar timestamp de la conexión
    const connection = this.driverConnections.get(driverId);
    if (connection) {
      connection.lastUpdate = new Date();
      this.driverConnections.set(driverId, connection);
    }

    this.logger.debug(
      `📍 Conductor ${driverId}: lat=${latitude.toFixed(6)}, lng=${longitude.toFixed(6)}`,
    );

    return location;
  }

  /**
   * Obtiene la ubicación de un conductor específico
   */
  getDriverLocation(driverId: string): DriverLocation | null {
    return this.driverLocations.get(driverId) || null;
  }

  /**
   * Obtiene todas las ubicaciones de conductores online
   */
  getAllOnlineDrivers(): DriverLocation[] {
    const onlineDrivers: DriverLocation[] = [];
    for (const location of this.driverLocations.values()) {
      if (location.isOnline) {
        onlineDrivers.push(location);
      }
    }
    return onlineDrivers;
  }

  /**
   * Verifica si un conductor está conectado
   */
  isDriverOnline(driverId: string): boolean {
    const location = this.driverLocations.get(driverId);
    return location?.isOnline ?? false;
  }

  /**
   * Obtiene estadísticas del tracking
   */
  getStats() {
    return {
      totalConnections: this.driverConnections.size,
      onlineDrivers: this.getAllOnlineDrivers().length,
      totalTracked: this.driverLocations.size,
    };
  }
}
