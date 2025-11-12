import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateTurnoDto, UpdateTurnoDto } from './dto/index';

/**
 * Interfaz para errores de Prisma
 */
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

/**
 * Servicio de Turnos
 * Contiene toda la lógica de negocio relacionada con turnos
 */
@Injectable()
export class TurnosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los turnos con sus relaciones
   */
  async findAll() {
    try {
      const turnos = await this.prisma.turnos.findMany({
        include: {
          conductor: true,
          vehiculo: {
            include: {
              tipoVehiculo: true,
              marcaVehiculo: true,
            },
          },
        },
        orderBy: {
          fecha: 'desc',
        },
      });

      return {
        success: true,
        data: turnos,
        message: 'Turnos obtenidos exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener turnos',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene un turno por su ID
   */
  async findOne(id: string) {
    try {
      const turno = await this.prisma.turnos.findUnique({
        where: { idTurno: id },
        include: {
          conductor: true,
          vehiculo: {
            include: {
              tipoVehiculo: true,
              marcaVehiculo: true,
            },
          },
        },
      });

      if (!turno) {
        throw new HttpException(
          {
            success: false,
            error: 'Turno no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: turno,
        message: 'Turno encontrado',
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
          error: 'Error al buscar turno',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea un nuevo turno
   */
  async create(createTurnoDto: CreateTurnoDto) {
    try {
      // Verificar que exista el conductor
      const conductor = await this.prisma.conductores.findUnique({
        where: { idConductor: createTurnoDto.idConductor },
      });

      if (!conductor) {
        throw new HttpException(
          {
            success: false,
            error: 'El conductor especificado no existe',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar que el conductor esté activo
      if (!conductor.estado) {
        throw new HttpException(
          {
            success: false,
            error: 'El conductor especificado está inactivo',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar que exista el vehículo
      const vehiculo = await this.prisma.vehiculos.findUnique({
        where: { idVehiculo: createTurnoDto.idVehiculo },
      });

      if (!vehiculo) {
        throw new HttpException(
          {
            success: false,
            error: 'El vehículo especificado no existe',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar que el vehículo esté activo
      if (!vehiculo.estado) {
        throw new HttpException(
          {
            success: false,
            error: 'El vehículo especificado está inactivo',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Preparar datos
      const data = {
        idTurno: createTurnoDto.idTurno || uuidv4(),
        idConductor: createTurnoDto.idConductor,
        idVehiculo: createTurnoDto.idVehiculo,
        fecha: new Date(createTurnoDto.fecha),
        hora: createTurnoDto.hora,
        estado: createTurnoDto.estado || 'Programado',
      };

      const nuevoTurno = await this.prisma.turnos.create({
        data,
        include: {
          conductor: true,
          vehiculo: {
            include: {
              tipoVehiculo: true,
              marcaVehiculo: true,
            },
          },
        },
      });

      return {
        success: true,
        data: nuevoTurno,
        message: 'Turno creado exitosamente',
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
          error: 'Error al crear turno',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza un turno existente
   */
  async update(id: string, updateTurnoDto: UpdateTurnoDto) {
    try {
      const existente = await this.prisma.turnos.findUnique({
        where: { idTurno: id },
      });

      if (!existente) {
        throw new HttpException(
          {
            success: false,
            error: 'Turno no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar conductor si se está actualizando
      if (updateTurnoDto.idConductor) {
        const conductor = await this.prisma.conductores.findUnique({
          where: { idConductor: updateTurnoDto.idConductor },
        });

        if (!conductor) {
          throw new HttpException(
            {
              success: false,
              error: 'El conductor especificado no existe',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!conductor.estado) {
          throw new HttpException(
            {
              success: false,
              error: 'El conductor especificado está inactivo',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Verificar vehículo si se está actualizando
      if (updateTurnoDto.idVehiculo) {
        const vehiculo = await this.prisma.vehiculos.findUnique({
          where: { idVehiculo: updateTurnoDto.idVehiculo },
        });

        if (!vehiculo) {
          throw new HttpException(
            {
              success: false,
              error: 'El vehículo especificado no existe',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!vehiculo.estado) {
          throw new HttpException(
            {
              success: false,
              error: 'El vehículo especificado está inactivo',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Preparar datos para actualización
      const data: Record<string, unknown> = { ...updateTurnoDto };

      if (data.fecha && typeof data.fecha === 'string') {
        data.fecha = new Date(data.fecha);
      }

      const turnoActualizado = await this.prisma.turnos.update({
        where: { idTurno: id },
        data,
        include: {
          conductor: true,
          vehiculo: {
            include: {
              tipoVehiculo: true,
              marcaVehiculo: true,
            },
          },
        },
      });

      return {
        success: true,
        data: turnoActualizado,
        message: 'Turno actualizado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          {
            success: false,
            error: 'Turno no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar turno',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina un turno
   */
  async remove(id: string) {
    try {
      const existente = await this.prisma.turnos.findUnique({
        where: { idTurno: id },
      });

      if (!existente) {
        throw new HttpException(
          {
            success: false,
            error: 'Turno no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.turnos.delete({
        where: { idTurno: id },
      });

      return {
        success: true,
        message: 'Turno eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          {
            success: false,
            error: 'Turno no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al eliminar turno',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
