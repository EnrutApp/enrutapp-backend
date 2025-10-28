/*
  Warnings:

  - Made the column `fotoUrl` on table `Vehiculos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Vehiculos` MODIFY `fotoUrl` VARCHAR(255) NOT NULL;
