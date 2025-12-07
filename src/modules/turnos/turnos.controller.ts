import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
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

/**
 * Controlador de Turnos
 * Maneja las operaciones CRUD de turnos
 */
@ApiTags('Turnos')
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

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
