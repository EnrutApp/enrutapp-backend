/*
  Warnings:

  - You are about to drop the column `ciudad` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `idCiudad` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Usuarios` DROP COLUMN `ciudad`,
    ADD COLUMN `idCiudad` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Ciudades` (
    `idCiudad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreCiudad` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Ciudades_nombreCiudad_key`(`nombreCiudad`),
    PRIMARY KEY (`idCiudad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_idCiudad_fkey` FOREIGN KEY (`idCiudad`) REFERENCES `Ciudades`(`idCiudad`) ON DELETE RESTRICT ON UPDATE CASCADE;
