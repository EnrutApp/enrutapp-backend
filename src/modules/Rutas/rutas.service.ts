import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@Injectable()
export class RutasService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== RUTAS =====
  async create(data: any) {
    try {
      // Tomar el tiempo desde 'tiempo' o 'tiempoEstimado'
      const tiempoEstimado = data.tiempo || data.tiempoEstimado || null;

      console.log('Datos recibidos para crear ruta:', {
        idOrigen: data.idOrigen,
        idDestino: data.idDestino,
        distancia: data.distancia,
        precioBase: data.precioBase,
        tiempoEstimado,
        estado: data.estado,
        observaciones: data.observaciones,
      });

      return this.prisma.ruta.create({
        data: {
          idOrigen: data.idOrigen,
          idDestino: data.idDestino,
          distancia: data.distancia
            ? parseFloat(data.distancia.toString())
            : null,
          precioBase: data.precioBase
            ? parseFloat(data.precioBase.toString())
            : null,
          tiempoEstimado: tiempoEstimado,
          estado: data.estado || 'Activa',
          observaciones: data.observaciones || null,
        },
        include: {
          origen: { include: { ubicacion: true } },
          destino: { include: { ubicacion: true } },
        },
      });
    } catch (error) {
      console.error('Error detallado al crear ruta:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.ruta.findMany({
      include: {
        origen: { include: { ubicacion: true } },
        destino: { include: { ubicacion: true } },
      },
    });
  }

  async findOne(idRuta: string) {
    return this.prisma.ruta.findUnique({
      where: { idRuta },
      include: {
        origen: { include: { ubicacion: true } },
        destino: { include: { ubicacion: true } },
      },
    });
  }

  async update(idRuta: string, data: UpdateRutaDto) {
    return this.prisma.ruta.update({
      where: { idRuta },
      data,
    });
  }

  async remove(idRuta: string) {
    return this.prisma.ruta.delete({ where: { idRuta } });
  }

  // ===== UBICACIONES =====
  async createUbicacion(data: {
    nombreUbicacion: string;
    direccion: string;
    latitud: number;
    longitud: number;
  }) {
    return this.prisma.ubicacion.create({
      data,
    });
  }

  async findAllUbicaciones() {
    return this.prisma.ubicacion.findMany({
      orderBy: { nombreUbicacion: 'asc' },
    });
  }

  // ===== ORÍGEN =====
  async createOrigen(data: { idUbicacion: string; descripcion?: string }) {
    return this.prisma.origen.create({
      data,
      include: { ubicacion: true },
    });
  }

  async findAllOrigenes() {
    return this.prisma.origen.findMany({
      include: { ubicacion: true },
      orderBy: { ubicacion: { nombreUbicacion: 'asc' } },
    });
  }

  // ===== DESTINO =====
  async createDestino(data: { idUbicacion: string; descripcion?: string }) {
    return this.prisma.destino.create({
      data,
      include: { ubicacion: true },
    });
  }

  async findAllDestinos() {
    return this.prisma.destino.findMany({
      include: { ubicacion: true },
      orderBy: { ubicacion: { nombreUbicacion: 'asc' } },
    });
  }
}
