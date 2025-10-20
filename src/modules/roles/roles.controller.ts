import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Public } from '../../common/decorators';
import { CreateRolDto, UpdateRolDto } from './dto';

/**
 * Controlador de Roles
 * Maneja las operaciones CRUD de roles del sistema
 */
@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Obtener todos los roles
   * Endpoint público
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todos los roles',
    description: 'Obtiene la lista completa de roles disponibles en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    schema: {
      example: {
        success: true,
        data: [
          {
            idRol: '550e8400-e29b-41d4-a716-446655440001',
            nombreRol: 'Admin',
            descripcion: 'Administrador del sistema',
            estado: true,
          },
          {
            idRol: '550e8400-e29b-41d4-a716-446655440002',
            nombreRol: 'Conductor',
            descripcion: 'Rol para conductores',
            estado: true,
          },
        ],
      },
    },
  })
  async findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Obtener un rol por ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener rol por ID',
    description: 'Obtiene la información detallada de un rol específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del rol (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    schema: {
      example: {
        success: true,
        data: {
          idRol: '550e8400-e29b-41d4-a716-446655440001',
          nombreRol: 'Admin',
          descripcion: 'Administrador del sistema',
          estado: true,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Rol no encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  /**
   * Crear un nuevo rol
   * Endpoint público
   */
  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear nuevo rol',
    description: 'Registra un nuevo rol en el sistema con sus permisos',
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          idRol: '550e8400-e29b-41d4-a716-446655440003',
          nombreRol: 'Conductor',
          descripcion: 'Rol para conductores de vehículos',
          estado: true,
        },
        message: 'Rol creado exitosamente',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o rol ya existe',
  })
  async create(@Body() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  /**
   * Actualizar un rol existente
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar rol',
    description:
      'Actualiza la información de un rol existente. No permite modificar el rol Admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del rol a actualizar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Rol actualizado correctamente',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Rol no encontrado',
  })
  @ApiForbiddenResponse({
    description: 'No se puede modificar el rol Admin',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos',
  })
  async update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolesService.update(id, updateRolDto);
  }

  /**
   * Eliminar un rol
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar rol',
    description:
      'Elimina un rol del sistema. No permite eliminar el rol Admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del rol a eliminar (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Rol eliminado correctamente',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Rol no encontrado',
  })
  @ApiForbiddenResponse({
    description: 'No se puede eliminar el rol Admin',
  })
  @ApiUnauthorizedResponse({
    description: 'Token no válido o expirado',
  })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
