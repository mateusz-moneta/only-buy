import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Ratings', () => {
  let app: INestApplication;
  let accessToken: string;
  let secondAccessToken: string;
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

    const username = `rating_user_${Date.now()}`;
    const email = `${username}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username,
        email,
        password: 'TestPassword123!',
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username,
        password: 'TestPassword123!',
      })
      .expect(200);

    accessToken = loginResponse.body.accessToken;

    const secondUsername = `rating_second_user_${Date.now()}`;
    const secondEmail = `${secondUsername}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: secondUsername,
        email: secondEmail,
        password: 'TestPassword123!',
      })
      .expect(201);

    const secondLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: secondUsername,
        password: 'TestPassword123!',
      })
      .expect(200);

    secondAccessToken = secondLoginResponse.body.accessToken;

    const productsResponse = await request(app.getHttpServer())
      .get('/products')
      .query({
        page: 1,
        limit: 20,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(productsResponse.body.data.length).toBeGreaterThan(0);

    productId = productsResponse.body.data[0].id;

    expect(productId).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('TS-17 - should create product rating', async () => {
    const response = await request(app.getHttpServer())
      .post('/products/rate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        productId,
        rating: 5,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        rating: 5,
        averageRating: expect.any(Number),
      }),
    );

    expect(response.body.averageRating).toBeGreaterThanOrEqual(1);
    expect(response.body.averageRating).toBeLessThanOrEqual(5);
  });

  it('TS-18 - should update product average rating', async () => {
    const response = await request(app.getHttpServer())
      .post('/products/rate')
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        productId,
        rating: 3,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        rating: 3,
        averageRating: expect.any(Number),
      }),
    );

    expect(response.body.averageRating).toBeGreaterThanOrEqual(1);
    expect(response.body.averageRating).toBeLessThanOrEqual(5);
  });

  it('TS-19 - should update existing product rating', async () => {
    const response = await request(app.getHttpServer())
      .patch('/products/rate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        productId,
        rating: 4,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        rating: 4,
        averageRating: expect.any(Number),
      }),
    );

    expect(response.body.averageRating).toBeGreaterThanOrEqual(1);
    expect(response.body.averageRating).toBeLessThanOrEqual(5);
  });

  it('TS-20 - should reject duplicate product rating', async () => {
    const response = await request(app.getHttpServer())
      .post('/products/rate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        productId,
        rating: 2,
      });

    expect([400, 409]).toContain(response.status);
  });
});
