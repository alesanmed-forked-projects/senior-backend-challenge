import { Inject, Injectable } from '@nestjs/common';
import { REVIEW_REPOSITORY } from 'src/reviews/infrastructure/persistence/review-repository.token';
import type { ReviewRepository } from 'src/reviews/application/ports/reviews.repository';
import { ReviewNotFound } from 'src/reviews/domain/errors/review-not-found.error';

@Injectable()
export class DeleteReviewUsecase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findByUserAndId(userId, id);

    if (!review) {
      throw new ReviewNotFound(id);
    }

    await this.reviewRepository.delete(id);
  }
}
