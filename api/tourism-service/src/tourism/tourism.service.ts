import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTourismDto } from './dto/create-tourism.dto';
import { UpdateTourismDto } from './dto/update-tourism.dto';

@Injectable()
export class TourismService {
  constructor(private prisma: PrismaService) {}
  async create(createTourismDto: CreateTourismDto) {
    return await this.prisma.tourismPlace.create({
    data: createTourismDto,
  });
  }

  async findAll() {
    return await this.prisma.tourismPlace.findMany();
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
