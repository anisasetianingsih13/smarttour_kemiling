export class CreateTourismDto {
  name!: string;
  description!: string;
  isIndoor!: boolean;
  latitude!: number;
  longitude!: number;
  rating?: number;
  imageUrl?: string;
}
