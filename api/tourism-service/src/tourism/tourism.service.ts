import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTourismDto } from './dto/create-tourism.dto';
import { UpdateTourismDto } from './dto/update-tourism.dto';

@Injectable()
export class TourismService {
  constructor(private prisma: PrismaService) {}

  // tambah data wisata
  async create(createTourismDto: CreateTourismDto) {
    await this.prisma.tourismPlace.create({
      data: createTourismDto,
    });

    return {
      success: true,
      message: 'Data wisata berhasil ditambahkan',
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
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
