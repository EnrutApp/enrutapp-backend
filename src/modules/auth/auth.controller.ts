import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/forgot-reset-password.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
  Patch,
  UseInterceptors,
  UploadedFile,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../../common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// Interfaces para tipado seguro
interface AuthenticatedRequest extends Request {
  user: {
    idUsuario: string;
    correo: string;
    idRol: string;
    [key: string]: unknown;
  };
}

interface UploadedFileData {
  filename: string;
  originalname: string;
  mimetype: string;
}

interface UpdateUserDto {
  telefono?: string;
  direccion?: string;
  idCiudad?: string | number;
}

interface CambiarEstadoDto {
  idUsuario: string;
  estado: boolean;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica un usuario con correo y contraseña, retorna un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso. Retorna token JWT y datos del usuario',
    schema: {
      example: {
        success: true,
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            idUsuario: '550e8400-e29b-41d4-a716-446655440000',
            nombre: 'Juan Pérez',
            correo: 'juan@example.com',
            rol: {
              idRol: '550e8400-e29b-41d4-a716-446655440001',
              nombreRol: 'Admin',
            },
          },
        },
        message: 'Login exitoso',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
    schema: {
      example: {
        success: false,
        error: 'Credenciales inválidas',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          idUsuario: '550e8400-e29b-41d4-a716-446655440000',
          nombre: 'Juan Pérez',
          correo: 'juan@example.com',
        },
        message: 'Usuario registrado exitosamente',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o correo ya registrado',
    schema: {
      example: {
        success: false,
        error: 'El correo ya está registrado',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Retorna la información del usuario actual basado en el token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          idUsuario: '550e8400-e29b-41d4-a716-446655440000',
          correo: 'juan@example.com',
          idRol: '550e8400-e29b-41d4-a716-446655440001',
        },
        message: 'Perfil obtenido exitosamente',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  getProfile(@Request() req: AuthenticatedRequest) {
    return {
      success: true,
      data: req.user,
      message: 'Perfil obtenido exitosamente',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description:
      'Permite al usuario autenticado cambiar su contraseña actual por una nueva',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Contraseña actualizada exitosamente',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o contraseña actual incorrecta',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.idUsuario,
      changePasswordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener datos completos del usuario',
    description:
      'Retorna toda la información del usuario autenticado incluyendo relaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario obtenidos exitosamente',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return {
      success: true,
      data: req.user,
      message: 'Usuario actual obtenido exitosamente',
    };
  }
  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un correo con el token para restablecer la contraseña',
  })
  @ApiResponse({
    status: 200,
    description: 'Correo de recuperación enviado',
    schema: {
      example: {
        success: true,
        message: 'Correo de recuperación enviado',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Correo no encontrado',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description: 'Restablece la contraseña usando el token recibido por correo',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
  })
  @ApiBadRequestResponse({
    description: 'Token inválido o expirado',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('foto')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Subir foto de perfil',
    description:
      'Permite al usuario subir o actualizar su foto de perfil (jpg, jpeg, png)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpg, jpeg, png)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Foto subida exitosamente',
    schema: {
      example: {
        success: true,
        foto: '/uploads/550e8400-e29b-41d4-a716-446655440000.jpg',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  @ApiBadRequestResponse({
    description: 'Formato de archivo no válido',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Solo imágenes jpg, jpeg, png'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: UploadedFileData,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.idUsuario;
    const fotoUrl = `/uploads/${file.filename}`;
    await this.authService.updatePhoto(userId, fotoUrl);
    return { success: true, foto: fotoUrl };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('foto')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Eliminar foto de perfil',
    description: 'Elimina la foto de perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Foto eliminada exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Foto de perfil eliminada',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async deletePhoto(@Req() req: AuthenticatedRequest) {
    const userId = req.user.idUsuario;
    await this.authService.deletePhoto(userId);
    return { success: true, message: 'Foto de perfil eliminada' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Actualizar datos del usuario',
    description:
      'Permite actualizar teléfono, dirección y ciudad del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Usuario actualizado correctamente',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateUserDto,
  ) {
    const userId = req.user.idUsuario;
    const { telefono = '', direccion = '', idCiudad = '' } = body;
    await this.authService.updateUser(userId, {
      telefono: String(telefono),
      direccion: String(direccion),
      idCiudad: String(idCiudad),
    });
    return { success: true, message: 'Usuario actualizado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('estado')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cambiar estado de usuario',
    description:
      'Activa o desactiva un usuario del sistema (requiere permisos de admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado',
    schema: {
      example: {
        success: true,
        message: 'Estado del usuario actualizado',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o sin permisos',
  })
  async cambiarEstadoUsuario(
    @Req() _req: AuthenticatedRequest,
    @Body() body: CambiarEstadoDto,
  ) {
    try {
      const userId = body.idUsuario;
      const nuevoEstado = body.estado;

      await this.authService.cambiarEstadoUsuario(userId, nuevoEstado);

      return {
        success: true,
        message: `Usuario ${nuevoEstado ? 'habilitado' : 'deshabilitado'} correctamente`,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      if (errorMessage === 'Usuario no encontrado') {
        throw new HttpException(
          {
            success: false,
            error: 'Usuario no encontrado',
            message: errorMessage,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (
        errorMessage === 'No se puede cambiar el estado de un administrador'
      ) {
        throw new HttpException(
          {
            success: false,
            error: 'Operación no permitida',
            message: errorMessage,
          },
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(
        {
          success: false,
          error: 'Error interno',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
