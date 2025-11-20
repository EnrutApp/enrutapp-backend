-- CreateTable
CREATE TABLE "Usuarios" (
    "idUsuario" VARCHAR(36) NOT NULL,
    "idRol" VARCHAR(36) NOT NULL,
    "foto" TEXT,
    "tipoDoc" VARCHAR(36) NOT NULL,
    "numDocumento" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "idCiudad" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "resetPasswordCode" VARCHAR(100),
    "resetPasswordExpires" TIMESTAMP(3),

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Ciudades" (
    "idCiudad" SERIAL NOT NULL,
    "nombreCiudad" VARCHAR(100) NOT NULL,

    CONSTRAINT "Ciudades_pkey" PRIMARY KEY ("idCiudad")
);

-- CreateTable
CREATE TABLE "Roles" (
    "idRol" VARCHAR(36) NOT NULL,
    "nombreRol" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "TiposDoc" (
    "idTipoDoc" VARCHAR(36) NOT NULL,
    "nombreTipoDoc" VARCHAR(50) NOT NULL,

    CONSTRAINT "TiposDoc_pkey" PRIMARY KEY ("idTipoDoc")
);

-- CreateTable
CREATE TABLE "TiposVehiculo" (
    "idTipoVehiculo" VARCHAR(36) NOT NULL,
    "nombreTipoVehiculo" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TiposVehiculo_pkey" PRIMARY KEY ("idTipoVehiculo")
);

-- CreateTable
CREATE TABLE "MarcasVehiculos" (
    "idMarcaVehiculo" VARCHAR(36) NOT NULL,
    "nombreMarca" VARCHAR(50) NOT NULL,
    "pais" VARCHAR(50),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarcasVehiculos_pkey" PRIMARY KEY ("idMarcaVehiculo")
);

-- CreateTable
CREATE TABLE "Vehiculos" (
    "idVehiculo" VARCHAR(36) NOT NULL,
    "idTipoVehiculo" VARCHAR(36) NOT NULL,
    "idMarcaVehiculo" VARCHAR(36) NOT NULL,
    "idPropietario" VARCHAR(36) NOT NULL,
    "idConductorAsignado" VARCHAR(36),
    "placa" VARCHAR(10) NOT NULL,
    "linea" VARCHAR(50) NOT NULL,
    "modelo" INTEGER NOT NULL,
    "color" VARCHAR(30) NOT NULL,
    "vin" VARCHAR(17),
    "fotoUrl" VARCHAR(255) NOT NULL,
    "capacidadPasajeros" INTEGER NOT NULL,
    "capacidadCarga" DECIMAL(10,2),
    "soatVencimiento" TIMESTAMP(3),
    "tecnomecanicaVencimiento" TIMESTAMP(3),
    "seguroVencimiento" TIMESTAMP(3),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehiculos_pkey" PRIMARY KEY ("idVehiculo")
);

-- CreateTable
CREATE TABLE "Ubicaciones" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "idUbicacion" VARCHAR(36) NOT NULL,
    "nombreUbicacion" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("idUbicacion")
);

-- CreateTable
CREATE TABLE "Origen" (
    "idOrigen" VARCHAR(36) NOT NULL,
    "idUbicacion" VARCHAR(36) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "Origen_pkey" PRIMARY KEY ("idOrigen")
);

-- CreateTable
CREATE TABLE "Destino" (
    "idDestino" VARCHAR(36) NOT NULL,
    "idUbicacion" VARCHAR(36) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "Destino_pkey" PRIMARY KEY ("idDestino")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "idRuta" VARCHAR(36) NOT NULL,
    "idOrigen" VARCHAR(36) NOT NULL,
    "idDestino" VARCHAR(36) NOT NULL,
    "distancia" DECIMAL(10,2),
    "observaciones" VARCHAR(100),
    "tiempoEstimado" VARCHAR(10),
    "precioBase" DECIMAL(10,2),
    "estado" VARCHAR(50),

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("idRuta")
);

-- CreateTable
CREATE TABLE "CategoriasLicencia" (
    "idCategoriaLicencia" VARCHAR(36) NOT NULL,
    "nombreCategoria" VARCHAR(10) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriasLicencia_pkey" PRIMARY KEY ("idCategoriaLicencia")
);

-- CreateTable
CREATE TABLE "Conductores" (
    "idConductor" VARCHAR(36) NOT NULL,
    "idUsuario" VARCHAR(36) NOT NULL,
    "numeroLicencia" VARCHAR(50) NOT NULL,
    "idCategoriaLicencia" VARCHAR(36) NOT NULL,
    "fechaVencimientoLicencia" TIMESTAMP(3) NOT NULL,
    "observaciones" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conductores_pkey" PRIMARY KEY ("idConductor")
);

