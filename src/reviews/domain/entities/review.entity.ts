import { DateTime } from 'luxon';
import { InvalidReviewData } from '../errors/invalid-review-data.error';

interface ReviewData {
  id?: number;
  restaurantId: number;
  userId: number;
  rating: number;
  comment: string;
  authorName?: string;
  date: DateTime;
  createdAt: DateTime;
}

export class Review {
  private constructor(private readonly data: ReviewData) {
    this.validate(data);
  }

  static createNew(params: Omit<ReviewData, 'id' | 'createdAt'>): Review {
    return new Review({
      ...params,
      id: undefined,
      createdAt: DateTime.now() as DateTime,
    });
  }

  static fromData(data: ReviewData): Review {
    return new Review(data);
  }

  withId(id: number): Review {
    this.data.id = id;

    return this;
  }

  get id(): number | undefined {
    return this.data.id;
  }

  get restaurantId(): number {
    return this.data.restaurantId;
  }

  get userId(): number {
    return this.data.userId;
  }

  get rating(): number {
    return this.data.rating;
  }

  set rating(rating: number) {
    this.validateRating(rating);
    this.data.rating = rating;
  }

  get comment(): string {
    return this.data.comment;
  }

  set comment(comment: string) {
    this.validateComment(comment);
    this.data.comment = comment;
  }

  get authorName(): string | undefined {
    return this.data.authorName;
  }

  get date(): DateTime {
    return this.data.date;
  }

  get createdAt(): DateTime {
    return this.data.createdAt;
  }

  private validate(data: ReviewData): void {
    this.validateRating(data.rating);
    this.validateComment(data.comment);
    this.validateDate(data.date);
  }

  private validateRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new InvalidReviewData('rating', rating.toString());
    }
  }

  private validateComment(comment: string): void {
    if (!comment.trim() || comment.length > 400) {
      throw new InvalidReviewData('comment', comment);
    }
  }

  private validateDate(date: DateTime): void {
    if (!date.isValid) {
      throw new InvalidReviewData('date', date.invalidReason!);
    }
  }
}
