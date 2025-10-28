import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@enrutapp.com',
    type: String,
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  correo!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
    type: String,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena!: string;

  @ApiProperty({
    description: 'Recordar sesión del usuario',
    example: true,
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'Remember debe ser un booleano' })
  remember?: boolean;
}

export class RegisterDto {
  @ApiProperty({
    description: 'ID del rol asignado al usuario',
    example: '550e8400-e29b-41d4-a716-446655440001',
    type: String,
    format: 'uuid',
  })
  @IsUUID('all', { message: 'El ID del rol debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del rol es obligatorio' })
  idRol!: string;

  @ApiProperty({
    description: 'ID del tipo de documento (CC, TI, Pasaporte, etc.)',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    format: 'uuid',
  })
  @IsUUID('all', {
    message: 'El ID del tipo de documento debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  tipoDoc!: string;

  @ApiProperty({
    description: 'Número de documento de identidad',
    example: '1234567890',
    type: String,
  })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  numDocumento!: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
    type: String,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @ApiProperty({
    description: 'Número de teléfono de contacto',
    example: '+57 3001234567',
    type: String,
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono!: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@example.com',
    type: String,
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  correo!: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'securePassword123',
    minLength: 6,
    type: String,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena!: string;

  @ApiProperty({
    description: 'Dirección de residencia del usuario',
    example: 'Calle 123 #45-67, Barrio Centro',
    type: String,
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion!: string;

  @ApiProperty({
    description: 'ID de la ciudad de residencia',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  idCiudad!: number;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'oldPassword123',
    type: String,
  })
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria' })
  contrasenaActual!: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario (mínimo 6 caracteres)',
    example: 'newPassword456',
    minLength: 6,
    type: String,
  })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  nuevaContrasena!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  ciudad?: string;
}

// Interfaces para respuestas
export interface AuthResponse {
  success: boolean;
  data?: {
    access_token: string;
    user: {
      idUsuario: string;
      nombre: string;
      correo: string;
      rol: {
        idRol: string;
        nombreRol: string;
      };
      tipoDocumento?: {
        idTipoDoc: string;
        nombreTipoDoc: string;
      };
      ciudad?: {
        idCiudad: number;
        nombreCiudad: string;
      };
    };
    expires_in?: string;
  };
  message?: string;
  error?: string;
}

export interface JwtPayload {
  sub: string; // idUsuario
  correo: string;
  nombre: string;
  rol: string;
  iat?: number;
  exp?: number;
}
