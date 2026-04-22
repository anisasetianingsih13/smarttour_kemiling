import { PartialType } from '@nestjs/mapped-types';
import { CreateTourismDto } from './create-tourism.dto';

export class UpdateTourismDto extends PartialType(CreateTourismDto) {}
