import { Module } from '@nestjs/common';
import { KnexModule } from 'src/core/infrastructure/persistence/knex.module';
import { RestaurantController } from './http/restaurant.controller';
import { RESTAURANT_REPOSITORY } from './infrastructure/persistence/restaurant-repository.token';
import { RestaurantSqliteRepository } from './infrastructure/persistence/sqlite-restaurant.repository';
import { FindRestaurantsUsecase } from './application/usecases/find-restaurants.usecase';
import { FindRestaurantUsecase } from './application/usecases/find-restaurant.usecase';
import { CreateRestaurantUsecase } from './application/create-restaurant.usecase';
import { UpdateRestaurantUsecase } from './application/usecases/update-restaurant.usecase';
import { DeleteRestaurantUsecase } from './application/usecases/delete-restaurant.usecase';

@Module({
  imports: [KnexModule],
  controllers: [RestaurantController],
  providers: [
    {
      provide: RESTAURANT_REPOSITORY,
      useClass: RestaurantSqliteRepository,
    },
    FindRestaurantsUsecase,
    FindRestaurantUsecase,
    CreateRestaurantUsecase,
    UpdateRestaurantUsecase,
    DeleteRestaurantUsecase,
  ],
  exports: [RESTAURANT_REPOSITORY],
})
export class RestaurantsModule {}
