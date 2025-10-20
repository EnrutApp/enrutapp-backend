-- CreateTable
CREATE TABLE `Usuarios` (
    `idUsuario` VARCHAR(36) NOT NULL,
    `idRol` VARCHAR(36) NOT NULL,
    `tipoDoc` VARCHAR(36) NOT NULL,
    `numDocumento` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `estado` BOOLEAN NOT NULL,

    UNIQUE INDEX `Usuarios_numDocumento_key`(`numDocumento`),
    UNIQUE INDEX `Usuarios_correo_key`(`correo`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `idRol` VARCHAR(36) NOT NULL,
    `nombreRol` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,
    `estado` BOOLEAN NOT NULL,

    UNIQUE INDEX `Roles_nombreRol_key`(`nombreRol`),
    PRIMARY KEY (`idRol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TiposDoc` (
    `idTipoDoc` VARCHAR(36) NOT NULL,
    `nombreTipoDoc` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `TiposDoc_nombreTipoDoc_key`(`nombreTipoDoc`),
    PRIMARY KEY (`idTipoDoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_idRol_fkey` FOREIGN KEY (`idRol`) REFERENCES `Roles`(`idRol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_tipoDoc_fkey` FOREIGN KEY (`tipoDoc`) REFERENCES `TiposDoc`(`idTipoDoc`) ON DELETE RESTRICT ON UPDATE CASCADE;
