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

    productsRepository = module.get(getRepositoryToken(ProductEntity));

    productImagesRepository = module.get(
      getRepositoryToken(ProductImageEntity),
    );
  }, 30000);

  afterAll(async () => {
    await module.close();
  });

  describe('createProduct', () => {
    it('should create product and persist it in database', async () => {
      const dto = {
        name: `Integration product ${Date.now()}`,
        description: 'Integration test product',
        price: '99.99',
        code: `INT-${Date.now()}`,
        isActive: 'true',
        isPromo: 'false',
      };

      const result = await productsService.createProduct(dto, []);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(dto.name);
      expect(result.description).toBe(dto.description);
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
      expect(savedProduct?.price).toBe('99.99');
    });
  });

  describe('findOneById', () => {
    it('should return persisted product with images', async () => {
      const product = await productsRepository.save(
        productsRepository.create({
          name: `Find product ${Date.now()}`,
          description: 'Find test product',
          price: 49.99,
          code: `FIND-${Date.now()}`,
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
    it('should return products persisted in database', async () => {
      const code = `ALL-${Date.now()}`;

      await productsRepository.save(
        productsRepository.create({
          name: `List product ${Date.now()}`,
          description: 'List test product',
          price: 29.99,
          code,
          isActive: true,
          isPromo: false,
        }),
      );

      const result = await productsService.findAll();

      expect(result.length).toBeGreaterThan(0);

      expect(result.some((product) => product.code === code)).toBe(true);
    });
  });

  describe('product images', () => {
    it('should create product image and persist it', async () => {
      const product = await productsRepository.save(
        productsRepository.create({
          name: `Image product ${Date.now()}`,
          description: 'Image test product',
          price: 19.99,
          code: `IMG-${Date.now()}`,
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
  });

  describe('remove', () => {
    it('should remove product from database', async () => {
      const product = await productsRepository.save(
        productsRepository.create({
          name: `Remove product ${Date.now()}`,
          description: 'Remove test product',
          price: 10,
          code: `REMOVE-${Date.now()}`,
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
