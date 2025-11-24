import { describe, it, beforeEach, expect, vi } from 'vitest';
import { FindReviewsUsecase } from './find-reviews.usecase';
import {
  createReviewRepositoryMock,
  createRestaurantRepositoryMock,
  stubReview,
  stubRestaurant,
} from 'src/test-utils';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { faker } from '@faker-js/faker';

describe('FindReviewsUsecase', () => {
  let usecase: FindReviewsUsecase;
  let reviewRepository: ReturnType<typeof createReviewRepositoryMock>;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    reviewRepository = createReviewRepositoryMock();
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new FindReviewsUsecase(reviewRepository, restaurantRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return reviews for a restaurant', async () => {
      const restaurant = stubRestaurant();
      const reviews = [stubReview(), stubReview(), stubReview()];

      vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);
      vi.mocked(reviewRepository.findAllByRestaurantId).mockResolvedValue(
        reviews,
      );

      const result = await usecase.execute(restaurant.id!);

      expect(result).toEqual(reviews);
      expect(restaurantRepository.findById).toHaveBeenCalledWith(restaurant.id);
      expect(reviewRepository.findAllByRestaurantId).toHaveBeenCalledWith(
        restaurant.id,
      );
    });

    it('should throw RestaurantNotFound when restaurant does not exist', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 1000 });

      vi.mocked(restaurantRepository.findById).mockResolvedValue(undefined);

      await expect(usecase.execute(restaurantId)).rejects.toThrow(
        RestaurantNotFound,
      );
      expect(reviewRepository.findAllByRestaurantId).not.toHaveBeenCalled();
    });

    it('should return empty array when restaurant has no reviews', async () => {
      const restaurant = stubRestaurant();

      vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);
      vi.mocked(reviewRepository.findAllByRestaurantId).mockResolvedValue([]);

      const result = await usecase.execute(restaurant.id!);

      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 1000 });

      vi.mocked(restaurantRepository.findById).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(restaurantId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
