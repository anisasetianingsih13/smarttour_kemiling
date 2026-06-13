import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourismModule } from './tourism/tourism.module';

@Module({
  imports: [TourismModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
