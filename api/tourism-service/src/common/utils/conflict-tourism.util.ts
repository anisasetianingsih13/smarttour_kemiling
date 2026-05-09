import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { PrismaService } from '../../prisma.service';

// duplikasi data tourism
export const conflictTourism = async (
  prisma: PrismaService['tourismPlace'],
  message: string,
  name: string,
  id?: number,
) => {
  // cek apakah nama tourism sudah ada
  const exist = await prisma.findFirst({
    where: {
      name: name,

      // pengecualian saat update data
      ...(id ? { NOT: { id: id } } : undefined),
    },
  });

  // jika nama tourism sudah ada
  if (exist) {
    throw new ConflictException({
      success: false,
      message: message,
      metadata: {
        status: HttpStatus.CONFLICT,
      },
    });
  }

  return name;
};
