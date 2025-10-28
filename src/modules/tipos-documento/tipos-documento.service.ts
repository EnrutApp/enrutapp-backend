import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';

// Type guard para errores conocidos de Prisma sin depender de tipos internos
type PrismaKnownError = {
  code: string;
  meta?: { target?: string[] | string } | undefined;
};

function isPrismaKnownError(err: unknown): err is PrismaKnownError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in (err as Record<string, unknown>) &&
    typeof (err as { code: unknown }).code === 'string'
  );
}

/**
 * Servicio de Tipos de Documento
 * Contiene toda la lógica de negocio relacionada con tipos de documento
 */
@Injectable()
export class TiposDocumentoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los tipos de documento con sus usuarios asociados
   */
  async findAll() {
    try {
      const tiposDoc = await this.prisma.tiposDoc.findMany({
        include: {
          usuarios: true,
        },
      });

      return {
        success: true,
        data: tiposDoc,
        message: 'Tipos de documento obtenidos exitosamente',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al obtener tipos de documento',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crea un nuevo tipo de documento
   */
  async create(createTipoDocDto: { nombreTipoDoc: string }) {
    try {
      // Normalizar entrada
      const nombreNormalizado = createTipoDocDto?.nombreTipoDoc?.trim();
      if (!nombreNormalizado) {
        throw new HttpException(
          {
            success: false,
            error: 'Validación',
            message: 'El nombre del tipo de documento es requerido',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar duplicado antes de crear para retornar un error amigable
      const existente = await this.prisma.tiposDoc.findUnique({
        where: { nombreTipoDoc: nombreNormalizado },
      });
      if (existente) {
        throw new HttpException(
          {
            success: false,
            error: 'Duplicado',
            message: `Ya existe un tipo de documento con el nombre "${nombreNormalizado}"`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const data = {
        idTipoDoc: uuidv4(),
        nombreTipoDoc: nombreNormalizado,
      };
      const nuevoTipoDoc = await this.prisma.tiposDoc.create({
        data,
      });

      return {
        success: true,
        data: nuevoTipoDoc,
        message: 'Tipo de documento creado exitosamente',
      };
    } catch (error) {
      if (isPrismaKnownError(error) && error.code === 'P2002') {
        const campos = Array.isArray(error.meta?.target)
          ? error.meta?.target.join(', ')
          : error.meta?.target || 'campo único';
        throw new HttpException(
          {
            success: false,
            error: 'Duplicado',
            message: `Ya existe un registro con el mismo valor en ${campos}`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new HttpException(
        {
          success: false,
          error: 'Error al crear tipo de documento',
          message: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
