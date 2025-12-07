import { IsString, IsInt, IsPositive, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDetalleReservaPasajeroDto {
  @IsString()
  @Transform(({ value }: any) => String(value))
  nombrePasajero!: string;

  @IsString()
  @Transform(({ value }: any) => String(value))
  tipoDoc!: string;

  @IsString()
  @Transform(({ value }: any) => String(value))
  numDocPasajero!: string;

  @IsInt()
  @IsPositive()
  @Transform(({ value }: any) => (typeof value === 'string' ? parseInt(value) : value))
  edadPasajero!: number;

  // Propiedades opcionales del frontend
  @IsOptional()
  telefono?: string;
}
