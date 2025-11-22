import { Inject, Injectable } from '@nestjs/common';
import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type { RestaurantRepository } from 'src/restaurants/application/ports/restaurants.repository';
import { Restaurant } from 'src/restaurants/domain/entities/restaurant.entity';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

@Injectable()
export class FindRestaurantUsecase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new RestaurantNotFound(id);
    }

    return restaurant;
  }
}
