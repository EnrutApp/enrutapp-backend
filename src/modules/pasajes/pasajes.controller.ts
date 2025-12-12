import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PasajesService } from './pasajes.service';
import { CreatePasajeDto } from './dto/create-pasaje.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pasajes')
@Controller('pasajes')
export class PasajesController {
  constructor(private readonly pasajesService: PasajesService) {}

  @Post()
  @ApiOperation({ summary: 'Vender un pasaje' })
  async create(@Body() createPasajeDto: CreatePasajeDto) {
    return this.pasajesService.create(createPasajeDto);
  }

  @Get('turno/:id')
  @ApiOperation({ summary: 'Listar pasajes de un turno (viaje)' })
  async findByViaje(@Param('id') id: string) {
    return this.pasajesService.findAllByTurno(id);
  }
}
