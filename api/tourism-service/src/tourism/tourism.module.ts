import { Module } from '@nestjs/common';
import { TourismService } from './tourism.service';
import { TourismController } from './tourism.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TourismController],
  providers: [TourismService, PrismaService],
})
export class TourismModule {}
