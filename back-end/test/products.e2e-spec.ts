import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

describe('Products', () => {
  let app: INestApplication;
  let accessToken: string;
  let productId: string;

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

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'ADoORmri1997@',
      })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject unauthenticated request', async () => {
    await request(app.getHttpServer()).get('/products').expect(401);
  });

  it('should return products for authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should filter products by active status for authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .query({
        isActive: true,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(
      response.body.every((product: any) => product.isActive === true),
    ).toBe(true);
  });

  it('should filter products by promo status for authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .query({
        isPromo: true,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(
      response.body.every((product: any) => product.isPromo === true),
    ).toBe(true);
  });

  it('should search products by phrase for authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .query({
        phrase: 'Moneta',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a product for authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .post('/products/new')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'Integration Test Product')
      .field('description', 'Product created during integration test')
      .field('code', 'TEST-001')
      .field('price', '100')
      .field('isActive', 'true')
      .field('isPromo', 'false')
      .expect(201);

    productId = response.body.id;

    expect(productId).toEqual(expect.any(String));

    expect(response.body).toEqual(
      expect.objectContaining({
        id: productId,
        name: 'Integration Test Product',
        code: 'TEST-001',
      }),
    );
  });

  it('should return product by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: productId,
        name: 'Integration Test Product',
      }),
    );
  });

  it('should return 404 for non-existing product', async () => {
    await request(app.getHttpServer())
      .get('/products/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should update product', async () => {
    const response = await request(app.getHttpServer())
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'Updated Integration Product')
      .field('description', 'Updated description')
      .field('code', 'TEST-002')
      .field('price', '250')
      .field('isActive', 'true')
      .field('isPromo', 'true')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: productId,
        name: 'Updated Integration Product',
        description: 'Updated description',
        code: 'TEST-002',
        isPromo: true,
      }),
    );
  });

  it('should persist updated product', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.name).toBe('Updated Integration Product');
    expect(response.body.description).toBe('Updated description');
    expect(response.body.code).toBe('TEST-002');
    expect(response.body.price).toBe('250.00');
    expect(response.body.isPromo).toBe(true);
  });
});
