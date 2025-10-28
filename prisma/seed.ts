// src/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed iniciando...');

  // 1. Asegurar TiposDoc
  await prisma.tiposDoc.upsert({
    where: { idTipoDoc: 'td-cc-1000-0000-000000000001' },
    update: { nombreTipoDoc: 'Cédula de ciudadanía' },
    create: { idTipoDoc: 'td-cc-1000-0000-000000000001', nombreTipoDoc: 'Cédula de ciudadanía' },
  });

  // 2. Asegurar Ciudades (ej. Bogotá)
  await prisma.ciudades.upsert({
    where: { nombreCiudad: 'Bogotá' },
    update: {},
    create: { nombreCiudad: 'Bogotá' },
  });

  // 3. Asegurar Roles
  await prisma.roles.upsert({
    where: { idRol: 'rl-admin-1000-0000-000000000001' },
    update: { nombreRol: 'Administrador', descripcion: 'Acceso total al sistema', estado: true },
    create: { idRol: 'rl-admin-1000-0000-000000000001', nombreRol: 'Administrador', descripcion: 'Acceso total al sistema', estado: true },
  });

  await prisma.roles.upsert({
    where: { idRol: 'rl-cond-2000-0000-000000000002' },
    update: { nombreRol: 'Conductor', descripcion: 'Usuario conductor', estado: true },
    create: { idRol: 'rl-cond-2000-0000-000000000002', nombreRol: 'Conductor', descripcion: 'Usuario conductor', estado: true },
  });

  await prisma.roles.upsert({
    where: { idRol: 'rl-client-3000-0000-000000000003' },
    update: { nombreRol: 'Cliente', descripcion: 'Usuario cliente', estado: true },
    create: { idRol: 'rl-client-3000-0000-000000000003', nombreRol: 'Cliente', descripcion: 'Usuario cliente', estado: true },
  });

  // Obtener ids necesarios
  const ciudad = await prisma.ciudades.findUnique({ where: { nombreCiudad: 'Bogotá' }});
  const tipoDoc = await prisma.tiposDoc.findUnique({ where: { idTipoDoc: 'td-cc-1000-0000-000000000001' }});

  if (!ciudad || !tipoDoc) throw new Error('Ciudad o TipoDoc no creado');

  // 4. Hash de contraseñas (12 rounds)
  const adminPasswordHash = await bcrypt.hash('Admin2025*', 12);
  const driverPasswordHash = await bcrypt.hash('Driver2025*', 12);
  const clientPasswordHash = await bcrypt.hash('Client2025*', 12);

  // 5. Crear / actualizar usuarios base (upsert por correo)
  await prisma.usuarios.upsert({
    where: { correo: 'admin@enrutapp.com' },
    update: {
      contrasena: adminPasswordHash,
      idRol: 'rl-admin-1000-0000-000000000001',
      nombre: 'Administrador Principal',
      telefono: '3001000001',
      direccion: 'Calle 1 #1-1, Bogotá',
      idCiudad: ciudad.idCiudad,
      tipoDoc: tipoDoc.idTipoDoc,
      numDocumento: '9000000001',
      estado: true,
    },
    create: {
      idUsuario: 'usr-admin-1000-0000-000000000001',
      idRol: 'rl-admin-1000-0000-000000000001',
      tipoDoc: tipoDoc.idTipoDoc,
      numDocumento: '9000000001',
      nombre: 'Administrador Principal',
      telefono: '3001000001',
      correo: 'admin@enrutapp.com',
      contrasena: adminPasswordHash,
      direccion: 'Calle 1 #1-1, Bogotá',
      idCiudad: ciudad.idCiudad,
      estado: true,
    },
  });

  await prisma.usuarios.upsert({
    where: { correo: 'driver@enrutapp.com' },
    update: {
      contrasena: driverPasswordHash,
      idRol: 'rl-cond-2000-0000-000000000002',
      nombre: 'Conductor General',
      telefono: '3001000002',
      direccion: 'Carrera 2 #2-2, Bogotá',
      idCiudad: ciudad.idCiudad,
      tipoDoc: tipoDoc.idTipoDoc,
      numDocumento: '9000000002',
      estado: true,
    },
    create: {
      idUsuario: 'usr-driver-1000-0000-000000000001',
      idRol: 'rl-cond-2000-0000-000000000002',
      tipoDoc: tipoDoc.idTipoDoc,
      numDocumento: '9000000002',
      nombre: 'Conductor General',
      telefono: '3001000002',
      correo: 'driver@enrutapp.com',
      contrasena: driverPasswordHash,
      direccion: 'Carrera 2 #2-2, Bogotá',
      idCiudad: ciudad.idCiudad,
      estado: true,
    },
  });

  await prisma.usuarios.upsert({
    where: { correo: 'client@enrutapp.com' },
    update: {
      contrasena: clientPasswordHash,
      idRol: 'rl-client-3000-0000-000000000003',
      nombre: 'Cliente General',
      telefono: '3001000003',
      direccion: 'Avenida 3 #3-3, Bogotá',
      idCiudad: ciudad.idCiudad,
      tipoDoc: tipoDoc.idTipoDoc,
      numDocumento: '9000000003',
      estado: true,
    },
    create: {
      idUsuario: 'usr-client-1000-0000-000000000003',
      idRol: 'rl-client-3000-0000-000000000003',
      tipoDoc: tipoDoc.idTipoDoc,
      numDocumento: '9000000003',
      nombre: 'Cliente General',
      telefono: '3001000003',
      correo: 'client@enrutapp.com',
      contrasena: clientPasswordHash,
      direccion: 'Avenida 3 #3-3, Bogotá',
      idCiudad: ciudad.idCiudad,
      estado: true,
    },
  });

  console.log('✅ Seed completado.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
