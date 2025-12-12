-- CreateEnum
CREATE TYPE "TipoPlaca" AS ENUM ('BLANCA', 'AMARILLA');

-- AlterTable
ALTER TABLE "Vehiculos" ADD COLUMN     "tipoPlaca" "TipoPlaca" NOT NULL DEFAULT 'BLANCA';
