import { HttpStatus } from '@nestjs/common';
import { InvalidCredentialsException } from 'src/auth/domain/errors/invalid-credentials.error';
import { UserAlreadyExists } from 'src/auth/domain/errors/user-exists.error';
import { InvalidUrl } from 'src/core/domain/errors/invalid-url.error';
import { InvalidRestaurantData } from 'src/restaurants/domain/errors/invalid-restaurant-data.error';
import { InvalidSort } from 'src/restaurants/domain/errors/invalid-sort.error';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { InvalidReviewData } from 'src/reviews/domain/errors/invalid-review-data.error';
import { ReviewNotFound } from 'src/reviews/domain/errors/review-not-found.error';
import { FavoriteNotFound } from 'src/users/domain/errors/favorite-not-found.error';
import { InvalidUserRole } from 'src/users/domain/errors/invalid-user-role.error';
import { UserNotFound } from 'src/users/domain/errors/user-not-found.error';
import { InvalidFavoriteData } from 'src/users/domain/errors/invalid-favorite-data.error';
import { InvalidUserData } from 'src/users/domain/errors/invalid-user-data.error';
import { InvalidStatsData } from 'src/dashboard/domain/errors/invalid-stats-data.error';

export const HTTP_ERROR_MAPPING: Record<string, HttpStatus> = {
  UNKNOWN_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,

  [InvalidCredentialsException.code]: HttpStatus.UNAUTHORIZED,
  [UserAlreadyExists.code]: HttpStatus.CONFLICT,

  [InvalidSort.code]: HttpStatus.BAD_REQUEST,
  [RestaurantNotFound.code]: HttpStatus.NOT_FOUND,
  [InvalidRestaurantData.code]: HttpStatus.BAD_REQUEST,

  [ReviewNotFound.code]: HttpStatus.NOT_FOUND,
  [InvalidReviewData.code]: HttpStatus.BAD_REQUEST,

  [FavoriteNotFound.code]: HttpStatus.NOT_FOUND,
  [InvalidFavoriteData.code]: HttpStatus.BAD_REQUEST,

  [InvalidUserRole.code]: HttpStatus.BAD_REQUEST,
  [UserNotFound.code]: HttpStatus.NOT_FOUND,
  [InvalidUserData.code]: HttpStatus.BAD_REQUEST,

  [InvalidUrl.code]: HttpStatus.BAD_REQUEST,

  [InvalidStatsData.code]: HttpStatus.BAD_REQUEST,
};
