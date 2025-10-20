import { Module } from '@nestjs/common';
import { TiposDocumentoController } from './tipos-documento.controller';
import { TiposDocumentoService } from './tipos-documento.service';

/**
 * Módulo de Tipos de Documento
 * Gestiona los tipos de documento disponibles en el sistema
 */
@Module({
  controllers: [TiposDocumentoController],
  providers: [TiposDocumentoService],
  exports: [TiposDocumentoService],
})
export class TiposDocumentoModule {}
