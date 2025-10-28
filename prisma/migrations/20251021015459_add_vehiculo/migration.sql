-- CreateTable
CREATE TABLE `TiposVehiculo` (
    `idTipoVehiculo` VARCHAR(36) NOT NULL,
    `nombreTipoVehiculo` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TiposVehiculo_nombreTipoVehiculo_key`(`nombreTipoVehiculo`),
    PRIMARY KEY (`idTipoVehiculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarcasVehiculos` (
    `idMarcaVehiculo` VARCHAR(36) NOT NULL,
    `nombreMarca` VARCHAR(50) NOT NULL,
    `pais` VARCHAR(50) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MarcasVehiculos_nombreMarca_key`(`nombreMarca`),
    PRIMARY KEY (`idMarcaVehiculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehiculos` (
    `idVehiculo` VARCHAR(36) NOT NULL,
    `idTipoVehiculo` VARCHAR(36) NOT NULL,
    `idMarcaVehiculo` VARCHAR(36) NOT NULL,
    `placa` VARCHAR(10) NOT NULL,
    `linea` VARCHAR(50) NOT NULL,
    `modelo` INTEGER NOT NULL,
    `color` VARCHAR(30) NOT NULL,
    `vin` VARCHAR(17) NULL,
    `capacidadPasajeros` INTEGER NOT NULL,
    `capacidadCarga` DECIMAL(10, 2) NULL,
    `soatVencimiento` DATETIME(3) NULL,
    `tecnomecanicaVencimiento` DATETIME(3) NULL,
    `seguroVencimiento` DATETIME(3) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehiculos_placa_key`(`placa`),
    UNIQUE INDEX `Vehiculos_vin_key`(`vin`),
    INDEX `Vehiculos_idTipoVehiculo_idx`(`idTipoVehiculo`),
    INDEX `Vehiculos_idMarcaVehiculo_idx`(`idMarcaVehiculo`),
    INDEX `Vehiculos_placa_idx`(`placa`),
    PRIMARY KEY (`idVehiculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehiculos` ADD CONSTRAINT `Vehiculos_idTipoVehiculo_fkey` FOREIGN KEY (`idTipoVehiculo`) REFERENCES `TiposVehiculo`(`idTipoVehiculo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculos` ADD CONSTRAINT `Vehiculos_idMarcaVehiculo_fkey` FOREIGN KEY (`idMarcaVehiculo`) REFERENCES `MarcasVehiculos`(`idMarcaVehiculo`) ON DELETE RESTRICT ON UPDATE CASCADE;
