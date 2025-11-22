import { describe, it, expect, beforeEach } from 'vitest';
import { ReviewSqliteRepository } from 'src/reviews/infrastructure/persistence/sqlite-review.repository';
import { Review } from 'src/reviews/domain/entities/review.entity';
import { useTestDatabase } from 'test/helpers/test-database.helper';
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import { stubReview } from 'src/test-utils';
import { Knex } from 'knex';

describe('ReviewSqliteRepository - Integration', () => {
  const { getDb } = useTestDatabase();
  let restaurantId: number;
  let userId: number;
  let reviewId: number;
  let db: Knex;
  let repository: ReviewSqliteRepository;

  beforeEach(async () => {
    db = getDb();
    repository = new ReviewSqliteRepository(db);

    // Insert test user
    [userId] = await db('users').insert({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(10),
      role: 'USER',
      created_at: new Date().toISOString(),
    });

    // Insert test restaurant
    [restaurantId] = await db('restaurants').insert({
      name: faker.company.name(),
      neighborhood: faker.location.city(),
      photograph: `${faker.word.adjective()}.jpg`,
      address: faker.location.streetAddress(),
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
      image: faker.image.url(),
      cuisine_type: faker.word.adjective(),
    });

    // Insert test review
    [reviewId] = await db('reviews').insert({
      restaurant_id: restaurantId,
      user_id: userId,
      rating: 5,
      comments: 'Great food!',
      date: 'January 1, 2024',
      created_at: '2024-01-01 00:00:00',
    });
  });

  describe('findAllByRestaurantId', () => {
    it('should return reviews for a restaurant', async () => {
      const reviews = await repository.findAllByRestaurantId(restaurantId);

      expect(reviews).toHaveLength(1);
      expect(reviews[0]).toBeInstanceOf(Review);
      expect(reviews[0].restaurantId).toBe(restaurantId);
      expect(reviews[0].authorName).toBeDefined();
    });

    it('should return empty array when restaurant has no reviews', async () => {
      const reviews = await repository.findAllByRestaurantId(999);

      expect(reviews).toHaveLength(0);
    });

    it('should order reviews by created_at desc', async () => {
      // Insert another review with later date
      await db('reviews').insert({
        restaurant_id: restaurantId,
        user_id: userId,
        rating: 4,
        comments: 'Good service',
        date: 'January 2, 2024',
        created_at: '2024-01-02 00:00:00',
      });

      const reviews = await repository.findAllByRestaurantId(restaurantId);

      expect(reviews).toHaveLength(2);
      expect(reviews[0].createdAt.toFormat('yyyy-MM-dd')).toBe('2024-01-02');
      expect(reviews[1].createdAt.toFormat('yyyy-MM-dd')).toBe('2024-01-01');
    });
  });

  describe('findAllByUserId', () => {
    it('should return reviews by user', async () => {
      const reviews = await repository.findAllByUserId(userId);

      expect(reviews).toHaveLength(1);
      expect(reviews[0]).toBeInstanceOf(Review);
      expect(reviews[0].userId).toBe(userId);
    });

    it('should return empty array when user has no reviews', async () => {
      const reviews = await repository.findAllByUserId(999);

      expect(reviews).toHaveLength(0);
    });

    it('should return multiple reviews for same user', async () => {
      // Insert another restaurant
      const [secondRestaurantId] = await db('restaurants').insert({
        name: faker.company.name(),
        neighborhood: faker.location.city(),
        photograph: `${faker.word.adjective()}.jpg`,
        address: faker.location.streetAddress(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        image: faker.image.url(),
        cuisine_type: faker.word.adjective(),
      });

      // Insert another review
      await db('reviews').insert({
        restaurant_id: secondRestaurantId,
        user_id: userId,
        rating: 4,
        comments: 'Nice place',
        date: 'January 2, 2024',
        created_at: '2024-01-02 00:00:00',
      });

      const reviews = await repository.findAllByUserId(userId);

      expect(reviews).toHaveLength(2);
      expect(reviews[0].userId).toBe(userId);
      expect(reviews[1].userId).toBe(userId);
    });
  });

  describe('findByUserAndId', () => {
    it('should return review when user owns it', async () => {
      const review = await repository.findByUserAndId(userId, reviewId);

      expect(review).toBeDefined();
      expect(review).toBeInstanceOf(Review);
      expect(review?.id).toBe(reviewId);
      expect(review?.userId).toBe(userId);
    });

    it('should return undefined when review does not exist', async () => {
      const review = await repository.findByUserAndId(userId, 999);

      expect(review).toBeUndefined();
    });

    it('should return undefined when user does not own review', async () => {
      const review = await repository.findByUserAndId(999, reviewId);

      expect(review).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new review and return id', async () => {
      const review = stubReview({
        userId,
        restaurantId,
      });

      const newReviewId = await repository.create(review);

      expect(newReviewId).toBeGreaterThan(0);

      // Verify review was inserted
      const savedReview = await db('reviews').where('id', newReviewId).first();
      expect(savedReview).toBeDefined();
      expect(savedReview.rating).toBe(review.rating);
      expect(savedReview.comments).toBe(review.comment);
    });

    it('should create multiple reviews', async () => {
      const review1 = stubReview({
        userId,
        restaurantId,
        rating: 5,
      });

      const review2 = stubReview({
        userId,
        restaurantId,
        rating: 3,
      });

      const id1 = await repository.create(review1);
      const id2 = await repository.create(review2);

      expect(id1).not.toBe(id2);

      const count = await db('reviews').count('* as count').first();
      expect(count?.count).toBe(3); // 1 from beforeEach + 2 new
    });
  });

  describe('update', () => {
    it('should update review rating and comment', async () => {
      const review = await repository.findByUserAndId(userId, reviewId);
      expect(review).toBeDefined();

      review!.rating = 3;
      review!.comment = 'Updated comment';

      await repository.update(review!);

      const updatedReview = await db('reviews').where('id', reviewId).first();
      expect(updatedReview.rating).toBe(3);
      expect(updatedReview.comments).toBe('Updated comment');
    });

    it('should not update other fields', async () => {
      const originalReview = await db('reviews').where('id', reviewId).first();
      const review = await repository.findByUserAndId(userId, reviewId);

      review!.rating = 2;
      review!.comment = 'Changed';

      await repository.update(review!);

      const updatedReview = await db('reviews').where('id', reviewId).first();
      expect(updatedReview.user_id).toBe(originalReview.user_id);
      expect(updatedReview.restaurant_id).toBe(originalReview.restaurant_id);
      expect(updatedReview.created_at).toBe(originalReview.created_at);
    });
  });

  describe('delete', () => {
    it('should delete a review', async () => {
      await repository.delete(reviewId);

      const deletedReview = await db('reviews').where('id', reviewId).first();
      expect(deletedReview).toBeUndefined();
    });

    it('should only delete specified review', async () => {
      // Insert another review
      const [secondReviewId] = await db('reviews').insert({
        restaurant_id: restaurantId,
        user_id: userId,
        rating: 4,
        comments: 'Another review',
        date: 'January 2, 2024',
        created_at: '2024-01-02 00:00:00',
      });

      await repository.delete(reviewId);

      const remainingReviews = await db('reviews').select('*');
      expect(remainingReviews).toHaveLength(1);
      expect(remainingReviews[0].id).toBe(secondReviewId);
    });
  });

  describe('integration scenarios', () => {
    it('should create, update, and delete a review', async () => {
      // Create
      const review = Review.createNew({
        userId,
        restaurantId,
        rating: 5,
        comment: 'Initial comment',
        date: DateTime.now(),
      });

      const newReviewId = await repository.create(review);
      expect(newReviewId).toBeGreaterThan(0);

      // Update
      const fetchedReview = await repository.findByUserAndId(
        userId,
        newReviewId,
      );
      fetchedReview!.rating = 4;
      fetchedReview!.comment = 'Updated comment';
      await repository.update(fetchedReview!);

      const updatedReview = await db('reviews')
        .where('id', newReviewId)
        .first();
      expect(updatedReview.rating).toBe(4);

      // Delete
      await repository.delete(newReviewId);
      const deletedReview = await db('reviews')
        .where('id', newReviewId)
        .first();
      expect(deletedReview).toBeUndefined();
    });
  });
});
