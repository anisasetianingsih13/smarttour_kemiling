import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { PrismaService } from '../../prisma.service';

// pengecekan data tourism
export const notExistTourism = async (
  prisma: PrismaService['tourismPlace'],
  id: number,
  message: string,
) => {
  // cek data tourism berdasarkan id
  const exist = await prisma.findFirst({
    where: {
      id: id,
    },
  });

  // jika data tidak ditemukan
  if (!exist) {
    throw new NotFoundException({
      success: false,
      message: message,
      metadata: {
        status: HttpStatus.NOT_FOUND,
      },
    });
  }

  return exist;
};
