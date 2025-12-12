import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para actualizar un rol existente
 * Todos los campos son opcionales
 */
export class UpdateRolDto {
  @IsString({ message: 'El nombre del rol debe ser texto' })
  @IsOptional()
  nombreRol?: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  descripcion?: string;

  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  @IsOptional()
  estado?: boolean;

  // Alias para el estado desde el frontend
  @IsBoolean({ message: 'Activo debe ser verdadero o falso' })
  @IsOptional()
  activo?: boolean;

  @IsOptional()
  permissions?: string[];
}
