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
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { CategoriasLicenciaService } from './categorias-licencia.service';
import {
  CreateCategoriaLicenciaDto,
  UpdateCategoriaLicenciaDto,
} from './dto/index';

/**
 * Controlador de Categorías de Licencia
 * Maneja las operaciones CRUD de categorías de licencia de conducción
 */
@ApiTags('Categorías de Licencia')
@Controller('categorias-licencia')
export class CategoriasLicenciaController {
  constructor(
    private readonly categoriasLicenciaService: CategoriasLicenciaService,
  ) {}

  /**
   * Obtener todas las categorías de licencia
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todas las categorías de licencia',
    description:
      'Obtiene la lista completa de categorías de licencia de conducción activas en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    schema: {
      example: {
        success: true,
        data: [
          {
            idCategoriaLicencia: '550e8400-e29b-41d4-a716-446655440001',
            nombreCategoria: 'B1',
            descripcion: 'Automóviles, camperos, camionetas y microbuses',
            estado: true,
          },
        ],
        message: 'Categorías de licencia obtenidas exitosamente',
      },
    },
  })
  async findAll() {
    return this.categoriasLicenciaService.findAll();
  }

  /**
   * Obtener una categoría de licencia por ID
   */
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener categoría de licencia por ID',
    description:
      'Obtiene la información detallada de una categoría de licencia específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría de licencia (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría de licencia encontrada',
  })
  @ApiNotFoundResponse({
    description: 'Categoría de licencia no encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async findOne(@Param('id') id: string) {
    return this.categoriasLicenciaService.findOne(id);
  }

  /**
   * Crear una nueva categoría de licencia
   */
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Crear nueva categoría de licencia',
    description: 'Registra una nueva categoría de licencia en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría de licencia creada exitosamente',
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiConflictResponse({
    description: 'La categoría de licencia ya existe',
  })
  async create(@Body() createCategoriaLicenciaDto: CreateCategoriaLicenciaDto) {
    return this.categoriasLicenciaService.create(createCategoriaLicenciaDto);
  }

  /**
   * Actualizar una categoría de licencia existente
   */
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar categoría de licencia',
    description:
      'Actualiza la información de una categoría de licencia existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría de licencia a actualizar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría de licencia actualizada exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Categoría de licencia no encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
  })
  @ApiConflictResponse({
    description: 'La categoría de licencia ya está en uso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaLicenciaDto: UpdateCategoriaLicenciaDto,
  ) {
    return this.categoriasLicenciaService.update(
      id,
      updateCategoriaLicenciaDto,
    );
  }

  /**
   * Eliminar una categoría de licencia
   */
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar categoría de licencia',
    description: 'Desactiva una categoría de licencia del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría de licencia a eliminar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría de licencia eliminada exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Categoría de licencia no encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async remove(@Param('id') id: string) {
    return this.categoriasLicenciaService.remove(id);
  }
}
