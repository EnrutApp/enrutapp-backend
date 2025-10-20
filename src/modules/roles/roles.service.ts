import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateRolDto, UpdateRolDto } from './dto';

// Interfaz para errores de Prisma
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

/**
 * Servicio de Roles
 * Contiene toda la lógica de negocio relacionada con roles
 */
@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los roles con sus usuarios asociados
   */
  async findAll() {
    try {
      const roles = await this.prisma.roles.findMany({
        include: {
          usuarios: true,
        },
      });

      return {
        success: true,
        data: roles,
        message: 'Roles obtenidos exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener roles',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene un rol por su ID
   */
  async findOne(id: string) {
    try {
      const rol = await this.prisma.roles.findUnique({
        where: { idRol: id },
        include: {
          usuarios: true,
        },
      });

      if (!rol) {
        throw new HttpException(
          {
            success: false,
            error: 'Rol no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: rol,
        message: 'Rol encontrado',
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
          error: 'Error al buscar rol',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea un nuevo rol
   */
  async create(createRolDto: CreateRolDto) {
    try {
      // Preparar datos
      const data = {
        idRol: createRolDto.idRol || uuidv4(),
        nombreRol: createRolDto.nombreRol,
        descripcion: createRolDto.descripcion || null,
        estado:
          typeof createRolDto.estado === 'boolean' ? createRolDto.estado : true,
      };

      const nuevoRol = await this.prisma.roles.create({ data });

      return {
        success: true,
        data: nuevoRol,
        message: 'Rol creado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Error de duplicado
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new HttpException(
          { success: false, error: 'El nombre del rol ya existe' },
          HttpStatus.CONFLICT,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear rol',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza un rol existente
   * El rol Administrador está protegido contra cambios
   */
  async update(id: string, updateRolDto: UpdateRolDto) {
    try {
      const existente = await this.prisma.roles.findUnique({
        where: { idRol: id },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Rol no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Proteger rol Administrador
      if (existente.nombreRol?.toLowerCase() === 'administrador') {
        throw new HttpException(
          {
            success: false,
            error: 'No se puede editar el rol Administrador',
            message:
              'El rol Administrador está protegido y no puede ser modificado',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // Permitir alias 'activo' desde frontend
      if ('activo' in updateRolDto && updateRolDto.activo !== undefined) {
        updateRolDto.estado = !!updateRolDto.activo;
        delete updateRolDto.activo;
      }

      const rolActualizado = await this.prisma.roles.update({
        where: { idRol: id },
        data: updateRolDto,
      });

      return {
        success: true,
        data: rolActualizado,
        message: 'Rol actualizado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new HttpException(
          { success: false, error: 'Nombre de rol duplicado' },
          HttpStatus.CONFLICT,
        );
      }
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Rol no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al actualizar rol',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina un rol
   * No permite eliminar el rol Administrador ni roles con usuarios asociados
   */
  async remove(id: string) {
    try {
      const existente = await this.prisma.roles.findUnique({
        where: { idRol: id },
        include: { usuarios: true },
      });

      if (!existente) {
        throw new HttpException(
          { success: false, error: 'Rol no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Proteger rol Administrador
      if (existente.nombreRol === 'Administrador') {
        throw new HttpException(
          {
            success: false,
            error: 'No se puede eliminar el rol Administrador',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // Verificar que no tenga usuarios
      if (existente.usuarios && existente.usuarios.length > 0) {
        throw new HttpException(
          {
            success: false,
            error: 'No se puede eliminar un rol con usuarios asociados',
          },
          HttpStatus.CONFLICT,
        );
      }

      await this.prisma.roles.delete({ where: { idRol: id } });

      return {
        success: true,
        message: 'Rol eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        throw new HttpException(
          { success: false, error: 'Rol no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al eliminar rol',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
