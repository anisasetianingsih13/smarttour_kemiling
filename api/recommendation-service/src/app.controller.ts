import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('recommendation')
  async getRecommendation(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    if (!lat || !lng) {
      throw new BadRequestException('Parameter lat dan lng wajib diisi!');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('Parameter lat dan lng harus berupa angka valid!');
    }

    return this.appService.getRecommendation(latitude, longitude);
  }
}
