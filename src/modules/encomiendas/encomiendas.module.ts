import { Module } from '@nestjs/common';
import { EncomiendasService } from './encomiendas.service';

import { EncomiendasController } from './encomiendas.controller';

@Module({
  controllers: [EncomiendasController],
  providers: [EncomiendasService],
})
export class EncomiendasModule {}
