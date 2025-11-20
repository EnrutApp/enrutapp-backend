-- AlterTable
ALTER TABLE `Usuarios` ADD COLUMN `lastLoginAttempt` DATETIME(3) NULL,
    ADD COLUMN `lockedUntil` DATETIME(3) NULL,
    ADD COLUMN `loginAttempts` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(36) NOT NULL,
    `idUsuario` VARCHAR(36) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revokedAt` DATETIME(3) NULL,
    `deviceInfo` VARCHAR(255) NULL,

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    INDEX `RefreshToken_idUsuario_idx`(`idUsuario`),
    INDEX `RefreshToken_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;
