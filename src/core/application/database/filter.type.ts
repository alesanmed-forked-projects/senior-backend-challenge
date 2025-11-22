export type Filter<T> = T & {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
