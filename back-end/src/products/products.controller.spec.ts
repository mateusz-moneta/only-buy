import { NotFoundException } from '@nestjs/common';

import {
  CreateProductDto,
  CreateProductRateDto,
  UpdateProductDto,
  UpdateProductRateDto,
} from './dto';

import { ProductsController } from './products.controller';

import { ProductRatesService, ProductsService } from './services';

import { ProductEntity } from './entities';

import { JwtPayload } from '../auth/payloads';
import { Product } from './models';
import { Page } from '../shared/models';
import { Role } from '../users/models';

describe(ProductsController.name, () => {
  let controller: ProductsController;

  const productsService = {
    createProduct: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    remove: jest.fn(),
    updateProduct: jest.fn(),
  };

  const productRatesService = {
    createProductRate: jest.fn(),
    updateProductRate: jest.fn(),
  };

  const user: JwtPayload = {
    sub: 'user-id',
    username: 'john',
    role: 'STANDARD',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new ProductsController(
      productsService as unknown as ProductsService,
      productRatesService as unknown as ProductRatesService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create product', async () => {
      const dto = {
        name: 'Product',
        description: 'Description',
        price: '99.99',
        code: 'PRODUCT-001',
        isActive: 'true',
        isPromo: 'false',
      } as CreateProductDto;

      const productImages: Express.Multer.File[] = [];

      const product = {
        id: 'product-id',
        name: 'Product',
      } as ProductEntity;

      productsService.createProduct.mockResolvedValue(product);

      const result = await controller.create(dto, productImages, user);

      expect(productsService.createProduct).toHaveBeenCalledTimes(1);

      expect(productsService.createProduct).toHaveBeenCalledWith(
        dto,
        productImages,
        'user-id',
      );

      expect(result).toBe(product);
    });

    it('should pass empty images array to service', async () => {
      const dto = {
        name: 'Product',
        description: 'Description',
        price: '99.99',
        code: 'PRODUCT-001',
        isActive: 'true',
        isPromo: 'false',
      } as CreateProductDto;

      const product = {
        id: 'product-id',
      } as ProductEntity;

      productsService.createProduct.mockResolvedValue(product);

      const result = await controller.create(dto, [], user);

      expect(productsService.createProduct).toHaveBeenCalledWith(
        dto,
        [],
        'user-id',
      );

      expect(result).toBe(product);
    });
  });

  describe('findAll', () => {
    const page: Page<Product> = {
      data: [
        {
          id: 'product-1',
          name: 'Product 1',
        },
        {
          id: 'product-2',
          name: 'Product 2',
        },
      ] as Product[],
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    it('should return paginated products', async () => {
      productsService.findAll.mockResolvedValue(page);

      const result = await controller.findAll(
        true,
        false,
        'Laptop',
        1,
        20,
        user,
      );

      expect(productsService.findAll).toHaveBeenCalledTimes(1);

      expect(productsService.findAll).toHaveBeenCalledWith(
        true,
        false,
        'Laptop',
        'user-id',
        1,
        20,
      );

      expect(result).toBe(page);
    });

    it('should pass undefined filters and pagination', async () => {
      const emptyPage: Page<Product> = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };

      productsService.findAll.mockResolvedValue(emptyPage);

      const result = await controller.findAll(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        user,
      );

      expect(productsService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        'user-id',
        undefined,
        undefined,
      );

      expect(result).toBe(emptyPage);
    });

    it('should pass custom page and limit', async () => {
      productsService.findAll.mockResolvedValue(page);

      await controller.findAll(undefined, undefined, undefined, 3, 10, user);

      expect(productsService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        'user-id',
        3,
        10,
      );
    });
  });

  describe('find', () => {
    it('should return product', async () => {
      const product = {
        id: 'product-id',
        name: 'Laptop',
      };

      productsService.findOneById.mockResolvedValue(product);

      const result = await controller.find('product-id', user);

      expect(productsService.findOneById).toHaveBeenCalledTimes(1);

      expect(productsService.findOneById).toHaveBeenCalledWith(
        'product-id',
        'user-id',
      );

      expect(result).toBe(product);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productsService.findOneById.mockResolvedValue(null);

      await expect(controller.find('unknown-id', user)).rejects.toThrow(
        new NotFoundException('Product not found'),
      );

      expect(productsService.findOneById).toHaveBeenCalledWith(
        'unknown-id',
        'user-id',
      );
    });
  });

  describe('remove', () => {
    it('should remove product', async () => {
      productsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('product-id', user);

      expect(productsService.remove).toHaveBeenCalledTimes(1);

      expect(productsService.remove).toHaveBeenCalledWith(
        'product-id',
        'user-id',
      );

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    const dto = {
      name: 'Updated product',
      description: 'Updated description',
      price: '149.99',
      code: 'UPDATED-001',
      isActive: 'true',
      isPromo: 'false',
      deletedImageIds: [],
    } as UpdateProductDto;

    it('should update product', async () => {
      const productImages: Express.Multer.File[] = [];

      const product = {
        id: 'product-id',
        name: 'Updated product',
      };

      productsService.updateProduct.mockResolvedValue(product);

      const result = await controller.update(
        'product-id',
        dto,
        productImages,
        user,
      );

      expect(productsService.updateProduct).toHaveBeenCalledTimes(1);

      expect(productsService.updateProduct).toHaveBeenCalledWith(
        'product-id',
        dto,
        productImages,
        'user-id',
      );

      expect(result).toBe(product);
    });

    it('should update product without images', async () => {
      const product = {
        id: 'product-id',
      };

      productsService.updateProduct.mockResolvedValue(product);

      const result = await controller.update('product-id', dto, [], user);

      expect(productsService.updateProduct).toHaveBeenCalledWith(
        'product-id',
        dto,
        [],
        'user-id',
      );

      expect(result).toBe(product);
    });
  });

  describe('createRate', () => {
    it('should create product rate', async () => {
      const dto: CreateProductRateDto = {
        productId: 'product-id',
        rating: 5,
      };

      const productRate = {
        rating: 5,
        averageRating: 5,
      };

      productRatesService.createProductRate.mockResolvedValue(productRate);

      const result = await controller.createRate(dto, user);

      expect(productRatesService.createProductRate).toHaveBeenCalledTimes(1);

      expect(productRatesService.createProductRate).toHaveBeenCalledWith(
        dto,
        'user-id',
      );

      expect(result).toBe(productRate);
    });
  });

  describe('updateProductRate', () => {
    it('should update product rate', async () => {
      const dto: UpdateProductRateDto = {
        productId: 'product-id',
        rating: 4,
      };

      const productRate = {
        rating: 4,
        averageRating: 4.5,
      };

      productRatesService.updateProductRate.mockResolvedValue(productRate);

      const result = await controller.updateProductRate(dto, user);

      expect(productRatesService.updateProductRate).toHaveBeenCalledTimes(1);

      expect(productRatesService.updateProductRate).toHaveBeenCalledWith(
        dto,
        'user-id',
      );

      expect(result).toBe(productRate);
    });
  });
});
