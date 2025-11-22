import { Filter, Paginated } from 'src/core/application/database/filter.type';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';

export type RestaurantFilters = {
  cuisine?: string;
  rating?: number;
  neighborhood?: string;
};

export interface RestaurantRepository {
  findAll(filter: Filter<RestaurantFilters>): Promise<Paginated<Restaurant>>;
  findById(id: number): Promise<Restaurant | undefined>;

  create(restaurant: Restaurant): Promise<number>;
  update(restaurant: Restaurant): Promise<void>;
  delete(restaurant: Restaurant): Promise<void>;
}
