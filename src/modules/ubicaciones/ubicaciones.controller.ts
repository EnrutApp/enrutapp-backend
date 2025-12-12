import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

import { Public } from '../../common/decorators';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('ubicaciones')
@ApiBearerAuth()
@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.ubicacionesService.create(createUbicacionDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.ubicacionesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.ubicacionesService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateUbicacionDto: UpdateUbicacionDto,
  ) {
    return this.ubicacionesService.update(id, updateUbicacionDto);
  }

  @Get(':id/rutas-activas')
  checkRutasActivas(@Param('id') id: string) {
    return this.ubicacionesService.checkRutasActivas(id);
  }

  @Delete(':id/force')
  forceDelete(@Param('id') id: string) {
    return this.ubicacionesService.forceDelete(id);
  }

  @Post('batch-delete')
  removeBatch(@Body() body: { ids: string[] }) {
    // Implement batch delete logic in service or verify if frontend iterates.
    // Frontend `handleDeleteMultipleConfirm` maps and calls remove one by one (Wait, line 387 in UbicacionesPage.jsx).
    // But `removeBatch` is defined in service line 40 as `apiClient.post('/ubicaciones/batch-delete', { ids })`.
    // UbicacionesPage.jsx DOES NOT USE removeBatch! It iterates:
    // const deletePromises = selectedUbicaciones.map(async ubicacionId => ... ubicacionesService.remove(ubicacionId) ...)
    // So `batch-delete` endpoint is NOT used by the current Page logic, but the Service has it.
    // I will implement it just in case, or leave it.
    // Actually, user said "al seleccionar masivamente... no se eliminan".
    // If UbicacionesPage iterates, it calls `remove` multiple times.
    // If `remove` fails because of dependencies, it returns error.
    // The frontend alerts: "FailedCount passed".

    // I don't STRICTLY need batch-delete if the frontend iterates.
    // But I DO need checkRutasActivas and forceDelete.
    return {
      message: 'Batch delete not implemented, checking iterative delete',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`[DEBUG] Attempting to delete Ubicacion with ID: ${id}`);
    return this.ubicacionesService.remove(id);
  }
}
