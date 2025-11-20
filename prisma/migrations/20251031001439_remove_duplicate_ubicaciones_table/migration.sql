/*
  Warnings:

  - You are about to drop the `Ubicaciones` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Agregar campos con valores por defecto para registros existentes
ALTER TABLE `Ubicacion` 
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Ubicaciones`;
