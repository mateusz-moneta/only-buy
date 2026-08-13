import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

describe('Users', () => {
  let app: INestApplication;
  let adminAccessToken: string;
  let userAccessToken: string;
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

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'ADoORmri1997@',
      })
      .expect(200);

    adminAccessToken = adminLogin.body.accessToken;

    const username = `integration_user_${Date.now()}`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username,
        email: `${username}@example.com`,
        password: 'TestPassword123!',
      })
      .expect(201);

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username,
        password: 'TestPassword123!',
      })
      .expect(200);

    userAccessToken = userLogin.body.accessToken;

    const usersResponse = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    const createdUser = usersResponse.body.find(
      (user: any) => user.username === username,
    );

    expect(createdUser).toBeDefined();

    userId = createdUser.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('TS-27 - should return list of users for administrator', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          active: expect.any(Boolean),
        }),
      ]),
    );
  });

  it('TS-28 - should deactivate standard user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        active: false,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: userId,
        active: false,
      }),
    );
  });

  it('TS-29 - should activate standard user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        active: true,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: userId,
        active: true,
      }),
    );
  });

  it('TS-30 - should reject administrative operation for standard user', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(403);
  });

  it('should reject user update for standard user', async () => {
    await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        active: false,
      })
      .expect(403);
  });
});
