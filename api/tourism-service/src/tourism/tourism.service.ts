import { Injectable } from '@nestjs/common';
import { CreateTourismDto } from './dto/create-tourism.dto';
import { UpdateTourismDto } from './dto/update-tourism.dto';

@Injectable()
export class TourismService {
  create(createTourismDto: CreateTourismDto) {
    return 'This action adds a new tourism';
  }

  findAll() {
    return `This action returns all tourism`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourism`;
  }

  update(id: number, updateTourismDto: UpdateTourismDto) {
    return `This action updates a #${id} tourism`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourism`;
  }
}
