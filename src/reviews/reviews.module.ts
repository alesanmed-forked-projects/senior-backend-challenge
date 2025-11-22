import { Module } from '@nestjs/common';
import { KnexModule } from 'src/core/infrastructure/persistence/knex.module';
import { ReviewsController } from './http/reviews.controller';
import { REVIEW_REPOSITORY } from './infrastructure/persistence/review-repository.token';
import { ReviewSqliteRepository } from './infrastructure/persistence/sqlite-review.repository';
import { FindReviewsUsecase } from './application/usecases/find-reviews.usecase';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { FindReviewsByUserUsecase } from './application/usecases/find-reviews-by-user.usecase';
import { USER_REPOSITORY } from 'src/users/infrastructure/persistence/user-repository.token';
import { UserSqliteRepository } from 'src/users/infrastructure/persistence/sqlite-user.repository';
import { CreateReviewUsecase } from './application/usecases/create-review.usecase';
import { UpdateReviewUsecase } from './application/usecases/update-review.usecase';
import { DeleteReviewUsecase } from './application/usecases/delete-review.usecase';

@Module({
  imports: [KnexModule, RestaurantsModule],
  controllers: [ReviewsController],
  providers: [
    {
      provide: REVIEW_REPOSITORY,
      useClass: ReviewSqliteRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserSqliteRepository,
    },
    FindReviewsUsecase,
    FindReviewsByUserUsecase,
    CreateReviewUsecase,
    UpdateReviewUsecase,
    DeleteReviewUsecase,
  ],
})
export class ReviewsModule {}
