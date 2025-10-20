import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear un nuevo tipo de documento
 */
export class CreateTipoDocumentoDto {
  @ApiProperty({
    description: 'Nombre completo del tipo de documento',
    example: 'Cédula de Ciudadanía',
    type: String,
  })
  @IsString({ message: 'El nombre del tipo de documento debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del tipo de documento es obligatorio' })
  nombreTipoDoc!: string;

  @ApiProperty({
    description: 'Abreviatura del tipo de documento',
    example: 'CC',
    required: false,
    type: String,
  })
  @IsString({ message: 'La abreviatura debe ser texto' })
  @IsOptional()
  abreviatura?: string;
}
