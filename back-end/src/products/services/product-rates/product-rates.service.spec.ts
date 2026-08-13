import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductRateEntity } from '../../entities';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../../../users/services';
import { ProductRatesService } from './product-rates.service';

describe(ProductRatesService.name, () => {
  let service: ProductRatesService;

  const productRatesRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const productsService = {
    findOneById: jest.fn(),
  };

  const usersService = {
    findOneByUsername: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProductRatesService(
      productRatesRepository as unknown as Repository<ProductRateEntity>,
      productsService as unknown as ProductsService,
      usersService as unknown as UsersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProductRate', () => {
    const product = {
      id: 'product-id',
      name: 'Product',
    };

    const user = {
      id: 'user-id',
      username: 'john',
    };

    const dto = {
      productId: 'product-id',
      rating: 5,
    };

    it('should create product rate', async () => {
      productsService.findOneById.mockResolvedValue(product);
      usersService.findOneByUsername.mockResolvedValue(user);

      productRatesRepository.findOne.mockResolvedValue(null);

      const productRate = {
        rating: 5,
        product,
        user,
        save: jest.fn().mockResolvedValue(undefined),
      };

      productRatesRepository.create.mockReturnValue(productRate);

      const getRawOne = jest.fn().mockResolvedValue({
        averageRating: '5',
      });

      const where = jest.fn().mockReturnValue({
        getRawOne,
      });

      const select = jest.fn().mockReturnValue({
        where,
      });

      productRatesRepository.createQueryBuilder.mockReturnValue({
        select,
      });

      const result = await service.createProductRate(dto, 'john');

      expect(productsService.findOneById).toHaveBeenCalledWith('product-id');

      expect(usersService.findOneByUsername).toHaveBeenCalledWith('john');

      expect(productRatesRepository.findOne).toHaveBeenCalledWith({
        where: {
          product: {
            id: 'product-id',
          },
          user: {
            id: 'user-id',
          },
        },
      });

      expect(productRatesRepository.create).toHaveBeenCalledWith({
        rating: 5,
        product,
        user,
      });

      expect(productRate.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        rating: 5,
        averageRating: 5,
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productsService.findOneById.mockResolvedValue(null);
      usersService.findOneByUsername.mockResolvedValue(user);

      await expect(service.createProductRate(dto, 'john')).rejects.toThrow(
        new NotFoundException('Product or user not found'),
      );

      expect(productRatesRepository.findOne).not.toHaveBeenCalled();

      expect(productRatesRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      productsService.findOneById.mockResolvedValue(product);
      usersService.findOneByUsername.mockResolvedValue(null);

      await expect(service.createProductRate(dto, 'john')).rejects.toThrow(
        new NotFoundException('Product or user not found'),
      );

      expect(productRatesRepository.findOne).not.toHaveBeenCalled();

      expect(productRatesRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when user already rated product', async () => {
      productsService.findOneById.mockResolvedValue(product);
      usersService.findOneByUsername.mockResolvedValue(user);

      productRatesRepository.findOne.mockResolvedValue({
        id: 'existing-rate',
        rating: 4,
      });

      await expect(service.createProductRate(dto, 'john')).rejects.toThrow(
        new ConflictException('You have already rated this product'),
      );

      expect(productRatesRepository.create).not.toHaveBeenCalled();
    });

    it('should calculate average rating after creating rate', async () => {
      productsService.findOneById.mockResolvedValue(product);
      usersService.findOneByUsername.mockResolvedValue(user);
      productRatesRepository.findOne.mockResolvedValue(null);

      const productRate = {
        rating: 5,
        product,
        user,
        save: jest.fn().mockResolvedValue(undefined),
      };

      productRatesRepository.create.mockReturnValue(productRate);

      const getRawOne = jest.fn().mockResolvedValue({
        averageRating: '4',
      });

      const where = jest.fn().mockReturnValue({
        getRawOne,
      });

      const select = jest.fn().mockReturnValue({
        where,
      });

      productRatesRepository.createQueryBuilder.mockReturnValue({
        select,
      });

      const result = await service.createProductRate(dto, 'john');

      expect(select).toHaveBeenCalledWith(
        'ROUND(AVG(productRate.rating))',
        'averageRating',
      );

      expect(where).toHaveBeenCalledWith('productRate.productId = :productId', {
        productId: 'product-id',
      });

      expect(result.averageRating).toBe(4);
    });
  });

  describe('updateProductRate', () => {
    const dto = {
      productId: 'product-id',
      rating: 4,
    };

    it('should update existing product rate', async () => {
      const productRate = {
        rating: 3,
      };

      productRatesRepository.findOne.mockResolvedValue(productRate);

      productRatesRepository.save.mockResolvedValue(productRate);

      const getRawOne = jest.fn().mockResolvedValue({
        averageRating: '4',
      });

      const where = jest.fn().mockReturnValue({
        getRawOne,
      });

      const select = jest.fn().mockReturnValue({
        where,
      });

      productRatesRepository.createQueryBuilder.mockReturnValue({
        select,
      });

      const result = await service.updateProductRate(dto, 'john');

      expect(productRatesRepository.findOne).toHaveBeenCalledWith({
        where: {
          product: {
            id: 'product-id',
          },
          user: {
            username: 'john',
          },
        },
      });

      expect(productRate.rating).toBe(4);

      expect(productRatesRepository.save).toHaveBeenCalledWith(productRate);

      expect(result).toEqual({
        rating: 4,
        averageRating: 4,
      });
    });

    it('should throw NotFoundException when product rate does not exist', async () => {
      productRatesRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProductRate(dto, 'john')).rejects.toThrow(
        new NotFoundException('Product rate not found'),
      );

      expect(productRatesRepository.save).not.toHaveBeenCalled();

      expect(productRatesRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should calculate average rating after updating rate', async () => {
      const productRate = {
        rating: 2,
      };

      productRatesRepository.findOne.mockResolvedValue(productRate);

      productRatesRepository.save.mockResolvedValue(productRate);

      const getRawOne = jest.fn().mockResolvedValue({
        averageRating: '3.5',
      });

      const where = jest.fn().mockReturnValue({
        getRawOne,
      });

      const select = jest.fn().mockReturnValue({
        where,
      });

      productRatesRepository.createQueryBuilder.mockReturnValue({
        select,
      });

      const result = await service.updateProductRate(dto, 'john');

      expect(select).toHaveBeenCalledWith(
        'AVG(productRate.rating)',
        'averageRating',
      );

      expect(where).toHaveBeenCalledWith('productRate.productId = :productId', {
        productId: 'product-id',
      });

      expect(result.averageRating).toBe(3.5);
    });
  });
});
