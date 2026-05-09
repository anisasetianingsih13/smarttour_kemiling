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

  // tampil semua data wisata
  async findAll() {
    const data = await this.prisma.tourismPlace.findMany();

    return {
      success: true,
      message: 'Data wisata berhasil ditampilkan',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data: data,
    };
  }

  // detail data wisata berdasarkan id
  async findOne(id: number) {
    const data = await this.prisma.tourismPlace.findUnique({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Detail data wisata berhasil ditampilkan',
      metadata: {
        status: HttpStatus.OK,
      },
      data: data,
    };
  }

  // ubah data wisata
  async update(id: number, updateTourismDto: UpdateTourismDto) {
    await this.prisma.tourismPlace.update({
      where: {
        id,
      },
      data: updateTourismDto,
    });

    return {
      success: true,
      message: 'Data wisata berhasil diubah',
      metadata: {
        status: HttpStatus.OK,
      },
    };
  }

  async remove(id: number) {
    return await this.prisma.tourismPlace.delete({
      where: {
        id,
      },
    });
  }
}
