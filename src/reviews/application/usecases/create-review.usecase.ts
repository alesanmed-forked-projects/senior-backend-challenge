import { Inject, Injectable } from '@nestjs/common';
import { REVIEW_REPOSITORY } from 'src/reviews/infrastructure/persistence/review-repository.token';
import type { ReviewRepository } from 'src/reviews/application/ports/reviews.repository';
import { CreateReviewCommand } from './commands/create-review.command';
import { Review } from 'src/reviews/domain/entities/review.entity';
import { DateTime } from 'luxon';

@Injectable()
export class CreateReviewUsecase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(command: CreateReviewCommand): Promise<number> {
    const review = Review.createNew({
      userId: command.userId,
      restaurantId: command.restaurantId,
      rating: command.rating,
      comment: command.comment,
      date: DateTime.now(),
    });

    return this.reviewRepository.create(review);
  }
}
