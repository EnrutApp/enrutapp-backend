-- DropForeignKey
ALTER TABLE `reservasprivadas` DROP FOREIGN KEY `ReservasPrivadas_idConductor_fkey`;

-- DropForeignKey
ALTER TABLE `reservasprivadas` DROP FOREIGN KEY `ReservasPrivadas_idVehiculo_fkey`;

-- DropIndex
DROP INDEX `ReservasPrivadas_idConductor_fkey` ON `reservasprivadas`;

-- DropIndex
DROP INDEX `ReservasPrivadas_idVehiculo_fkey` ON `reservasprivadas`;

-- AlterTable
ALTER TABLE `reservasprivadas` MODIFY `idVehiculo` VARCHAR(36) NULL,
    MODIFY `idConductor` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idVehiculo_fkey` FOREIGN KEY (`idVehiculo`) REFERENCES `Vehiculos`(`idVehiculo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservasPrivadas` ADD CONSTRAINT `ReservasPrivadas_idConductor_fkey` FOREIGN KEY (`idConductor`) REFERENCES `Conductores`(`idConductor`) ON DELETE SET NULL ON UPDATE CASCADE;
