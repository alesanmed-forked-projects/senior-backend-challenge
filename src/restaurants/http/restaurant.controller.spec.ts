import { describe, it, beforeEach, expect, vi } from 'vitest';
import { RestaurantController } from './restaurant.controller';
import { FindRestaurantsUsecase } from 'src/restaurants/application/usecases/find-restaurants.usecase';
import { FindRestaurantUsecase } from 'src/restaurants/application/usecases/find-restaurant.usecase';
import { stubRestaurant } from 'src/test-utils';
import { FindRestaurantsDto } from './dto/find-restaurants.dto';
import { HttpRestaurantMapper } from './mappers/http-restaurant.mapper';
import { RestaurantNotFound } from 'src/restaurants/domain/errors/restaurant-not-found.error';
import { faker } from '@faker-js/faker';
import { CreateRestaurantUsecase } from '../application/create-restaurant.usecase';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { HttpStatus } from '@nestjs/common';
import { UpdateRestaurantUsecase } from '../application/usecases/update-restaurant.usecase';
import { DeleteRestaurantUsecase } from '../application/usecases/delete-restaurant.usecase';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Response } from 'express';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let findRestaurantsUsecase: FindRestaurantsUsecase;
  let findRestaurantByIdUsecase: FindRestaurantUsecase;
  let createRestaurantUsecase: CreateRestaurantUsecase;
  let updateRestaurantUsecase: UpdateRestaurantUsecase;
  let deleteRestaurantUsecase: DeleteRestaurantUsecase;

  beforeEach(() => {
    findRestaurantsUsecase = {
      execute: vi.fn(),
    } as unknown as FindRestaurantsUsecase;

    findRestaurantByIdUsecase = {
      execute: vi.fn(),
    } as unknown as FindRestaurantUsecase;

    createRestaurantUsecase = {
      execute: vi.fn(),
    } as unknown as CreateRestaurantUsecase;

    updateRestaurantUsecase = {
      execute: vi.fn(),
    } as unknown as UpdateRestaurantUsecase;

    deleteRestaurantUsecase = {
      execute: vi.fn(),
    } as unknown as DeleteRestaurantUsecase;

    controller = new RestaurantController(
      findRestaurantsUsecase,
      findRestaurantByIdUsecase,
      createRestaurantUsecase,
      updateRestaurantUsecase,
      deleteRestaurantUsecase,
    );
    vi.clearAllMocks();
  });

  describe('findRestaurants', () => {
    it('should return paginated restaurants', async () => {
      const restaurants = [
        stubRestaurant(),
        stubRestaurant(),
        stubRestaurant(),
      ];
      const query: FindRestaurantsDto = {
        page: 1,
        limit: 10,
      };

      const paginatedResult = {
        data: restaurants,
        total: 3,
        page: 1,
        limit: 10,
      };

      vi.mocked(findRestaurantsUsecase.execute).mockResolvedValue(
        paginatedResult,
      );

      const result = await controller.findRestaurants(query);

      expect(result).toEqual({
        data: restaurants.map(HttpRestaurantMapper.toDto),
        total: 3,
        page: 1,
        limit: 10,
      });
      expect(findRestaurantsUsecase.execute).toHaveBeenCalledWith(query);
    });

    it('should return empty array when no restaurants are found', async () => {
      const query: FindRestaurantsDto = {
        page: 1,
        limit: 10,
      };

      vi.mocked(findRestaurantsUsecase.execute).mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      const result = await controller.findRestaurants(query);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
      expect(findRestaurantsUsecase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe('findRestaurantById', () => {
    it('should return restaurant DTO', async () => {
      const restaurant = stubRestaurant();
      const expectedDto = HttpRestaurantMapper.toDto(restaurant);

      vi.mocked(findRestaurantByIdUsecase.execute).mockResolvedValue(
        restaurant,
      );

      const result = await controller.findRestaurantById(restaurant.id!);

      expect(result).toEqual(expectedDto);
      expect(findRestaurantByIdUsecase.execute).toHaveBeenCalledWith(
        restaurant.id,
      );
    });

    it('should throw error when restaurant does not exist', async () => {
      const restaurantId = faker.number.int({ min: 1, max: 1000 });
      vi.mocked(findRestaurantByIdUsecase.execute).mockRejectedValue(
        new RestaurantNotFound(restaurantId),
      );

      await expect(controller.findRestaurantById(restaurantId)).rejects.toThrow(
        RestaurantNotFound,
      );
    });
  });

  describe('createRestaurant', () => {
    it('should create restaurant and return 201 with id', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        name: faker.company.name(),
        neighborhood: faker.location.city(),
        photograph: `${faker.word.adjective()}.jpg`,
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        image_url: faker.image.url(),
        cuisine_type: faker.word.adjective(),
      };

      const restaurantId = faker.number.int({ min: 1, max: 1000 });

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;

      vi.mocked(createRestaurantUsecase.execute).mockResolvedValue(
        restaurantId,
      );

      await controller.createRestaurant(createRestaurantDto, mockResponse);

      expect(createRestaurantUsecase.execute).toHaveBeenCalledWith(
        createRestaurantDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalledWith({ id: restaurantId });
    });
  });

  describe('updateRestaurant', () => {
    it('should call UpdateRestaurantUsecase and return 200', async () => {
      const id = faker.number.int({ min: 1, max: 1000 });
      const updateRestaurantDto: UpdateRestaurantDto = {
        name: faker.company.name(),
        neighborhood: faker.location.city(),
        photograph: `${faker.word.adjective()}.jpg`,
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        image_url: faker.image.url(),
        cuisine_type: faker.word.adjective(),
      };

      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;

      vi.mocked(updateRestaurantUsecase.execute).mockResolvedValue();

      await controller.updateRestaurant(id, updateRestaurantDto, mockResponse);

      expect(updateRestaurantUsecase.execute).toHaveBeenCalledWith({
        id,
        ...updateRestaurantDto,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw error when restaurant does not exist', async () => {
      const id = faker.number.int({ min: 1, max: 1000 });
      const updateRestaurantDto: UpdateRestaurantDto = {
        name: faker.company.name(),
        neighborhood: faker.location.city(),
        photograph: `${faker.word.adjective()}.jpg`,
        address: faker.location.streetAddress(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        image_url: faker.image.url(),
        cuisine_type: faker.word.adjective(),
      };
      const mockResponse = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;

      vi.mocked(updateRestaurantUsecase.execute).mockRejectedValue(
        new RestaurantNotFound(id),
      );

      await expect(
        controller.updateRestaurant(id, updateRestaurantDto, mockResponse),
      ).rejects.toThrow(RestaurantNotFound);
    });

    describe('deleteRestaurant', () => {
      it('should call DeleteRestaurantUsecase with id', async () => {
        const id = faker.number.int({ min: 1, max: 1000 });

        vi.mocked(deleteRestaurantUsecase.execute).mockResolvedValue();

        await controller.deleteRestaurant(id);

        expect(deleteRestaurantUsecase.execute).toHaveBeenCalledWith(id);
      });

      it('should throw error when restaurant does not exist', async () => {
        const id = faker.number.int({ min: 1, max: 1000 });
        vi.mocked(deleteRestaurantUsecase.execute).mockRejectedValue(
          new RestaurantNotFound(id),
        );

        await expect(controller.deleteRestaurant(id)).rejects.toThrow(
          RestaurantNotFound,
        );
      });
    });
  });
});
