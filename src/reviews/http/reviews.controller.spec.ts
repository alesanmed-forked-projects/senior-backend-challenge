import { describe, it, beforeEach, expect, vi } from 'vitest';
import { ReviewsController } from './reviews.controller';
import { FindReviewsUsecase } from 'src/reviews/application/usecases/find-reviews.usecase';
import { FindReviewsByUserUsecase } from 'src/reviews/application/usecases/find-reviews-by-user.usecase';
import { CreateReviewUsecase } from 'src/reviews/application/usecases/create-review.usecase';
import { UpdateReviewUsecase } from 'src/reviews/application/usecases/update-review.usecase';
import { DeleteReviewUsecase } from 'src/reviews/application/usecases/delete-review.usecase';
import { stubAuthUser, stubReview } from 'src/test-utils';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { HttpReviewMapper } from './mappers/http-review.mapper';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { ReviewNotFound } from 'src/reviews/domain/errors/review-not-found.error';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let findReviewsByRestaurantIdUsecase: FindReviewsUsecase;
  let findReviewsByUserUsecase: FindReviewsByUserUsecase;
  let createReviewUsecase: CreateReviewUsecase;
  let updateReviewUsecase: UpdateReviewUsecase;
  let deleteReviewUsecase: DeleteReviewUsecase;

  beforeEach(() => {
    findReviewsByRestaurantIdUsecase = {
      execute: vi.fn(),
    } as any;

    findReviewsByUserUsecase = {
      execute: vi.fn(),
    } as any;

    createReviewUsecase = {
      execute: vi.fn(),
    } as any;

    updateReviewUsecase = {
      execute: vi.fn(),
    } as any;

    deleteReviewUsecase = {
      execute: vi.fn(),
    } as any;

    controller = new ReviewsController(
      findReviewsByRestaurantIdUsecase,
      findReviewsByUserUsecase,
      createReviewUsecase,
      updateReviewUsecase,
      deleteReviewUsecase,
    );
    vi.clearAllMocks();
  });

  describe('findReviewsByRestaurantId', () => {
    it('should return reviews for restaurant', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 100 });
      const reviews = [stubReview(), stubReview(), stubReview()];

      vi.mocked(findReviewsByRestaurantIdUsecase.execute).mockResolvedValue(
        reviews,
      );

      const result = await controller.findReviewsByRestaurantId(restaurantId);

      expect(result).toEqual(reviews.map(HttpReviewMapper.toDto));
      expect(findReviewsByRestaurantIdUsecase.execute).toHaveBeenCalledWith(
        restaurantId,
      );
    });

    it('should throw error when restaurant does not exist', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(findReviewsByRestaurantIdUsecase.execute).mockRejectedValue(
        new RestaurantNotFound(restaurantId),
      );

      await expect(
        controller.findReviewsByRestaurantId(restaurantId),
      ).rejects.toThrow(RestaurantNotFound);
    });
  });

  describe('findReviewsByCurrentUser', () => {
    it('should return reviews for current user', async () => {
      const user = stubAuthUser();
      const reviews = [stubReview(), stubReview()];

      vi.mocked(findReviewsByUserUsecase.execute).mockResolvedValue(reviews);

      const result = await controller.findReviewsByCurrentUser(user);

      expect(result).toEqual(reviews.map(HttpReviewMapper.toDto));
      expect(findReviewsByUserUsecase.execute).toHaveBeenCalledWith(user.id);
    });
  });

  describe('createReview', () => {
    it('should create review and return 201 with id', async () => {
      const user = stubAuthUser();
      const restaurantId = faker.number.int({ min: 1, max: 100 });
      const reviewId = faker.number.int({ min: 1, max: 1000 });

      const createReviewDto: CreateReviewDto = {
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      vi.mocked(createReviewUsecase.execute).mockResolvedValue(reviewId);

      await controller.createReview(
        restaurantId,
        user,
        createReviewDto,
        mockResponse,
      );

      expect(createReviewUsecase.execute).toHaveBeenCalledWith({
        userId: user.id,
        restaurantId,
        ...createReviewDto,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalledWith({ id: reviewId });
    });

    it('should throw error when restaurant does not exist', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 1000 });
      const user = stubAuthUser();
      const createReviewDto: CreateReviewDto = {
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };
      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      vi.mocked(createReviewUsecase.execute).mockRejectedValue(
        new RestaurantNotFound(restaurantId),
      );

      await expect(
        controller.createReview(
          restaurantId,
          user,
          createReviewDto,
          mockResponse,
        ),
      ).rejects.toThrow(RestaurantNotFound);
    });
  });

  describe('updateReview', () => {
    it('should update review', async () => {
      const user = stubAuthUser();
      const reviewId = faker.number.int({ min: 1, max: 1000 });

      const updateReviewDto: UpdateReviewDto = {
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      vi.mocked(updateReviewUsecase.execute).mockResolvedValue();

      await controller.updateReview(reviewId, user, updateReviewDto);

      expect(updateReviewUsecase.execute).toHaveBeenCalledWith({
        userId: user.id,
        id: reviewId,
        ...updateReviewDto,
      });
    });

    it('should throw error when review does not exist', async () => {
      const reviewId = faker.number.int({ min: 1, max: 1000 });
      const user = stubAuthUser();
      const updateReviewDto: UpdateReviewDto = {
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };
      vi.mocked(updateReviewUsecase.execute).mockRejectedValue(
        new ReviewNotFound(reviewId),
      );

      await expect(
        controller.updateReview(reviewId, user, updateReviewDto),
      ).rejects.toThrow(ReviewNotFound);
    });
  });

  describe('deleteReview', () => {
    it('should delete review', async () => {
      const user = stubAuthUser();
      const reviewId = faker.number.int({ min: 1, max: 1000 });

      vi.mocked(deleteReviewUsecase.execute).mockResolvedValue();

      await controller.deleteReview(reviewId, user);

      expect(deleteReviewUsecase.execute).toHaveBeenCalledWith(
        reviewId,
        user.id,
      );
    });

    it('should throw error when review does not exist', async () => {
      const reviewId = faker.number.int({ min: 1, max: 1000 });
      const user = stubAuthUser();
      vi.mocked(deleteReviewUsecase.execute).mockRejectedValue(
        new ReviewNotFound(reviewId),
      );

      await expect(controller.deleteReview(reviewId, user)).rejects.toThrow(
        ReviewNotFound,
      );
    });
  });
});
