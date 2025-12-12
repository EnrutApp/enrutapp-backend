import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Carga variables desde el .env del root del backend (../.env)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL no está definido.');
  console.error(
    '   Ejecuta este script desde el root del backend o crea un archivo .env en enrutapp-backend con DATABASE_URL.',
  );
  console.error(
    '   Ejemplo: DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"',
  );
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Iniciando promoción a Administrador...');

  // 1. Buscar o crear el rol Admin
  let adminRole = await prisma.roles.findFirst({
    where: {
      OR: [{ nombreRol: 'Admin' }, { nombreRol: 'Administrador' }],
    },
  });

  if (!adminRole) {
    console.log('⚠️ Rol Admin no encontrado. Creándolo...');
    adminRole = await prisma.roles.create({
      data: {
        idRol: 'admin-role-id', // Use a fixed ID or uuid
        nombreRol: 'Admin',
        descripcion: 'Super Administrador del Sistema',
        estado: true,
      },
    });
    console.log('✅ Rol Admin creado:', adminRole.idRol);
  } else {
    console.log('ℹ️ Rol Admin encontrado:', adminRole.idRol);
  }

  // 2. Buscar el primer usuario (asumiendo que es el que creó el dev)
  const user = await prisma.usuarios.findFirst({
    orderBy: { nombre: 'asc' }, // El más antiguo (o dec 'desc' para el último)
  });

  if (!user) {
    console.error('❌ No se encontraron usuarios en la base de datos.');
    return;
  }

  console.log(`👤 Usuario encontrado: ${user.nombre} (${user.correo})`);

  // 3. Actualizar el rol del usuario
  await prisma.usuarios.update({
    where: { idUsuario: user.idUsuario },
    data: { idRol: adminRole.idRol },
  });

  console.log(`🎉 ¡ÉXITO! El usuario ${user.nombre} ahora es ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
