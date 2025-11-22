import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindRestaurantsUsecase } from 'src/restaurants/application/usecases/find-restaurants.usecase';
import { FindRestaurantsDto } from './dto/find-restaurants.dto';
import { HttpRestaurantMapper } from './mappers/http-restaurant.mapper';
import { FindRestaurantUsecase } from 'src/restaurants/application/usecases/find-restaurant.usecase';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CreateRestaurantUsecase } from '../application/create-restaurant.usecase';
import type { Response } from 'express';
import { Roles } from 'src/core/http/decorators/role.decorator';
import { Role } from 'src/users/domain/value-objects/role.enum';
import { PublicEndpoint } from 'src/core/http/decorators/public.decorator';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UpdateRestaurantUsecase } from '../application/usecases/update-restaurant.usecase';
import { EditRestaurantCommand } from '../application/usecases/commands/edit-restaurant.usecase';
import { DeleteRestaurantUsecase } from '../application/usecases/delete-restaurant.usecase';

@ApiTags('Restaurants')
@Controller('/restaurants')
export class RestaurantController {
  constructor(
    private readonly findRestaurantsUsecase: FindRestaurantsUsecase,
    private readonly findRestaurantByIdUsecase: FindRestaurantUsecase,
    private readonly createRestaurantUsecase: CreateRestaurantUsecase,
    private readonly updateRestaurantUsecase: UpdateRestaurantUsecase,
    private readonly deleteRestaurantUsecase: DeleteRestaurantUsecase,
  ) {}

  @ApiOperation({ summary: 'Find restaurants' })
  @PublicEndpoint()
  @Get('/')
  async findRestaurants(@Query() query: FindRestaurantsDto) {
    const restaurants = await this.findRestaurantsUsecase.execute(query);

    return {
      data: restaurants.data.map(HttpRestaurantMapper.toDto),
      total: restaurants.total,
      page: restaurants.page,
      limit: restaurants.limit,
    };
  }

  @ApiOperation({ summary: 'Find restaurant by id' })
  @PublicEndpoint()
  @Get('/:id')
  async findRestaurantById(@Param('id', ParseIntPipe) id: number) {
    const restaurant = await this.findRestaurantByIdUsecase.execute(id);

    return HttpRestaurantMapper.toDto(restaurant);
  }

  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid restaurant data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post('/')
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Res() response: Response,
  ) {
    const restaurantId =
      await this.createRestaurantUsecase.execute(createRestaurantDto);

    return response.status(HttpStatus.CREATED).send({ id: restaurantId });
  }

  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid restaurant data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Put('/:id')
  async updateRestaurant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Res() response: Response,
  ) {
    const editRestaurantCommand: EditRestaurantCommand = {
      id,
      ...updateRestaurantDto,
    };

    await this.updateRestaurantUsecase.execute(editRestaurantCommand);

    return response.status(HttpStatus.OK).send();
  }

  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete('/:id')
  async deleteRestaurant(@Param('id', ParseIntPipe) id: number) {
    await this.deleteRestaurantUsecase.execute(id);
  }
}
