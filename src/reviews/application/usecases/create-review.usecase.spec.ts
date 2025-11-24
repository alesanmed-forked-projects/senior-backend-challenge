import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CreateReviewUsecase } from './create-review.usecase';
import { createReviewRepositoryMock } from 'src/test-utils';
import { CreateReviewCommand } from './commands/create-review.command';
import { faker } from '@faker-js/faker';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

describe('CreateReviewUsecase', () => {
  let usecase: CreateReviewUsecase;
  let reviewRepository: ReturnType<typeof createReviewRepositoryMock>;

  beforeEach(() => {
    reviewRepository = createReviewRepositoryMock();
    usecase = new CreateReviewUsecase(reviewRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a review and return its ID', async () => {
      const command: CreateReviewCommand = {
        userId: faker.number.int({ min: 1, max: 100 }),
        restaurantId: faker.number.int({ min: 1, max: 100 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      const reviewId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(reviewRepository.create).mockResolvedValue(reviewId);

      const result = await usecase.execute(command);

      expect(result).toBe(reviewId);
      expect(reviewRepository.create).toHaveBeenCalledTimes(1);
      expect(reviewRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: command.userId,
          restaurantId: command.restaurantId,
          rating: command.rating,
          comment: command.comment,
        }),
      );
    });

    it('should throw error when restaurant does not exist', async () => {
      const command: CreateReviewCommand = {
        userId: faker.number.int({ min: 1, max: 100 }),
        restaurantId: faker.number.int({ min: 1, max: 100 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      vi.mocked(reviewRepository.create).mockRejectedValue(
        new RestaurantNotFound(command.restaurantId),
      );

      await expect(usecase.execute(command)).rejects.toThrow(
        RestaurantNotFound,
      );
    });

    it('should handle repository errors', async () => {
      const command: CreateReviewCommand = {
        userId: faker.number.int({ min: 1, max: 100 }),
        restaurantId: faker.number.int({ min: 1, max: 100 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      vi.mocked(reviewRepository.create).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(command)).rejects.toThrow('Database error');
    });
  });
});
