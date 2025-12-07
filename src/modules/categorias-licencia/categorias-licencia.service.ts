import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateCategoriaLicenciaDto,
  UpdateCategoriaLicenciaDto,
} from './dto/index';

// Interfaz para errores de Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

/**
 * Servicio de Categorías de Licencia
 * Contiene toda la lógica de negocio relacionada con las categorías de licencia de conducción
 */
@Injectable()
export class CategoriasLicenciaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las categorías de licencia
   */
  async findAll() {
    try {
      const categorias = await this.prisma.categoriasLicencia.findMany({
        where: {
          estado: true,
        },
        orderBy: {
          nombreCategoria: 'asc',
        },
      });

      return {
        success: true,
        data: categorias,
        message: 'Categorías de licencia obtenidas exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener categorías de licencia',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene una categoría de licencia por su ID
   */
  async findOne(id: string) {
    try {
      const categoria = await this.prisma.categoriasLicencia.findUnique({
        where: { idCategoriaLicencia: id },
      });

      if (!categoria) {
        throw new HttpException(
          {
            success: false,
            error: 'Categoría de licencia no encontrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: categoria,
        message: 'Categoría de licencia encontrada',
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
          error: 'Error al buscar categoría de licencia',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea una nueva categoría de licencia
   */
  async create(createCategoriaLicenciaDto: CreateCategoriaLicenciaDto) {
    try {
      const data: any = {
        idCategoriaLicencia:
          createCategoriaLicenciaDto.idCategoriaLicencia || uuidv4(),
        nombreCategoria:
          createCategoriaLicenciaDto.nombreCategoria.toUpperCase(),
        descripcion: createCategoriaLicenciaDto.descripcion || null,
        estado:
          typeof createCategoriaLicenciaDto.estado === 'boolean'
            ? createCategoriaLicenciaDto.estado
            : true,
      };

      const nuevaCategoria = await this.prisma.categoriasLicencia.create({
        data,
      });

      return {
        success: true,
        data: nuevaCategoria,
        message: 'Categoría de licencia creada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Error de duplicado
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new HttpException(
          {
            success: false,
            error: 'La categoría de licencia ya existe',
          },
          HttpStatus.CONFLICT,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear categoría de licencia',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza una categoría de licencia existente
   */
  async update(
    id: string,
    updateCategoriaLicenciaDto: UpdateCategoriaLicenciaDto,
  ) {
    try {
      const existente = await this.prisma.categoriasLicencia.findUnique({
        where: { idCategoriaLicencia: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Categoría de licencia no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Preparar datos para actualización
      const data: Record<string, unknown> = { ...updateCategoriaLicenciaDto };

      if (data.nombreCategoria && typeof data.nombreCategoria === 'string') {
        data.nombreCategoria = data.nombreCategoria.toUpperCase();
      }

      const categoriaActualizada = await this.prisma.categoriasLicencia.update({
        where: { idCategoriaLicencia: id },
        data,
      });

      return {
        success: true,
        data: categoriaActualizada,
        message: 'Categoría de licencia actualizada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new HttpException(
          {
            success: false,
            error: 'La categoría de licencia ya existe',
          },
          HttpStatus.CONFLICT,
        );
      }
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Categoría de licencia no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar categoría de licencia',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina una categoría de licencia (soft delete)
   */
  async remove(id: string) {
    try {
      const existente = await this.prisma.categoriasLicencia.findUnique({
        where: { idCategoriaLicencia: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Categoría de licencia no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Soft delete: solo cambia el estado a false
      await this.prisma.categoriasLicencia.update({
        where: { idCategoriaLicencia: id },
        data: { estado: false },
      });

      return {
        success: true,
        message: 'Categoría de licencia eliminada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Categoría de licencia no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al eliminar categoría de licencia',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
