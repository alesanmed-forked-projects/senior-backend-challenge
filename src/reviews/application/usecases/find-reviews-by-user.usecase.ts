import { Inject, Injectable } from '@nestjs/common';
import { REVIEW_REPOSITORY } from 'src/reviews/infrastructure/persistence/review-repository.token';
import type { ReviewRepository } from 'src/reviews/application/ports/reviews.repository';
import { Review } from 'src/reviews/domain/entities/review.entity';
import { USER_REPOSITORY } from 'src/users/infrastructure/persistence/user-repository.token';
import type { UserRepository } from 'src/users/application/ports/user.repository';
import { UserNotFound } from 'src/users/domain/errors/user-not-found.error';

@Injectable()
export class FindReviewsByUserUsecase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: ReviewRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number): Promise<Review[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFound(userId);
    }

    return this.reviewRepository.findAllByUserId(user.id!);
  }
}
