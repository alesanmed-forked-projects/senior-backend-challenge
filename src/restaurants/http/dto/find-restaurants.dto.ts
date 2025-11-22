import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  ALLOWED_SORT_FIELDS,
  FindRestaurantsQuery,
} from 'src/restaurants/application/usecases/queries/find-restaurants.query';

export class FindRestaurantsDto implements FindRestaurantsQuery {
  @ApiProperty({
    description: 'The cuisine of the restaurant',
    example: 'Pizza',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cuisine?: string;

  @ApiProperty({
    description: 'The rating of the restaurant',
    example: 4.5,
    required: false,
  })
  @Type(() => Number)
  @Min(0)
  @Max(5.0)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsNotEmpty()
  @IsOptional()
  rating?: number;

  @ApiProperty({
    description: 'The neighborhood of the restaurant',
    example: 'Colonia Roma',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  neighborhood?: string;

  @ApiProperty({
    description: 'The page number',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: 'The page limit',
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    description: 'The sort field',
    example: 'name',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_SORT_FIELDS)
  @IsOptional()
  sort?: string;

  @ApiProperty({
    description: 'The sort order',
    example: 'asc',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
