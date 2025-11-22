import type { HttpReview } from 'src/reviews/http/dto/http-review';
import { Review } from 'src/reviews/domain/entities/review.entity';

export class HttpReviewMapper {
  static toDto(this: void, review: Review): HttpReview {
    return {
      id: review.id!,
      restaurantId: review.restaurantId,
      comment: review.comment,
      autor: {
        id: review.userId,
        name: review.authorName,
      },
      rating: review.rating,
      date: review.date.toFormat('MMMM d, yyyy'),
      createdAt: review.createdAt.toISO() as string,
    };
  }
}
