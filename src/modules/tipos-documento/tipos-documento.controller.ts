import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TiposDocumentoService } from './tipos-documento.service';
import { Public } from '../../common/decorators';
import { CreateTipoDocumentoDto } from './dto';

/**
 * Controlador de Tipos de Documento
 * Maneja las operaciones relacionadas con tipos de documento
 */
@ApiTags('Tipos de Documento')
@Controller('tipos-documento')
export class TiposDocumentoController {
  constructor(private readonly tiposDocumentoService: TiposDocumentoService) {}

  /**
   * Obtener todos los tipos de documento
   * Endpoint público
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar tipos de documento',
    description:
      'Obtiene el catálogo completo de tipos de documento disponibles (CC, TI, Pasaporte, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo de tipos de documento',
    schema: {
      example: {
        success: true,
        data: [
          {
            idTipoDoc: '550e8400-e29b-41d4-a716-446655440001',
            nombreTipoDoc: 'Cédula de Ciudadanía',
            abreviatura: 'CC',
          },
          {
            idTipoDoc: '550e8400-e29b-41d4-a716-446655440002',
            nombreTipoDoc: 'Tarjeta de Identidad',
            abreviatura: 'TI',
          },
        ],
      },
    },
  })
  async findAll() {
    return this.tiposDocumentoService.findAll();
  }

  /**
   * Crear un nuevo tipo de documento
   * Endpoint público
   */
  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear tipo de documento',
    description: 'Registra un nuevo tipo de documento en el catálogo',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de documento creado exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          idTipoDoc: '550e8400-e29b-41d4-a716-446655440003',
          nombreTipoDoc: 'Pasaporte',
          abreviatura: 'PS',
        },
        message: 'Tipo de documento creado exitosamente',
      },
    },
  })
  async create(@Body() createTipoDocDto: CreateTipoDocumentoDto) {
    return this.tiposDocumentoService.create(createTipoDocDto);
  }
}
