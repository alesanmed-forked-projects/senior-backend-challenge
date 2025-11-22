import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetFavoritesUsecase } from '../application/usecases/get-favorites.usecase';
import { CurrentUser } from 'src/core/http/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/domain/auth-user';
import { HttpRestaurantMapper } from 'src/restaurants/http/mappers/http-restaurant.mapper';
import { AddFavoriteUsecase } from '../application/usecases/add-favorite.usecase';
import { DeleteFavoriteUsecase } from '../application/usecases/delete-favorite.usecase';

@ApiTags('Favorites')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('/me/favorites')
export class FavoriteController {
  constructor(
    private readonly getFavoritesUsecase: GetFavoritesUsecase,
    private readonly addFavoriteUsecase: AddFavoriteUsecase,
    private readonly deleteFavoriteUsecase: DeleteFavoriteUsecase,
  ) {}

  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: 200, description: 'Favorites found successfully' })
  @Get('/')
  async getFavorites(@CurrentUser() user: AuthUser) {
    const favorites = await this.getFavoritesUsecase.execute(user.id);

    return {
      data: favorites.map(HttpRestaurantMapper.toDto),
    };
  }

  @ApiOperation({ summary: 'Add a favorite' })
  @ApiResponse({ status: 201, description: 'Favorite added successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Post('/:restaurantId')
  async addFavorite(
    @CurrentUser() user: AuthUser,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    await this.addFavoriteUsecase.execute(user.id, restaurantId);
  }

  @ApiOperation({ summary: 'Delete a favorite' })
  @ApiResponse({ status: 200, description: 'Favorite deleted successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @Delete('/:restaurantId')
  async deleteFavorite(
    @CurrentUser() user: AuthUser,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    await this.deleteFavoriteUsecase.execute(user.id, restaurantId);
  }
}
