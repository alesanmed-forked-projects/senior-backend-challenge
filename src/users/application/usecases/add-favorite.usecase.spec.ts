import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddFavoriteUsecase } from './add-favorite.usecase';
import {
  createFavoriteRepositoryMock,
  createRestaurantRepositoryMock,
  stubRestaurant,
} from 'src/test-utils';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { Favorite } from 'src/users/domain/entities/favorite.entity';

describe('AddFavoriteUsecase', () => {
  let usecase: AddFavoriteUsecase;
  let favoriteRepository: ReturnType<typeof createFavoriteRepositoryMock>;
  let restaurantRepository: ReturnType<typeof createRestaurantRepositoryMock>;

  beforeEach(() => {
    favoriteRepository = createFavoriteRepositoryMock();
    restaurantRepository = createRestaurantRepositoryMock();
    usecase = new AddFavoriteUsecase(favoriteRepository, restaurantRepository);
    vi.clearAllMocks();
  });

  describe('execute', () => {
    it('should add a favorite when restaurant exists', async () => {
      const userId = 1;
      const restaurant = stubRestaurant();
      vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);

      await usecase.execute(userId, restaurant.id!);

      expect(restaurantRepository.findById).toHaveBeenCalledWith(restaurant.id);
      expect(favoriteRepository.create).toHaveBeenCalledTimes(1);

      const [favoriteArg] = vi.mocked(favoriteRepository.create).mock
        .calls[0] as [Favorite];

      expect(favoriteArg.userId).toBe(userId);
      expect(favoriteArg.restaurantId).toBe(restaurant.id);
    });

    it('should throw RestaurantNotFound when restaurant does not exist', async () => {
      const userId = 1;
      const restaurantId = 999;
      vi.mocked(restaurantRepository.findById).mockResolvedValue(undefined);

      await expect(usecase.execute(userId, restaurantId)).rejects.toThrow(
        RestaurantNotFound,
      );
      expect(restaurantRepository.findById).toHaveBeenCalledWith(restaurantId);
      expect(favoriteRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const userId = 1;
      const restaurant = stubRestaurant();
      vi.mocked(restaurantRepository.findById).mockResolvedValue(restaurant);
      vi.mocked(favoriteRepository.create).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(usecase.execute(userId, restaurant.id!)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
