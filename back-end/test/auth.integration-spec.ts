import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

describe('Auth integration', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('TS-01 - should register user with valid data', async () => {
    const username = `integration_${Date.now()}`;
    const email = `${username}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username,
        email,
        password: 'TestPassword123!',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        username,
        email,
      }),
    );
  });

  it('TS-02 - should reject registration with invalid email', async () => {
    const username = `integration_username_${Date.now()}`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username,
        email: 'invalid-email',
        password: 'TestPassword123!',
      })
      .expect(400);
  });

  it('TS-04 - should register user with avatar', async () => {
    const username = `integration_avatar_${Date.now()}`;
    const email = `${username}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .field('username', username)
      .field('email', email)
      .field('password', 'TestPassword123!')
      .attach('avatar', 'test/fixtures/placeholder.png')
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        username,
        email,
      }),
    );
  });

  it('TS-05 - should reject registration with invalid file', async () => {
    const username = `integration_file_${Date.now()}`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .field('username', username)
      .field('email', `${username}@example.com`)
      .field('password', 'TestPassword123!')
      .field('confirmPassword', 'TestPassword123!')
      .attach('avatar', 'test/fixtures/invalid.txt')
      .expect(400);
  });

  it('TS-06 - should authenticate user with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'ADoORmri1997@',
      })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
  });

  it('TS-07 - should reject invalid login credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'wrong-password',
      })
      .expect(401);
  });

  it('TS-08 - should reject login of inactive user', async () => {
    const username = `inactive_${Date.now()}`;
    const email = `${username}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username,
        email,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
      })
      .expect(201);

    /*
     * Ten test wymaga ustawienia użytkownika jako nieaktywnego.
     * Jeżeli zrobimy to przez endpoint administratora,
     * należy tutaj pobrać ID użytkownika i wykonać PATCH /users/:id.
     */
  });

  it('TS-09 - should return new access token using refresh token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'ADoORmri1997@',
      })
      .expect(200);

    const refreshToken = loginResponse.body.refreshToken;

    expect(refreshToken).toEqual(expect.any(String));

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken,
      })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
  });

  it('TS-10 - should reject invalid refresh token', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: 'invalid-refresh-token',
      })
      .expect(401);
  });
});
