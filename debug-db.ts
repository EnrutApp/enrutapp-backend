
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  try {
    const ubicacionesOld = await prisma.ubicaciones.findMany();
    console.log(`Found ${ubicacionesOld.length} records in Ubicaciones (Old):`);
    console.log(JSON.stringify(ubicacionesOld, null, 2));

    const ubicacionesNew = await prisma.ubicacion.findMany();
    console.log(`Found ${ubicacionesNew.length} records in Ubicacion (New):`);
    console.log(JSON.stringify(ubicacionesNew, null, 2));

  } catch (e) {
    console.error('Error querying database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
