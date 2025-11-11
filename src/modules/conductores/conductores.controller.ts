import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  ApiConsumes,
} from '@nestjs/swagger';
import { ConductoresService } from './conductores.service';
import { CreateConductorDto, UpdateConductorDto } from './dto/index';

/**
 * Controlador de Conductores
 * Maneja las operaciones CRUD de conductores
 */
@ApiTags('Conductores')
@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  /**
   * Obtener todos los conductores
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todos los conductores',
    description:
      'Obtiene la lista completa de conductores registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores obtenida exitosamente',
    schema: {
      example: {
        success: true,
        data: [
          {
            idConductor: '550e8400-e29b-41d4-a716-446655440001',
            nombre: 'Juan',
            apellido: 'Pérez',
            cedula: '1234567890',
            telefono: '3001234567',
            correo: 'juan@example.com',
            licencia: 'CC123456',
            estado: true,
          },
        ],
        message: 'Conductores obtenidos exitosamente',
      },
    },
  })
  async findAll() {
    return this.conductoresService.findAll();
  }

  /**
   * Obtener un conductor por ID
   */
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener conductor por ID',
    description: 'Obtiene la información detallada de un conductor específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Conductor encontrado',
  })
  @ApiNotFoundResponse({
    description: 'Conductor no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async findOne(@Param('id') id: string) {
    return this.conductoresService.findOne(id);
  }

  /**
   * Crear un nuevo conductor
   */
  @ApiBearerAuth('JWT-auth')
  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Crear nuevo conductor',
    description: 'Registra un nuevo conductor en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Conductor creado exitosamente',
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiConflictResponse({
    description: 'La cédula o licencia del conductor ya existe',
  })
  async create(
    @Body() createConductorDto: CreateConductorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.conductoresService.create(createConductorDto, file);
  }

  /**
   * Actualizar un conductor existente
   */
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar conductor',
    description: 'Actualiza la información de un conductor existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor a actualizar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Conductor actualizado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Conductor no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
  })
  @ApiConflictResponse({
    description: 'La cédula o licencia ya está en uso',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateConductorDto: UpdateConductorDto,
  ) {
    return this.conductoresService.update(id, updateConductorDto);
  }

  /**
   * Eliminar un conductor
   */
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar conductor',
    description: 'Elimina un conductor del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor a eliminar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Conductor eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Conductor no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async remove(@Param('id') id: string) {
    return this.conductoresService.remove(id);
  }

  /**
   * Subir/actualizar la foto de un conductor
   */
  @ApiBearerAuth('JWT-auth')
  @Post(':id/foto')
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Subir o actualizar foto del conductor',
    description:
      'Sube un archivo de imagen (jpg, png, webp) y actualiza el campo fotoUrl del conductor',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({ status: 200, description: 'Foto actualizada correctamente' })
  @ApiBadRequestResponse({
    description: 'Archivo inválido o datos incorrectos',
  })
  @ApiNotFoundResponse({ description: 'Conductor no encontrado' })
  async uploadFoto(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.conductoresService.actualizarFoto(id, file);
  }
}
