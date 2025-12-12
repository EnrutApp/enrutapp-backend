-- DropForeignKey
ALTER TABLE "Destino" DROP CONSTRAINT "Destino_idUbicacion_fkey";

-- DropForeignKey
ALTER TABLE "Origen" DROP CONSTRAINT "Origen_idUbicacion_fkey";

-- DropForeignKey
ALTER TABLE "Ruta" DROP CONSTRAINT "Ruta_idDestino_fkey";

-- DropForeignKey
ALTER TABLE "Ruta" DROP CONSTRAINT "Ruta_idOrigen_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_idCiudad_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_tipoDoc_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculos" DROP CONSTRAINT "Vehiculos_idPropietario_fkey";

-- AlterTable
ALTER TABLE "Ubicacion" ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "authProvider" VARCHAR(20) NOT NULL DEFAULT 'local',
ADD COLUMN     "perfilCompleto" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "tipoDoc" DROP NOT NULL,
ALTER COLUMN "numDocumento" DROP NOT NULL,
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "direccion" DROP NOT NULL,
ALTER COLUMN "idCiudad" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vehiculos" ADD COLUMN     "propietarioExternoDocumento" VARCHAR(20),
ADD COLUMN     "propietarioExternoNombre" VARCHAR(100),
ADD COLUMN     "propietarioExternoTelefono" VARCHAR(20),
ALTER COLUMN "idPropietario" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Permisos" (
    "idPermiso" VARCHAR(36) NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "codigo" VARCHAR(50) NOT NULL,

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("idPermiso")
);

-- CreateTable
CREATE TABLE "RolesPermisos" (
    "idRol" VARCHAR(36) NOT NULL,
    "idPermiso" VARCHAR(36) NOT NULL,

    CONSTRAINT "RolesPermisos_pkey" PRIMARY KEY ("idRol","idPermiso")
);

-- CreateTable
CREATE TABLE "Paradas" (
    "idParada" VARCHAR(36) NOT NULL,
    "idRuta" VARCHAR(36) NOT NULL,
    "idUbicacion" VARCHAR(36) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paradas_pkey" PRIMARY KEY ("idParada")
);

-- CreateTable
CREATE TABLE "Viajes" (
    "idViaje" VARCHAR(36) NOT NULL,
    "idTurno" VARCHAR(36) NOT NULL,
    "idRuta" VARCHAR(36) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Programado',
    "cuposDisponibles" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Viajes_pkey" PRIMARY KEY ("idViaje")
);

-- CreateTable
CREATE TABLE "Pasajes" (
    "idPasaje" VARCHAR(36) NOT NULL,
    "idViaje" VARCHAR(36) NOT NULL,
    "idUsuario" VARCHAR(36),
    "nombrePasajero" VARCHAR(100) NOT NULL,
    "documentoPasajero" VARCHAR(20),
    "asiento" VARCHAR(10),
    "precio" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Confirmado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pasajes_pkey" PRIMARY KEY ("idPasaje")
);

-- CreateTable
CREATE TABLE "Encomiendas" (
    "idEncomienda" VARCHAR(36) NOT NULL,
    "idViaje" VARCHAR(36) NOT NULL,
    "remitenteNombre" VARCHAR(100) NOT NULL,
    "remitenteTel" VARCHAR(20) NOT NULL,
    "destinatarioNombre" VARCHAR(100) NOT NULL,
    "destinatarioTel" VARCHAR(20) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "peso" DECIMAL(10,2),
    "precio" DECIMAL(10,2) NOT NULL,
    "guia" VARCHAR(20) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encomiendas_pkey" PRIMARY KEY ("idEncomienda")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permisos_codigo_key" ON "Permisos"("codigo");

-- CreateIndex
CREATE INDEX "Paradas_idRuta_idx" ON "Paradas"("idRuta");

-- CreateIndex
CREATE INDEX "Paradas_idUbicacion_idx" ON "Paradas"("idUbicacion");

-- CreateIndex
CREATE INDEX "Viajes_idTurno_idx" ON "Viajes"("idTurno");

-- CreateIndex
CREATE INDEX "Viajes_idRuta_idx" ON "Viajes"("idRuta");

-- CreateIndex
CREATE INDEX "Pasajes_idViaje_idx" ON "Pasajes"("idViaje");

-- CreateIndex
CREATE INDEX "Pasajes_idUsuario_idx" ON "Pasajes"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Encomiendas_guia_key" ON "Encomiendas"("guia");

-- CreateIndex
CREATE INDEX "Encomiendas_idViaje_idx" ON "Encomiendas"("idViaje");

-- CreateIndex
CREATE INDEX "Encomiendas_guia_idx" ON "Encomiendas"("guia");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_tipoDoc_fkey" FOREIGN KEY ("tipoDoc") REFERENCES "TiposDoc"("idTipoDoc") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_idCiudad_fkey" FOREIGN KEY ("idCiudad") REFERENCES "Ciudades"("idCiudad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesPermisos" ADD CONSTRAINT "RolesPermisos_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Roles"("idRol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesPermisos" ADD CONSTRAINT "RolesPermisos_idPermiso_fkey" FOREIGN KEY ("idPermiso") REFERENCES "Permisos"("idPermiso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculos" ADD CONSTRAINT "Vehiculos_idPropietario_fkey" FOREIGN KEY ("idPropietario") REFERENCES "Usuarios"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Origen" ADD CONSTRAINT "Origen_idUbicacion_fkey" FOREIGN KEY ("idUbicacion") REFERENCES "Ubicacion"("idUbicacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destino" ADD CONSTRAINT "Destino_idUbicacion_fkey" FOREIGN KEY ("idUbicacion") REFERENCES "Ubicacion"("idUbicacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_idOrigen_fkey" FOREIGN KEY ("idOrigen") REFERENCES "Origen"("idOrigen") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_idDestino_fkey" FOREIGN KEY ("idDestino") REFERENCES "Destino"("idDestino") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paradas" ADD CONSTRAINT "Paradas_idRuta_fkey" FOREIGN KEY ("idRuta") REFERENCES "Ruta"("idRuta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paradas" ADD CONSTRAINT "Paradas_idUbicacion_fkey" FOREIGN KEY ("idUbicacion") REFERENCES "Ubicacion"("idUbicacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_idTurno_fkey" FOREIGN KEY ("idTurno") REFERENCES "Turnos"("idTurno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_idRuta_fkey" FOREIGN KEY ("idRuta") REFERENCES "Ruta"("idRuta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pasajes" ADD CONSTRAINT "Pasajes_idViaje_fkey" FOREIGN KEY ("idViaje") REFERENCES "Viajes"("idViaje") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pasajes" ADD CONSTRAINT "Pasajes_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomiendas" ADD CONSTRAINT "Encomiendas_idViaje_fkey" FOREIGN KEY ("idViaje") REFERENCES "Viajes"("idViaje") ON DELETE RESTRICT ON UPDATE CASCADE;
