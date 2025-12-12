import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePasajeDto } from './dto/create-pasaje.dto';

@Injectable()
export class PasajesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPasajeDto: CreatePasajeDto) {
    try {
      // 1. Verificar Turno
      const turno = await this.prisma.turnos.findUnique({
        where: { idTurno: createPasajeDto.idTurno },
      });

      if (!turno) {
        throw new HttpException('Turno no encontrado', HttpStatus.NOT_FOUND);
      }

      if (turno.cuposDisponibles <= 0) {
        throw new HttpException(
          'No hay cupos disponibles',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Crear Pasaje y Actualizar Cupos en Transacción
      const result = await this.prisma.$transaction(async (tx) => {
        const pasaje = await tx.pasajes.create({
          data: {
            idTurno: createPasajeDto.idTurno,
            idUsuario: createPasajeDto.idUsuario,
            nombrePasajero: createPasajeDto.nombrePasajero,
            documentoPasajero: createPasajeDto.documentoPasajero,
            asiento: createPasajeDto.asiento,
            precio: createPasajeDto.precio,
            estado: createPasajeDto.estado || 'Reservado',
          },
        });

        await tx.turnos.update({
          where: { idTurno: createPasajeDto.idTurno },
          data: { cuposDisponibles: { decrement: 1 } },
        });

        return pasaje;
      });

      return {
        success: true,
        data: result,
        message: 'Pasaje creado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear pasaje',
          message: error instanceof Error ? error.message : 'Error desconocido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByTurno(idTurno: string) {
    return this.prisma.pasajes.findMany({
      where: { idTurno },
      include: { usuario: true },
    });
  }
}
