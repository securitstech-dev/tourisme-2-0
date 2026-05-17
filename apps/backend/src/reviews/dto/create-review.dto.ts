import { IsString, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  listingId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(10)
  comment: string;
}
