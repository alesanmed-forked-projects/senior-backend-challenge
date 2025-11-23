import { Review } from 'src/reviews/domain/entities/review.entity';
import { DateTime } from 'luxon';
import { faker } from '@faker-js/faker';
import { SqliteReview } from 'src/reviews/infrastructure/persistence/review.mapper';

export const stubReviewData = (overrides?: Partial<unknown>) => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  userId: faker.number.int({ min: 1, max: 100 }),
  restaurantId: faker.number.int({ min: 1, max: 100 }),
  rating: faker.number.int({ min: 1, max: 5 }),
  comment: faker.lorem.paragraph(),
  authorName: faker.person.fullName(),
  date: DateTime.now(),
  createdAt: DateTime.now(),
  ...overrides,
});

export const stubReview = (overrides?: Partial<unknown>): Review => {
  return Review.fromData(stubReviewData(overrides));
};

export const stubSqliteReview = (
  overrides?: Partial<SqliteReview>,
): SqliteReview => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    restaurant_id: faker.number.int({ min: 1, max: 100 }),
    user_id: faker.number.int({ min: 1, max: 100 }),
    rating: faker.number.int({ min: 1, max: 5 }),
    comments: faker.lorem.paragraph(),
    date: DateTime.now().toFormat('MMMM d, yyyy'),
    created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
    author_name: faker.person.fullName(),
    ...overrides,
  };
};
