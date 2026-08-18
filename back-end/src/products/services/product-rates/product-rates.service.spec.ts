import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductRateEntity } from '../../entities';
import { ProductsService } from '../products/products.service';
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

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProductRatesService(
      productRatesRepository as unknown as Repository<ProductRateEntity>,
      productsService as unknown as ProductsService,
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

    const userId = 'user-id';

    const dto = {
      productId: 'product-id',
      rating: 5,
    };

    it('should create product rate', async () => {
      productsService.findOneById.mockResolvedValue(product);

      productRatesRepository.findOne.mockResolvedValue(null);

      const productRate = {
        rating: 5,
        product: {
          id: product.id,
        },
        user: {
          id: userId,
        },
      };

      productRatesRepository.create.mockReturnValue(productRate);

      productRatesRepository.save.mockResolvedValue(productRate);

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

      const result = await service.createProductRate(dto, userId);

      expect(productsService.findOneById).toHaveBeenCalledWith('product-id');

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
        product: {
          id: 'product-id',
        },
        user: {
          id: 'user-id',
        },
      });

      expect(productRatesRepository.save).toHaveBeenCalledWith(productRate);

      expect(result).toEqual({
        rating: 5,
        averageRating: 5,
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productsService.findOneById.mockResolvedValue(null);

      await expect(service.createProductRate(dto, userId)).rejects.toThrow(
        new NotFoundException('Product not found'),
      );

      expect(productRatesRepository.findOne).not.toHaveBeenCalled();

      expect(productRatesRepository.create).not.toHaveBeenCalled();

      expect(productRatesRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when user already rated product', async () => {
      productsService.findOneById.mockResolvedValue(product);

      productRatesRepository.findOne.mockResolvedValue({
        id: 'existing-rate',
        rating: 4,
      });

      await expect(service.createProductRate(dto, userId)).rejects.toThrow(
        new ConflictException('You have already rated this product'),
      );

      expect(productRatesRepository.create).not.toHaveBeenCalled();

      expect(productRatesRepository.save).not.toHaveBeenCalled();
    });

    it('should calculate average rating after creating rate', async () => {
      productsService.findOneById.mockResolvedValue(product);

      productRatesRepository.findOne.mockResolvedValue(null);

      const productRate = {
        rating: 5,
        product: {
          id: product.id,
        },
        user: {
          id: userId,
        },
      };

      productRatesRepository.create.mockReturnValue(productRate);

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

      const result = await service.createProductRate(dto, userId);

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
    const userId = 'user-id';

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

      const result = await service.updateProductRate(dto, userId);

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

      expect(productRate.rating).toBe(4);

      expect(productRatesRepository.save).toHaveBeenCalledWith(productRate);

      expect(result).toEqual({
        rating: 4,
        averageRating: 4,
      });
    });

    it('should throw NotFoundException when product rate does not exist', async () => {
      productRatesRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProductRate(dto, userId)).rejects.toThrow(
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

      const result = await service.updateProductRate(dto, userId);

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
