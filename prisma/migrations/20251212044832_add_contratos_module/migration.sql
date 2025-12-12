-- CreateTable
CREATE TABLE "Contratos" (
    "idContrato" VARCHAR(36) NOT NULL,
    "idTurno" VARCHAR(36) NOT NULL,
    "titularNombre" VARCHAR(100) NOT NULL,
    "titularDocumento" VARCHAR(20),
    "placa" VARCHAR(10) NOT NULL,
    "tipoVehiculo" VARCHAR(50),
    "capacidadPasajeros" INTEGER,
    "origen" VARCHAR(120) NOT NULL,
    "destino" VARCHAR(120) NOT NULL,
    "fechaOrigen" TIMESTAMP(3) NOT NULL,
    "fechaDestino" TIMESTAMP(3) NOT NULL,
    "pasajeros" JSONB,
    "pdfUrl" VARCHAR(255) NOT NULL,
    "fechaContrato" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contratos_pkey" PRIMARY KEY ("idContrato")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contratos_idTurno_key" ON "Contratos"("idTurno");

-- CreateIndex
CREATE INDEX "Contratos_placa_idx" ON "Contratos"("placa");

-- CreateIndex
CREATE INDEX "Contratos_fechaContrato_idx" ON "Contratos"("fechaContrato");

-- AddForeignKey
ALTER TABLE "Contratos" ADD CONSTRAINT "Contratos_idTurno_fkey" FOREIGN KEY ("idTurno") REFERENCES "Turnos"("idTurno") ON DELETE CASCADE ON UPDATE CASCADE;
