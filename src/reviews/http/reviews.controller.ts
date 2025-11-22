import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindReviewsUsecase } from 'src/reviews/application/usecases/find-reviews.usecase';
import { HttpReviewMapper } from './mappers/http-review.mapper';
import { CurrentUser } from 'src/core/http/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/domain/auth-user';
import { FindReviewsByUserUsecase } from 'src/reviews/application/usecases/find-reviews-by-user.usecase';
import type { Response } from 'express';
import { CreateReviewUsecase } from 'src/reviews/application/usecases/create-review.usecase';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewCommand } from 'src/reviews/application/usecases/commands/create-review.command';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateReviewCommand } from 'src/reviews/application/usecases/commands/update-review.command';
import { UpdateReviewUsecase } from 'src/reviews/application/usecases/update-review.usecase';
import { DeleteReviewUsecase } from 'src/reviews/application/usecases/delete-review.usecase';
import { PublicEndpoint } from 'src/core/http/decorators/public.decorator';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(
    private readonly findReviewsByRestaurantIdUsecase: FindReviewsUsecase,
    private readonly findReviewsByUserUsecase: FindReviewsByUserUsecase,
    private readonly createReviewUsecase: CreateReviewUsecase,
    private readonly updateReviewUsecase: UpdateReviewUsecase,
    private readonly deleteReviewUsecase: DeleteReviewUsecase,
  ) {}

  @ApiOperation({ summary: 'Find restaurant by id' })
  @ApiParam({ name: 'restaurantId', description: 'The id of the restaurant' })
  @ApiResponse({ status: 200, description: 'Reviews found successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @PublicEndpoint()
  @Get('/restaurants/:restaurantId/reviews')
  async findReviewsByRestaurantId(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    const reviews =
      await this.findReviewsByRestaurantIdUsecase.execute(restaurantId);

    return reviews.map(HttpReviewMapper.toDto);
  }

  @ApiOperation({ summary: 'Find reviews by current user' })
  @ApiResponse({ status: 200, description: 'Reviews found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('/me/reviews')
  async findReviewsByCurrentUser(@CurrentUser() user: AuthUser) {
    const reviews = await this.findReviewsByUserUsecase.execute(user.id);

    return reviews.map(HttpReviewMapper.toDto);
  }

  @ApiOperation({ summary: 'Create a new review' })
  @ApiParam({ name: 'restaurantId', description: 'The id of the restaurant' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid review data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Post('/restaurants/:restaurantId/reviews')
  async createReview(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @CurrentUser() user: AuthUser,
    @Body() createReviewDto: CreateReviewDto,
    @Res() response: Response,
  ) {
    const createReviewCommand: CreateReviewCommand = {
      userId: user.id,
      restaurantId,
      ...createReviewDto,
    };

    const reviewId =
      await this.createReviewUsecase.execute(createReviewCommand);

    response.status(HttpStatus.CREATED).send({ id: reviewId });
  }

  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', description: 'The id of the review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid review data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @Put('/reviews/:id')
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const updateReviewCommand: UpdateReviewCommand = {
      userId: user.id,
      id,
      ...updateReviewDto,
    };

    await this.updateReviewUsecase.execute(updateReviewCommand);
  }

  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'The id of the review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  @Delete('/reviews/:id')
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    await this.deleteReviewUsecase.execute(id, user.id);
  }
}
