import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from '../../entities';
import { CreateProductDto, UpdateProductDto } from '../../dto';
import { ProductImagesService } from '../product-images/product-images.service';
import { UploadService } from '../../../uploads/services';
import { UserEntity } from '../../../users/entities';
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

  const productImagesService = {
    createProductImage: jest.fn(),
  };

  const uploadService = {
    saveFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProductsService(
      productsRepository as unknown as Repository<ProductEntity>,
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
    it('should return all products', async () => {
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

      query.getMany.mockResolvedValue(products);

      const result = await service.findAll();

      expect(productsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'product',
      );

      expect(query.getMany).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('product-1');
      expect(result[1].id).toBe('product-2');
    });

    it('should filter products by isActive', async () => {
      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([]);

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

      query.getMany.mockResolvedValue([]);

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

      query.getMany.mockResolvedValue([]);

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

      query.getMany.mockResolvedValue([]);

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

    it('should return user rating when username is provided', async () => {
      const product = createProductEntity({
        id: 'product-id',
        rates: [
          createProductRate({
            rating: 5,
            user: createUser({
              username: 'john',
            }),
          }),
        ],
      });

      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([product]);

      const result = await service.findAll(
        undefined,
        undefined,
        undefined,
        'john',
      );

      expect(result[0].rating).toBe(5);
    });

    it('should return null user rating when user has not rated product', async () => {
      const product = createProductEntity({
        rates: [
          createProductRate({
            rating: 5,
            user: createUser({
              username: 'john',
            }),
          }),
        ],
      });

      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([product]);

      const result = await service.findAll(
        undefined,
        undefined,
        undefined,
        'jane',
      );

      expect(result[0].rating).toBeNull();
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

      const result = await service.findOneById('product-id');

      expect(query.where).toHaveBeenCalledWith('product.id = :id', {
        id: 'product-id',
      });

      expect(result?.id).toBe('product-id');
      expect(result?.name).toBe('Product');
    });

    it('should return null when product does not exist', async () => {
      const query = createProductQueryBuilder();

      query.getOne.mockResolvedValue(null);

      const result = await service.findOneById('unknown-id');

      expect(result).toBeNull();
    });

    it('should return user rating when username is provided', async () => {
      const product = createProductEntity({
        rates: [
          createProductRate({
            rating: 4,
            user: createUser({
              username: 'john',
            }),
          }),
        ],
      });

      const query = createProductQueryBuilder();

      query.getOne.mockResolvedValue(product);

      const result = await service.findOneById('product-id', 'john');

      expect(result?.rating).toBe(4);
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

    it('should throw NotFoundException when product does not exist', async () => {
      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(null);

      await expect(
        service.updateProduct('product-id', updateDto, []),
      ).rejects.toThrow(new NotFoundException('Product not found'));

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);

      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should update product and commit transaction', async () => {
      const product = createProductEntity({
        id: 'product-id',
        name: 'Old product',
        price: 99,
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);
      queryRunner.manager.save.mockResolvedValue(product);

      const resultQuery = createProductQueryBuilder();

      resultQuery.getOne.mockResolvedValue(
        createProductEntity({
          id: 'product-id',
          name: 'Updated product',
          price: 149.99,
        }),
      );

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

      expect(result?.id).toBe('product-id');
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

      const resultQuery = createProductQueryBuilder();

      resultQuery.getOne.mockResolvedValue(product);

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

      expect(queryRunner.manager.delete).toHaveBeenCalledWith(
        ProductImageEntity,
        'image-id',
      );

      expect(uploadService.deleteFile).toHaveBeenCalledWith(
        '/images/image.png',
      );
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

      const resultQuery = createProductQueryBuilder();

      resultQuery.getOne.mockResolvedValue(product);

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

      const resultQuery = createProductQueryBuilder();

      resultQuery.getOne.mockResolvedValue(product);

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
    });

    it('should rollback transaction and delete created files when update fails', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const file = {
        originalname: 'image.png',
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

    it('should release query runner after successful update', async () => {
      const product = createProductEntity({
        id: 'product-id',
      });

      const queryRunner = createQueryRunner();

      queryRunner.manager.findOne.mockResolvedValue(product);
      queryRunner.manager.save.mockResolvedValue(product);

      const resultQuery = createProductQueryBuilder();

      resultQuery.getOne.mockResolvedValue(product);

      await service.updateProduct('product-id', updateDto, []);

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

      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapProduct', () => {
    it('should map product correctly', async () => {
      const product = createProductEntity({
        id: 'product-id',
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 2999.99,
        code: 'LAPTOP-001',
        isActive: true,
        isPromo: true,
        images: [
          {
            id: 'image-id',
            path: '/images/laptop.png',
          } as ProductImageEntity,
        ],
        rates: [
          createProductRate({
            rating: 5,
            user: createUser({
              username: 'john',
            }),
          }),
          createProductRate({
            rating: 4,
            user: createUser({
              username: 'jane',
            }),
          }),
        ],
      });

      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([product]);

      const result = await service.findAll(
        undefined,
        undefined,
        undefined,
        'john',
      );

      expect(result[0]).toEqual({
        id: 'product-id',
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 2999.99,
        code: 'LAPTOP-001',
        isActive: true,
        isPromo: true,
        images: [
          {
            id: 'image-id',
            path: '/images/laptop.png',
          },
        ],
        averageRating: 4.5,
        rating: 5,
      });
    });

    it('should return average rating 0 when product has no ratings', async () => {
      const product = createProductEntity({
        rates: [],
      });

      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([product]);

      const result = await service.findAll();

      expect(result[0].averageRating).toBe(0);
      expect(result[0].rating).toBeNull();
    });

    it('should calculate average rating correctly', async () => {
      const product = createProductEntity({
        rates: [
          createProductRate({
            rating: 5,
            user: createUser(),
          }),
          createProductRate({
            rating: 4,
            user: createUser(),
          }),
          createProductRate({
            rating: 4,
            user: createUser(),
          }),
        ],
      });

      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([product]);

      const result = await service.findAll();

      expect(result[0].averageRating).toBe(4.33);
    });

    it('should return null rating when username is not provided', async () => {
      const product = createProductEntity({
        rates: [
          createProductRate({
            rating: 5,
            user: createUser({
              username: 'john',
            }),
          }),
        ],
      });

      const query = createProductQueryBuilder();

      query.getMany.mockResolvedValue([product]);

      const result = await service.findAll();

      expect(result[0].rating).toBeNull();
    });
  });

  function createProductQueryBuilder() {
    const query = {
      leftJoinAndSelect: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    };

    query.leftJoinAndSelect.mockReturnValue(query);
    query.where.mockReturnValue(query);
    query.andWhere.mockReturnValue(query);

    productsRepository.createQueryBuilder.mockReturnValue(query);

    return query;
  }

  function createUser(overrides: Partial<UserEntity> = {}): UserEntity {
    return {
      id: 'user-id',
      username: 'john',
      avatar: null,
      email: 'john@example.com',
      password: 'hashed-password',
      ...overrides,
    } as UserEntity;
  }

  function createProductRate(
    overrides: Partial<ProductRateEntity> = {},
  ): ProductRateEntity {
    return {
      id: 'rate-id',
      rating: 5,
      product: {} as ProductEntity,
      user: createUser(),
      ...overrides,
    } as ProductRateEntity;
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
