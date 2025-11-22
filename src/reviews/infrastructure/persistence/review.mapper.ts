import { Review } from 'src/reviews/domain/entities/review.entity';
import { DateTime } from 'luxon';

export type SqliteReview = {
  id?: number;
  restaurant_id: number;
  user_id: number;
  rating: number;
  comments: string;
  date: string;
  created_at: string;
  author_name?: string;
};

export class ReviewMapper {
  static toDomain(this: void, sqliteReview: SqliteReview): Review {
    return Review.fromData({
      id: sqliteReview.id,
      restaurantId: sqliteReview.restaurant_id,
      userId: sqliteReview.user_id,
      rating: sqliteReview.rating,
      comment: sqliteReview.comments,
      authorName: sqliteReview.author_name,
      date: DateTime.fromFormat(sqliteReview.date, 'MMMM d, yyyy'),
      createdAt: DateTime.fromFormat(
        sqliteReview.created_at,
        'yyyy-MM-dd HH:mm:ss',
        { zone: 'utc' },
      ),
    });
  }

  static toInfrastructure(this: void, review: Review): SqliteReview {
    return {
      id: review.id,
      restaurant_id: review.restaurantId,
      user_id: review.userId,
      rating: review.rating,
      comments: review.comment,
      date: review.date.toFormat('MMMM d, yyyy'),
      created_at: review.createdAt.toFormat('yyyy-MM-dd HH:mm:ss'),
    };
  }

  static toInfrastructureUpdate(
    this: void,
    review: Review,
  ): Partial<SqliteReview> {
    return {
      id: review.id,
      rating: review.rating,
      comments: review.comment,
    };
  }
}
