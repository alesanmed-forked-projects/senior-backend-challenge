import { describe, it, beforeEach, expect, vi } from 'vitest';
import { FindRestaurantUsecase } from './find-restaurant.usecase';
import { createRestaurantRepositoryMock, stubRestaurant } from 'src/test-utils';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { faker } from '@faker-js/faker';

describe('FindRestaurantUsecase', () => {
  let usecase: FindRestaurantUsecase;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new FindRestaurantUsecase(restaurantRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should return restaurant when found', async () => {
      const restaurant = stubRestaurant();
      vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);

      const result = await usecase.execute(restaurant.id!);

      expect(result).toBe(restaurant);
      expect(restaurantRepository.findById).toHaveBeenCalledTimes(1);
      expect(restaurantRepository.findById).toHaveBeenCalledWith(restaurant.id);
    });

    it('should throw RestaurantNotFound when restaurant does not exist', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(restaurantRepository.findById).mockResolvedValue(undefined);

      await expect(usecase.execute(restaurantId)).rejects.toThrow(
        RestaurantNotFound,
      );
      expect(restaurantRepository.findById).toHaveBeenCalledWith(restaurantId);
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
