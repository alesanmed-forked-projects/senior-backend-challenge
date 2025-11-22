import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type { RestaurantRepository } from '../ports/restaurants.repository';
import { Inject, Injectable } from '@nestjs/common';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

@Injectable()
export class DeleteRestaurantUsecase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new RestaurantNotFound(id);
    }

    await this.restaurantRepository.delete(restaurant);
  }
}
