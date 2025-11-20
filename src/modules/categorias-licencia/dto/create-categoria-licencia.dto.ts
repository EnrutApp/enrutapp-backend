import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear una nueva categoría de licencia
 */
export class CreateCategoriaLicenciaDto {
  @ApiProperty({
    description:
      'ID único de la categoría de licencia (UUID). Si no se proporciona, se genera automáticamente',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsUUID(4, {
    message: 'El ID de la categoría debe ser un UUID válido',
  })
  @IsOptional()
  idCategoriaLicencia?: string;

  @ApiProperty({
    description:
      'Nombre de la categoría de licencia (A1, A2, B1, B2, B3, C1, C2, C3)',
    example: 'B1',
    type: String,
    maxLength: 10,
  })
  @IsString({ message: 'El nombre de la categoría debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @Length(2, 10, {
    message: 'El nombre de la categoría debe tener entre 2 y 10 caracteres',
  })
  nombreCategoria!: string;

  @ApiProperty({
    description: 'Descripción de la categoría de licencia',
    example: 'Automóviles, camperos, camionetas y microbuses',
    required: false,
    type: String,
    maxLength: 255,
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  @Length(1, 255, {
    message: 'La descripción no puede exceder 255 caracteres',
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Estado de la categoría (activo/inactivo)',
    example: true,
    required: false,
    type: Boolean,
    default: true,
  })
  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  @IsOptional()
  estado?: boolean;
}
