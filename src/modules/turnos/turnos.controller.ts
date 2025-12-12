import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto, UpdateTurnoDto } from './dto/index';
import { Public } from '../../common/decorators';

/**
 * Controlador de Turnos
 * Maneja las operaciones CRUD de turnos
 */
@ApiTags('Turnos')
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  /**
   * Buscar turnos (public)
   * Nota: Turno = Viaje. Este endpoint reemplaza la búsqueda pública que antes vivía en /viajes/buscar.
   */
  @Get('buscar')
  @Public()
  @ApiOperation({
    summary: 'Buscar turnos disponibles (public)',
    description:
      'Busca turnos por origen/destino y fecha. Pensado para la landing/compra pública.',
  })
  async buscar(
    @Query('origen') origen?: string,
    @Query('destino') destino?: string,
    @Query('origenId') origenId?: string,
    @Query('destinoId') destinoId?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.turnosService.buscarPublico({
      origen,
      destino,
      origenId,
      destinoId,
      fecha,
    });
  }

  /**
   * Turnos por ruta/fecha (public)
   */
  @Get('ruta/:idRuta')
  @Public()
  @ApiOperation({
    summary: 'Listar turnos por ruta y fecha (public)',
    description:
      'Obtiene turnos de una ruta específica para una fecha. Pensado para consultas públicas.',
  })
  async findByRuta(
    @Param('idRuta') idRuta: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.turnosService.findByRutaPublico(idRuta, fecha);
  }

  /**
   * Asientos de un turno (public)
   */
  @Get(':id/asientos')
  @Public()
  @ApiOperation({
    summary: 'Obtener asientos de un turno (public)',
    description:
      'Devuelve cantidad de asientos y asientos ocupados según pasajes del turno.',
  })
  async getAsientos(@Param('id') id: string) {
    return this.turnosService.getAsientosPublico(id);
  }

  /**
   * Obtener todos los turnos
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todos los turnos',
    description:
      'Obtiene la lista completa de turnos registrados en el sistema con sus relaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de turnos obtenida exitosamente',
  })
  async findAll() {
    return this.turnosService.findAll();
  }

  /**
   * Obtener un turno por ID
   */
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener turno por ID',
    description: 'Obtiene la información detallada de un turno específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del turno (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Turno encontrado',
  })
  @ApiNotFoundResponse({ description: 'Turno no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async findOne(@Param('id') id: string) {
    return this.turnosService.findOne(id);
  }

  /**
   * Crear un nuevo turno
   */
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Crear nuevo turno',
    description: 'Registra un nuevo turno en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Turno creado exitosamente',
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  /**
   * Actualizar un turno existente
   */
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar turno',
    description: 'Actualiza la información de un turno existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del turno a actualizar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Turno actualizado exitosamente',
  })
  @ApiNotFoundResponse({ description: 'Turno no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async update(
    @Param('id') id: string,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  /**
   * Eliminar un turno
   */
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar turno',
    description: 'Elimina un turno del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del turno a eliminar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Turno eliminado exitosamente',
  })
  @ApiNotFoundResponse({ description: 'Turno no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async remove(@Param('id') id: string) {
    return this.turnosService.remove(id);
  }
}
