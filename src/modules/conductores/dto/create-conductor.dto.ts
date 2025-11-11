import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

/**
 * DTO para crear un nuevo conductor
 */
export class CreateConductorDto {
  @ApiProperty({
    description:
      'ID único del conductor (UUID v4). Si no se proporciona, se genera automáticamente',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsUUID(4, { message: 'El ID del conductor debe ser un UUID válido' })
  @IsOptional()
  idConductor?: string;

  @ApiProperty({
    description: 'Nombre del conductor',
    example: 'Juan',
    type: String,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 100, {
    message: 'El nombre debe tener entre 2 y 100 caracteres',
  })
  nombre!: string;

  @ApiProperty({
    description: 'Apellido del conductor',
    example: 'Pérez García',
    type: String,
    maxLength: 100,
  })
  @IsString({ message: 'El apellido debe ser texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @Length(2, 100, {
    message: 'El apellido debe tener entre 2 y 100 caracteres',
  })
  apellido!: string;

  @ApiProperty({
    description: 'Número de cédula del conductor (único)',
    example: '1234567890',
    type: String,
    maxLength: 20,
  })
  @IsString({ message: 'La cédula debe ser texto' })
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  @Matches(/^[0-9]+$/, {
    message: 'La cédula solo puede contener números',
  })
  cedula!: string;

  @ApiProperty({
    description: 'Número de teléfono del conductor',
    example: '3001234567',
    type: String,
    maxLength: 20,
  })
  @IsString({ message: 'El teléfono debe ser texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Length(10, 20, {
    message: 'El teléfono debe tener entre 10 y 20 caracteres',
  })
  @Matches(/^[0-9+\-\s]+$/, {
    message: 'El teléfono solo puede contener números, +, - o espacios',
  })
  telefono!: string;

  @ApiProperty({
    description: 'Correo electrónico del conductor (opcional, único)',
    example: 'juan.perez@example.com',
    required: false,
    type: String,
  })
  @IsEmail({}, { message: 'El correo debe ser válido' })
  @IsOptional()
  correo?: string;

  @ApiProperty({
    description: 'Número de licencia de conducción (único)',
    example: 'CC123456789ABC',
    type: String,
    maxLength: 50,
  })
  @IsString({ message: 'La licencia debe ser texto' })
  @IsNotEmpty({ message: 'La licencia es obligatoria' })
  @Length(5, 50, {
    message: 'La licencia debe tener entre 5 y 50 caracteres',
  })
  licencia!: string;

  @ApiProperty({
    description: 'Estado del conductor (activo/inactivo)',
    example: true,
    required: false,
    type: Boolean,
    default: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  @IsOptional()
  estado?: boolean;

  @ApiProperty({
    description:
      'URL relativa de la foto del conductor (se asigna automáticamente al subir el archivo "foto")',
    example: '/uploads/conductores/550e8400-e29b-41d4-a716-446655440001.jpg',
    required: false,
    type: String,
    maxLength: 255,
  })
  @IsString({ message: 'La URL de la foto debe ser texto' })
  @IsOptional()
  @Length(1, 255, {
    message: 'La URL de la foto no puede exceder 255 caracteres',
  })
  fotoUrl?: string;
}
