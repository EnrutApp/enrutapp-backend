import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Servicio de Ciudades
 * Contiene toda la lógica de negocio relacionada con ciudades
 */
@Injectable()
export class CiudadesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las ciudades ordenadas alfabéticamente
   */
  async findAll() {
    try {
      const ciudades = await this.prisma.ciudades.findMany({
        orderBy: { nombreCiudad: 'asc' },
        select: {
          idCiudad: true,
          nombreCiudad: true,
        },
      });

      return {
        success: true,
        data: ciudades,
        message: 'Ciudades obtenidas exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener ciudades',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
