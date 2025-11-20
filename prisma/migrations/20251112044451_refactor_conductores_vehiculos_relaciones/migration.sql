/*
  Warnings:

  - You are about to drop the column `apellido` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `cedula` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `correo` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `fotoUrl` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `licencia` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Conductores` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAttempt` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `loginAttempts` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the `Parada` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numeroLicencia]` on the table `Conductores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUsuario]` on the table `Conductores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fechaVencimientoLicencia` to the `Conductores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCategoriaLicencia` to the `Conductores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUsuario` to the `Conductores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroLicencia` to the `Conductores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idPropietario` to the `Vehiculos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Parada` DROP FOREIGN KEY `Parada_idRuta_fkey`;

-- DropForeignKey
ALTER TABLE `Parada` DROP FOREIGN KEY `Parada_idUbicacion_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_idUsuario_fkey`;

-- DropIndex
DROP INDEX `Conductores_cedula_idx` ON `Conductores`;

-- DropIndex
DROP INDEX `Conductores_cedula_key` ON `Conductores`;

-- DropIndex
DROP INDEX `Conductores_correo_key` ON `Conductores`;

-- DropIndex
DROP INDEX `Conductores_licencia_idx` ON `Conductores`;

-- DropIndex
DROP INDEX `Conductores_licencia_key` ON `Conductores`;

-- AlterTable
ALTER TABLE `Conductores` DROP COLUMN `apellido`,
    DROP COLUMN `cedula`,
    DROP COLUMN `correo`,
    DROP COLUMN `fotoUrl`,
    DROP COLUMN `licencia`,
    DROP COLUMN `nombre`,
    DROP COLUMN `telefono`,
    ADD COLUMN `fechaVencimientoLicencia` DATETIME(3) NOT NULL,
    ADD COLUMN `idCategoriaLicencia` VARCHAR(36) NOT NULL,
    ADD COLUMN `idUsuario` VARCHAR(36) NOT NULL,
    ADD COLUMN `numeroLicencia` VARCHAR(50) NOT NULL,
    ADD COLUMN `observaciones` TEXT NULL;

-- AlterTable
ALTER TABLE `Ubicacion` DROP COLUMN `createdAt`,
    DROP COLUMN `estado`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `Usuarios` DROP COLUMN `lastLoginAttempt`,
    DROP COLUMN `lockedUntil`,
    DROP COLUMN `loginAttempts`;

-- AlterTable
ALTER TABLE `Vehiculos` ADD COLUMN `idConductorAsignado` VARCHAR(36) NULL,
    ADD COLUMN `idPropietario` VARCHAR(36) NOT NULL;

-- DropTable
DROP TABLE `Parada`;

-- DropTable
DROP TABLE `RefreshToken`;

-- CreateTable
CREATE TABLE `Ubicaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriasLicencia` (
    `idCategoriaLicencia` VARCHAR(36) NOT NULL,
    `nombreCategoria` VARCHAR(10) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CategoriasLicencia_nombreCategoria_key`(`nombreCategoria`),
    PRIMARY KEY (`idCategoriaLicencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turnos` (
    `idTurno` VARCHAR(36) NOT NULL,
    `idConductor` VARCHAR(36) NOT NULL,
    `idVehiculo` VARCHAR(36) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora` VARCHAR(10) NOT NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'Programado',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Turnos_idConductor_idx`(`idConductor`),
    INDEX `Turnos_idVehiculo_idx`(`idVehiculo`),
    INDEX `Turnos_fecha_idx`(`fecha`),
    INDEX `Turnos_estado_idx`(`estado`),
    PRIMARY KEY (`idTurno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Conductores_numeroLicencia_key` ON `Conductores`(`numeroLicencia`);

-- CreateIndex
CREATE INDEX `Conductores_idUsuario_idx` ON `Conductores`(`idUsuario`);

-- CreateIndex
CREATE INDEX `Conductores_numeroLicencia_idx` ON `Conductores`(`numeroLicencia`);

-- CreateIndex
CREATE INDEX `Conductores_idCategoriaLicencia_idx` ON `Conductores`(`idCategoriaLicencia`);

-- CreateIndex
CREATE UNIQUE INDEX `Conductores_idUsuario_key` ON `Conductores`(`idUsuario`);

-- CreateIndex
CREATE INDEX `Vehiculos_idPropietario_idx` ON `Vehiculos`(`idPropietario`);

-- CreateIndex
CREATE INDEX `Vehiculos_idConductorAsignado_idx` ON `Vehiculos`(`idConductorAsignado`);

-- AddForeignKey
ALTER TABLE `Vehiculos` ADD CONSTRAINT `Vehiculos_idPropietario_fkey` FOREIGN KEY (`idPropietario`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculos` ADD CONSTRAINT `Vehiculos_idConductorAsignado_fkey` FOREIGN KEY (`idConductorAsignado`) REFERENCES `Conductores`(`idConductor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conductores` ADD CONSTRAINT `Conductores_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conductores` ADD CONSTRAINT `Conductores_idCategoriaLicencia_fkey` FOREIGN KEY (`idCategoriaLicencia`) REFERENCES `CategoriasLicencia`(`idCategoriaLicencia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turnos` ADD CONSTRAINT `Turnos_idConductor_fkey` FOREIGN KEY (`idConductor`) REFERENCES `Conductores`(`idConductor`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turnos` ADD CONSTRAINT `Turnos_idVehiculo_fkey` FOREIGN KEY (`idVehiculo`) REFERENCES `Vehiculos`(`idVehiculo`) ON DELETE CASCADE ON UPDATE CASCADE;
