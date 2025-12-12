-- Unificar Turnos y Viajes (Turno = Viaje)
-- Esta migración asume historial previo donde existía tabla "Viajes" y Pasajes/Encomiendas referenciaban idViaje.

-- 1) Agregar columnas a Turnos
ALTER TABLE "Turnos" ADD COLUMN IF NOT EXISTS "idRuta" VARCHAR(36);
ALTER TABLE "Turnos" ADD COLUMN IF NOT EXISTS "cuposDisponibles" INTEGER;

-- 2) Backfill desde Viajes (si existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Viajes'
  ) THEN
    UPDATE "Turnos" t
    SET "idRuta" = v."idRuta",
        "cuposDisponibles" = v."cuposDisponibles"
    FROM "Viajes" v
    WHERE v."idTurno" = t."idTurno";
  END IF;
END $$;

-- 3) Completar cuposDisponibles desde Vehiculos si aún está null
UPDATE "Turnos" t
SET "cuposDisponibles" = v."capacidadPasajeros"
FROM "Vehiculos" v
WHERE v."idVehiculo" = t."idVehiculo"
  AND t."cuposDisponibles" IS NULL;

UPDATE "Turnos" SET "cuposDisponibles" = 0 WHERE "cuposDisponibles" IS NULL;

-- 4) Completar idRuta con alguna ruta existente si sigue null (último recurso)
UPDATE "Turnos"
SET "idRuta" = (SELECT "idRuta" FROM "Ruta" LIMIT 1)
WHERE "idRuta" IS NULL;

-- 5) Enforzar NOT NULL y FK de Turnos.idRuta
ALTER TABLE "Turnos" ALTER COLUMN "cuposDisponibles" SET NOT NULL;
ALTER TABLE "Turnos" ALTER COLUMN "idRuta" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Turnos_idRuta_fkey'
      AND table_name = 'Turnos'
  ) THEN
    ALTER TABLE "Turnos"
    ADD CONSTRAINT "Turnos_idRuta_fkey"
    FOREIGN KEY ("idRuta") REFERENCES "Ruta"("idRuta")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Turnos_idRuta_idx" ON "Turnos"("idRuta");

-- 6) Migrar Pasajes: idViaje -> idTurno
ALTER TABLE "Pasajes" ADD COLUMN IF NOT EXISTS "idTurno" VARCHAR(36);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Pasajes' AND column_name = 'idViaje'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Viajes'
  ) THEN
    UPDATE "Pasajes" p
    SET "idTurno" = v."idTurno"
    FROM "Viajes" v
    WHERE p."idViaje" = v."idViaje";
  END IF;
END $$;

-- Si aún hay nulls, intentamos usar el turno asociado por compatibilidad (si ya existía)
UPDATE "Pasajes" p
SET "idTurno" = p."idTurno"
WHERE p."idTurno" IS NULL;

ALTER TABLE "Pasajes" ALTER COLUMN "idTurno" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Pasajes_idTurno_fkey'
      AND table_name = 'Pasajes'
  ) THEN
    ALTER TABLE "Pasajes"
    ADD CONSTRAINT "Pasajes_idTurno_fkey"
    FOREIGN KEY ("idTurno") REFERENCES "Turnos"("idTurno")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Pasajes_idTurno_idx" ON "Pasajes"("idTurno");

-- Eliminar columna idViaje y su FK si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'Pasajes' AND constraint_name = 'Pasajes_idViaje_fkey'
  ) THEN
    ALTER TABLE "Pasajes" DROP CONSTRAINT "Pasajes_idViaje_fkey";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Pasajes' AND column_name = 'idViaje'
  ) THEN
    ALTER TABLE "Pasajes" DROP COLUMN "idViaje";
  END IF;
END $$;

-- 7) Migrar Encomiendas: idViaje -> idTurno
ALTER TABLE "Encomiendas" ADD COLUMN IF NOT EXISTS "idTurno" VARCHAR(36);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Encomiendas' AND column_name = 'idViaje'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Viajes'
  ) THEN
    UPDATE "Encomiendas" e
    SET "idTurno" = v."idTurno"
    FROM "Viajes" v
    WHERE e."idViaje" = v."idViaje";
  END IF;
END $$;

UPDATE "Encomiendas" e
SET "idTurno" = e."idTurno"
WHERE e."idTurno" IS NULL;

ALTER TABLE "Encomiendas" ALTER COLUMN "idTurno" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Encomiendas_idTurno_fkey'
      AND table_name = 'Encomiendas'
  ) THEN
    ALTER TABLE "Encomiendas"
    ADD CONSTRAINT "Encomiendas_idTurno_fkey"
    FOREIGN KEY ("idTurno") REFERENCES "Turnos"("idTurno")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Encomiendas_idTurno_idx" ON "Encomiendas"("idTurno");

-- Eliminar columna idViaje y su FK si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'Encomiendas' AND constraint_name = 'Encomiendas_idViaje_fkey'
  ) THEN
    ALTER TABLE "Encomiendas" DROP CONSTRAINT "Encomiendas_idViaje_fkey";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Encomiendas' AND column_name = 'idViaje'
  ) THEN
    ALTER TABLE "Encomiendas" DROP COLUMN "idViaje";
  END IF;
END $$;

-- 8) Eliminar Viajes (si existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Viajes'
  ) THEN
    -- Dropear FKs hacia Viajes si aún existen
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_name = 'Viajes' AND constraint_name = 'Viajes_idTurno_fkey'
    ) THEN
      ALTER TABLE "Viajes" DROP CONSTRAINT "Viajes_idTurno_fkey";
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_name = 'Viajes' AND constraint_name = 'Viajes_idRuta_fkey'
    ) THEN
      ALTER TABLE "Viajes" DROP CONSTRAINT "Viajes_idRuta_fkey";
    END IF;

    DROP TABLE "Viajes";
  END IF;
END $$;
