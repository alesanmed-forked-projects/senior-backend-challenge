export interface CreateReviewCommand {
  userId: number;
  restaurantId: number;
  rating: number;
  comment: string;
}
