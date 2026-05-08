import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TourismService } from './tourism.service';
import { CreateTourismDto } from './dto/create-tourism.dto';
import { UpdateTourismDto } from './dto/update-tourism.dto';

@Controller('tourism')
export class TourismController {
  constructor(private readonly tourismService: TourismService) {}

  @Post()
  create(@Body() createTourismDto: CreateTourismDto) {
    return this.tourismService.create(createTourismDto);
  }

  @Get()
  findAll() {
    return this.tourismService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourismService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourismDto: UpdateTourismDto) {
    return this.tourismService.update(+id, updateTourismDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourismService.remove(+id);
  }
}
