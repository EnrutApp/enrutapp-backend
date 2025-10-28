import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { CiudadesModule } from './modules/ciudades/ciudades.module';
import { TiposDocumentoModule } from './modules/tipos-documento/tipos-documento.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RutasModule } from './modules/Rutas/rutas.module';

/**
 * Módulo raíz de la aplicación
 * Importa todos los módulos de funcionalidad
 */
@Module({
  imports: [
    // Módulo global de base de datos
    DatabaseModule,

    // Módulos de funcionalidad
    AuthModule,
    UsuariosModule,
    RolesModule,
    CiudadesModule,
    TiposDocumentoModule,
    RutasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
