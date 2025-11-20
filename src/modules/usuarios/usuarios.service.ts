import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as nodemailer from 'nodemailer';

/**
 * Servicio de Usuarios
 * Contiene toda la lógica de negocio relacionada con usuarios
 */
@Injectable()
export class UsuariosService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Envía correo con las credenciales al nuevo usuario
   */
  private async sendWelcomeEmail(
    email: string,
    nombre: string,
    password?: string, // Opcional: si se proporciona, se incluyen las credenciales
  ): Promise<void> {
    try {
      const conCredenciales = !!password;

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@enrutapp.com',
        to: email,
        subject: conCredenciales
          ? '¡Bienvenido a EnrutApp! - Credenciales de acceso'
          : '¡Bienvenido a EnrutApp!',
        html: conCredenciales
          ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">¡Bienvenido a EnrutApp!</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Correo:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Contraseña:</strong> ${password}</p>
            </div>
            
            <p style="color: #ef4444;"><strong>⚠️ Importante:</strong> Por tu seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p>
            
            <p>Puedes acceder al sistema en: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #2563eb;">EnrutApp</a></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
          </div>
        `
          : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">¡Bienvenido a EnrutApp!</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente en EnrutApp.</p>
            
            <p>Ahora puedes acceder al sistema con las credenciales que configuraste durante el registro.</p>
            
            <p>Puedes acceder al sistema en: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #2563eb;">EnrutApp</a></p>
            
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
          </div>
        `,
        text: conCredenciales
          ? `
¡Bienvenido a EnrutApp!

Hola ${nombre},

Tu cuenta ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:

Correo: ${email}
Contraseña: ${password}

⚠️ Importante: Por tu seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.

Puedes acceder al sistema en: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
        `
          : `
¡Bienvenido a EnrutApp!

Hola ${nombre},

Tu cuenta ha sido creada exitosamente en EnrutApp.

Ahora puedes acceder al sistema con las credenciales que configuraste durante el registro.

Puedes acceder al sistema en: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
        `,
      });
    } catch (error) {
      console.error('Error al enviar correo de bienvenida:', error);
      // No lanzamos error para no bloquear la creación del usuario
    }
  }

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

      // Guardar contraseña en texto plano temporalmente para enviar por correo
      const plainPassword = createUsuarioDto.contrasena;

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

      // Enviar correo con las credenciales de forma asíncrona
      this.sendWelcomeEmail(
        correoNormalizado,
        createUsuarioDto.nombre,
        plainPassword,
      ).catch((error) => {
        console.error('Error al enviar correo de bienvenida:', error);
      });

      return {
        success: true,
        data: nuevoUsuario,
        message:
          'Usuario creado exitosamente. Se ha enviado un correo con las credenciales.',
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
