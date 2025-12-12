import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@ApiTags('Rutas')
@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  /**
   * Crear una nueva ruta de transporte
   */
  @Post()
  @ApiOperation({ summary: 'Crear una nueva ruta' })
  create(@Body() dto: CreateRutaDto) {
    return this.rutasService.create(dto);
  }

  /**
   * Obtener todas las rutas
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas las rutas' })
  findAll() {
    return this.rutasService.findAll();
  }

  /**
   * Crear una nueva ubicación
   */
  @Post('ubicaciones')
  @ApiOperation({ summary: 'Crear ubicación' })
  createUbicacion(@Body() body: any) {
    return this.rutasService.createUbicacion(body);
  }

  /**
   * Listar todas las ubicaciones
   */
  @Get('ubicaciones')
  @ApiOperation({ summary: 'Listar ubicaciones' })
  findAllUbicaciones() {
    return this.rutasService.findAllUbicaciones();
  }

  /**
   * Crear un nuevo origen
   */
  @Post('origen')
  @ApiOperation({ summary: 'Crear origen' })
  createOrigen(@Body() body: any) {
    return this.rutasService.createOrigen(body);
  }

  /**
   * Listar todos los orígenes
   */
  @Get('origen')
  @ApiOperation({ summary: 'Listar orígenes' })
  findAllOrigenes() {
    return this.rutasService.findAllOrigenes();
  }

  /**
   * Buscar origen por ID de ubicación
   */
  @Get('origen/por-ubicacion/:id')
  @ApiOperation({ summary: 'Buscar origen por ubicación' })
  findOrigenByUbicacion(@Param('id') id: string) {
    return this.rutasService.findOrigenByUbicacion(id);
  }

  /**
   * Crear un nuevo destino
   */
  @Post('destino')
  @ApiOperation({ summary: 'Crear destino' })
  createDestino(@Body() body: any) {
    return this.rutasService.createDestino(body);
  }

  /**
   * Listar todos los destinos
   */
  @Get('destino')
  @ApiOperation({ summary: 'Listar destinos' })
  findAllDestinos() {
    return this.rutasService.findAllDestinos();
  }

  /**
   * Buscar destino por ID de ubicación
   */
  @Get('destino/por-ubicacion/:id')
  @ApiOperation({ summary: 'Buscar destino por ubicación' })
  findDestinoByUbicacion(@Param('id') id: string) {
    return this.rutasService.findDestinoByUbicacion(id);
  }

  /**
   * Obtener una ruta por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener ruta por ID' })
  findOne(@Param('id') id: string) {
    return this.rutasService.findOne(id);
  }

  /**
   * Actualizar una ruta
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una ruta existente' })
  update(@Param('id') id: string, @Body() dto: UpdateRutaDto) {
    return this.rutasService.update(id, dto);
  }

  /**
   * Eliminar una ruta
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ruta' })
  remove(@Param('id') id: string) {
    return this.rutasService.remove(id);
  }
}
