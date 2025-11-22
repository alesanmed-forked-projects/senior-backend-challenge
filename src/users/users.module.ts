import { Module } from '@nestjs/common';
import { UserSqliteRepository } from './infrastructure/persistence/sqlite-user.repository';
import { USER_REPOSITORY } from './infrastructure/persistence/user-repository.token';
import { KnexModule } from 'src/core/infrastructure/persistence/knex.module';
import { GetUserUsecase } from './application/usecases/get-user.usecase';
import { UserController } from './http/user.controller';
import { FavoriteController } from './http/favorite.controller';
import { FAVORITE_REPOSITORY } from './infrastructure/persistence/favorite-repository.token';
import { FavoriteSqliteRepository } from './infrastructure/persistence/sqlite-favorite.repository';
import { GetFavoritesUsecase } from './application/usecases/get-favorites.usecase';
import { AddFavoriteUsecase } from './application/usecases/add-favorite.usecase';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { DeleteFavoriteUsecase } from './application/usecases/delete-favorite.usecase';

@Module({
  imports: [KnexModule, RestaurantsModule],
  controllers: [UserController, FavoriteController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserSqliteRepository,
    },
    {
      provide: FAVORITE_REPOSITORY,
      useClass: FavoriteSqliteRepository,
    },
    GetUserUsecase,
    GetFavoritesUsecase,
    AddFavoriteUsecase,
    DeleteFavoriteUsecase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
