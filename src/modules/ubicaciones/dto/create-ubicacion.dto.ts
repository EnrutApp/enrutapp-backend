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
<<<<<<< HEAD
  @IsNumber()
  @Type(() => Number)
  latitud?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitud?: number;
}
=======
  @IsBoolean({ message: 'El estado debe ser verdadero o falso' })
  estado?: boolean;

  @IsOptional()
  latitud?: number;

  @IsOptional()
  longitud?: number;
}
>>>>>>> d490ac7d89576ca24f0665c24fe76b4ab8e51d74
