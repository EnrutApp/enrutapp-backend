-- CreateTable
CREATE TABLE `Parada` (
    `idParada` VARCHAR(36) NOT NULL,
    `idRuta` VARCHAR(36) NOT NULL,
    `idUbicacion` VARCHAR(36) NOT NULL,
    `orden` INTEGER NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Parada_idRuta_idx`(`idRuta`),
    INDEX `Parada_idUbicacion_idx`(`idUbicacion`),
    UNIQUE INDEX `Parada_idRuta_orden_key`(`idRuta`, `orden`),
    PRIMARY KEY (`idParada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Parada` ADD CONSTRAINT `Parada_idRuta_fkey` FOREIGN KEY (`idRuta`) REFERENCES `Ruta`(`idRuta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parada` ADD CONSTRAINT `Parada_idUbicacion_fkey` FOREIGN KEY (`idUbicacion`) REFERENCES `Ubicacion`(`idUbicacion`) ON DELETE RESTRICT ON UPDATE CASCADE;
