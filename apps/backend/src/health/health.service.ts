import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async check() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const version = process.env.npm_package_version || '1.0.0';

    // Check database connection
    let databaseStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    return {
      status: 'ok',
      timestamp,
      uptime,
      version,
      database: databaseStatus,
    };
  }
}
