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

  async findOne(id: number) {
    return await this.prisma.tourismPlace.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTourismDto: UpdateTourismDto) {
    return await this.prisma.tourismPlace.update({
      where: {
        id,
      },
      data: updateTourismDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.tourismPlace.delete({
      where: {
        id,
      },
    });
  }
}
