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

      const productImages = [
        {
          originalname: 'image.png',
        },
      ] as Express.Multer.File[];

      const product = {
        id: 'product-id',
        name: 'Product',
      } as ProductEntity;

      productsService.createProduct.mockResolvedValue(product);

      const result = await controller.create(dto, productImages);

      expect(productsService.createProduct).toHaveBeenCalledTimes(1);

      expect(productsService.createProduct).toHaveBeenCalledWith(
        dto,
        productImages,
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

      const result = await controller.create(dto, []);

      expect(productsService.createProduct).toHaveBeenCalledWith(dto, []);

      expect(result).toBe(product);
    });
  });

  describe('findAll', () => {
    const user = {
      username: 'john',
    };

    it('should return all products', async () => {
      const products = [
        {
          id: 'product-1',
          name: 'Product 1',
        },
        {
          id: 'product-2',
          name: 'Product 2',
        },
      ];

      productsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll(
        true,
        false,
        'Laptop',
        user as any,
      );

      expect(productsService.findAll).toHaveBeenCalledTimes(1);

      expect(productsService.findAll).toHaveBeenCalledWith(
        true,
        false,
        'Laptop',
        'john',
      );

      expect(result).toBe(products);
    });

    it('should pass undefined filters', async () => {
      productsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(
        undefined,
        undefined,
        undefined,
        user as any,
      );

      expect(productsService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        'john',
      );

      expect(result).toEqual([]);
    });
  });

  describe('find', () => {
    const user = {
      username: 'john',
    };

    it('should return product', async () => {
      const product = {
        id: 'product-id',
        name: 'Laptop',
      };

      productsService.findOneById.mockResolvedValue(product);

      const result = await controller.find('product-id', user as any);

      expect(productsService.findOneById).toHaveBeenCalledTimes(1);

      expect(productsService.findOneById).toHaveBeenCalledWith(
        'product-id',
        'john',
      );

      expect(result).toBe(product);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productsService.findOneById.mockResolvedValue(null);

      await expect(controller.find('unknown-id', user as any)).rejects.toThrow(
        new NotFoundException('Product not found'),
      );

      expect(productsService.findOneById).toHaveBeenCalledWith(
        'unknown-id',
        'john',
      );
    });
  });

  describe('remove', () => {
    it('should remove product', async () => {
      productsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('product-id');

      expect(productsService.remove).toHaveBeenCalledTimes(1);

      expect(productsService.remove).toHaveBeenCalledWith('product-id');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    const user = {
      username: 'john',
    };

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
      const productImages = [
        {
          originalname: 'new-image.png',
        },
      ] as Express.Multer.File[];

      const product = {
        id: 'product-id',
        name: 'Updated product',
      };

      productsService.updateProduct.mockResolvedValue(product);

      const result = await controller.update(
        'product-id',
        dto,
        productImages,
        user as any,
      );

      expect(productsService.updateProduct).toHaveBeenCalledTimes(1);

      expect(productsService.updateProduct).toHaveBeenCalledWith(
        'product-id',
        dto,
        productImages,
        'john',
      );

      expect(result).toBe(product);
    });

    it('should update product without images', async () => {
      const product = {
        id: 'product-id',
      };

      productsService.updateProduct.mockResolvedValue(product);

      const result = await controller.update(
        'product-id',
        dto,
        [],
        user as any,
      );

      expect(productsService.updateProduct).toHaveBeenCalledWith(
        'product-id',
        dto,
        [],
        'john',
      );

      expect(result).toBe(product);
    });
  });

  describe('createRate', () => {
    const user = {
      username: 'john',
    };

    it('should create product rate', async () => {
      const dto = {
        productId: 'product-id',
        rating: 5,
      } as CreateProductRateDto;

      const productRate = {
        rating: 5,
        averageRating: 5,
      };

      productRatesService.createProductRate.mockResolvedValue(productRate);

      const result = await controller.createRate(dto, user as any);

      expect(productRatesService.createProductRate).toHaveBeenCalledTimes(1);

      expect(productRatesService.createProductRate).toHaveBeenCalledWith(
        dto,
        'john',
      );

      expect(result).toBe(productRate);
    });
  });

  describe('updateProductRate', () => {
    const user = {
      username: 'john',
    };

    it('should update product rate', async () => {
      const dto = {
        productId: 'product-id',
        rating: 4,
      } as UpdateProductRateDto;

      const productRate = {
        rating: 4,
        averageRating: 4.5,
      };

      productRatesService.updateProductRate.mockResolvedValue(productRate);

      const result = await controller.updateProductRate(dto, user as any);

      expect(productRatesService.updateProductRate).toHaveBeenCalledTimes(1);

      expect(productRatesService.updateProductRate).toHaveBeenCalledWith(
        dto,
        'john',
      );

      expect(result).toBe(productRate);
    });
  });
});
