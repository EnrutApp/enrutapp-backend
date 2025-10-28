import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

/**
 * Servicio de Usuarios
 * Contiene toda la lógica de negocio relacionada con usuarios
 */
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifica si un correo ya existe en la base de datos
   */
  async checkEmailExists(email: string) {
    const user = await this.prisma.usuarios.findUnique({
      where: { correo: email },
      select: { idUsuario: true },
    });
    return { exists: !!user };
  }

  /**
   * Verifica si un número de documento ya existe
   */
  async checkDocumentExists(numero: string) {
    const user = await this.prisma.usuarios.findFirst({
      where: { numDocumento: numero },
      select: { idUsuario: true },
    });
    return { exists: !!user };
  }

  /**
   * Obtiene todos los usuarios con sus relaciones
   */
  async findAll(filter?: { rol?: string }) {
    try {
      const whereClause = filter?.rol
        ? {
            rol: {
              is: {
                nombreRol: filter.rol,
              },
            },
          }
        : undefined;

      const usuarios = await this.prisma.usuarios.findMany({
        where: whereClause,
        include: {
          rol: true,
          tipoDocumento: true,
          ciudad: true,
        },
      });

      return {
        success: true,
        data: usuarios,
        message: 'Usuarios obtenidos exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener usuarios',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async findOne(id: string) {
    try {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { idUsuario: id },
        include: {
          rol: true,
          tipoDocumento: true,
          ciudad: true,
        },
      });

      if (!usuario) {
        throw new HttpException(
          {
            success: false,
            error: 'Usuario no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: usuario,
        message: 'Usuario encontrado',
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
          error: 'Error al buscar usuario',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      // Validar que el rol existe
      if (!createUsuarioDto.idRol) {
        throw new HttpException(
          { success: false, error: 'El rol es requerido' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const rol = await this.prisma.roles.findUnique({
        where: { idRol: createUsuarioDto.idRol },
      });

      if (!rol) {
        throw new HttpException(
          { success: false, error: 'El rol especificado no existe' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Normalizar datos
      const correoNormalizado = String(createUsuarioDto.correo)
        .trim()
        .toLowerCase();
      const numDocumentoNormalizado = String(
        createUsuarioDto.numDocumento,
      ).trim();

      // Hashear contraseña
      const hashedPassword = await hash(createUsuarioDto.contrasena, 10);

      const nuevoUsuario = await this.prisma.usuarios.create({
        data: {
          idUsuario: uuidv4(),
          idRol: createUsuarioDto.idRol,
          foto: null,
          tipoDoc: createUsuarioDto.tipoDoc || '',
          numDocumento: numDocumentoNormalizado,
          nombre: createUsuarioDto.nombre,
          telefono: createUsuarioDto.telefono || '',
          correo: correoNormalizado,
          contrasena: hashedPassword,
          direccion: createUsuarioDto.direccion || '',
          idCiudad: createUsuarioDto.idCiudad || 1,
          estado:
            typeof createUsuarioDto.estado === 'boolean'
              ? createUsuarioDto.estado
              : true,
        },
        include: {
          rol: true,
          tipoDocumento: true,
          ciudad: true,
        },
      });

      return {
        success: true,
        data: nuevoUsuario,
        message: 'Usuario creado exitosamente',
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
          error: 'Error al crear usuario',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const usuarioExistente = await this.prisma.usuarios.findUnique({
        where: { idUsuario: id },
        include: { rol: true },
      });

      if (!usuarioExistente) {
        throw new HttpException(
          { success: false, error: 'Usuario no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Proteger cambios en administradores
      const isAdmin =
        usuarioExistente.rol?.nombreRol?.toLowerCase() === 'administrador';

      if (isAdmin) {
        if (
          updateUsuarioDto.idRol &&
          updateUsuarioDto.idRol !== usuarioExistente.idRol
        ) {
          throw new HttpException(
            {
              success: false,
              error: 'No se puede cambiar el rol de un administrador',
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }

      // Preparar datos para actualización
      type UpdateData = Partial<Omit<CreateUsuarioDto, 'contrasena'>> & {
        contrasena?: string;
      };
      const dataToUpdate: UpdateData = { ...updateUsuarioDto };

      // Hashear contraseña si se está actualizando
      if (dataToUpdate.contrasena) {
        dataToUpdate.contrasena = await hash(dataToUpdate.contrasena, 10);
      }

      const usuarioActualizado = await this.prisma.usuarios.update({
        where: { idUsuario: id },
        data: dataToUpdate,
        include: {
          rol: true,
          tipoDocumento: true,
          ciudad: true,
        },
      });

      return {
        success: true,
        data: usuarioActualizado,
        message: 'Usuario actualizado exitosamente',
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
          error: 'Error al actualizar usuario',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Elimina un usuario
   */
  async remove(id: string) {
    try {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { idUsuario: id },
        include: { rol: true },
      });

      if (!usuario) {
        throw new HttpException(
          { success: false, error: 'Usuario no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      // No permitir eliminar administradores
      if (usuario.rol.nombreRol.toLowerCase() === 'administrador') {
        throw new HttpException(
          {
            success: false,
            error: 'No se puede eliminar un administrador',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      await this.prisma.usuarios.delete({
        where: { idUsuario: id },
      });

      return {
        success: true,
        message: 'Usuario eliminado exitosamente',
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
          error: 'Error al eliminar usuario',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
