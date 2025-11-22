import { it, expect } from 'vitest';
import { describe } from 'vitest';
import { Review } from './review.entity';
import { DateTime } from 'luxon';
import { InvalidReviewData } from '../errors/invalid-review-data.error';

describe('ReviewEntity', () => {
  describe('createNew', () => {
    it('should create a new review', () => {
      const review = Review.createNew({
        restaurantId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great food!',
        date: DateTime.now(),
      });

      expect(review).toBeInstanceOf(Review);
    });

    it('should throw an error if the rating is invalid', () => {
      expect(() =>
        Review.createNew({
          restaurantId: 1,
          userId: 1,
          rating: 0,
          comment: 'Great food!',
          date: DateTime.now(),
        }),
      ).toThrow(InvalidReviewData);
    });

    it('should throw an error if the comment is invalid', () => {
      expect(() =>
        Review.createNew({
          restaurantId: 1,
          userId: 1,
          rating: 5,
          comment: '',
          date: DateTime.now(),
        }),
      ).toThrow(InvalidReviewData);
    });

    it('should throw an error if the date is invalid', () => {
      expect(() =>
        Review.createNew({
          restaurantId: 1,
          userId: 1,
          rating: 5,
          comment: 'Great food!',
          date: DateTime.fromISO('invalid'),
        }),
      ).toThrow(InvalidReviewData);
    });
  });

  describe('fromData', () => {
    it('should create a review from data', () => {
      const review = Review.fromData({
        restaurantId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great food!',
        date: DateTime.now(),
        createdAt: DateTime.now(),
      });

      expect(review).toBeInstanceOf(Review);
    });

    it('should throw an error if the rating is invalid', () => {
      expect(() =>
        Review.fromData({
          restaurantId: 1,
          userId: 1,
          rating: 0,
          comment: 'Great food!',
          date: DateTime.now(),
          createdAt: DateTime.now(),
        }),
      ).toThrow(InvalidReviewData);
    });

    it('should throw an error if the comment is invalid', () => {
      expect(() =>
        Review.fromData({
          restaurantId: 1,
          userId: 1,
          rating: 5,
          comment: '',
          date: DateTime.now(),
          createdAt: DateTime.now(),
        }),
      ).toThrow(InvalidReviewData);
    });

    it('should throw an error if the date is invalid', () => {
      expect(() =>
        Review.fromData({
          restaurantId: 1,
          userId: 1,
          rating: 5,
          comment: 'Great food!',
          date: DateTime.fromISO('invalid'),
          createdAt: DateTime.now(),
        }),
      ).toThrow(InvalidReviewData);
    });
  });

  describe('setters', () => {
    it('should set the rating', () => {
      const review = Review.createNew({
        restaurantId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great food!',
        date: DateTime.now(),
      });

      review.rating = 4;
      expect(review.rating).toBe(4);
    });

    it('should set the comment', () => {
      const review = Review.createNew({
        restaurantId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great food!',
        date: DateTime.now(),
      });

      review.comment = 'Good food!';
      expect(review.comment).toBe('Good food!');
    });

    it('should throw an error if the rating is set to an invalid value', () => {
      const review = Review.createNew({
        restaurantId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great food!',
        date: DateTime.now(),
      });

      expect(() => (review.rating = 0)).toThrow(InvalidReviewData);

      expect(() => (review.rating = 6)).toThrow(InvalidReviewData);
    });

    it('should throw an error if the comment is set to an invalid value', () => {
      const review = Review.createNew({
        restaurantId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great food!',
        date: DateTime.now(),
      });

      expect(() => (review.comment = '')).toThrow(InvalidReviewData);
    });
  });
});
