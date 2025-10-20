import {
  IsEmail,
  IsString,
  IsUUID,
  MinLength,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

/**
 * DTO para actualizar un usuario existente
 * Todos los campos son opcionales
 */
export class UpdateUsuarioDto {
  @IsUUID(4, { message: 'El ID del rol debe ser un UUID válido' })
  @IsOptional()
  idRol?: string;

  @IsUUID(4, { message: 'El tipo de documento debe ser un UUID válido' })
  @IsOptional()
  tipoDoc?: string;

  @IsString({ message: 'El número de documento debe ser texto' })
  @IsOptional()
  numDocumento?: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsOptional()
  nombre?: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  @IsOptional()
  telefono?: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsOptional()
  correo?: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsOptional()
  contrasena?: string;

  @IsString({ message: 'La dirección debe ser texto' })
  @IsOptional()
  direccion?: string;

  @IsInt({ message: 'El ID de ciudad debe ser un número entero' })
  @IsOptional()
  idCiudad?: number;

  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  @IsOptional()
  estado?: boolean;
}
