import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CustomParseUUIDPipe } from 'src/common/pipes/parse-uuid.pipe';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { AddPasajeroDto } from './dto/add-pasajero.dto';
import { AssignConductorVehiculoDto } from './dto/assign-conductor-vehiculo.dto';

@Controller('reservas')
@UseGuards(JwtAuthGuard)
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  // ⭐ Endpoint de debug SIN autenticación
  @Public()
  @Get('debug/all')
  debugGetAll() {
    return this.reservasService.debugGetAllReservas();
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.reservasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.reservasService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateReservaDto) {
    return this.reservasService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id', CustomParseUUIDPipe) id: string, @Body() updateDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateDto);
  }

  @Put(':id')
  updateWithPut(@Param('id', CustomParseUUIDPipe) id: string, @Body() updateDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.reservasService.remove(id);
  }

  // Asignar vehículo + conductor
  @Patch(':id/asignar')
  assign(@Param('id', CustomParseUUIDPipe) id: string, @Body() body: AssignConductorVehiculoDto) {
    return this.reservasService.assignVehiculoConductor(id, body);
  }

  // Cambiar estado
  @Patch(':id/estado')
  changeEstado(@Param('id', CustomParseUUIDPipe) id: string, @Body('estado') estado: string) {
    return this.reservasService.changeEstado(id, estado);
  }

  // Agregar pasajero (por cliente o manual)
  @Post(':id/pasajeros')
  addPasajero(@Param('id', CustomParseUUIDPipe) id: string, @Body() dto: AddPasajeroDto) {
    return this.reservasService.addPasajero(id, dto);
  }

  // Eliminar pasajero por idDetalle
  @Delete(':id/pasajeros/:idDetalle')
  @HttpCode(204)
  removePasajero(@Param('idDetalle') idDetalle: string) {
    return this.reservasService.removePasajero(idDetalle);
  }
}