-- CreateTable
CREATE TABLE "Turnos" (
    "idTurno" VARCHAR(36) NOT NULL,
    "idConductor" VARCHAR(36) NOT NULL,
    "idVehiculo" VARCHAR(36) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" VARCHAR(10) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Programado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Turnos_pkey" PRIMARY KEY ("idTurno")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_numDocumento_key" ON "Usuarios"("numDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_key" ON "Usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Ciudades_nombreCiudad_key" ON "Ciudades"("nombreCiudad");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_nombreRol_key" ON "Roles"("nombreRol");

-- CreateIndex
CREATE UNIQUE INDEX "TiposDoc_nombreTipoDoc_key" ON "TiposDoc"("nombreTipoDoc");

-- CreateIndex
CREATE UNIQUE INDEX "TiposVehiculo_nombreTipoVehiculo_key" ON "TiposVehiculo"("nombreTipoVehiculo");

-- CreateIndex
CREATE UNIQUE INDEX "MarcasVehiculos_nombreMarca_key" ON "MarcasVehiculos"("nombreMarca");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculos_placa_key" ON "Vehiculos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculos_vin_key" ON "Vehiculos"("vin");

-- CreateIndex
CREATE INDEX "Vehiculos_idTipoVehiculo_idx" ON "Vehiculos"("idTipoVehiculo");

-- CreateIndex
CREATE INDEX "Vehiculos_idMarcaVehiculo_idx" ON "Vehiculos"("idMarcaVehiculo");

-- CreateIndex
CREATE INDEX "Vehiculos_idPropietario_idx" ON "Vehiculos"("idPropietario");

-- CreateIndex
CREATE INDEX "Vehiculos_idConductorAsignado_idx" ON "Vehiculos"("idConductorAsignado");

-- CreateIndex
CREATE INDEX "Vehiculos_placa_idx" ON "Vehiculos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasLicencia_nombreCategoria_key" ON "CategoriasLicencia"("nombreCategoria");

-- CreateIndex
CREATE UNIQUE INDEX "Conductores_numeroLicencia_key" ON "Conductores"("numeroLicencia");

-- CreateIndex
CREATE INDEX "Conductores_idUsuario_idx" ON "Conductores"("idUsuario");

-- CreateIndex
CREATE INDEX "Conductores_numeroLicencia_idx" ON "Conductores"("numeroLicencia");

-- CreateIndex
CREATE INDEX "Conductores_idCategoriaLicencia_idx" ON "Conductores"("idCategoriaLicencia");

-- CreateIndex
CREATE UNIQUE INDEX "Conductores_idUsuario_key" ON "Conductores"("idUsuario");

-- CreateIndex
CREATE INDEX "Turnos_idConductor_idx" ON "Turnos"("idConductor");

-- CreateIndex
CREATE INDEX "Turnos_idVehiculo_idx" ON "Turnos"("idVehiculo");

-- CreateIndex
CREATE INDEX "Turnos_fecha_idx" ON "Turnos"("fecha");

-- CreateIndex
CREATE INDEX "Turnos_estado_idx" ON "Turnos"("estado");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Roles"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_tipoDoc_fkey" FOREIGN KEY ("tipoDoc") REFERENCES "TiposDoc"("idTipoDoc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_idCiudad_fkey" FOREIGN KEY ("idCiudad") REFERENCES "Ciudades"("idCiudad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculos" ADD CONSTRAINT "Vehiculos_idTipoVehiculo_fkey" FOREIGN KEY ("idTipoVehiculo") REFERENCES "TiposVehiculo"("idTipoVehiculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculos" ADD CONSTRAINT "Vehiculos_idMarcaVehiculo_fkey" FOREIGN KEY ("idMarcaVehiculo") REFERENCES "MarcasVehiculos"("idMarcaVehiculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculos" ADD CONSTRAINT "Vehiculos_idPropietario_fkey" FOREIGN KEY ("idPropietario") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculos" ADD CONSTRAINT "Vehiculos_idConductorAsignado_fkey" FOREIGN KEY ("idConductorAsignado") REFERENCES "Conductores"("idConductor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Origen" ADD CONSTRAINT "Origen_idUbicacion_fkey" FOREIGN KEY ("idUbicacion") REFERENCES "Ubicacion"("idUbicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destino" ADD CONSTRAINT "Destino_idUbicacion_fkey" FOREIGN KEY ("idUbicacion") REFERENCES "Ubicacion"("idUbicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_idOrigen_fkey" FOREIGN KEY ("idOrigen") REFERENCES "Origen"("idOrigen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_idDestino_fkey" FOREIGN KEY ("idDestino") REFERENCES "Destino"("idDestino") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conductores" ADD CONSTRAINT "Conductores_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conductores" ADD CONSTRAINT "Conductores_idCategoriaLicencia_fkey" FOREIGN KEY ("idCategoriaLicencia") REFERENCES "CategoriasLicencia"("idCategoriaLicencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_idConductor_fkey" FOREIGN KEY ("idConductor") REFERENCES "Conductores"("idConductor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_idVehiculo_fkey" FOREIGN KEY ("idVehiculo") REFERENCES "Vehiculos"("idVehiculo") ON DELETE CASCADE ON UPDATE CASCADE;
