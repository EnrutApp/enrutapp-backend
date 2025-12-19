import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEncomiendaDto } from './dto/create-encomienda.dto';

@Injectable()
export class EncomiendasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEncomiendaDto: CreateEncomiendaDto) {
    try {
      // Verificar Turno
      const turno = await this.prisma.turnos.findUnique({
        where: { idTurno: createEncomiendaDto.idTurno },
      });

      if (!turno) {
        throw new HttpException('Turno no encontrado', HttpStatus.NOT_FOUND);
      }

      // Generar Guía (ENC-XXXXXX)
      const uniqueSuffix = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      const guia = `ENC-${uniqueSuffix}${random}`; // E.g., ENC-123456789

      const encomienda = await this.prisma.encomiendas.create({
        data: {
          ...createEncomiendaDto,
          guia,
          estado: createEncomiendaDto.estado || 'Pendiente',
        },
      });

      return encomienda;
    } catch {
      throw new HttpException(
        'Error al crear encomienda',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByTurno(idTurno: string) {
    return this.prisma.encomiendas.findMany({
      where: { idTurno },
    });
  }

  async updateEstado(id: string, estado: string) {
    return this.prisma.encomiendas.update({
      where: { idEncomienda: id },
      data: { estado },
    });
  }
}
