
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking Ubicaciones status...');
  try {
    const ubicaciones = await prisma.ubicacion.findMany();
    console.log(`Found ${ubicaciones.length} records in Ubicacion:`);
    ubicaciones.forEach(u => {
      console.log(`- ${u.nombreUbicacion} (ID: ${u.idUbicacion}): Estado=${u.estado}`);
    });

  } catch (e) {
    console.error('Error querying database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
