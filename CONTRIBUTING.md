# 🛠️ Guía de Desarrollo

Guía práctica para el equipo de desarrollo de **EnrutApp Backend**.

## 📋 Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Flujo de Trabajo Diario](#flujo-de-trabajo-diario)
- [Estándares de Código](#estándares-de-código)
- [Convenciones de Commits](#convenciones-de-commits)
- [Testing](#testing)
- [Tips y Buenas Prácticas](#tips-y-buenas-prácticas)

---

## 🛠️ Configuración Inicial

### Prerrequisitos

- **Node.js**: >= 18.x (recomendado 20.x)
- **MySQL**: >= 8.0
- **npm**: >= 9.x

### Primera vez configurando el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/EnrutApp/enrutapp-backend.git
cd enrutapp-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de MySQL

# 4. Ejecutar migraciones de Prisma
npx prisma migrate dev

# 5. Iniciar servidor
npm run start:dev
```

### Verificar que todo funciona

```bash
# API corriendo: http://localhost:3000
# Swagger: http://localhost:3000/api/docs

# Ejecutar tests
npm run test
```

---

## 🔄 Flujo de Trabajo Diario

### Trabajar en una nueva feature

```bash
# 1. Actualizar main
git checkout main
git pull origin main

# 2. Crear branch
git checkout -b feature/nombre-descriptivo

# 3. Desarrollar
# ... hacer cambios en el código ...

# 4. Antes de commit, verificar
npm run lint:check     # Verifica linting
npm run format         # Formatea código
npm run test          # Ejecuta tests

# 5. Commit
git add .
git commit -m "feat: descripción del cambio"

# 6. Push
git push origin feature/nombre-descriptivo

# 7. Crear Pull Request en GitHub
# El CI/CD se ejecutará automáticamente
```

### Tipos de Branches

- `feature/nombre` - Nueva funcionalidad
- `fix/nombre` - Corrección de bug
- `refactor/nombre` - Refactorización
- `chore/nombre` - Mantenimiento

**Ejemplos:**
```bash
git checkout -b feature/modulo-reservas
git checkout -b fix/validacion-email
git checkout -b refactor/optimizar-queries
```

---

## 📝 Estándares de Código

### TypeScript

- ✅ **Tipado estricto**: Evita `any`, usa tipos específicos
- ✅ **Interfaces**: Define interfaces para objetos complejos
- ✅ **Nomenclatura**: camelCase para variables, PascalCase para clases

```typescript
// ❌ Mal
function getData(id: any) {
  return data[id];
}

// ✅ Bien
function getData(id: string): UserDto {
  return this.userRepository.findById(id);
}
```

### NestJS

- ✅ **DTOs**: Usa DTOs para validación de entrada
- ✅ **Decoradores**: Usa decoradores apropiados (@Injectable, @Controller, etc.)
- ✅ **Modules**: Organiza el código en módulos cohesivos
- ✅ **Guards**: Protege rutas con guards de autenticación

```typescript
// ✅ Estructura de un controller
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(createUsuarioDto);
  }
}
```

### Prisma

- ✅ **Queries eficientes**: Usa `select` e `include` apropiadamente
- ✅ **Transacciones**: Usa transacciones para operaciones múltiples
- ✅ **Manejo de errores**: Captura y maneja errores de Prisma

```typescript
// ✅ Query eficiente
async findUsuarioWithRol(id: string) {
  return this.prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: {
        select: {
          nombre: true,
          permisos: true,
        },
      },
    },
  });
}
```

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Variables | camelCase | `usuarioActivo` |
| Funciones | camelCase | `obtenerUsuarios()` |
| Clases | PascalCase | `UsuariosController` |
| Interfaces | PascalCase con prefijo I | `IUsuarioResponse` |
| Enums | PascalCase | `EstadoReserva` |
| Constantes | UPPER_SNAKE_CASE | `MAX_INTENTOS_LOGIN` |
| Archivos | kebab-case | `usuarios.controller.ts` |
| DTOs | PascalCase con sufijo Dto | `CreateUsuarioDto` |

### Estructura de Carpetas

```
src/modules/nombre-modulo/
├── nombre-modulo.module.ts
├── nombre-modulo.controller.ts
├── nombre-modulo.service.ts
├── nombre-modulo.service.spec.ts
├── dto/
│   ├── create-nombre.dto.ts
│   ├── update-nombre.dto.ts
│   └── index.ts
├── entities/           (opcional)
├── guards/            (opcional)
└── interfaces/        (opcional)
```

---

## 💬 Convenciones de Commits

Usamos **Conventional Commits** para mantener un historial claro:

```
<tipo>: <descripción corta>
```

### Tipos

- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `refactor` - Refactorización
- `chore` - Mantenimiento (deps, config)
- `docs` - Documentación
- `test` - Tests

### Ejemplos

```bash
git commit -m "feat: agregar módulo de reservas"
git commit -m "fix: corregir validación de email"
git commit -m "refactor: optimizar queries de Prisma"
git commit -m "chore: actualizar dependencias"
```

### Tips

- ✅ Presente imperativo: "agregar" no "agregado"
- ✅ Minúscula
- ✅ Sin punto final
- ✅ Máximo 72 caracteres

---

## 🧪 Testing

### Escribir Tests

```typescript
// usuarios.service.spec.ts
describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar un array de usuarios', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e

# Test específico
npm run test -- usuarios.service.spec.ts
```

### Cobertura Mínima

- ✅ **80%** de cobertura de líneas
- ✅ **75%** de cobertura de branches
- ✅ **80%** de cobertura de funciones
- ✅ **80%** de cobertura de statements

---

## � Tips y Buenas Prácticas

### Scripts útiles

```bash
# Desarrollo
npm run start:dev           # Servidor con hot-reload
npm run test:watch         # Tests en modo watch

# Antes de commit
npm run lint:check         # Verificar linting
npm run format            # Formatear código
npm run test              # Ejecutar tests

# Prisma
npx prisma studio         # GUI para ver/editar BD
npx prisma migrate dev    # Crear nueva migración
npx prisma generate       # Regenerar cliente
```

### Estructura de archivos

```
src/modules/nombre-modulo/
├── nombre-modulo.module.ts
├── nombre-modulo.controller.ts
├── nombre-modulo.service.ts
├── nombre-modulo.service.spec.ts
└── dto/
    ├── create-nombre.dto.ts
    └── update-nombre.dto.ts
```

### Nomenclatura

- Variables/Funciones: `camelCase`
- Clases/Interfaces: `PascalCase`
- Archivos: `kebab-case`
- Constantes: `UPPER_SNAKE_CASE`

### GitHub Actions

El CI/CD se ejecuta automáticamente en cada push/PR y verifica:
- ✅ Linting
- ✅ Tests en Node 18, 20, 22
- ✅ Build exitoso
- ✅ Prisma schema válido

Si algo falla, GitHub te notificará. ¡Revisa los logs!

---

<p align="center">
  📝 Última actualización: Octubre 2025
</p>
