import { Inject, Injectable } from '@nestjs/common';
import type { ReviewRepository } from 'src/reviews/application/ports/reviews.repository';
import { REVIEW_REPOSITORY } from 'src/reviews/infrastructure/persistence/review-repository.token';
import { Review } from 'src/reviews/domain/entities/review.entity';
import { RESTAURANT_REPOSITORY } from 'src/restaurants/infrastructure/persistence/restaurant-repository.token';
import type { RestaurantRepository } from 'src/restaurants/application/ports/restaurants.repository';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';

@Injectable()
export class FindReviewsUsecase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

  async execute(restaurantId: number): Promise<Review[]> {
    const restaurant = await this.restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new RestaurantNotFound(restaurantId);
    }

    return this.reviewRepository.findAllByRestaurantId(restaurant.id!);
  }
}
