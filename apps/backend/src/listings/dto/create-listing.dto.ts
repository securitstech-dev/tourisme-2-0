import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ListingType } from '@prisma/client';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ListingType)
  @IsNotEmpty()
  listingType: ListingType;

  @IsNumber()
  @IsOptional()
  pricePerNight?: number;

  @IsNumber()
  @IsOptional()
  pricePerPerson?: number;

  @IsNumber()
  @IsOptional()
  priceFlatRate?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  images?: { url: string; cloudinaryId: string }[];
}
