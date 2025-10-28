import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUbicacionDto) {
    return this.prisma.ubicaciones.create({ data });
  }

  async findAll() {
    return this.prisma.ubicaciones.findMany({
      where: { estado: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const ubicacion = await this.prisma.ubicaciones.findUnique({
      where: { id },
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }

    return ubicacion;
  }

  async update(id: number, data: UpdateUbicacionDto) {
    // Verificar que existe
    await this.findOne(id);

    return this.prisma.ubicaciones.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    // Verificar que existe
    await this.findOne(id);

    // Soft delete (cambiar estado a false en lugar de eliminar)
    return this.prisma.ubicaciones.update({
      where: { id },
      data: { estado: false },
    });
  }
}
