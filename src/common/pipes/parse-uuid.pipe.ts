import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomParseUUIDPipe implements PipeTransform<string> {
  transform(value: string): string {
    // Si el valor está vacío o es null, lanzar error
    if (!value) {
      throw new BadRequestException('ID no puede estar vacío');
    }

    // Convertir a string si viene como número
    const stringValue = String(value).trim();

    // Validar que no esté vacío después de trim
    if (!stringValue) {
      throw new BadRequestException('ID no puede estar vacío');
    }

    return stringValue;
  }
}
