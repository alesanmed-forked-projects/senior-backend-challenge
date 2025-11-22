import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UpdateReviewCommand } from 'src/reviews/application/usecases/commands/update-review.command';

export class UpdateReviewDto
  implements Omit<UpdateReviewCommand, 'userId' | 'id'>
{
  @ApiProperty({
    description: 'The rating of the review',
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'The comment of the review',
    example: 'This is a test review',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  comment: string;
}
