import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  // ===== RUTAS =====
  @Post()
  create(@Body() dto: CreateRutaDto) {
    return this.rutasService.create(dto);
  }

  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRutaDto) {
    return this.rutasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutasService.remove(id);
  }

  // ===== UBICACIONES =====
  @Post('ubicaciones')
  createUbicacion(@Body() body: any) {
    return this.rutasService.createUbicacion(body);
  }

  @Get('ubicaciones')
  findAllUbicaciones() {
    return this.rutasService.findAllUbicaciones();
  }

  // ===== ORIGEN =====
  @Post('origen')
  createOrigen(@Body() body: any) {
    return this.rutasService.createOrigen(body);
  }

  @Get('origen')
  findAllOrigenes() {
    return this.rutasService.findAllOrigenes();
  }

  @Get('origen/por-ubicacion/:id')
  findOrigenByUbicacion(@Param('id') id: string) {
    return this.rutasService.findOrigenByUbicacion(id);
  }

  // ===== DESTINO =====
  @Post('destino')
  createDestino(@Body() body: any) {
    return this.rutasService.createDestino(body);
  }

  @Get('destino')
  findAllDestinos() {
    return this.rutasService.findAllDestinos();
  }

  @Get('destino/por-ubicacion/:id')
  findDestinoByUbicacion(@Param('id') id: string) {
    return this.rutasService.findDestinoByUbicacion(id);
  }
}
