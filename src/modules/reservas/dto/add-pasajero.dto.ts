import { IsOptional, IsString, IsInt, IsPositive, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Puedes enviar:
 * - idCliente: cuando seleccionas un cliente ya creado (tomará nombre/tipoDoc/numDocumento)
 * - o los datos del pasajero manualmente (nombrePasajero, tipoDoc, numDocPasajero, edadPasajero)
 */
export class AddPasajeroDto {
  @IsOptional()
  @IsString()
  idCliente?: string;

  // Si no pasas idCliente, pasa los campos a continuación
  @ValidateIf((o) => !o.idCliente)
  @IsString()
  @Transform(({ value }: any) => (value === '' || value === null ? '' : String(value)))
  nombrePasajero?: string;

  @ValidateIf((o) => !o.idCliente)
  @IsString()
  @Transform(({ value }: any) => (value === '' || value === null ? '' : String(value)))
  tipoDoc?: string;

  @ValidateIf((o) => !o.idCliente)
  @IsString()
  @Transform(({ value }: any) => (value === '' || value === null ? '' : String(value)))
  numDocPasajero?: string;

  @ValidateIf((o) => !o.idCliente)
  @IsInt()
  @IsPositive()
  @Transform(({ value }: any) => (typeof value === 'string' ? parseInt(value) : value))
  edadPasajero?: number;

  @IsOptional()
  @IsString()
  telefono?: string;
}
