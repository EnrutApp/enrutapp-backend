import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateDetalleReservaPasajeroDto } from './create-detalle-pasajero.dto';

export class CreateReservaDto {
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? '' : String(value)))
  idUsuario!: string; // cliente que solicita la reserva

  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? '' : String(value)))
  idRuta!: string;

  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? '' : String(value)))
  fecha!: string; // ISO date (YYYY-MM-DD)

  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? '' : String(value)))
  horaSalida!: string; // Formato: HH:mm

  @IsInt()
  @IsPositive()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value) : value))
  cantidadPersonas!: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : String(value)))
  idVehiculo?: string | null; // opcional al crear

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : String(value)))
  idConductor?: string | null; // opcional al crear

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => (value === null || value === '' || value === undefined ? null : parseFloat(value)))
  precioTotal?: number;

  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? '' : String(value)))
  idMetodoPago!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? null : String(value)))
  fechaReserva?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null ? 'Pendiente' : String(value)))
  estadoReserva?: string; // Por defecto: 'Pendiente'

  // pasajeros opcionales al crear (detalles, cuando no se seleccionan desde Clientes)
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
