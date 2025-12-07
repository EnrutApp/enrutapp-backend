// src/prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
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

  // 7. Crear Método de Pago
  console.log('💳 Creando métodos de pago...');
  const metodoPago = await prisma.metodoPago.upsert({
    where: { idMetodoPago: 'mp-efectivo-1000-0000-000000000001' },
    update: { nombreMetodo: 'Efectivo' },
    create: { idMetodoPago: 'mp-efectivo-1000-0000-000000000001', nombreMetodo: 'Efectivo' },
  });

  // 8. Crear Ubicaciones (Origen y Destino)
  console.log('📍 Creando ubicaciones...');
  const ubicacionOrigen = await prisma.ubicacion.upsert({
    where: { idUbicacion: 'ub-bogota-centro-000000000001' },
    update: { nombreUbicacion: 'Bogotá Centro' },
    create: {
      idUbicacion: 'ub-bogota-centro-000000000001',
      nombreUbicacion: 'Bogotá Centro',
      direccion: 'Centro de Bogotá',
      latitud: new Prisma.Decimal(4.7110),
      longitud: new Prisma.Decimal(-74.0055),
    },
  });

  const ubicacionDestino = await prisma.ubicacion.upsert({
    where: { idUbicacion: 'ub-bogota-sur-0000000000001' },
    update: { nombreUbicacion: 'Bogotá Sur' },
    create: {
      idUbicacion: 'ub-bogota-sur-0000000000001',
      nombreUbicacion: 'Bogotá Sur',
      direccion: 'Sur de Bogotá',
      latitud: new Prisma.Decimal(4.5560),
      longitud: new Prisma.Decimal(-74.1305),
    },
  });

  // 9. Crear Origen y Destino
  console.log('🚩 Creando origen y destino de rutas...');
  const origen = await prisma.origen.upsert({
    where: { idOrigen: 'or-bogota-centro-00000000001' },
    update: { descripcion: 'Terminal Centro Bogotá' },
    create: {
      idOrigen: 'or-bogota-centro-00000000001',
      idUbicacion: ubicacionOrigen.idUbicacion,
      descripcion: 'Terminal Centro Bogotá',
    },
  });

  const destino = await prisma.destino.upsert({
    where: { idDestino: 'ds-bogota-sur-000000000001' },
    update: { descripcion: 'Terminal Sur Bogotá' },
    create: {
      idDestino: 'ds-bogota-sur-000000000001',
      idUbicacion: ubicacionDestino.idUbicacion,
      descripcion: 'Terminal Sur Bogotá',
    },
  });

  // 10. Crear Ruta
  console.log('🛣️  Creando ruta de prueba...');
  const ruta = await prisma.ruta.upsert({
    where: { idRuta: 'rt-bogota-centro-sur-000000001' },
    update: { tiempoEstimado: '45 min' },
    create: {
      idRuta: 'rt-bogota-centro-sur-000000001',
      idOrigen: origen.idOrigen,
      idDestino: destino.idDestino,
      distancia: new Prisma.Decimal(15.5),
      observaciones: 'Ruta principal Centro - Sur',
      tiempoEstimado: '45 min',
      precioBase: new Prisma.Decimal(30000),
      estado: 'Activa',
    },
  });

  // 7. Crear Reservas de prueba
  console.log('📅 Creando reservas de prueba...');

  // Obtener cliente
  const cliente = await prisma.usuarios.findUnique({ where: { correo: 'client@enrutapp.com' } });

  if (cliente && ruta && metodoPago) {
    // Crear una reserva de prueba
    const reserva = await prisma.reservasPrivadas.upsert({
      where: { idReservaPrivada: 'res-prueba-0000-0000-000000000001' },
      update: {},
      create: {
        idReservaPrivada: 'res-prueba-0000-0000-000000000001',
        idUsuario: cliente.idUsuario,
        idRuta: ruta.idRuta,
        fecha: new Date('2025-12-15'),
        horaSalida: '08:00',
        cantidadPersonas: 3,
        precioTotal: 150000,
        idMetodoPago: metodoPago.idMetodoPago,
        estadoReserva: 'Pendiente',
        fechaReserva: new Date(),
        idVehiculo: null,
        idConductor: null,
      },
    });

    console.log('✅ Reserva de prueba creada:', reserva.idReservaPrivada);

    // Crear detalles de pasajeros
    await prisma.detalleReservaPrivadaPasajero.upsert({
      where: { idDetalle: 'det-pasajero-0001-0000-000000000001' },
      update: {},
      create: {
        idDetalle: 'det-pasajero-0001-0000-000000000001',
        idReservaPrivada: reserva.idReservaPrivada,
        nombrePasajero: 'Juan Pérez',
        tipoDoc: tipoDoc.idTipoDoc,
        numDocPasajero: '1001001001',
        edadPasajero: 30,
      },
    });

    console.log('✅ Pasajero de prueba agregado');
  } else {
    console.warn('⚠️ No se pudo crear reservas de prueba: faltan datos necesarios');
  }

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
