import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateRestaurantCommand } from 'src/restaurants/application/usecases/commands/create-restaurant.command';

export class CoordinatesDto {
  @ApiProperty({
    description: 'The latitude of the restaurant',
    example: 19.432607,
  })
  @IsNumber({ maxDecimalPlaces: 6 })
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    description: 'The longitude of the restaurant',
    example: -99.133209,
  })
  @IsNumber({ maxDecimalPlaces: 6 })
  @IsNotEmpty()
  lng: number;
}

export class CreateRestaurantDto implements CreateRestaurantCommand {
  @ApiProperty({
    description: 'The name of the restaurant',
    example: 'Restaurant 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The neighborhood of the restaurant',
    example: 'Neighborhood 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  neighborhood: string;

  @ApiProperty({
    description: 'The photograph of the restaurant',
    example: 'Photograph 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  photograph: string;

  @ApiProperty({
    description: 'The address of the restaurant',
    example: 'Address 1',
  })
  @IsString()
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
  @IsNotEmpty()
  coordinates: CoordinatesDto;

  @ApiProperty({
    description: 'The image URL of the restaurant',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsUrl()
  image_url: string;

  @ApiProperty({
    description: 'The cuisine type of the restaurant',
    example: 'Mexican',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cuisine_type: string;
}
