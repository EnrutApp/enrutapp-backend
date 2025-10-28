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
import { VehiculosModule } from './modules/vehiculos/vehiculos.module';
import { TiposVehiculoModule } from './modules/tipos-vehiculo/tipos-vehiculo.module';
import { MarcasVehiculosModule } from './modules/marcas-vehiculos/marcas-vehiculos.module';
import { UbicacionesModule } from './modules/ubicaciones/ubicaciones.module';
import { PrismaModule } from './database/prisma.module';
import { RutasModule } from './modules/Rutas/rutas.module';

/**
 * Módulo raíz de la aplicación
 * Importa todos los módulos de funcionalidad
 */
@Module({
  imports: [
    // Módulo global de base de datos
    DatabaseModule,
    PrismaModule,

    // Módulos de funcionalidad
    AuthModule,
    UsuariosModule,
    RolesModule,
    CiudadesModule,
    TiposDocumentoModule,
    VehiculosModule,
    TiposVehiculoModule,
    MarcasVehiculosModule,
    UbicacionesModule,
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
