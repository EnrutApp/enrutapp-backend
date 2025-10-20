import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

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
  async create(createTipoDocDto: any) {
    try {
      const nuevoTipoDoc = await this.prisma.tiposDoc.create({
        data: createTipoDocDto,
      });

      return {
        success: true,
        data: nuevoTipoDoc,
        message: 'Tipo de documento creado exitosamente',
      };
    } catch (error) {
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
