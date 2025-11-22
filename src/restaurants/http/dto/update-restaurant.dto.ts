import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { EditRestaurantCommand } from 'src/restaurants/application/usecases/commands/edit-restaurant.usecase';
import { CoordinatesDto } from './create-restaurant.dto';

export class UpdateRestaurantDto implements Omit<EditRestaurantCommand, 'id'> {
  @ApiProperty({
    description: 'The name of the restaurant',
    example: 'Restaurant 1',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The neighborhood of the restaurant',
    example: 'Neighborhood 1',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  neighborhood: string;

  @ApiProperty({
    description: 'The photograph of the restaurant',
    example: 'Photograph 1',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  photograph: string;

  @ApiProperty({
    description: 'The address of the restaurant',
    example: 'Address 1',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    description: 'The coordinates of the restaurant',
    example: {
      lat: 19.432607,
      lng: -99.133209,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  @IsOptional()
  @IsNotEmpty()
  coordinates: CoordinatesDto;

  @ApiProperty({
    description: 'The image URL of the restaurant',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  @IsUrl()
  image_url: string;

  @ApiProperty({
    description: 'The cuisine type of the restaurant',
    example: 'Mexican',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  cuisine_type: string;
}
