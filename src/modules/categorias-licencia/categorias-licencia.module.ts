import { Module } from '@nestjs/common';
import { CategoriasLicenciaController } from './categorias-licencia.controller';
import { CategoriasLicenciaService } from './categorias-licencia.service';
import { PrismaService } from '../../database/prisma.service';

/**
 * Módulo de Categorías de Licencia
 * Gestiona las categorías de licencia de conducción
 */
@Module({
  controllers: [CategoriasLicenciaController],
  providers: [CategoriasLicenciaService, PrismaService],
  exports: [CategoriasLicenciaService],
})
export class CategoriasLicenciaModule {}
