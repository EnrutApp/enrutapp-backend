import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsInt,
  IsPositive,
  IsNumber,
  IsDateString,
  Length,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

/**
 * DTO para crear un nuevo vehículo
 */
export class CreateVehiculoDto {
  @ApiProperty({
    description:
      'ID único del vehículo (UUID v4). Si no se proporciona, se genera automáticamente',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsUUID(4, { message: 'El ID del vehículo debe ser un UUID válido' })
  @IsOptional()
  idVehiculo?: string;

  @ApiProperty({
    description: 'ID del tipo de vehículo',
    example: '550e8400-e29b-41d4-a716-446655440010',
    type: String,
    format: 'uuid',
  })
  @IsUUID(4, { message: 'El ID del tipo de vehículo debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El tipo de vehículo es obligatorio' })
  idTipoVehiculo!: string;

  @ApiProperty({
    description: 'ID de la marca del vehículo',
    example: '550e8400-e29b-41d4-a716-446655440020',
    type: String,
    format: 'uuid',
  })
  @IsUUID(4, { message: 'El ID de la marca debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La marca del vehículo es obligatoria' })
  idMarcaVehiculo!: string;

  @ApiProperty({
    description: 'Placa del vehículo (hasta 10 caracteres)',
    example: 'ABC123',
    type: String,
    maxLength: 10,
  })
  @IsString({ message: 'La placa debe ser texto' })
  @IsNotEmpty({ message: 'La placa es obligatoria' })
  @Length(3, 10, { message: 'La placa debe tener entre 3 y 10 caracteres' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'La placa solo puede contener letras mayúsculas y números',
  })
  placa!: string;

  @ApiProperty({
    description: 'Línea o modelo del vehículo',
    example: 'Corolla',
    type: String,
    maxLength: 50,
  })
  @IsString({ message: 'La línea debe ser texto' })
  @IsNotEmpty({ message: 'La línea del vehículo es obligatoria' })
  linea!: string;

  @ApiProperty({
    description: 'Año del modelo del vehículo',
    example: 2023,
    type: Number,
    minimum: 1900,
    maximum: 2100,
  })
  @IsInt({ message: 'El modelo debe ser un número entero' })
  @IsPositive({ message: 'El modelo debe ser un número positivo' })
  @Min(1900, { message: 'El modelo no puede ser menor a 1900' })
  @Max(2100, { message: 'El modelo no puede ser mayor a 2100' })
  @Type(() => Number)
  modelo!: number;

  @ApiProperty({
    description: 'Color del vehículo',
    example: 'Blanco',
    type: String,
    maxLength: 30,
  })
  @IsString({ message: 'El color debe ser texto' })
  @IsNotEmpty({ message: 'El color es obligatorio' })
  color!: string;

  @ApiProperty({
    description:
      'Número VIN del vehículo (Vehicle Identification Number - 17 caracteres)',
    example: '1HGBH41JXMN109186',
    required: false,
    type: String,
    maxLength: 17,
  })
  @IsString({ message: 'El VIN debe ser texto' })
  @IsOptional()
  @Length(17, 17, { message: 'El VIN debe tener exactamente 17 caracteres' })
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'El VIN debe contener solo caracteres alfanuméricos válidos',
  })
  vin?: string;

  @ApiProperty({
    description: 'Capacidad de pasajeros del vehículo',
    example: 5,
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: 'La capacidad de pasajeros debe ser un número entero' })
  @IsPositive({ message: 'La capacidad de pasajeros debe ser positiva' })
  @Min(1, { message: 'La capacidad debe ser al menos 1' })
  @Type(() => Number)
  capacidadPasajeros!: number;

  @ApiProperty({
    description:
      'Capacidad de carga del vehículo en kilogramos (opcional, con 2 decimales)',
    example: 1500.5,
    required: false,
    type: Number,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'La capacidad de carga debe ser un número con máximo 2 decimales',
    },
  )
  @IsPositive({ message: 'La capacidad de carga debe ser positiva' })
  @IsOptional()
  @Type(() => Number)
  capacidadCarga?: number;

  @ApiProperty({
    description: 'Fecha de vencimiento del SOAT',
    example: '2025-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha de vencimiento del SOAT debe ser válida' },
  )
  @IsOptional()
  soatVencimiento?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento de la revisión tecnomecánica',
    example: '2025-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha de vencimiento de la tecnomecánica debe ser válida' },
  )
  @IsOptional()
  tecnomecanicaVencimiento?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento del seguro',
    example: '2025-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha de vencimiento del seguro debe ser válida' },
  )
  @IsOptional()
  seguroVencimiento?: string;

  @ApiProperty({
    description: 'Estado del vehículo (activo/inactivo)',
    example: true,
    required: false,
    type: Boolean,
    default: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    // Para evitar retornar `any`, en otros casos no transformar el campo
    return undefined;
  })
  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  @IsOptional()
  estado?: boolean;

  @ApiProperty({
    description:
      'URL relativa de la foto del vehículo (se asigna automáticamente al subir el archivo "foto")',
    example: '/uploads/vehiculos/550e8400-e29b-41d4-a716-446655440001.jpg',
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
