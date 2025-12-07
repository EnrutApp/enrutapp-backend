import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsPositive,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateDetalleReservaPasajeroDto } from './create-detalle-pasajero.dto';

export class UpdateReservaDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  idUsuario?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  idRuta?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  fecha?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  horaSalida?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => (value === null || value === '' ? null : Number(value)))
  cantidadPersonas?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : String(value)))
  idVehiculo?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : String(value)))
  idConductor?: string | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => (value === null || value === '' ? null : Number(value)))
  precioTotal?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  idMetodoPago?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  estadoReserva?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : value))
  fechaReserva?: string;

  // Si envías 'detalles' reemplaza los actuales (delete/create)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleReservaPasajeroDto)
  detalles?: CreateDetalleReservaPasajeroDto[];

  // Propiedades adicionales del frontend (se ignoran pero no lanzan error)
  @IsOptional()
  id?: string;

  @IsOptional()
  idCliente?: string;

  @IsOptional()
  nombreCliente?: string;

  @IsOptional()
  pasajeros?: any;

  @IsOptional()
  origen?: any;

  @IsOptional()
  destino?: any;

  @IsOptional()
  hora?: string;

  @IsOptional()
  precio?: number;

  @IsOptional()
  estado?: string;

  @IsOptional()
  nombreConductor?: string;

  @IsOptional()
  placaVehiculo?: string;

  [key: string]: any; // Permitir propiedades adicionales desconocidas
}
