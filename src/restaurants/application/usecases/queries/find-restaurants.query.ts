export interface FindRestaurantsQuery {
  cuisine?: string;
  rating?: number;
  neighborhood?: string;
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
}

export const ALLOWED_SORT_FIELDS = ['name', 'neighborhood', 'rating'];
