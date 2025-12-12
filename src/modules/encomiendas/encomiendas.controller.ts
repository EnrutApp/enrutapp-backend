import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { EncomiendasService } from './encomiendas.service';
import { CreateEncomiendaDto } from './dto/create-encomienda.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Encomiendas')
@Controller('encomiendas')
export class EncomiendasController {
  constructor(private readonly encomiendasService: EncomiendasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una encomienda' })
  async create(@Body() createEncomiendaDto: CreateEncomiendaDto) {
    return this.encomiendasService.create(createEncomiendaDto);
  }

  @Get('turno/:id')
  @ApiOperation({ summary: 'Listar encomiendas de un turno (viaje)' })
  async findByViaje(@Param('id') id: string) {
    return this.encomiendasService.findAllByTurno(id);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de encomienda' })
  async updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.encomiendasService.updateEstado(id, estado);
  }
}
