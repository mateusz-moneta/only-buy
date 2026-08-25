import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { ProductEntity, ProductImageEntity } from '../entities';
import { ProductImagesService, ProductsService } from '../services';
import { UserEntity } from '../../users';

describe('Products integration', () => {
  let app: INestApplication;

  let productsService: ProductsService;
  let productImagesService: ProductImagesService;

  let productsRepository: Repository<ProductEntity>;
  let productImagesRepository: Repository<ProductImageEntity>;

  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    productsService = moduleFixture.get<ProductsService>(ProductsService);

    productImagesService =
      moduleFixture.get<ProductImagesService>(ProductImagesService);

    productsRepository = moduleFixture.get<Repository<ProductEntity>>(
      'ProductEntityRepository',
    );

    productImagesRepository = moduleFixture.get<Repository<ProductImageEntity>>(
      'ProductImageEntityRepository',
    );

    const dataSource = moduleFixture.get<DataSource>(DataSource);

    const usersRepository = dataSource.getRepository(UserEntity);

    const user = await usersRepository.findOne({
      where: {
        username: 'admin',
      },
    });

    if (!user) {
      throw new Error('Admin user was not found');
    }

    userId = user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('product images', () => {
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

      const image = await productImagesRepository.save(
        productImagesRepository.create({
          path: `uploads/products/cascade-${timestamp}.jpg`,
          product,
        }),
      );

      const savedImageBeforeDelete = await productImagesRepository.findOne({
        where: {
          id: image.id,
        },
      });

      expect(savedImageBeforeDelete).not.toBeNull();

      await productsService.remove(product.id, userId);

      const savedProduct = await productsRepository.findOne({
        where: {
          id: product.id,
        },
      });

      const savedImage = await productImagesRepository.findOne({
        where: {
          id: image.id,
        },
      });

      expect(savedProduct).toBeNull();
      expect(savedImage).toBeNull();
    });
  });
});
