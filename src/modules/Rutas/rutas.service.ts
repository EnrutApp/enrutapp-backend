import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@Injectable()
export class RutasService {
  private readonly logger = new Logger(RutasService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    try {
      // Tomar el tiempo desde 'tiempo' o 'tiempoEstimado'
      const tiempoEstimado = data.tiempo || data.tiempoEstimado || null;

      this.logger.log(
        `Creando nueva ruta de ${data.idOrigen} a ${data.idDestino}`,
      );

      const rutaData: any = {
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
      };

      if (data.paradas && Array.isArray(data.paradas) && data.paradas.length > 0) {
        rutaData.paradas = {
          create: data.paradas.map((idUbicacion: string, index: number) => ({
            idUbicacion,
            orden: index + 1,
          })),
        };
      }

      return this.prisma.ruta.create({
        data: rutaData,
        include: {
          origen: { include: { ubicacion: true } },
          destino: { include: { ubicacion: true } },
          paradas: {
            include: { ubicacion: true },
            orderBy: { orden: 'asc' },
          },
        },
      });
    } catch (error) {
      this.logger.error('Error al crear ruta', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.ruta.findMany({
      include: {
        origen: { include: { ubicacion: true } },
        destino: { include: { ubicacion: true } },
        paradas: {
          include: { ubicacion: true },
          orderBy: { orden: 'asc' },
        },
      },
    });
  }

  async findOne(idRuta: string) {
    return this.prisma.ruta.findUnique({
      where: { idRuta },
      include: {
        origen: { include: { ubicacion: true } },
        destino: { include: { ubicacion: true } },
        paradas: {
          include: { ubicacion: true },
          orderBy: { orden: 'asc' },
        },
      },
    });
  }

  async update(idRuta: string, data: UpdateRutaDto & { paradas?: string[] }) {
    const updateData: any = {
      ...data,
    };

    // Si vienen paradas, actualizamos la relación (borrar anteriores y crear nuevas)
    if (data.paradas && Array.isArray(data.paradas)) {
      updateData.paradas = {
        deleteMany: {}, // Borrar existentes
        create: data.paradas.map((idUbicacion: string, index: number) => ({
          idUbicacion,
          orden: index + 1,
        })),
      };
    }
    
    // Convertir decimales si vienen en el update
    if (data.distancia) updateData.distancia = parseFloat(data.distancia.toString());
    if (data.precioBase) updateData.precioBase = parseFloat(data.precioBase.toString());

    return this.prisma.ruta.update({
      where: { idRuta },
      data: updateData,
       include: {
        origen: { include: { ubicacion: true } },
        destino: { include: { ubicacion: true } },
        paradas: {
          include: { ubicacion: true },
          orderBy: { orden: 'asc' },
        },
      },
    });
  }

  async remove(idRuta: string) {
    return this.prisma.ruta.delete({ where: { idRuta } });
  }

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
    // 1. Obtener ubicaciones de la tabla nueva
    const ubicaciones = await this.prisma.ubicacion.findMany({
      orderBy: { nombreUbicacion: 'asc' },
    });

    return ubicaciones;
  }

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

  async findOrigenByUbicacion(idUbicacion: string) {
    return this.prisma.origen.findFirst({
      where: { idUbicacion },
      include: { ubicacion: true },
    });
  }

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

  async findDestinoByUbicacion(idUbicacion: string) {
    return this.prisma.destino.findFirst({
      where: { idUbicacion },
      include: { ubicacion: true },
    });
  }
}
