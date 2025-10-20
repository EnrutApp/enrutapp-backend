import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CiudadesService } from './ciudades.service';
import { Public } from '../../common/decorators';

/**
 * Controlador de Ciudades
 * Maneja las operaciones relacionadas con ciudades
 */
@ApiTags('Ciudades')
@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) {}

  /**
   * Obtener todas las ciudades
   * Endpoint público
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar ciudades',
    description:
      'Obtiene el catálogo completo de ciudades disponibles en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo de ciudades',
    schema: {
      example: {
        success: true,
        data: [
          {
            idCiudad: 1,
            nombreCiudad: 'Bogotá',
            departamento: 'Cundinamarca',
          },
          {
            idCiudad: 2,
            nombreCiudad: 'Medellín',
            departamento: 'Antioquia',
          },
        ],
      },
    },
  })
  async findAll() {
    return this.ciudadesService.findAll();
  }
}
