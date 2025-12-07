import { Module } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { UbicacionesController } from './ubicaciones.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [UbicacionesController],
  providers: [UbicacionesService, PrismaService],
})
export class UbicacionesModule {}