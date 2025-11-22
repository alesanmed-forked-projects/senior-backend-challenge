import { Knex } from 'knex';
import { stubSqliteRestaurant, stubSqliteUser } from 'src/test-utils';
import { FavoriteSqliteRepository } from 'src/users/infrastructure/persistence/sqlite-favorite.repository';
import { useTestDatabase } from 'test/helpers/test-database.helper';
import { beforeEach, describe, expect, it } from 'vitest';
import { Favorite } from 'src/users/domain/entities/favorite.entity';

describe('FavoriteSqliteRepository - Integration', () => {
  const { getDb } = useTestDatabase();
  let db: Knex;
  let repository: FavoriteSqliteRepository;
  let userId: number;
  let restaurantId: number;

  beforeEach(async () => {
    db = getDb();
    repository = new FavoriteSqliteRepository(db);

    const user = stubSqliteUser();
    delete user.id;

    [userId] = await db('users').insert(user);

    const restaurant = stubSqliteRestaurant();
    delete restaurant.average_rating;
    delete restaurant.id;

    [restaurantId] = await db('restaurants').insert(restaurant);
  });

  describe('create', () => {
    it('should add a restaurant to favorites', async () => {
      const favorite = Favorite.createNew({ userId, restaurantId });
      await repository.create(favorite);

      const favorites = await repository.findAllByUserId(userId);

      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(restaurantId);
    });
  });

  describe('delete', () => {
    it('should remove a restaurant from favorites', async () => {
      const favorite = Favorite.createNew({ userId, restaurantId });
      await repository.create(favorite);
      await repository.delete(favorite);

      const favorites = await repository.findAllByUserId(userId);
      expect(favorites).toHaveLength(0);
    });
  });

  describe('findAllByUserId', () => {
    it('should return the favorites for a user', async () => {
      const favorite = Favorite.createNew({ userId, restaurantId });
      await repository.create(favorite);
      const favorites = await repository.findAllByUserId(userId);

      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(restaurantId);
    });

    it('should return an empty array when there are no favorites', async () => {
      const favorites = await repository.findAllByUserId(userId);
      expect(favorites).toHaveLength(0);
    });
  });
});
