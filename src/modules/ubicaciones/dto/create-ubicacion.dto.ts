import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUbicacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la ubicación es obligatorio' })
  nombreUbicacion!: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitud?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitud?: number;
}