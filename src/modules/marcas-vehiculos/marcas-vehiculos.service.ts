import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateMarcaVehiculoDto, UpdateMarcaVehiculoDto } from './dto';

// Interfaz para errores de Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

/**
 * Servicio de Marcas de Vehículos
 * Contiene toda la lógica de negocio relacionada con marcas de vehículos
 */
@Injectable()
export class MarcasVehiculosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las marcas de vehículos con sus vehículos asociados
   */
  async findAll() {
    try {
      const marcasVehiculos = await this.prisma.marcasVehiculos.findMany({
        include: {
          vehiculos: true,
        },
        orderBy: {
          nombreMarca: 'asc',
        },
      });

      return {
        success: true,
        data: marcasVehiculos,
        message: 'Marcas de vehículos obtenidas exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener marcas de vehículos',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene una marca de vehículo por su ID
   */
  async findOne(id: string) {
    try {
      const marcaVehiculo = await this.prisma.marcasVehiculos.findUnique({
        where: { idMarcaVehiculo: id },
        include: {
          vehiculos: true,
        },
      });

      if (!marcaVehiculo) {
        throw new HttpException(
          {
            success: false,
            error: 'Marca de vehículo no encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: marcaVehiculo,
        message: 'Marca de vehículo encontrada',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al buscar marca de vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea una nueva marca de vehículo
   */
  async create(createMarcaVehiculoDto: CreateMarcaVehiculoDto) {
    try {
      // Preparar datos
      const data = {
        idMarcaVehiculo: createMarcaVehiculoDto.idMarcaVehiculo || uuidv4(),
        nombreMarca: createMarcaVehiculoDto.nombreMarca,
        pais: createMarcaVehiculoDto.pais || null,
        estado:
          typeof createMarcaVehiculoDto.estado === 'boolean'
            ? createMarcaVehiculoDto.estado
            : true,
      };

      const nuevaMarcaVehiculo = await this.prisma.marcasVehiculos.create({
        data,
      });

      return {
        success: true,
        data: nuevaMarcaVehiculo,
        message: 'Marca de vehículo creada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Error de duplicado
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new HttpException(
          {
            success: false,
            error: 'El nombre de la marca ya existe',
          },
          HttpStatus.CONFLICT,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear marca de vehículo',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza una marca de vehículo existente
   */
  async update(id: string, updateMarcaVehiculoDto: UpdateMarcaVehiculoDto) {
    try {
      const existente = await this.prisma.marcasVehiculos.findUnique({
        where: { idMarcaVehiculo: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Marca de vehículo no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }

      const marcaVehiculoActualizada = await this.prisma.marcasVehiculos.update(
        {
          where: { idMarcaVehiculo: id },
          data: updateMarcaVehiculoDto,
        },
      );

      return {
        success: true,
        data: marcaVehiculoActualizada,
        message: 'Marca de vehículo actualizada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new HttpException(
          { success: false, error: 'Nombre de marca duplicado' },
          HttpStatus.CONFLICT,
        );
      }
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Marca de vehículo no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar marca de vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina una marca de vehículo
   * No permite eliminar si tiene vehículos asociados
   */
  async remove(id: string) {
    try {
      const existente = await this.prisma.marcasVehiculos.findUnique({
        where: { idMarcaVehiculo: id },
        include: { vehiculos: true },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Marca de vehículo no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar que no tenga vehículos asociados
      if (existente.vehiculos && existente.vehiculos.length > 0) {
        throw new HttpException(
          {
            success: false,
            error: 'No se puede eliminar una marca con vehículos asociados',
          },
          HttpStatus.CONFLICT,
        );
      }

      await this.prisma.marcasVehiculos.delete({
        where: { idMarcaVehiculo: id },
      });

      return {
        success: true,
        message: 'Marca de vehículo eliminada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Marca de vehículo no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al eliminar marca de vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
