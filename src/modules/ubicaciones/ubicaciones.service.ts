import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUbicacionDto) {
    // Validar nombre único (case insensitive)
    const existe = await this.prisma.ubicacion.findFirst({
      where: { 
        nombreUbicacion: {
          equals: data.nombreUbicacion,
          mode: 'insensitive',
        }
      },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe una ubicación con el nombre "${data.nombreUbicacion}"`
      );
    }

    // Asegurar que latitud y longitud sean convertidos a Decimal o manejados correctamente
    return this.prisma.ubicacion.create({
      data: {
        ...data,
        estado: true, // Default active on create
      },
    });
  }

  async findAll() {
    return this.prisma.ubicacion.findMany({
      orderBy: { nombreUbicacion: 'asc' }, // Ordenar por nombre
    });
  }

  async findOne(id: string) {
    const ubicacion = await this.prisma.ubicacion.findUnique({
      where: { idUbicacion: id },
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }

    return ubicacion;
  }

  async update(id: string, data: UpdateUbicacionDto) {
    // Verificar que existe
    await this.findOne(id);

    // Validar nombre único al actualizar (si se cambia el nombre)
    if (data.nombreUbicacion) {
      const existe = await this.prisma.ubicacion.findFirst({
        where: {
          nombreUbicacion: {
            equals: data.nombreUbicacion,
            mode: 'insensitive',
          },
          NOT: { idUbicacion: id }, // Excluir la ubicación actual
        },
      });

      if (existe) {
        throw new ConflictException(
          `Ya existe una ubicación con el nombre "${data.nombreUbicacion}"`
        );
      }
    }

    return this.prisma.ubicacion.update({
      where: { idUbicacion: id },
      data,
    });
  }

  async remove(id: string) {
    // Verificar que existe
    const ubicacion = await this.findOne(id);

    // Verificar si tiene rutas activas antes de eliminar (si está activo)
    if (ubicacion.estado) {
      const rutasActivas = await this.checkRutasActivas(id);
      if (rutasActivas.tieneRutasActivas) {
        throw new ConflictException({
          message: 'La ubicación tiene rutas activas asociadas',
          data: rutasActivas,
        });
      }
    }

    // Hard Delete (gracias a OnDelete: Cascade en el esquema, borrará dependencias)
    return this.prisma.ubicacion.delete({
      where: { idUbicacion: id },
    });
  }

  async checkRutasActivas(id: string) {
    const ubicacion = await this.findOne(id);
    const nombreUbicacion = ubicacion.nombreUbicacion;

    // Buscar rutas donde esta ubicación es el Origen
    const origenes = await this.prisma.origen.findMany({
      where: { idUbicacion: id },
      include: {
        rutasOrigen: {
          include: {
            destino: {
              include: {
                ubicacion: true,
              },
            },
            origen: {
              include: {
                ubicacion: true,
              },
            },
          },
        },
      },
    });

    // Buscar rutas donde esta ubicación es el Destino
    const destinos = await this.prisma.destino.findMany({
      where: { idUbicacion: id },
      include: {
        rutasDestino: {
          include: {
            origen: {
              include: {
                ubicacion: true,
              },
            },
            destino: {
              include: {
                ubicacion: true,
              },
            },
          },
        },
      },
    });

    let rutasActivas: any[] = [];

    // Procesar rutas como Origen
    origenes.forEach((origen) => {
      origen.rutasOrigen.forEach((ruta) => {
        // Filtrar solo rutas activas si existe el campo estado
        // Asumiendo estado !== 'Inactivo' o similar. Si es string.
        // Si no hay especificación clara, incluimos todas.
        rutasActivas.push({
          idRuta: ruta.idRuta,
          origen: ruta.origen.ubicacion.nombreUbicacion, // Debería ser igual a nombreUbicacion
          destino: ruta.destino.ubicacion.nombreUbicacion,
        });
      });
    });

    // Procesar rutas como Destino
    destinos.forEach((destino) => {
      destino.rutasDestino.forEach((ruta) => {
         rutasActivas.push({
          idRuta: ruta.idRuta,
          origen: ruta.origen.ubicacion.nombreUbicacion,
          destino: ruta.destino.ubicacion.nombreUbicacion, // Debería ser igual a nombreUbicacion
        });
      });
    });

    // Eliminar duplicados si una ruta va de A a A (raro pero posible)
    const uniqueRutas = rutasActivas.filter(
      (ruta, index, self) =>
        index === self.findIndex((t) => t.idRuta === ruta.idRuta)
    );

    return {
      tieneRutasActivas: uniqueRutas.length > 0,
      totalRutasActivas: uniqueRutas.length,
      rutasActivas: uniqueRutas,
    };
  }

  async forceDelete(id: string) {
    // Verificar que existe
    await this.findOne(id);
    
    // Hard Delete directo (el esquema cascade se encarga de lo demás)
    return this.prisma.ubicacion.delete({
      where: { idUbicacion: id },
    });
  }
}
