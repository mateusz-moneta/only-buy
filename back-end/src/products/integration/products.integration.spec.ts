import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';

import { ProductsService, ProductImagesService } from '../services';
import { UploadService } from '../../uploads/services';
import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from '../entities';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity, UserEntity } from '../../users/entities';
import { RoleEntity } from '../../roles/entities';

describe('Products integration', () => {
  let module: TestingModule;

  let productsService: ProductsService;
  let productImagesService: ProductImagesService;

  let productsRepository: Repository<ProductEntity>;
  let productImagesRepository: Repository<ProductImageEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          ProductEntity,
          ProductImageEntity,
          ProductRateEntity,
          RefreshTokenEntity,
          RoleEntity,
          UserEntity,
        ]),
        JwtModule.register({
          secret: process.env.SECRET,
        }),
      ],
      providers: [
        ProductsService,
        ProductImagesService,
        {
          provide: UploadService,
          useValue: {
            saveFile: jest
              .fn()
              .mockReturnValue('uploads/product-images/test-image.jpg'),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);

    productImagesService =
      module.get<ProductImagesService>(ProductImagesService);

    productsRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    productImagesRepository = module.get<Repository<ProductImageEntity>>(
      getRepositoryToken(ProductImageEntity),
    );
  }, 30000);

  afterAll(async () => {
    await module.close();
  });

  describe('createProduct', () => {
    it('should create product and persist it in database', async () => {
      const timestamp = Date.now();

      const dto = {
        name: `Integration product ${timestamp}`,
        description: 'Integration test product',
        details: '<p>Integration test details</p>',
        price: '99.99',
        code: `INT-${timestamp}`,
        isActive: 'true',
        isPromo: 'false',
      };

      const result = await productsService.createProduct(dto, []);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(dto.name);
      expect(result.description).toBe(dto.description);
      expect(result.details).toBe(dto.details);
      expect(result.code).toBe(dto.code);
      expect(result.isActive).toBe(true);
      expect(result.isPromo).toBe(false);

      const savedProduct = await productsRepository.findOne({
        where: {
          id: result.id,
        },
      });

      expect(savedProduct).toBeDefined();
      expect(savedProduct?.name).toBe(dto.name);
      expect(savedProduct?.description).toBe(dto.description);
      expect(savedProduct?.details).toBe(dto.details);
      expect(savedProduct?.price).toBe('99.99');
    });
  });

  describe('findOneById', () => {
    it('should return persisted product with images', async () => {
      const timestamp = Date.now();

      const product = await productsRepository.save(
        productsRepository.create({
          name: `Find product ${timestamp}`,
          description: 'Find test product',
          details: '<p>Find test product details</p>',
          price: 49.99,
          code: `FIND-${timestamp}`,
          isActive: true,
          isPromo: false,
        }),
      );

      const image = await productImagesService.createProductImage({
        productId: product.id,
        path: 'uploads/products/test.jpg',
      });

      image.product = product;

      await image.save();

      const result = await productsService.findOneById(product.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(product.id);
      expect(result?.name).toBe(product.name);
      expect(result?.details).toBe(product.details);

      expect(result?.images).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: image.id,
            path: image.path,
          }),
        ]),
      );
    });

    it('should return null when product does not exist', async () => {
      const result = await productsService.findOneById(
        '00000000-0000-0000-0000-000000000000',
      );

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated products persisted in database', async () => {
      const timestamp = Date.now();

      const name = `List product ${timestamp}`;
      const code = `ALL-${timestamp}`;

      await productsRepository.save(
        productsRepository.create({
          name,
          description: 'List test product',
          details: '<p>List test product details</p>',
          price: 29.99,
          code,
          isActive: true,
          isPromo: false,
        }),
      );

      const result = await productsService.findAll(
        undefined,
        undefined,
        name,
        undefined,
        1,
        20,
      );

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);

      expect(result.data.length).toBe(1);

      expect(result.data[0].code).toBe(code);
      expect(result.data[0].name).toBe(name);
      expect(result.data[0].details).toBe('<p>List test product details</p>');

      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should respect pagination parameters', async () => {
      const result = await productsService.findAll(
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        2,
      );

      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);

      expect(result.data.length).toBeLessThanOrEqual(2);
      expect(result.total).toBeGreaterThanOrEqual(result.data.length);
      expect(result.totalPages).toBe(Math.ceil(result.total / 2));
    });

    it('should use default pagination values', async () => {
      const result = await productsService.findAll();

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data.length).toBeLessThanOrEqual(20);
    });

    it('should normalize invalid page number', async () => {
      const result = await productsService.findAll(
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        20,
      );

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should respect maximum limit', async () => {
      const result = await productsService.findAll(
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        1000,
      );

      expect(result.limit).toBeLessThanOrEqual(100);
      expect(result.data.length).toBeLessThanOrEqual(100);
    });

    it('should filter products by active status', async () => {
      const timestamp = Date.now();

      const activeCode = `ACTIVE-${timestamp}`;
      const inactiveCode = `INACTIVE-${timestamp}`;

      const activeName = `Active ${timestamp}`;
      const inactiveName = `Inactive ${timestamp}`;

      await productsRepository.save([
        productsRepository.create({
          name: activeName,
          description: 'Active product',
          details: '<p>Active product details</p>',
          price: 10,
          code: activeCode,
          isActive: true,
          isPromo: false,
        }),

        productsRepository.create({
          name: inactiveName,
          description: 'Inactive product',
          details: '<p>Inactive product details</p>',
          price: 10,
          code: inactiveCode,
          isActive: false,
          isPromo: false,
        }),
      ]);

      const result = await productsService.findAll(
        true,
        undefined,
        activeName,
        undefined,
        1,
        20,
      );

      expect(result.data).toHaveLength(1);

      expect(result.data[0].code).toBe(activeCode);

      expect(result.data[0].isActive).toBe(true);

      expect(result.data.some((product) => product.code === inactiveCode)).toBe(
        false,
      );
    });

    it('should filter products by promo status', async () => {
      const timestamp = Date.now();

      const promoCode = `PROMO-${timestamp}`;
      const regularCode = `REGULAR-${timestamp}`;

      await productsRepository.save([
        productsRepository.create({
          name: `Promo ${timestamp}`,
          description: 'Promo product',
          details: '<p>Promo product details</p>',
          price: 10,
          code: promoCode,
          isActive: true,
          isPromo: true,
        }),

        productsRepository.create({
          name: `Regular ${timestamp}`,
          description: 'Regular product',
          details: '<p>Regular product details</p>',
          price: 10,
          code: regularCode,
          isActive: true,
          isPromo: false,
        }),
      ]);

      const result = await productsService.findAll(
        undefined,
        true,
        undefined,
        undefined,
        1,
        100,
      );

      expect(result.data.some((product) => product.code === promoCode)).toBe(
        true,
      );

      expect(result.data.some((product) => product.code === regularCode)).toBe(
        false,
      );
    });

    it('should filter products by phrase', async () => {
      const timestamp = Date.now();

      const matchingCode = `PHRASE-${timestamp}`;
      const otherCode = `OTHER-${timestamp}`;

      await productsRepository.save([
        productsRepository.create({
          name: `Gaming Laptop ${timestamp}`,
          description: 'Gaming laptop',
          details: '<p>Gaming laptop details</p>',
          price: 100,
          code: matchingCode,
          isActive: true,
          isPromo: false,
        }),

        productsRepository.create({
          name: `Office Monitor ${timestamp}`,
          description: 'Office monitor',
          details: '<p>Office monitor details</p>',
          price: 100,
          code: otherCode,
          isActive: true,
          isPromo: false,
        }),
      ]);

      const result = await productsService.findAll(
        undefined,
        undefined,
        'Gaming Laptop',
        undefined,
        1,
        100,
      );

      expect(result.data.some((product) => product.code === matchingCode)).toBe(
        true,
      );

      expect(result.data.some((product) => product.code === otherCode)).toBe(
        false,
      );
    });
  });

  describe('product images', () => {
    it('should create product image and persist it', async () => {
      const timestamp = Date.now();

      const product = await productsRepository.save(
        productsRepository.create({
          name: `Image product ${timestamp}`,
          description: 'Image test product',
          details: '<p>Image test product details</p>',
          price: 19.99,
          code: `IMG-${timestamp}`,
          isActive: true,
          isPromo: false,
        }),
      );

      const image = await productImagesService.createProductImage({
        productId: product.id,
        path: 'uploads/products/integration.jpg',
      });

      expect(image).toBeDefined();
      expect(image.id).toBeDefined();
      expect(image.path).toBe('uploads/products/integration.jpg');

      const savedImage = await productImagesRepository.findOne({
        where: {
          id: image.id,
        },
      });

      expect(savedImage).toBeDefined();
      expect(savedImage?.path).toBe('uploads/products/integration.jpg');
    });

    it('should remove product images when product is deleted', async () => {
      const timestamp = Date.now();

      const product = await productsRepository.save(
        productsRepository.create({
          name: `Cascade product ${timestamp}`,
          description: 'Cascade test product',
          details: '<p>Cascade test product details</p>',
          price: 20,
          code: `CASCADE-${timestamp}`,
          isActive: true,
          isPromo: false,
        }),
      );

      const image = await productImagesService.createProductImage({
        productId: product.id,
        path: 'uploads/products/cascade.jpg',
      });

      image.product = product;

      await image.save();

      await productsService.remove(product.id);

      const savedImage = await productImagesRepository.findOne({
        where: {
          id: image.id,
        },
      });

      expect(savedImage).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove product from database', async () => {
      const timestamp = Date.now();

      const product = await productsRepository.save(
        productsRepository.create({
          name: `Remove product ${timestamp}`,
          description: 'Remove test product',
          details: '<p>Remove test product details</p>',
          price: 10,
          code: `REMOVE-${timestamp}`,
          isActive: true,
          isPromo: false,
        }),
      );

      await productsService.remove(product.id);

      const result = await productsRepository.findOne({
        where: {
          id: product.id,
        },
      });

      expect(result).toBeNull();
    });
  });
});
