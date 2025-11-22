import { Inject, Injectable } from '@nestjs/common';
import { REVIEW_REPOSITORY } from 'src/reviews/infrastructure/persistence/review-repository.token';
import type { ReviewRepository } from 'src/reviews/application/ports/reviews.repository';
import { UpdateReviewCommand } from './commands/update-review.command';
import { ReviewNotFound } from 'src/reviews/domain/errors/review-not-found.error';

@Injectable()
export class UpdateReviewUsecase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(command: UpdateReviewCommand): Promise<void> {
    const review = await this.reviewRepository.findByUserAndId(
      command.userId,
      command.id,
    );

    if (!review) {
      throw new ReviewNotFound(command.id);
    }

    review.rating = command.rating;
    review.comment = command.comment;

    await this.reviewRepository.update(review);
  }
}
