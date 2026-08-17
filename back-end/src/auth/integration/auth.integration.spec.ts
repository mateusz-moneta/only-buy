import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../services';
import { RefreshTokenService, UsersService } from '../../users/services';
import { RolesService } from '../../roles/services';
import { RefreshTokenEntity, UserEntity } from '../../users/entities';
import { RoleEntity } from '../../roles/entities';
import { UploadService } from '../../uploads/services';
import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from '../../products/entities';

describe('Auth integration', () => {
  let module: TestingModule;

  let authService: AuthService;
  let usersService: UsersService;
  let refreshTokenService: RefreshTokenService;

  let userRepository: Repository<UserEntity>;
  let refreshTokenRepository: Repository<RefreshTokenEntity>;
  let roleRepository: Repository<RoleEntity>;

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
          ProductImageEntity,
          ProductEntity,
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
        AuthService,
        RefreshTokenService,
        RolesService,
        UsersService,
        {
          provide: UploadService,
          useValue: {
            saveFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    refreshTokenService = module.get(RefreshTokenService);

    userRepository = module.get(getRepositoryToken(UserEntity));

    refreshTokenRepository = module.get(getRepositoryToken(RefreshTokenEntity));

    roleRepository = module.get(getRepositoryToken(RoleEntity));

    await createStandardRole();
  });

  afterAll(async () => {
    await module.close();
  });

  async function createStandardRole(): Promise<void> {
    const existingRole = await roleRepository.findOne({
      where: {
        name: 'STANDARD',
      },
    });

    if (!existingRole) {
      await roleRepository.save(
        roleRepository.create({
          name: 'STANDARD',
        }),
      );
    }
  }

  describe('login', () => {
    it('should authenticate registered user and persist refresh token', async () => {
      const username = `integration-${Date.now()}`;
      const email = `${username}@test.pl`;
      const password = 'Password123!';

      await usersService.register({
        username,
        email,
        password,
      });

      const result = await authService.login({
        username,
        password,
      });

      expect(result).toEqual(
        expect.objectContaining({
          username,
          role: 'STANDARD',
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );

      const storedRefreshToken =
        await refreshTokenService.findRefreshTokenByToken(result.refreshToken);

      expect(storedRefreshToken).toBeDefined();
      expect(storedRefreshToken?.token).toBe(result.refreshToken);
      expect(storedRefreshToken?.user.username).toBe(username);
    });

    it('should reject invalid password', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      await expect(
        authService.login({
          username,
          password: 'WrongPassword123!',
        }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should reject inactive user', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const user = await usersService.findOneByUsername(username);

      expect(user).toBeDefined();

      await usersService.updateActive(user!.id, false);

      await expect(
        authService.login({
          username,
          password: 'Password123!',
        }),
      ).rejects.toThrow('Account is inactive');
    });
  });

  describe('refresh token', () => {
    it('should return user data from persisted refresh token', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const login = await authService.login({
        username,
        password: 'Password123!',
      });

      const result = await authService.getUserDataFromRefreshToken(
        login.refreshToken,
      );

      expect(result).toEqual({
        avatar: null,
        username,
        role: 'STANDARD',
        accessToken: expect.any(String),
      });
    });

    it('should return false for invalid refresh token', async () => {
      const result = await authService.validateRefreshToken(
        'invalid-refresh-token',
      );

      expect(result).toBe(false);
    });

    it('should return true for valid persisted refresh token', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const login = await authService.login({
        username,
        password: 'Password123!',
      });

      const result = await authService.validateRefreshToken(login.refreshToken);

      expect(result).toBe(true);
    });
  });

  describe('user and database integration', () => {
    it('should persist user with STANDARD role and hashed password', async () => {
      const username = `integration-${Date.now()}`;
      const password = 'Password123!';

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password,
      });

      const user = await usersService.findOneByUsername(username);

      expect(user).toBeDefined();
      expect(user?.username).toBe(username);
      expect(user?.email).toBe(`${username}@test.pl`);
      expect(user?.role.name).toBe('STANDARD');

      expect(user?.password).toBeDefined();
      expect(user?.password).not.toBe(password);
    });
  });
});
