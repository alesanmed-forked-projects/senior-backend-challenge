import { describe, it, beforeEach, expect, vi } from 'vitest';
import { FindReviewsByUserUsecase } from './find-reviews-by-user.usecase';
import {
  createReviewRepositoryMock,
  createUserRepositoryMock,
  stubReview,
  stubUser,
} from 'src/test-utils';
import { UserNotFound } from 'src/users/domain/errors/user-not-found.error';
import { faker } from '@faker-js/faker';

describe('FindReviewsByUserUsecase', () => {
  let usecase: FindReviewsByUserUsecase;
  let reviewRepository: ReturnType<typeof createReviewRepositoryMock>;
  let userRepository: ReturnType<typeof createUserRepositoryMock>;

  beforeEach(() => {
    reviewRepository = createReviewRepositoryMock();
    userRepository = createUserRepositoryMock();
    usecase = new FindReviewsByUserUsecase(
      reviewRepository as any,
      userRepository as any,
    );
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return reviews for a user', async () => {
      const user = stubUser();
      const reviews = [stubReview(), stubReview(), stubReview()];

      vi.mocked(userRepository.findById).mockResolvedValue(user);
      vi.mocked(reviewRepository.findAllByUserId).mockResolvedValue(reviews);

      const result = await usecase.execute(user.id!);

      expect(result).toEqual(reviews);
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(reviewRepository.findAllByUserId).toHaveBeenCalledWith(user.id);
    });

    it('should throw UserNotFound when user does not exist', async () => {
      const userId = faker.number.int({ min: 1, max: 1000 });

      vi.mocked(userRepository.findById).mockResolvedValue(undefined);

      await expect(usecase.execute(userId)).rejects.toThrow(UserNotFound);
      expect(reviewRepository.findAllByUserId).not.toHaveBeenCalled();
    });

    it('should return empty array when user has no reviews', async () => {
      const user = stubUser();

      vi.mocked(userRepository.findById).mockResolvedValue(user);
      vi.mocked(reviewRepository.findAllByUserId).mockResolvedValue([]);

      const result = await usecase.execute(user.id!);

      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const userId = faker.number.int({ min: 1, max: 1000 });

      vi.mocked(userRepository.findById).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(userId)).rejects.toThrow('Database error');
    });
  });
});
