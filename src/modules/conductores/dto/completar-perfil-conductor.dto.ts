import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para completar perfil de conductor (self-service)
 * Usado cuando un usuario con rol Conductor completa su propio perfil
 */
export class CompletarPerfilConductorDto {
  @ApiProperty({
    description: 'ID de la categoría de licencia de conducción',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  idCategoriaLicencia!: string;

  @ApiProperty({
    description:
      'Fecha de vencimiento de la licencia (YYYY-MM-DD). Debe ser mayor a la fecha actual',
    example: '2025-12-31',
  })
  @IsDateString()
  fechaVencimientoLicencia!: string;

  @ApiProperty({
    description: 'Observaciones adicionales sobre el conductor (opcional)',
    example: 'Licencia actualizada recientemente',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
