import { describe, it, beforeEach, expect, vi } from 'vitest';
import { UpdateReviewUsecase } from './update-review.usecase';
import { createReviewRepositoryMock, stubReview } from 'src/test-utils';
import { UpdateReviewCommand } from './commands/update-review.command';
import { ReviewNotFound } from 'src/reviews/domain/errors/review-not-found.error';
import { faker } from '@faker-js/faker';

describe('UpdateReviewUsecase', () => {
  let usecase: UpdateReviewUsecase;
  let reviewRepository: ReturnType<typeof createReviewRepositoryMock>;

  beforeEach(() => {
    reviewRepository = createReviewRepositoryMock();
    usecase = new UpdateReviewUsecase(reviewRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a review successfully', async () => {
      const review = stubReview();
      const command: UpdateReviewCommand = {
        id: review.id!,
        userId: review.userId,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      vi.mocked(reviewRepository.findByUserAndId).mockResolvedValue(review);
      vi.mocked(reviewRepository.update).mockResolvedValue();

      await usecase.execute(command);

      expect(reviewRepository.findByUserAndId).toHaveBeenCalledWith(
        command.userId,
        command.id,
      );
      expect(reviewRepository.update).toHaveBeenCalledTimes(1);
      expect(review.rating).toBe(command.rating);
      expect(review.comment).toBe(command.comment);
    });

    it('should throw ReviewNotFound when review does not exist', async () => {
      const command: UpdateReviewCommand = {
        id: faker.number.int({ min: 1, max: 1000 }),
        userId: faker.number.int({ min: 1, max: 100 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      vi.mocked(reviewRepository.findByUserAndId).mockResolvedValue(undefined);

      await expect(usecase.execute(command)).rejects.toThrow(ReviewNotFound);
      expect(reviewRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command: UpdateReviewCommand = {
        id: faker.number.int({ min: 1, max: 1000 }),
        userId: faker.number.int({ min: 1, max: 100 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      vi.mocked(reviewRepository.findByUserAndId).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(command)).rejects.toThrow('Database error');
    });
  });
});
