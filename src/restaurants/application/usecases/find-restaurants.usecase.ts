import { Inject, Injectable } from '@nestjs/common';
import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type {
  RestaurantFilters,
  RestaurantRepository,
} from 'src/restaurants/application/ports/restaurants.repository';
import {
  ALLOWED_SORT_FIELDS,
  FindRestaurantsQuery,
} from './queries/find-restaurants.query';
import { Filter, Paginated } from 'src/core/application/database/filter.type';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { InvalidSort } from 'src/restaurants/domain/errors/invalid-sort.error';

@Injectable()
export class FindRestaurantsUsecase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(query: FindRestaurantsQuery): Promise<Paginated<Restaurant>> {
    const { cuisine, rating, neighborhood, page, limit, sort, sortOrder } =
      query;

    if (sort && !ALLOWED_SORT_FIELDS.includes(sort)) {
      throw new InvalidSort(sort);
    }

    const filter: Filter<RestaurantFilters> = {
      cuisine,
      rating,
      neighborhood,
      page,
      limit,
      sort,
      sortOrder,
    };

    return this.restaurantRepository.findAll(filter);
  }
}
