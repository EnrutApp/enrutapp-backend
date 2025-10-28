-- CreateTable
CREATE TABLE `Ubicacion` (
    `idUbicacion` VARCHAR(36) NOT NULL,
    `nombreUbicacion` VARCHAR(100) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `latitud` DECIMAL(10, 8) NULL,
    `longitud` DECIMAL(11, 8) NULL,

    PRIMARY KEY (`idUbicacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Origen` (
    `idOrigen` VARCHAR(36) NOT NULL,
    `idUbicacion` VARCHAR(36) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`idOrigen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Destino` (
    `idDestino` VARCHAR(36) NOT NULL,
    `idUbicacion` VARCHAR(36) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`idDestino`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ruta` (
    `idRuta` VARCHAR(36) NOT NULL,
    `idOrigen` VARCHAR(36) NOT NULL,
    `idDestino` VARCHAR(36) NOT NULL,
    `distancia` DECIMAL(10, 2) NULL,
    `observaciones` VARCHAR(100) NULL,
    `tiempoEstimado` TIME NULL,
    `precioBase` DECIMAL(10, 2) NULL,
    `estado` VARCHAR(50) NULL,

    PRIMARY KEY (`idRuta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Origen` ADD CONSTRAINT `Origen_idUbicacion_fkey` FOREIGN KEY (`idUbicacion`) REFERENCES `Ubicacion`(`idUbicacion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destino` ADD CONSTRAINT `Destino_idUbicacion_fkey` FOREIGN KEY (`idUbicacion`) REFERENCES `Ubicacion`(`idUbicacion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruta` ADD CONSTRAINT `Ruta_idOrigen_fkey` FOREIGN KEY (`idOrigen`) REFERENCES `Origen`(`idOrigen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruta` ADD CONSTRAINT `Ruta_idDestino_fkey` FOREIGN KEY (`idDestino`) REFERENCES `Destino`(`idDestino`) ON DELETE RESTRICT ON UPDATE CASCADE;
