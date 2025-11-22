export interface HttpReview {
  id: number;
  restaurantId: number;
  rating: number;
  comment: string;
  autor: {
    id: number;
    name?: string;
  };
  date: string;
  createdAt: string;
}
