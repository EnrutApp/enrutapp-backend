import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateVehiculoDto, UpdateVehiculoDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

// Interfaz para errores de Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

/**
 * Servicio de Vehículos
 * Contiene toda la lógica de negocio relacionada con vehículos
 */
@Injectable()
export class VehiculosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los vehículos con sus relaciones
   */
  async findAll() {
    try {
      const vehiculos = await this.prisma.vehiculos.findMany({
        include: {
          tipoVehiculo: true,
          marcaVehiculo: true,
        },
        orderBy: {
          placa: 'asc',
        },
      });

      return {
        success: true,
        data: vehiculos,
        message: 'Vehículos obtenidos exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener vehículos',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene un vehículo por su ID
   */
  async findOne(id: string) {
    try {
      const vehiculo = await this.prisma.vehiculos.findUnique({
        where: { idVehiculo: id },
        include: {
          tipoVehiculo: true,
          marcaVehiculo: true,
        },
      });

      if (!vehiculo) {
        throw new HttpException(
          {
            success: false,
            error: 'Vehículo no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: vehiculo,
        message: 'Vehículo encontrado',
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
          error: 'Error al buscar vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea un nuevo vehículo
   */
  async create(
    createVehiculoDto: CreateVehiculoDto,
    file?: Express.Multer.File,
  ) {
    try {
      // Validar que se envíe archivo de foto
      if (!file) {
        throw new HttpException(
          { success: false, error: 'La foto del vehículo es obligatoria' },
          HttpStatus.BAD_REQUEST,
        );
      }
      // Verificar que exista el tipo de vehículo
      const tipoVehiculo = await this.prisma.tiposVehiculo.findUnique({
        where: { idTipoVehiculo: createVehiculoDto.idTipoVehiculo },
      });

      if (!tipoVehiculo) {
        throw new HttpException(
          {
            success: false,
            error: 'El tipo de vehículo especificado no existe',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar que exista la marca
      const marcaVehiculo = await this.prisma.marcasVehiculos.findUnique({
        where: { idMarcaVehiculo: createVehiculoDto.idMarcaVehiculo },
      });

      if (!marcaVehiculo) {
        throw new HttpException(
          {
            success: false,
            error: 'La marca de vehículo especificada no existe',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Preparar datos
      type VehiculoData = {
        idVehiculo: string;
        idTipoVehiculo: string;
        idMarcaVehiculo: string;
        placa: string;
        linea: string;
        modelo: number;
        color: string;
        vin: string | null;
        capacidadPasajeros: number;
        capacidadCarga: Decimal | null;
        soatVencimiento: Date | null;
        tecnomecanicaVencimiento: Date | null;
        seguroVencimiento: Date | null;
        estado: boolean;
        fotoUrl: string;
      };

      const data: VehiculoData = {
        idVehiculo: createVehiculoDto.idVehiculo || uuidv4(),
        idTipoVehiculo: createVehiculoDto.idTipoVehiculo,
        idMarcaVehiculo: createVehiculoDto.idMarcaVehiculo,
        placa: createVehiculoDto.placa.toUpperCase(),
        linea: createVehiculoDto.linea,
        modelo: createVehiculoDto.modelo,
        color: createVehiculoDto.color,
        vin: createVehiculoDto.vin?.toUpperCase() || null,
        capacidadPasajeros: createVehiculoDto.capacidadPasajeros,
        capacidadCarga: createVehiculoDto.capacidadCarga
          ? new Decimal(createVehiculoDto.capacidadCarga)
          : null,
        soatVencimiento: createVehiculoDto.soatVencimiento
          ? new Date(createVehiculoDto.soatVencimiento)
          : null,
        tecnomecanicaVencimiento: createVehiculoDto.tecnomecanicaVencimiento
          ? new Date(createVehiculoDto.tecnomecanicaVencimiento)
          : null,
        seguroVencimiento: createVehiculoDto.seguroVencimiento
          ? new Date(createVehiculoDto.seguroVencimiento)
          : null,
        estado:
          typeof createVehiculoDto.estado === 'boolean'
            ? createVehiculoDto.estado
            : true,
        fotoUrl: `/uploads/vehiculos/${file.filename}`,
      };

      const nuevoVehiculo = await this.prisma.vehiculos.create({
        data,
        include: {
          tipoVehiculo: true,
          marcaVehiculo: true,
        },
      });

      return {
        success: true,
        data: nuevoVehiculo,
        message: 'Vehículo creado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Error de duplicado
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.[0];
        if (target === 'placa') {
          throw new HttpException(
            { success: false, error: 'La placa del vehículo ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        if (target === 'vin') {
          throw new HttpException(
            { success: false, error: 'El VIN del vehículo ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          { success: false, error: 'El vehículo ya existe' },
          HttpStatus.CONFLICT,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear vehículo',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza un vehículo existente
   */
  async update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
    try {
      const existente = await this.prisma.vehiculos.findUnique({
        where: { idVehiculo: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Vehículo no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar tipo de vehículo si se está actualizando
      if (updateVehiculoDto.idTipoVehiculo) {
        const tipoVehiculo = await this.prisma.tiposVehiculo.findUnique({
          where: { idTipoVehiculo: updateVehiculoDto.idTipoVehiculo },
        });
        if (!tipoVehiculo) {
          throw new HttpException(
            {
              success: false,
              error: 'El tipo de vehículo especificado no existe',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Verificar marca si se está actualizando
      if (updateVehiculoDto.idMarcaVehiculo) {
        const marcaVehiculo = await this.prisma.marcasVehiculos.findUnique({
          where: { idMarcaVehiculo: updateVehiculoDto.idMarcaVehiculo },
        });
        if (!marcaVehiculo) {
          throw new HttpException(
            {
              success: false,
              error: 'La marca de vehículo especificada no existe',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Preparar datos para actualización
      const data: Record<string, unknown> = { ...updateVehiculoDto };

      if (data.placa && typeof data.placa === 'string') {
        data.placa = data.placa.toUpperCase();
      }
      if (data.vin && typeof data.vin === 'string') {
        data.vin = data.vin.toUpperCase();
      }
      if (data.capacidadCarga !== undefined) {
        data.capacidadCarga =
          typeof data.capacidadCarga === 'number' && data.capacidadCarga > 0
            ? new Decimal(data.capacidadCarga)
            : null;
      }
      if (data.soatVencimiento && typeof data.soatVencimiento === 'string') {
        data.soatVencimiento = new Date(data.soatVencimiento);
      }
      if (
        data.tecnomecanicaVencimiento &&
        typeof data.tecnomecanicaVencimiento === 'string'
      ) {
        data.tecnomecanicaVencimiento = new Date(data.tecnomecanicaVencimiento);
      }
      if (
        data.seguroVencimiento &&
        typeof data.seguroVencimiento === 'string'
      ) {
        data.seguroVencimiento = new Date(data.seguroVencimiento);
      }

      const vehiculoActualizado = await this.prisma.vehiculos.update({
        where: { idVehiculo: id },
        data,
        include: {
          tipoVehiculo: true,
          marcaVehiculo: true,
        },
      });

      return {
        success: true,
        data: vehiculoActualizado,
        message: 'Vehículo actualizado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.[0];
        if (target === 'placa') {
          throw new HttpException(
            { success: false, error: 'La placa del vehículo ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        if (target === 'vin') {
          throw new HttpException(
            { success: false, error: 'El VIN del vehículo ya existe' },
            HttpStatus.CONFLICT,
          );
        }
      }
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Vehículo no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina un vehículo
   */
  async remove(id: string) {
    try {
      const existente = await this.prisma.vehiculos.findUnique({
        where: { idVehiculo: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Vehículo no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.vehiculos.delete({ where: { idVehiculo: id } });

      return {
        success: true,
        message: 'Vehículo eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Vehículo no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al eliminar vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualiza la foto del vehículo y guarda la ruta relativa en fotoUrl
   */
  async actualizarFoto(id: string, file?: Express.Multer.File) {
    try {
      const existente = await this.prisma.vehiculos.findUnique({
        where: { idVehiculo: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Vehículo no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      if (!file) {
        throw new HttpException(
          { success: false, error: 'No se recibió archivo de imagen' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Construir ruta relativa servida desde /uploads
      const relativePath = `/uploads/vehiculos/${file.filename}`;

      // Intentar borrar la foto anterior si existe
      if (existente.fotoUrl) {
        const prev = existente.fotoUrl.replace('/uploads/', '');
        const prevPath = join(process.cwd(), 'uploads', prev);
        try {
          if (existsSync(prevPath)) unlinkSync(prevPath);
        } catch {
          // si falla, no bloquear flujo
        }
      }

      const actualizado = await this.prisma.vehiculos.update({
        where: { idVehiculo: id },
        data: { fotoUrl: relativePath },
        include: { tipoVehiculo: true, marcaVehiculo: true },
      });

      return {
        success: true,
        data: actualizado,
        message: 'Foto del vehículo actualizada correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar foto del vehículo',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
