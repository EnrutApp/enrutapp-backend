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
   * Crea una nueva ciudad
   */
  async create(createCiudadDto: any) {
    try {
      const ciudad = await this.prisma.ciudades.create({
        data: {
          nombreCiudad: createCiudadDto.nombreCiudad,
        },
      });

      return {
        success: true,
        data: ciudad,
        message: 'Ciudad creada exitosamente',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear ciudad',
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
