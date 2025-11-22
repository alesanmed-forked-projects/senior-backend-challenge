import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoriteController } from './favorite.controller';
import { GetFavoritesUsecase } from '../application/usecases/get-favorites.usecase';
import { AddFavoriteUsecase } from '../application/usecases/add-favorite.usecase';
import { DeleteFavoriteUsecase } from '../application/usecases/delete-favorite.usecase';
import { stubAuthUser, stubRestaurant } from 'src/test-utils';
import { HttpRestaurantMapper } from 'src/restaurants/http/mappers/http-restaurant.mapper';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let getFavoritesUsecase: GetFavoritesUsecase;
  let addFavoriteUsecase: AddFavoriteUsecase;
  let deleteFavoriteUsecase: DeleteFavoriteUsecase;

  beforeEach(() => {
    getFavoritesUsecase = { execute: vi.fn() } as any;
    addFavoriteUsecase = { execute: vi.fn() } as any;
    deleteFavoriteUsecase = { execute: vi.fn() } as any;

    controller = new FavoriteController(
      getFavoritesUsecase,
      addFavoriteUsecase,
      deleteFavoriteUsecase,
    );

    vi.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('should return mapped favorites for current user', async () => {
      const authUser = stubAuthUser();
      const restaurants = [stubRestaurant(), stubRestaurant()];
      const expectedDtos = restaurants.map(HttpRestaurantMapper.toDto);

      vi.mocked(getFavoritesUsecase.execute).mockResolvedValue(
        restaurants as any,
      );

      const result = await controller.getFavorites(authUser);

      expect(result).toEqual({ data: expectedDtos });
      expect(getFavoritesUsecase.execute).toHaveBeenCalledWith(authUser.id);
    });
  });

  describe('addFavorite', () => {
    it('should call AddFavoriteUsecase with user id and restaurant id', async () => {
      const authUser = stubAuthUser();
      const restaurantId = 10;

      await controller.addFavorite(authUser, restaurantId);

      expect(addFavoriteUsecase.execute).toHaveBeenCalledWith(
        authUser.id,
        restaurantId,
      );
    });
  });

  describe('deleteFavorite', () => {
    it('should call DeleteFavoriteUsecase with user id and restaurant id', async () => {
      const authUser = stubAuthUser();
      const restaurantId = 10;

      await controller.deleteFavorite(authUser, restaurantId);

      expect(deleteFavoriteUsecase.execute).toHaveBeenCalledWith(
        authUser.id,
        restaurantId,
      );
    });
  });
});
