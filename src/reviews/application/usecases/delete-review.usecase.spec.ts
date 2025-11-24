import { describe, it, beforeEach, expect, vi } from 'vitest';
import { DeleteReviewUsecase } from './delete-review.usecase';
import { createReviewRepositoryMock, stubReview } from 'src/test-utils';
import { ReviewNotFound } from 'src/reviews/domain/errors/review-not-found.error';
import { faker } from '@faker-js/faker';

describe('DeleteReviewUsecase', () => {
  let usecase: DeleteReviewUsecase;
  let reviewRepository: ReturnType<typeof createReviewRepositoryMock>;

  beforeEach(() => {
    reviewRepository = createReviewRepositoryMock();
    usecase = new DeleteReviewUsecase(reviewRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a review successfully', async () => {
      const review = stubReview();
      vi.mocked(reviewRepository.findByUserAndId).mockResolvedValue(review);
      vi.mocked(reviewRepository.delete).mockResolvedValue();

      await usecase.execute(review.id!, review.userId);

      expect(reviewRepository.findByUserAndId).toHaveBeenCalledWith(
        review.userId,
        review.id,
      );
      expect(reviewRepository.delete).toHaveBeenCalledWith(review.id);
    });

    it('should throw ReviewNotFound when review does not exist', async () => {
      const reviewId = faker.number.int({ min: 1, max: 1000 });
      const userId = faker.number.int({ min: 1, max: 100 });

      vi.mocked(reviewRepository.findByUserAndId).mockResolvedValue(undefined);

      await expect(usecase.execute(reviewId, userId)).rejects.toThrow(
        ReviewNotFound,
      );
      expect(reviewRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const reviewId = faker.number.int({ min: 1, max: 1000 });
      const userId = faker.number.int({ min: 1, max: 100 });

      vi.mocked(reviewRepository.findByUserAndId).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(reviewId, userId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
