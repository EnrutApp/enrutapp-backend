import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaLicenciaDto } from './create-categoria-licencia.dto';

/**
 * DTO para actualizar una categoría de licencia
 * Hereda todos los campos de CreateCategoriaLicenciaDto pero los hace opcionales
 */
export class UpdateCategoriaLicenciaDto extends PartialType(
  CreateCategoriaLicenciaDto,
) {}
