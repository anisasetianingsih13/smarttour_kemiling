import { PrismaService } from '../../prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

// buat fungsi untuk pengecekan data tourism
export const notExistTourism = async (
  prisma: PrismaService['tourismPlace'],
  id: number,
  message: string,
) => {
  // tampilkan data tourism berdasarkan id
  const data = await prisma.findUnique({
    where: { id: id },
  });

  // jika data tidak ditemukan
  if (!data) {
    throw new NotFoundException({
      success: false,
      message: message,
      metadata: {
        status: HttpStatus.NOT_FOUND,
      },
    });
  }

  return data;
};
