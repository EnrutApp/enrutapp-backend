import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AddPasajeroDto } from './dto/add-pasajero.dto';
import { AssignConductorVehiculoDto } from './dto/assign-conductor-vehiculo.dto';

/**
 * Utilidad para obtener el rango del día (00:00:00 - 23:59:59.999)
 * para comparar reservas por fecha (evita problemas de horas).
 */
function dayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------
  // Listado con filtros y paginación
  // ---------------------------
  async findAll(query: {
    estado?: string;
    idUsuario?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    pageSize?: number;
    search?: string;
  } = {}) {
    const where: any = {};

    if (query.estado) where.estadoReserva = query.estado;
    if (query.idUsuario) where.idUsuario = query.idUsuario;

    if (query.fechaDesde || query.fechaHasta) {
      where.fecha = {};
      if (query.fechaDesde) where.fecha.gte = new Date(query.fechaDesde);
      if (query.fechaHasta) where.fecha.lte = new Date(query.fechaHasta);
    }

    if (query.search) {
      // ejemplo de búsqueda sobre nombre del usuario o placa del vehículo
      where.OR = [
        { usuario: { nombre: { contains: query.search, mode: 'insensitive' } } },
        { vehiculo: { placa: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;

    const [data, total] = await Promise.all([
      this.prisma.reservasPrivadas.findMany({
        where,
        include: {
          detalles: true,
          usuario: true,
          conductor: { include: { usuario: true } },
          vehiculo: true,
          ruta: {
            include: {
              origen: { include: { ubicacion: true } },
              destino: { include: { ubicacion: true } },
            },
          },
          metodoPago: true,
        },
        orderBy: { fechaReserva: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.reservasPrivadas.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ---------------------------
  // Debug: Obtener TODAS las reservas sin paginación
  // ---------------------------
  async debugGetAllReservas() {
    try {
      const reservas = await this.prisma.reservasPrivadas.findMany({
        include: {
          detalles: true,
          usuario: true,
          conductor: { include: { usuario: true } },
          vehiculo: true,
          ruta: {
            include: {
              origen: { include: { ubicacion: true } },
              destino: { include: { ubicacion: true } },
            },
          },
          metodoPago: true,
        },
        orderBy: { fechaReserva: 'desc' },
      });

      return {
        success: true,
        total: reservas.length,
        message: reservas.length === 0 ? 'No hay reservas en la base de datos' : `Se encontraron ${reservas.length} reservas`,
        reservas: reservas.map((r) => ({
          idReservaPrivada: r.idReservaPrivada,
          usuario: r.usuario?.nombre || 'Sin usuario',
          estado: r.estadoReserva,
          fecha: r.fecha,
          cantidadPersonas: r.cantidadPersonas,
        })),
        fullData: reservas,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al obtener las reservas',
        total: 0,
        reservas: [],
        fullData: [],
      };
    }
  }

  // ---------------------------
  // Obtener una reserva por id
  // ---------------------------
  async findOne(id: string) {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID de reserva no puede estar vacío');
    }

    const reserva = await this.prisma.reservasPrivadas.findUnique({
      where: { idReservaPrivada: id },
      include: {
        detalles: true,
        usuario: true,
        conductor: { include: { usuario: true } },
        vehiculo: true,
        ruta: {
          include: {
            origen: { include: { ubicacion: true } },
            destino: { include: { ubicacion: true } },
          },
        },
        metodoPago: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID "${id}" no encontrada`);
    }
    return reserva;
  }

  // ---------------------------
  // Crear reserva (transaccional)
  // ---------------------------
  async create(dto: CreateReservaDto) {
    // Validaciones básicas: existencia de usuario, ruta y metodo de pago
    const [usuario, ruta, metodoPago] = await Promise.all([
      this.prisma.usuarios.findUnique({ where: { idUsuario: dto.idUsuario } }),
      this.prisma.ruta.findUnique({ where: { idRuta: dto.idRuta } }),
      this.prisma.metodoPago.findUnique({ where: { idMetodoPago: dto.idMetodoPago } }),
    ]);

    if (!usuario) throw new NotFoundException('Usuario (cliente) no encontrado');
    if (!ruta) throw new NotFoundException('Ruta no encontrada');
    if (!metodoPago) throw new NotFoundException('Método de pago no encontrado');

    // Si envían vehículo o conductor en el create, validamos existencia, capacidad y disponibilidad
    if (dto.idVehiculo) {
      const veh = await this.prisma.vehiculos.findUnique({ where: { idVehiculo: dto.idVehiculo } });
      if (!veh) throw new NotFoundException('Vehículo no encontrado');
      if (dto.cantidadPersonas > veh.capacidadPasajeros) {
        throw new BadRequestException('La cantidad de pasajeros excede la capacidad del vehículo');
      }

      const { start, end } = dayRange(new Date(dto.fecha));
      const conflict = await this.prisma.reservasPrivadas.findFirst({
        where: {
          idVehiculo: dto.idVehiculo,
          fecha: { gte: start, lte: end },
        },
      });
      if (conflict) throw new ConflictException('El vehículo ya tiene una reserva en esa fecha');
    }

    if (dto.idConductor) {
      const cond = await this.prisma.conductores.findUnique({ where: { idConductor: dto.idConductor } });
      if (!cond) throw new NotFoundException('Conductor no encontrado');

      const { start, end } = dayRange(new Date(dto.fecha));
      const conflict = await this.prisma.reservasPrivadas.findFirst({
        where: {
          idConductor: dto.idConductor,
          fecha: { gte: start, lte: end },
        },
      });
      if (conflict) throw new ConflictException('El conductor ya tiene una reserva en esa fecha');
    }

    // Transacción: crear reserva y crear pasajeros anidados (si vienen)
    const created = await this.prisma.$transaction(async (tx) => {
      const r = await tx.reservasPrivadas.create({
        data: {
          idUsuario: dto.idUsuario,
          idVehiculo: dto.idVehiculo ?? null,
          idConductor: dto.idConductor ?? null,
          idRuta: dto.idRuta,
          fecha: new Date(dto.fecha),
          horaSalida: dto.horaSalida,
          cantidadPersonas: dto.cantidadPersonas,
          precioTotal: dto.precioTotal ?? null,
          idMetodoPago: dto.idMetodoPago,
          estadoReserva: dto.estadoReserva ?? 'Pendiente',
          fechaReserva: dto.fechaReserva ? new Date(dto.fechaReserva) : new Date(),

          detalles: dto.detalles && dto.detalles.length > 0
            ? {
                create: dto.detalles.map((d) => ({
                  // No es necesario enviar idDetalle: Prisma lo genera con default(uuid())
                  nombrePasajero: d.nombrePasajero,
                  tipoDoc: d.tipoDoc,
                  numDocPasajero: d.numDocPasajero,
                  edadPasajero: d.edadPasajero,
                })),
              }
            : undefined,
        },
      });

      return r;
    });

    return this.findOne(created.idReservaPrivada);
  }

  // ---------------------------
  // Actualizar reserva (puedes reemplazar pasajeros con `detalles` en el dto)
  // ---------------------------
  async update(id: string, dto: UpdateReservaDto) {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID de reserva no puede estar vacío');
    }

    const existing = await this.prisma.reservasPrivadas.findUnique({ where: { idReservaPrivada: id } });
    if (!existing) {
      throw new NotFoundException(`Reserva con ID "${id}" no encontrada. Verifica que el ID sea correcto.`);
    }

    // Si cambia vehículo o cantidad, validar capacidad
    const newVehiculoId = dto.idVehiculo !== undefined && dto.idVehiculo !== null ? dto.idVehiculo : existing.idVehiculo;
    const newCantidad = dto.cantidadPersonas ?? existing.cantidadPersonas;
    if (newVehiculoId) {
      const veh = await this.prisma.vehiculos.findUnique({ where: { idVehiculo: newVehiculoId } });
      if (!veh) throw new NotFoundException('Vehículo no encontrado');
      if (newCantidad > veh.capacidadPasajeros) {
        throw new BadRequestException('La cantidad de pasajeros excede la capacidad del vehículo');
      }
    }

    // Si cambian fecha/vehículo/conductor, validar disponibilidad
    const targetFecha = dto.fecha ? new Date(dto.fecha) : existing.fecha;
    const { start, end } = dayRange(targetFecha);

    if (dto.idVehiculo && dto.idVehiculo !== null) {
      const conflict = await this.prisma.reservasPrivadas.findFirst({
        where: {
          idVehiculo: dto.idVehiculo,
          fecha: { gte: start, lte: end },
          NOT: { idReservaPrivada: id },
        },
      });
      if (conflict) throw new ConflictException('El vehículo ya tiene una reserva en esa fecha');
    }

    if (dto.idConductor && dto.idConductor !== null) {
      const conflict = await this.prisma.reservasPrivadas.findFirst({
        where: {
          idConductor: dto.idConductor,
          fecha: { gte: start, lte: end },
          NOT: { idReservaPrivada: id },
        },
      });
      if (conflict) throw new ConflictException('El conductor ya tiene una reserva en esa fecha');
    }

    // Transacción: si envían detalles, reemplazamos (deleteMany -> createMany)
    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.detalles) {
        // borrar los actuales
        await tx.detalleReservaPrivadaPasajero.deleteMany({ where: { idReservaPrivada: id } });

        // crear nuevos detalles (si vienen)
        if (dto.detalles.length > 0) {
          await tx.detalleReservaPrivadaPasajero.createMany({
            data: dto.detalles.map((d) => ({
              idReservaPrivada: id,
              nombrePasajero: d.nombrePasajero,
              tipoDoc: d.tipoDoc,
              numDocPasajero: d.numDocPasajero,
              edadPasajero: d.edadPasajero,
            })),
          });
        }
      }

      // actualizar campos de la reserva
      const res = await tx.reservasPrivadas.update({
        where: { idReservaPrivada: id },
        data: {
          idUsuario: dto.idUsuario ?? existing.idUsuario,
          idVehiculo: dto.idVehiculo !== undefined ? dto.idVehiculo : existing.idVehiculo,
          idConductor: dto.idConductor !== undefined ? dto.idConductor : existing.idConductor,
          idRuta: dto.idRuta ?? existing.idRuta,
          fecha: dto.fecha ? new Date(dto.fecha) : existing.fecha,
          horaSalida: dto.horaSalida ?? existing.horaSalida,
          cantidadPersonas: dto.cantidadPersonas ?? existing.cantidadPersonas,
          precioTotal: dto.precioTotal ?? existing.precioTotal,
          idMetodoPago: dto.idMetodoPago ?? existing.idMetodoPago,
          estadoReserva: dto.estadoReserva ?? existing.estadoReserva,
          fechaReserva: dto.fechaReserva ? new Date(dto.fechaReserva) : existing.fechaReserva,
        },
      });

      return res;
    });

    return this.findOne(updated.idReservaPrivada);
  }

  // ---------------------------
  // Eliminar reserva (borramos detalles y reserva)
  // ---------------------------
  async remove(id: string) {
    const exists = await this.prisma.reservasPrivadas.findUnique({ where: { idReservaPrivada: id } });
    if (!exists) throw new NotFoundException('Reserva no encontrada');

    await this.prisma.$transaction([
      this.prisma.detalleReservaPrivadaPasajero.deleteMany({ where: { idReservaPrivada: id } }),
      this.prisma.reservasPrivadas.delete({ where: { idReservaPrivada: id } }),
    ]);

    return { deleted: true };
  }

  // ---------------------------
  // Agregar pasajero (desde cliente existente o manual)
  // ---------------------------
  async addPasajero(idReserva: string, dto: AddPasajeroDto) {
    const reserva = await this.prisma.reservasPrivadas.findUnique({ where: { idReservaPrivada: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    // Validar que al menos uno de los dos métodos esté presente
    if (!dto.idCliente && (!dto.nombrePasajero || !dto.tipoDoc || !dto.numDocPasajero || dto.edadPasajero === undefined || dto.edadPasajero === null)) {
      throw new BadRequestException('Debes enviar idCliente o todos los datos del pasajero (nombrePasajero, tipoDoc, numDocPasajero, edadPasajero)');
    }

    // Para poder controlar capacidad, debe existir vehículo asignado
    if (!reserva.idVehiculo) throw new BadRequestException('Asigna un vehículo antes de agregar pasajeros');

    const veh = await this.prisma.vehiculos.findUnique({ where: { idVehiculo: reserva.idVehiculo } });
    if (!veh) throw new NotFoundException('Vehículo asignado no encontrado');

    // contar pasajeros actuales
    const count = await this.prisma.detalleReservaPrivadaPasajero.count({ where: { idReservaPrivada: idReserva } });
    if (count + 1 > Number(veh.capacidadPasajeros)) {
      throw new BadRequestException('No puedes agregar más pasajeros: capacidad alcanzada');
    }

    // si nos pasan idCliente (usuario existente)
    if (dto.idCliente) {
      const cliente = await this.prisma.usuarios.findUnique({ where: { idUsuario: dto.idCliente } });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');

      const created = await this.prisma.detalleReservaPrivadaPasajero.create({
        data: {
          idReservaPrivada: idReserva,
          nombrePasajero: cliente.nombre,
          tipoDoc: cliente.tipoDoc,
          numDocPasajero: cliente.numDocumento,
          edadPasajero: 0, // si guardas edad en Usuarios, reemplaza aquí
        },
      });
      return created;
    }

    // si vienen datos manuales
    const created = await this.prisma.detalleReservaPrivadaPasajero.create({
      data: {
        idReservaPrivada: idReserva,
        nombrePasajero: dto.nombrePasajero!,
        tipoDoc: dto.tipoDoc!,
        numDocPasajero: dto.numDocPasajero!,
        edadPasajero: dto.edadPasajero!,
      },
    });

    return created;
  }

  // ---------------------------
  // Eliminar pasajero por idDetalle
  // ---------------------------
  async removePasajero(idDetalle: string) {
    const found = await this.prisma.detalleReservaPrivadaPasajero.findUnique({ where: { idDetalle } });
    if (!found) throw new NotFoundException('Pasajero no encontrado');

    await this.prisma.detalleReservaPrivadaPasajero.delete({ where: { idDetalle } });
    return { deleted: true };
  }

  // ---------------------------
  // Asignar o reasignar vehículo y conductor (valida capacidad y disponibilidad)
  // ---------------------------
  async assignVehiculoConductor(idReserva: string, dto: AssignConductorVehiculoDto) {
    const reserva = await this.prisma.reservasPrivadas.findUnique({ where: { idReservaPrivada: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    const veh = await this.prisma.vehiculos.findUnique({ where: { idVehiculo: dto.idVehiculo } });
    if (!veh) throw new NotFoundException('Vehículo no encontrado');

    // validar capacidad
    if (reserva.cantidadPersonas > veh.capacidadPasajeros) {
      throw new BadRequestException('La cantidad de pasajeros excede la capacidad del vehículo');
    }

    // comprobar disponibilidad en la fecha de la reserva
    const { start, end } = dayRange(reserva.fecha);
    const vehConflict = await this.prisma.reservasPrivadas.findFirst({
      where: {
        idVehiculo: dto.idVehiculo,
        fecha: { gte: start, lte: end },
        NOT: { idReservaPrivada: idReserva },
      },
    });
    if (vehConflict) throw new ConflictException('El vehículo ya tiene una reserva en esa fecha');

    const cond = await this.prisma.conductores.findUnique({ where: { idConductor: dto.idConductor } });
    if (!cond) throw new NotFoundException('Conductor no encontrado');

    const condConflict = await this.prisma.reservasPrivadas.findFirst({
      where: {
        idConductor: dto.idConductor,
        fecha: { gte: start, lte: end },
        NOT: { idReservaPrivada: idReserva },
      },
    });
    if (condConflict) throw new ConflictException('El conductor ya tiene una reserva en esa fecha');

    const updated = await this.prisma.reservasPrivadas.update({
      where: { idReservaPrivada: idReserva },
      data: {
        idVehiculo: dto.idVehiculo,
        idConductor: dto.idConductor,
      },
    });

    return this.findOne(updated.idReservaPrivada);
  }

  // ---------------------------
  // Cambiar estado de la reserva
  // ---------------------------
  async changeEstado(id: string, estado: string) {
    const exists = await this.prisma.reservasPrivadas.findUnique({ where: { idReservaPrivada: id } });
    if (!exists) throw new NotFoundException('Reserva no encontrada');

    const updated = await this.prisma.reservasPrivadas.update({
      where: { idReservaPrivada: id },
      data: { estadoReserva: estado },
    });

    return updated;
  }
}
