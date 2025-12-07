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
import { ReservasModule } from './modules/reservas/reservas.module';

@Module({
  imports: [
    DatabaseModule,
    PrismaModule,
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
    ReservasModule,
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