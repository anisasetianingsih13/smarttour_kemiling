import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTourismDto } from './dto/create-tourism.dto';
import { UpdateTourismDto } from './dto/update-tourism.dto';
import { conflictTourism } from '../common/utils/conflict-tourism.util';
import { notExistTourism } from '../common/utils/not-exist-tourism.util';

@Injectable()
export class TourismService {
  constructor(private prisma: PrismaService) {}

  // tambah data wisata
  async create(createTourismDto: CreateTourismDto) {
    try {
      const nameFilter = await conflictTourism(
        this.prisma.tourismPlace,
        process.env.FAILED_SAVE!,
        createTourismDto.name,
      );

      await this.prisma.tourismPlace.create({
        data: {
          ...createTourismDto,
          name: createTourismDto.name,
          nameFilter: nameFilter,
        },
      });

      return {
        success: true,
        message: process.env.SUCCESS_SAVE,
        metadata: {
          status: HttpStatus.CREATED,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: process.env.FAILED_CREATE,
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
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
    try {
      const data = await notExistTourism(
        this.prisma.tourismPlace,
        id,
        'Data wisata tidak ditemukan',
      );

      return {
        success: true,
        message: 'Detail data wisata berhasil ditampilkan',
        metadata: {
          status: HttpStatus.OK,
        },
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: 'Parameter / Slug ID Harus Angka !',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
  //update data
  async update(id: number, updateTourismDto: UpdateTourismDto) {
    try {
      // cek data ada atau tidak
      await notExistTourism(
        this.prisma.tourismPlace,
        id,
        'Data wisata tidak ditemukan',
      );

      // validasi name filter
      const nameFilter = updateTourismDto.name
        ? await conflictTourism(
            this.prisma.tourismPlace,
            process.env.FAILED_UPDATE!,
            updateTourismDto.name,
            id,
          )
        : undefined;

      await this.prisma.tourismPlace.update({
        where: {
          id: id,
        },
        data: {
          ...updateTourismDto,
          ...(nameFilter ? { nameFilter: nameFilter } : {}),
        },
      });

      return {
        success: true,
        message: process.env.SUCCESS_UPDATE,
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: 'Parameter / Slug ID Harus Angka !',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  // hapus data wisata
  async remove(id: number) {
    try {
      // cek data ada atau tidak
      await notExistTourism(
        this.prisma.tourismPlace,
        id,
        'Data wisata tidak ditemukan',
      );

      // hapus data wisata
      await this.prisma.tourismPlace.delete({
        where: {
          id: id,
        },
      });

      return {
        success: true,
        message: 'Data wisata berhasil dihapus',
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: 'Parameter / Slug ID Harus Angka !',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
}
