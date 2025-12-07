-- CreateTable
CREATE TABLE `MetodoPago` (
    `idMetodoPago` VARCHAR(36) NOT NULL,
    `nombreMetodo` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idMetodoPago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conductores` (
    `idConductor` VARCHAR(36) NOT NULL,
    `idUsuario` VARCHAR(36) NOT NULL,
    `licencia` VARCHAR(50) NOT NULL,
    `categoriaLicencia` VARCHAR(20) NOT NULL,
    `fechaVencimientoLicencia` DATETIME(3) NOT NULL,
    `idArl` VARCHAR(36) NULL,
    `idEps` VARCHAR(36) NULL,
    `fondoPensiones` VARCHAR(50) NULL,
    `estado` BOOLEAN NOT NULL,

    PRIMARY KEY (`idConductor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservasPrivadas` (
    `idReservaPrivada` VARCHAR(36) NOT NULL,
    `idUsuario` VARCHAR(36) NOT NULL,
    `idVehiculo` VARCHAR(36) NOT NULL,
    `idConductor` VARCHAR(36) NOT NULL,
    `idRuta` VARCHAR(36) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `horaSalida` VARCHAR(10) NOT NULL,
    `cantidadPersonas` INTEGER NOT NULL,
    `precioTotal` DECIMAL(10, 2) NULL,
    `idMetodoPago` VARCHAR(36) NOT NULL,
    `estadoReserva` VARCHAR(50) NOT NULL,
    `fechaReserva` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idReservaPrivada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleReservaPrivadaPasajero` (
    `idDetalle` VARCHAR(36) NOT NULL,
    `idReservaPrivada` VARCHAR(36) NOT NULL,
    `nombrePasajero` VARCHAR(100) NOT NULL,
    `tipoDoc` VARCHAR(36) NOT NULL,
    `numDocPasajero` VARCHAR(20) NOT NULL,
    `edadPasajero` INTEGER NOT NULL,

    PRIMARY KEY (`idDetalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Conductores` ADD CONSTRAINT `Conductores_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idVehiculo_fkey` FOREIGN KEY (`idVehiculo`) REFERENCES `Vehiculos`(`idVehiculo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idConductor_fkey` FOREIGN KEY (`idConductor`) REFERENCES `Conductores`(`idConductor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idRuta_fkey` FOREIGN KEY (`idRuta`) REFERENCES `Ruta`(`idRuta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idMetodoPago_fkey` FOREIGN KEY (`idMetodoPago`) REFERENCES `MetodoPago`(`idMetodoPago`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleReservaPrivadaPasajero` ADD CONSTRAINT `DetalleReservaPrivadaPasajero_idReservaPrivada_fkey` FOREIGN KEY (`idReservaPrivada`) REFERENCES `ReservasPrivadas`(`idReservaPrivada`) ON DELETE RESTRICT ON UPDATE CASCADE;
