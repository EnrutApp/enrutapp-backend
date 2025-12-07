// ...existing code...
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/forgot-reset-password.dto';
import * as nodemailer from 'nodemailer';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  AuthResponse,
  JwtPayload,
} from './dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUsuarioById(idUsuario: string) {
    return this.prisma.usuarios.findUnique({
      where: { idUsuario },
      include: { rol: true, ciudad: true },
    });
  }

  async cambiarEstadoUsuario(idUsuario: string, estado: boolean) {
    // Verificar si el usuario existe y obtener su rol
    const usuario = await this.prisma.usuarios.findUnique({
      where: { idUsuario },
      include: { rol: true },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si es administrador
    if (usuario.rol.nombreRol.toLowerCase() === 'administrador') {
      throw new Error('No se puede cambiar el estado de un administrador');
    }

    await this.prisma.usuarios.update({
      where: { idUsuario },
      data: { estado },
    });
  }
  async deletePhoto(userId: string) {
    await this.prisma.usuarios.update({
      where: { idUsuario: userId },
      data: { foto: null },
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { correo, contrasena, remember } = loginDto;

    try {
      // Buscar usuario por correo con relaciones
      const usuario = await this.prisma.usuarios.findUnique({
        where: { correo },
        include: {
          rol: true,
          tipoDocumento: true,
          ciudad: true,
        },
      });

      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar que el usuario esté activo
      if (!usuario.estado) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(
        contrasena,
        usuario.contrasena,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar token JWT con duración basada en "remember"
      const payload: JwtPayload = {
        sub: usuario.idUsuario,
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.rol.nombreRol,
      };

      // Si remember es true, token dura 30 días, sino 24 horas
      const expiresIn = remember ? '30d' : '24h';
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn,
      });

      if (!usuario.ciudad) {
        throw new UnauthorizedException(
          'La ciudad asociada al usuario no existe',
        );
      }
      return {
        success: true,
        data: {
          user: {
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: {
              idRol: usuario.rol.idRol,
              nombreRol: usuario.rol.nombreRol,
            },
            tipoDocumento: {
              idTipoDoc: usuario.tipoDocumento.idTipoDoc,
              nombreTipoDoc: usuario.tipoDocumento.nombreTipoDoc,
            },
            ciudad: {
              idCiudad: usuario.ciudad.idCiudad,
              nombreCiudad: usuario.ciudad.nombreCiudad,
            },
          },
          access_token,
          expires_in: expiresIn,
        },
        message: 'Login exitoso',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new UnauthorizedException(
        'Error en autenticación: ' + errorMessage,
      );
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const {
      correo,
      contrasena,
      nombre,
      numDocumento,
      telefono,
      direccion,
      idCiudad,
      idRol,
      tipoDoc,
    } = registerDto;

    try {
      // Verificar si el usuario ya existe por correo
      const existingUserByEmail = await this.prisma.usuarios.findUnique({
        where: { correo },
      });

      if (existingUserByEmail) {
        throw new ConflictException(
          'Ya existe un usuario con este correo electrónico',
        );
      }

      // Verificar si el usuario ya existe por número de documento
      const existingUserByDocument = await this.prisma.usuarios.findUnique({
        where: { numDocumento },
      });

      if (existingUserByDocument) {
        throw new ConflictException(
          'Ya existe un usuario con este número de documento',
        );
      }

      // Verificar que el rol existe
      const rol = await this.prisma.roles.findUnique({
        where: { idRol },
      });

      if (!rol) {
        throw new NotFoundException('Rol no encontrado');
      }

      // Verificar que el tipo de documento existe
      const tipoDocumento = await this.prisma.tiposDoc.findUnique({
        where: { idTipoDoc: tipoDoc },
      });

      if (!tipoDocumento) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 12);

      // Verificar que la ciudad existe
      const ciudad = await this.prisma.ciudades.findUnique({
        where: { idCiudad },
      });
      if (!ciudad) {
        throw new NotFoundException('Ciudad no encontrada');
      }

      // Crear usuario
      const nuevoUsuario = await this.prisma.usuarios.create({
        data: {
          idUsuario: uuidv4(),
          correo,
          contrasena: hashedPassword,
          nombre,
          numDocumento,
          telefono,
          direccion,
          idCiudad,
          idRol,
          tipoDoc,
          estado: true,
        },
        include: {
          rol: true,
          tipoDocumento: true,
          ciudad: true,
        },
      });

      // Generar token JWT
      const payload: JwtPayload = {
        sub: nuevoUsuario.idUsuario,
        correo: nuevoUsuario.correo,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol.nombreRol,
      };

      const access_token = await this.jwtService.signAsync(payload);

      // Enviar correo de bienvenida sin credenciales (el usuario ya las conoce)
      this.sendWelcomeEmailWithoutCredentials(
        nuevoUsuario.correo,
        nuevoUsuario.nombre,
      ).catch((error) => {
        console.error('Error al enviar correo de bienvenida:', error);
      });

      return {
        success: true,
        data: {
          user: {
            idUsuario: nuevoUsuario.idUsuario,
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            rol: {
              idRol: nuevoUsuario.rol.idRol,
              nombreRol: nuevoUsuario.rol.nombreRol,
            },
            tipoDocumento: {
              idTipoDoc: nuevoUsuario.tipoDocumento.idTipoDoc,
              nombreTipoDoc: nuevoUsuario.tipoDocumento.nombreTipoDoc,
            },
            ciudad: {
              idCiudad: nuevoUsuario.ciudad.idCiudad,
              nombreCiudad: nuevoUsuario.ciudad.nombreCiudad,
            },
          },
          access_token,
          expires_in: '24h',
        },
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new ConflictException(
        'Error al registrar usuario: ' + errorMessage,
      );
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { contrasenaActual, nuevaContrasena } = changePasswordDto;

    try {
      // Buscar usuario
      const usuario = await this.prisma.usuarios.findUnique({
        where: { idUsuario: userId },
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(
        contrasenaActual,
        usuario.contrasena,
      );
      if (!isCurrentPasswordValid) {
        // Cambiar a ForbiddenException para evitar logout en frontend
        throw new ForbiddenException('Contraseña actual incorrecta');
      }

      // Encriptar nueva contraseña
      const hashedNewPassword = await bcrypt.hash(nuevaContrasena, 12);

      // Actualizar contraseña
      await this.prisma.usuarios.update({
        where: { idUsuario: userId },
        data: { contrasena: hashedNewPassword },
      });

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new ConflictException(
        'Error al cambiar contraseña: ' + errorMessage,
      );
    }
  }

  async validateUser(payload: JwtPayload): Promise<unknown> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { idUsuario: payload.sub },
      include: {
        rol: true,
        tipoDocumento: true,
        ciudad: true,
      },
    });

    if (!usuario || !usuario.estado) {
      return null;
    }

    // Devolver usuario sin contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, ...result } = usuario;
    return result;
  }
  // Configuración de transporte para nodemailer (ajusta según tu proveedor)
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });

  /**
   * Envía correo de bienvenida sin credenciales (para auto-registro)
   */
  private async sendWelcomeEmailWithoutCredentials(
    email: string,
    nombre: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@enrutapp.com',
        to: email,
        subject: '¡Bienvenido a EnrutApp!',
        html: `
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
        text: `
¡Bienvenido a EnrutApp!

Hola ${nombre},

Tu cuenta ha sido creada exitosamente en EnrutApp.

Ahora puedes acceder al sistema con las credenciales que configuraste durante el registro.

Puedes acceder al sistema en: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
        `,
      });
    } catch (error) {
      console.error('Error al enviar correo de bienvenida:', error);
    }
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { correo } = dto;
    const usuario = await this.prisma.usuarios.findUnique({
      where: { correo },
    });
    if (!usuario) {
      throw new NotFoundException('No existe un usuario con ese correo');
    }
    // Generar código y expiración (ej: 6 dígitos, 15 min)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await this.prisma.usuarios.update({
      where: { correo },
      data: { resetPasswordCode: code, resetPasswordExpires: expires },
    });
    // Enviar correo
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@enrutapp.com',
      to: correo,
      subject: 'Código de recuperación de contraseña',
      text: `Tu código de recuperación es: ${code}. Expira en 15 minutos.`,
    });
    return { success: true, message: 'Código enviado al correo' };
  }

  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { code, newPassword } = dto;
    const usuario = await this.prisma.usuarios.findFirst({
      where: {
        resetPasswordCode: code,
        resetPasswordExpires: { gt: new Date() },
      },
    });
    if (!usuario) {
      throw new NotFoundException('Código inválido o expirado');
    }
    // Validar que la nueva contraseña no sea igual a la anterior
    const isSamePassword = await bcrypt.compare(
      newPassword,
      usuario.contrasena,
    );
    if (isSamePassword) {
      throw new ConflictException(
        'La nueva contraseña no puede ser igual a la anterior',
      );
    }
    // Validar requisitos mínimos (puedes ajustar la expresión según tus reglas)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new ConflictException(
        'La contraseña debe tener al menos 6 caracteres, incluir letras y números',
      );
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.usuarios.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        contrasena: hashed,
        resetPasswordCode: null,
        resetPasswordExpires: null,
      },
    });
    return { success: true, message: 'Contraseña restablecida correctamente' };
  }

  async updatePhoto(userId: string, fotoUrl: string) {
    await this.prisma.usuarios.update({
      where: { idUsuario: userId },
      data: { foto: fotoUrl },
    });
  }

  async updateUser(
    userId: string,
    {
      telefono,
      direccion,
      idCiudad,
    }: { telefono: string; direccion: string; idCiudad: string },
  ) {
    // Verificar que la ciudad existe
    const ciudadObj = await this.prisma.ciudades.findUnique({
      where: { idCiudad: Number(idCiudad) },
    });
    if (!ciudadObj) throw new Error('Ciudad no encontrada');
    await this.prisma.usuarios.update({
      where: { idUsuario: userId },
      data: {
        telefono,
        direccion,
        idCiudad: ciudadObj.idCiudad,
      },
    });
  }
}
