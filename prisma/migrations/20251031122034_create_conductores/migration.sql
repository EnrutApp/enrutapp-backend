-- CreateTable
CREATE TABLE `Conductores` (
    `idConductor` VARCHAR(36) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `cedula` VARCHAR(20) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `correo` VARCHAR(100) NULL,
    `licencia` VARCHAR(50) NOT NULL,
    `fotoUrl` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Conductores_cedula_key`(`cedula`),
    UNIQUE INDEX `Conductores_correo_key`(`correo`),
    UNIQUE INDEX `Conductores_licencia_key`(`licencia`),
    INDEX `Conductores_cedula_idx`(`cedula`),
    INDEX `Conductores_licencia_idx`(`licencia`),
    PRIMARY KEY (`idConductor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
