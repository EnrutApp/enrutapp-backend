import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateConductorDto, UpdateConductorDto } from './dto/index';

// Interfaz para errores de Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

/**
 * Servicio de Conductores
 * Contiene toda la lógica de negocio relacionada con conductores
 */
@Injectable()
export class ConductoresService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los conductores
   */
  async findAll() {
    try {
      const conductores = await this.prisma.conductores.findMany({
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        success: true,
        data: conductores,
        message: 'Conductores obtenidos exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener conductores',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene un conductor por su ID
   */
  async findOne(id: string) {
    try {
      const conductor = await this.prisma.conductores.findUnique({
        where: { idConductor: id },
      });

      if (!conductor) {
        throw new HttpException(
          {
            success: false,
            error: 'Conductor no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: conductor,
        message: 'Conductor encontrado',
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
          error: 'Error al buscar conductor',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea un nuevo conductor
   */
  async create(
    createConductorDto: CreateConductorDto,
    file?: Express.Multer.File,
  ) {
    try {
      const data: any = {
        idConductor: createConductorDto.idConductor || uuidv4(),
        nombre: createConductorDto.nombre,
        apellido: createConductorDto.apellido,
        cedula: createConductorDto.cedula.toUpperCase(),
        telefono: createConductorDto.telefono,
        correo: createConductorDto.correo?.toLowerCase() || null,
        licencia: createConductorDto.licencia.toUpperCase(),
        estado:
          typeof createConductorDto.estado === 'boolean'
            ? createConductorDto.estado
            : true,
        fotoUrl: file ? `/uploads/conductores/${file.filename}` : null,
      };

      const nuevoConductor = await this.prisma.conductores.create({
        data,
      });

      return {
        success: true,
        data: nuevoConductor,
        message: 'Conductor creado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Error de duplicado
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.[0];
        if (target === 'cedula') {
          throw new HttpException(
            { success: false, error: 'La cédula del conductor ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        if (target === 'licencia') {
          throw new HttpException(
            { success: false, error: 'La licencia del conductor ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        if (target === 'correo') {
          throw new HttpException(
            { success: false, error: 'El correo del conductor ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          { success: false, error: 'El conductor ya existe' },
          HttpStatus.CONFLICT,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear conductor',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza un conductor existente
   */
  async update(id: string, updateConductorDto: UpdateConductorDto) {
    try {
      const existente = await this.prisma.conductores.findUnique({
        where: { idConductor: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Conductor no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Preparar datos para actualización
      const data: Record<string, unknown> = { ...updateConductorDto };

      if (data.cedula && typeof data.cedula === 'string') {
        data.cedula = data.cedula.toUpperCase();
      }
      if (data.licencia && typeof data.licencia === 'string') {
        data.licencia = data.licencia.toUpperCase();
      }
      if (data.correo && typeof data.correo === 'string') {
        data.correo = data.correo.toLowerCase();
      }

      const conductorActualizado = await this.prisma.conductores.update({
        where: { idConductor: id },
        data,
      });

      return {
        success: true,
        data: conductorActualizado,
        message: 'Conductor actualizado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.[0];
        if (target === 'cedula') {
          throw new HttpException(
            { success: false, error: 'La cédula del conductor ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        if (target === 'licencia') {
          throw new HttpException(
            { success: false, error: 'La licencia del conductor ya existe' },
            HttpStatus.CONFLICT,
          );
        }
        if (target === 'correo') {
          throw new HttpException(
            { success: false, error: 'El correo del conductor ya existe' },
            HttpStatus.CONFLICT,
          );
        }
      }
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Conductor no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar conductor',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina un conductor
   */
  async remove(id: string) {
    try {
      const existente = await this.prisma.conductores.findUnique({
        where: { idConductor: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Conductor no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.conductores.delete({ where: { idConductor: id } });

      return {
        success: true,
        message: 'Conductor eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Conductor no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al eliminar conductor',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualiza la foto del conductor
   */
  async actualizarFoto(id: string, file?: Express.Multer.File) {
    try {
      const existente = await this.prisma.conductores.findUnique({
        where: { idConductor: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Conductor no encontrado' },
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
      const relativePath = `/uploads/conductores/${file.filename}`;

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

      const actualizado = await this.prisma.conductores.update({
        where: { idConductor: id },
        data: { fotoUrl: relativePath },
      });

      return {
        success: true,
        data: actualizado,
        message: 'Foto del conductor actualizada correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar foto del conductor',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
