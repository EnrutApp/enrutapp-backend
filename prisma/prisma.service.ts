import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // 👇 Forzamos el tipo del evento para evitar el error de TypeScript
    (this.$on as any)('beforeExit', async () => {
      await app.close();
    });
  }
}
