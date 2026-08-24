import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from '../../entities';

import { CreateProductDto, UpdateProductDto } from '../../dto';

import { ProductImagesService } from '../product-images/product-images.service';
import { UploadService } from '../../../uploads/services';
import { ProductsService } from './products.service';

describe(ProductsService.name, () => {
  let service: ProductsService;

  const productsRepository = {
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: {
      connection: {
        createQueryRunner: jest.fn(),
      },
    },
  };

  const productRatesRepository = {
    createQueryBuilder: jest.fn(),
  };

  const productImagesService = {
    createProductImage: jest.fn(),
  };

  const uploadService = {
    saveFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const configService = {
    get: jest.fn((key: string, defaultValue?: number) => defaultValue),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProductsService(
      configService as unknown as ConfigService,
      productsRepository as unknown as Repository<ProductEntity>,
      productRatesRepository as unknown as Repository<ProductRateEntity>,
      productImagesService as unknown as ProductImagesService,
      uploadService as unknown as UploadService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    const createProductDto: CreateProductDto = {
      name: 'Product',
      description: 'Description',
      details: '<p>Details</p>',
      price: '99.99',
      code: 'PRODUCT-001',
      isActive: 'true',
      isPromo: 'false',
    };

    it('should create product without images', async () => {
      const savedProduct = createProductEntity({
        id: 'product-id',
        name: 'Product',
        description: 'Description',
        price: 99.99,
        code: 'PRODUCT-001',
        isActive: true,
        isPromo: false,
      });

      productsRepository.save.mockResolvedValue(savedProduct);

      const result = await service.createProduct(createProductDto, []);

      expect(productsRepository.save).toHaveBeenCalledTimes(1);

      const product = productsRepository.save.mock.calls[0][0] as ProductEntity;

      expect(product.name).toBe('Product');
      expect(product.description).toBe('Description');
      expect(product.price).toBe(99.99);
      expect(product.code).toBe('PRODUCT-001');
      expect(product.isActive).toBe(true);
      expect(product.isPromo).toBe(false);

      expect(productImagesService.createProductImage).not.toHaveBeenCalled();

      expect(result).toBe(savedProduct);
    });

    it('should convert boolean string values correctly', async () => {
      const savedProduct = createProductEntity({
        id: 'product-id',
      });

      productsRepository.save.mockResolvedValue(savedProduct);

      await service.createProduct(
        {
          ...createProductDto,
          isActive: 'false',
          isPromo: 'true',
        },
        [],
      );

      const product = productsRepository.save.mock.calls[0][0] as ProductEntity;

      expect(product.isActive).toBe(false);
      expect(product.isPromo).toBe(true);
    });

    it('should create product images', async () => {
      const savedProduct = createProductEntity({
        id: 'product-id',
      });

      const file = {
        originalname: 'image.png',
        mimetype: 'image/png',
      } as Express.Multer.File;

      const savedImage = {
        id: 'image-id',
        save: jest.fn().mockResolvedValue(undefined),
      } as unknown as ProductImageEntity;

      productsRepository.save.mockResolvedValue(savedProduct);

      uploadService.saveFile.mockReturnValue(
        'product-images/product-id/image.png',
      );

      productImagesService.createProductImage.mockResolvedValue(savedImage);

      const result = await service.createProduct(createProductDto, [file]);

      expect(uploadService.saveFile).toHaveBeenCalledWith(
        file,
        'product-images/product-id',
      );

      expect(productImagesService.createProductImage).toHaveBeenCalledWith({
        productId: 'product-id',
        path: 'product-images/product-id/image.png',
      });

      expect(savedImage.product).toBe(savedProduct);

      expect(savedImage.save).toHaveBeenCalledTimes(1);

      expect(result).toBe(savedProduct);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const products = [
        createProductEntity({
          id: 'product-1',
          name: 'Product 1',
        }),
        createProductEntity({
          id: 'product-2',
          name: 'Product 2',
        }),
      ];

      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([products, 2]);

      const ratingQuery = createRatingQueryBuilder();

      ratingQuery.getRawMany.mockResolvedValue([]);

      productRatesRepository.createQueryBuilder.mockReturnValueOnce(
        ratingQuery,
      );

      const result = await service.findAll();

      expect(productsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'product',
      );

      expect(query.getManyAndCount).toHaveBeenCalledTimes(1);

      expect(query.skip).toHaveBeenCalledWith(0);

      expect(query.take).toHaveBeenCalledWith(20);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('product-1');
      expect(result.data[1].id).toBe('product-2');

      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should apply pagination', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 100]);

      mockProductRatings();

      await service.findAll(undefined, undefined, undefined, undefined, 2, 20);

      expect(query.skip).toHaveBeenCalledWith(20);

      expect(query.take).toHaveBeenCalledWith(20);
    });

    it('should use default limit', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll();

      expect(query.take).toHaveBeenCalledWith(20);
    });

    it('should respect maximum limit', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll(undefined, undefined, undefined, undefined, 1, 500);

      expect(query.take).toHaveBeenCalledWith(100);
    });

    it('should normalize invalid page', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll(undefined, undefined, undefined, undefined, 0, 20);

      expect(query.skip).toHaveBeenCalledWith(0);
    });

    it('should filter products by isActive', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll(true);

      expect(query.andWhere).toHaveBeenCalledWith(
        'product.isActive = :isActive',
        {
          isActive: true,
        },
      );
    });

    it('should filter products by isPromo', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll(undefined, true);

      expect(query.andWhere).toHaveBeenCalledWith(
        'product.isPromo = :isPromo',
        {
          isPromo: true,
        },
      );
    });

    it('should filter products by phrase', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll(undefined, undefined, 'Laptop');

      expect(query.andWhere).toHaveBeenCalledWith(
        'product.name ILIKE :phrase',
        {
          phrase: '%Laptop%',
        },
      );
    });

    it('should apply all filters', async () => {
      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      mockProductRatings();

      await service.findAll(true, false, 'Laptop');

      expect(query.andWhere).toHaveBeenCalledWith(
        'product.isActive = :isActive',
        {
          isActive: true,
        },
      );

      expect(query.andWhere).toHaveBeenCalledWith(
        'product.isPromo = :isPromo',
        {
          isPromo: false,
        },
      );

      expect(query.andWhere).toHaveBeenCalledWith(
        'product.name ILIKE :phrase',
        {
          phrase: '%Laptop%',
        },
      );
    });

    it('should pass userId to rating query', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[product], 1]);

      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          averageRating: '4.5',
        },
      ]);

      const userQuery = createRatingQueryBuilder();

      userQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          userRating: 5,
        },
      ]);

      productRatesRepository.createQueryBuilder
        .mockReturnValueOnce(averageQuery)
        .mockReturnValueOnce(userQuery);

      const result = await service.findAll(
        undefined,
        undefined,
        undefined,
        'user-id',
      );

      expect(userQuery.andWhere).toHaveBeenCalledWith('rate.userId = :userId', {
        userId: 'user-id',
      });

      expect(result.data[0].rating).toBe(5);

      expect(result.data[0].averageRating).toBe(4.5);
    });

    it('should return null user rating when user has not rated product', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[product], 1]);

      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          averageRating: '4.5',
        },
      ]);

      const userQuery = createRatingQueryBuilder();

      userQuery.getRawMany.mockResolvedValue([]);

      productRatesRepository.createQueryBuilder
        .mockReturnValueOnce(averageQuery)
        .mockReturnValueOnce(userQuery);

      const result = await service.findAll(
        undefined,
        undefined,
        undefined,
        'user-id',
      );

      expect(result.data[0].rating).toBeNull();

      expect(result.data[0].averageRating).toBe(4.5);
    });

    it('should return zero average rating when product has no ratings', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[product], 1]);

      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([]);

      productRatesRepository.createQueryBuilder.mockReturnValueOnce(
        averageQuery,
      );

      const result = await service.findAll();

      expect(result.data[0].averageRating).toBe(0);

      expect(result.data[0].rating).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return product when it exists', async () => {
      const product = createProductEntity({
        id: 'product-id',
        name: 'Product',
      });

      const query = createProductQueryBuilder();

      query.getOne.mockResolvedValue(product);

      const ratingQuery = createRatingQueryBuilder();

      ratingQuery.getRawMany.mockResolvedValue([]);

      productRatesRepository.createQueryBuilder.mockReturnValueOnce(
        ratingQuery,
      );

      const result = await service.findOneById('product-id');

      expect(query.where).toHaveBeenCalledWith('product.id = :id', {
        id: 'product-id',
      });

      expect(result?.id).toBe('product-id');

      expect(result?.name).toBe('Product');

      expect(result?.averageRating).toBe(0);
      expect(result?.rating).toBeNull();
    });

    it('should return null when product does not exist', async () => {
      const query = createProductQueryBuilder();

      query.getOne.mockResolvedValue(null);

      const result = await service.findOneById('unknown-id');

      expect(result).toBeNull();
    });

    it('should return user rating by userId', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const query = createProductQueryBuilder();

      query.getOne.mockResolvedValue(product);

      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          averageRating: '4',
        },
      ]);

      const userQuery = createRatingQueryBuilder();

      userQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          userRating: 5,
        },
      ]);

      productRatesRepository.createQueryBuilder
        .mockReturnValueOnce(averageQuery)
        .mockReturnValueOnce(userQuery);

      const result = await service.findOneById('product-id', 'user-id');

      expect(result?.rating).toBe(5);
      expect(result?.averageRating).toBe(4);
    });
  });

  describe('remove', () => {
    it('should delete product by id', async () => {
      productsRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await service.remove('product-id');

      expect(productsRepository.delete).toHaveBeenCalledTimes(1);

      expect(productsRepository.delete).toHaveBeenCalledWith('product-id');
    });
  });

  describe('updateProduct', () => {
    const updateDto: UpdateProductDto = {
      name: 'Updated product',
      description: 'Updated description',
      details: '<p>Updated details</p>',
      price: '149.99',
      code: 'UPDATED-001',
      isActive: 'true',
      isPromo: 'false',
      deletedImageIds: [],
    };

    const createQueryRunner = () => {
      const manager = {
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
      };

      const queryRunner = {
        manager,

        connect: jest.fn().mockResolvedValue(undefined),

        startTransaction: jest.fn().mockResolvedValue(undefined),

        commitTransaction: jest.fn().mockResolvedValue(undefined),

        rollbackTransaction: jest.fn().mockResolvedValue(undefined),

        release: jest.fn().mockResolvedValue(undefined),
      };

      productsRepository.manager.connection.createQueryRunner.mockReturnValue(
        queryRunner,
      );

      return queryRunner;
    };

    const mockResultProduct = (product: ProductEntity) => {
      const query = createProductQueryBuilder();

      query.getOne.mockResolvedValue(product);

      return query;
    };

    const mockAverageRating = (
      productId = 'product-id',
      averageRating = '4.5',
    ) => {
      const ratingQuery = createRatingQueryBuilder();

      ratingQuery.getRawMany.mockResolvedValue([
        {
          product_id: productId,
          averageRating,
        },
      ]);

      productRatesRepository.createQueryBuilder.mockReturnValueOnce(
        ratingQuery,
      );

      return ratingQuery;
    };

    const mockNoRatings = () => {
      const ratingQuery = createRatingQueryBuilder();

      ratingQuery.getRawMany.mockResolvedValue([]);

      productRatesRepository.createQueryBuilder.mockReturnValueOnce(
        ratingQuery,
      );

      return ratingQuery;
    };

    const mockRatingsWithUserRating = (
      averageRating = '4.5',
      userRating = 5,
    ) => {
      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          averageRating,
        },
      ]);

      const userQuery = createRatingQueryBuilder();

      userQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          userRating,
        },
      ]);

      productRatesRepository.createQueryBuilder
        .mockReturnValueOnce(averageQuery)
        .mockReturnValueOnce(userQuery);

      return {
        averageQuery,
        userQuery,
      };
    };

    it('should throw NotFoundException when product does not exist', async () => {
      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(null);

      await expect(
        service.updateProduct('product-id', updateDto, []),
      ).rejects.toThrow(new NotFoundException('Product not found'));

      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(ProductEntity, {
        where: {
          id: 'product-id',
        },
      });

      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should update product and commit transaction', async () => {
      const product = createProductEntity({
        id: 'product-id',
        name: 'Old product',
        description: 'Old description',
        price: 99,
        code: 'OLD-001',
        isActive: false,
        isPromo: true,
      });

      const updatedProduct = createProductEntity({
        id: 'product-id',
        name: 'Updated product',
        description: 'Updated description',
        price: 149.99,
        code: 'UPDATED-001',
        isActive: true,
        isPromo: false,
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      mockResultProduct(updatedProduct);

      mockAverageRating('product-id', '4.5');

      const result = await service.updateProduct('product-id', updateDto, []);

      expect(product.name).toBe('Updated product');

      expect(product.description).toBe('Updated description');

      expect(product.price).toBe(149.99);

      expect(product.code).toBe('UPDATED-001');

      expect(product.isActive).toBe(true);
      expect(product.isPromo).toBe(false);

      expect(queryRunner.manager.save).toHaveBeenCalledWith(product);

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);

      expect(result.id).toBe('product-id');

      expect(result.name).toBe('Updated product');

      expect(result.averageRating).toBe(4.5);

      expect(result.rating).toBeNull();
    });

    it('should update product and return user rating', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      mockResultProduct(product);

      mockRatingsWithUserRating('4.5', 5);

      const result = await service.updateProduct(
        'product-id',
        updateDto,
        [],
        'user-id',
      );

      expect(result.averageRating).toBe(4.5);

      expect(result.rating).toBe(5);

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should delete selected product images', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const image = {
        id: 'image-id',
        path: '/images/image.png',
      } as ProductImageEntity;

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      const imageQuery = {
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn(),
      };

      imageQuery.where.mockReturnValue(imageQuery);

      imageQuery.andWhere.mockReturnValue(imageQuery);

      imageQuery.getMany.mockResolvedValue([image]);

      queryRunner.manager.createQueryBuilder.mockReturnValue(imageQuery);

      mockResultProduct(product);

      mockNoRatings();

      await service.updateProduct(
        'product-id',
        {
          ...updateDto,
          deletedImageIds: ['image-id'],
        },
        [],
      );

      expect(queryRunner.manager.createQueryBuilder).toHaveBeenCalledWith(
        ProductImageEntity,
        'image',
      );

      expect(imageQuery.where).toHaveBeenCalledWith('image.id IN (:...ids)', {
        ids: ['image-id'],
      });

      expect(imageQuery.andWhere).toHaveBeenCalledWith(
        'image.productId = :productId',
        {
          productId: 'product-id',
        },
      );

      expect(queryRunner.manager.delete).toHaveBeenCalledWith(
        ProductImageEntity,
        'image-id',
      );

      expect(uploadService.deleteFile).toHaveBeenCalledWith(
        '/images/image.png',
      );

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should accept single deleted image id', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      const imageQuery = {
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      imageQuery.where.mockReturnValue(imageQuery);

      imageQuery.andWhere.mockReturnValue(imageQuery);

      queryRunner.manager.createQueryBuilder.mockReturnValue(imageQuery);

      mockResultProduct(product);

      mockNoRatings();

      await service.updateProduct(
        'product-id',
        {
          ...updateDto,
          deletedImageIds: ['image-id'],
        },
        [],
      );

      expect(imageQuery.where).toHaveBeenCalledWith('image.id IN (:...ids)', {
        ids: ['image-id'],
      });

      expect(imageQuery.andWhere).toHaveBeenCalledWith(
        'image.productId = :productId',
        {
          productId: 'product-id',
        },
      );

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should create new product images', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const file = {
        originalname: 'image.png',
        mimetype: 'image/png',
      } as Express.Multer.File;

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      uploadService.saveFile.mockReturnValue('/images/new-image.png');

      mockResultProduct(product);

      mockNoRatings();

      await service.updateProduct('product-id', updateDto, [file]);

      expect(uploadService.saveFile).toHaveBeenCalledWith(
        file,
        'product-images/product-id',
      );

      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/images/new-image.png',
          product,
        }),
      );

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should create multiple product images', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const files = [
        {
          originalname: 'image-1.png',
          mimetype: 'image/png',
        },
        {
          originalname: 'image-2.png',
          mimetype: 'image/png',
        },
      ] as Express.Multer.File[];

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      uploadService.saveFile
        .mockReturnValueOnce('/images/image-1.png')
        .mockReturnValueOnce('/images/image-2.png');

      mockResultProduct(product);

      mockNoRatings();

      await service.updateProduct('product-id', updateDto, files);

      expect(uploadService.saveFile).toHaveBeenCalledTimes(2);

      expect(uploadService.saveFile).toHaveBeenNthCalledWith(
        1,
        files[0],
        'product-images/product-id',
      );

      expect(uploadService.saveFile).toHaveBeenNthCalledWith(
        2,
        files[1],
        'product-images/product-id',
      );

      expect(queryRunner.manager.save).toHaveBeenCalledTimes(3);
    });

    it('should rollback transaction and delete created files when update fails', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const file = {
        originalname: 'image.png',
        mimetype: 'image/png',
      } as Express.Multer.File;

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save
        .mockResolvedValueOnce(product)
        .mockRejectedValueOnce(new Error('Database error'));

      uploadService.saveFile.mockReturnValue('/images/created.png');

      await expect(
        service.updateProduct('product-id', updateDto, [file]),
      ).rejects.toThrow('Database error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

      expect(uploadService.deleteFile).toHaveBeenCalledWith(
        '/images/created.png',
      );

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should rollback transaction when deleting image fails', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const image = {
        id: 'image-id',
        path: '/images/image.png',
      } as ProductImageEntity;

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      const imageQuery = {
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn().mockResolvedValue([image]),
      };

      imageQuery.where.mockReturnValue(imageQuery);

      imageQuery.andWhere.mockReturnValue(imageQuery);

      queryRunner.manager.createQueryBuilder.mockReturnValue(imageQuery);

      queryRunner.manager.delete.mockRejectedValue(
        new Error('Delete image failed'),
      );

      await expect(
        service.updateProduct(
          'product-id',
          {
            ...updateDto,
            deletedImageIds: ['image-id'],
          },
          [],
        ),
      ).rejects.toThrow('Delete image failed');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

      expect(uploadService.deleteFile).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should delete files only after successful transaction commit', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const image = {
        id: 'image-id',
        path: '/images/image.png',
      } as ProductImageEntity;

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      const imageQuery = {
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn().mockResolvedValue([image]),
      };

      imageQuery.where.mockReturnValue(imageQuery);

      imageQuery.andWhere.mockReturnValue(imageQuery);

      queryRunner.manager.createQueryBuilder.mockReturnValue(imageQuery);

      mockResultProduct(product);

      mockNoRatings();

      await service.updateProduct(
        'product-id',
        {
          ...updateDto,
          deletedImageIds: ['image-id'],
        },
        [],
      );

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(uploadService.deleteFile).toHaveBeenCalledWith(
        '/images/image.png',
      );

      const commitOrder =
        queryRunner.commitTransaction.mock.invocationCallOrder[0];

      const deleteFileOrder =
        uploadService.deleteFile.mock.invocationCallOrder[0];

      expect(commitOrder).toBeLessThan(deleteFileOrder);
    });

    it('should delete created files when final product query fails', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const file = {
        originalname: 'image.png',
        mimetype: 'image/png',
      } as Express.Multer.File;

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save
        .mockResolvedValueOnce(product)
        .mockRejectedValueOnce(new Error('Database error'));

      uploadService.saveFile.mockReturnValue('/images/created.png');

      await expect(
        service.updateProduct('product-id', updateDto, [file]),
      ).rejects.toThrow('Database error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(uploadService.deleteFile).toHaveBeenCalledWith(
        '/images/created.png',
      );

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when updated product cannot be found after commit', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      const resultQuery = createProductQueryBuilder();

      resultQuery.getOne.mockResolvedValue(null);

      await expect(
        service.updateProduct('product-id', updateDto, []),
      ).rejects.toThrow(new NotFoundException('Product not found'));

      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should release query runner when update fails', async () => {
      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.updateProduct('product-id', updateDto, []),
      ).rejects.toThrow('Database error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should release query runner after successful update', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);

      queryRunner.manager.save.mockResolvedValue(product);

      mockResultProduct(product);
      mockNoRatings();

      await service.updateProduct('product-id', updateDto, []);

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });
  });
  describe('rating calculations', () => {
    it('should calculate average rating in SQL', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[product], 1]);

      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          averageRating: '4.33',
        },
      ]);

      productRatesRepository.createQueryBuilder.mockReturnValueOnce(
        averageQuery,
      );

      const result = await service.findAll();

      expect(result.data[0].averageRating).toBe(4.33);

      expect(averageQuery.groupBy).toHaveBeenCalledWith('rate.productId');
    });

    it('should calculate user rating using userId', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const query = createProductQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[product], 1]);

      const averageQuery = createRatingQueryBuilder();

      averageQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          averageRating: '4',
        },
      ]);

      const userQuery = createRatingQueryBuilder();

      userQuery.getRawMany.mockResolvedValue([
        {
          product_id: 'product-id',
          userRating: 5,
        },
      ]);

      productRatesRepository.createQueryBuilder
        .mockReturnValueOnce(averageQuery)
        .mockReturnValueOnce(userQuery);

      const result = await service.findAll(
        undefined,
        undefined,
        undefined,
        'user-id',
      );

      expect(userQuery.andWhere).toHaveBeenCalledWith('rate.userId = :userId', {
        userId: 'user-id',
      });

      expect(result.data[0].rating).toBe(5);
    });
  });

  function createProductQueryBuilder() {
    const query = {
      leftJoinAndSelect: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
      getOne: jest.fn(),
      getManyAndCount: jest.fn(),
    };

    query.leftJoinAndSelect.mockReturnValue(query);

    query.where.mockReturnValue(query);

    query.andWhere.mockReturnValue(query);

    query.skip.mockReturnValue(query);

    query.take.mockReturnValue(query);

    productsRepository.createQueryBuilder.mockReturnValue(query);

    return query;
  }

  function createRatingQueryBuilder() {
    const query = {
      select: jest.fn(),
      addSelect: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      groupBy: jest.fn(),
      getRawMany: jest.fn(),
    };

    query.select.mockReturnValue(query);

    query.addSelect.mockReturnValue(query);

    query.where.mockReturnValue(query);

    query.andWhere.mockReturnValue(query);

    query.groupBy.mockReturnValue(query);

    return query;
  }

  function mockProductRatings(): void {
    productRatesRepository.createQueryBuilder.mockReset();
  }

  function createProductEntity(
    overrides: Partial<ProductEntity> = {},
  ): ProductEntity {
    return {
      id: 'product-id',
      name: 'Product',
      description: 'Description',
      price: 100,
      code: 'PRODUCT-001',
      isActive: true,
      isPromo: false,
      images: [],
      rates: [],
      ...overrides,
    } as ProductEntity;
  }
});
