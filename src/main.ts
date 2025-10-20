import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
const chalk = require('chalk');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos de /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Habilitar CORS para todas las conexiones (desarrollo)
  app.enableCors({
    origin: true, // Permitir todos los orígenes durante desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // Habilitar validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma automáticamente los tipos
      disableErrorMessages: false, // Mostrar mensajes de error detallados
    }),
  );

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('EnrutApp API')
    .setDescription(
      'API REST para el sistema de gestión de transporte EnrutApp. Incluye autenticación JWT, gestión de usuarios, roles, rutas, vehículos, conductores, reservas y más.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Endpoints de autenticación y autorización')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag('Roles', 'Gestión de roles y permisos')
    .addTag('Tipos de Documento', 'Catálogo de tipos de documento de identidad')
    .addTag('Ciudades', 'Catálogo de ciudades')
    .addTag('Rutas', 'Gestión de rutas de transporte')
    .addTag('Vehículos', 'Gestión de vehículos')
    .addTag('Conductores', 'Gestión de conductores')
    .addTag('Reservas', 'Gestión de reservas de pasajeros')
    .addTag('Encomiendas', 'Gestión de encomiendas')
    .addTag('Turnos', 'Gestión de turnos de trabajo')
    .addTag('Finanzas', 'Módulo de finanzas y reportes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description:
          'Ingrese el token JWT obtenido del endpoint /api/auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'EnrutApp API - Documentación',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Mensajes informativos en consola con colores
  const serverUrl = `http://localhost:${port}`;
  const apiUrl = `${serverUrl}/api`;
  const docsUrl = `${serverUrl}/api/docs`;
  const uploadsUrl = `${serverUrl}/uploads`;

  console.log('\n');
  console.log(chalk.bold.cyan('=========================================='));
  console.log(chalk.bold.cyan('🚀 EnrutApp Backend - Servidor Iniciado 🚀'));
  console.log(chalk.bold.cyan('=========================================='));
  console.log('\n');

  console.log(chalk.bold('📍 URLs del Servidor:'));
  console.log(chalk.green(`   ➜ Local:           ${chalk.bold(serverUrl)}`));
  console.log(chalk.green(`   ➜ API Base:        ${chalk.bold(apiUrl)}`));
  console.log(
    chalk.yellow(`   ➜ Swagger Docs:    ${chalk.bold.underline(docsUrl)}`),
  );
  console.log(chalk.blue(`   ➜ Archivos:        ${chalk.bold(uploadsUrl)}`));

  console.log('\n');
  console.log(chalk.bold('⚙️ Configuración:'));
  console.log(chalk.green('   ✓ Autenticación:   JWT Bearer Token'));
  console.log(chalk.green('   ✓ Validación:      class-validator (Global)'));
  console.log(
    chalk.green('   ✓ CORS:            Habilitado (todos los orígenes)'),
  );
  console.log(chalk.green('   ✓ Prefijo API:     /api'));

  console.log('\n');
  console.log(chalk.bold('📋 Endpoints Principales:'));
  console.log(chalk.gray('   Auth:'));
  console.log(
    chalk.white('   • POST   /api/auth/login           - Iniciar sesión'),
  );
  console.log(
    chalk.white('   • POST   /api/auth/register        - Registrar usuario'),
  );
  console.log(
    chalk.white('   • GET    /api/auth/profile         - Perfil (🔒 JWT)'),
  );
  console.log(chalk.gray('\n   Recursos:'));
  console.log(
    chalk.white(
      '   • GET    /api/usuarios             - Listar usuarios (🔒 JWT)',
    ),
  );
  console.log(
    chalk.white('   • GET    /api/roles                - Listar roles'),
  );
  console.log(
    chalk.white('   • GET    /api/ciudades             - Catálogo de ciudades'),
  );
  console.log(
    chalk.white('   • GET    /api/tipos-documento      - Tipos de documento'),
  );

  console.log('\n');
  console.log(
    chalk.bold.yellow('💡 Tip: ') +
      chalk.white(
        `Abre ${chalk.bold.underline(docsUrl)} para ver la documentación de swagger completa`,
      ),
  );
  console.log(
    chalk.bold.yellow('🔑 Nota: ') +
      chalk.white(
        'Usa el botón "Authorize" en Swagger para autenticarte con JWT',
      ),
  );

  console.log('\n');
  console.log(
    chalk.bold.magenta('📊 Estado: ') +
      chalk.bold.green('✓ Listo para recibir peticiones'),
  );
  console.log(chalk.cyan('==========================================\n'));
}

void bootstrap();
