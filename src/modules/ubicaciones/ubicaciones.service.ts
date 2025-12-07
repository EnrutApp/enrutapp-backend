import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class UbicacionesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUbicacionDto) {
    if (!data.nombreUbicacion || !data.direccion) {
      throw new BadRequestException('Nombre de ubicación y dirección son obligatorios');
    }

    return this.prisma.ubicacion.create({
      data: {
        nombreUbicacion: data.nombreUbicacion,
        direccion: data.direccion,
        latitud: data.latitud !== undefined ? new Decimal(data.latitud.toString()) : null,
        longitud: data.longitud !== undefined ? new Decimal(data.longitud.toString()) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.ubicacion.findMany({
      include: {
        origenes: true,
        destinos: true,
      },
    });
  }

  async findOne(id: string) {
    const ubicacion = await this.prisma.ubicacion.findUnique({
      where: { idUbicacion: id },
      include: {
        origenes: true,
        destinos: true,
      },
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }

    return ubicacion;
  }

  async update(id: string, data: UpdateUbicacionDto) {
    await this.findOne(id);

    const updateData: any = {};
    
    if (data.nombreUbicacion !== undefined) {
      updateData.nombreUbicacion = data.nombreUbicacion;
    }
    
    if (data.direccion !== undefined) {
      updateData.direccion = data.direccion;
    }
    
    if (data.latitud !== undefined) {
      updateData.latitud = new Decimal(data.latitud.toString());
    }
    
    if (data.longitud !== undefined) {
      updateData.longitud = new Decimal(data.longitud.toString());
    }

    return this.prisma.ubicacion.update({
      where: { idUbicacion: id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.ubicacion.delete({
      where: { idUbicacion: id },
    });
  }
}