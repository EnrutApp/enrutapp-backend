import { IsString } from 'class-validator';

export class AssignConductorVehiculoDto {
  @IsString()
  idVehiculo!: string;

  @IsString()
  idConductor!: string;
}
