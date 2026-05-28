import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourismModule } from './tourism/tourism.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TourismModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
