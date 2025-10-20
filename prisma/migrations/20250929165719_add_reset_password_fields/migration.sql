-- AlterTable
ALTER TABLE `Usuarios` ADD COLUMN `resetPasswordCode` VARCHAR(100) NULL,
    ADD COLUMN `resetPasswordExpires` DATETIME(3) NULL;
