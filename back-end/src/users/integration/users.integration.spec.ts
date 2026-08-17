import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersService } from '../services';
import { RolesService } from '../../roles/services';
import { UploadService } from '../../uploads/services';
import { RefreshTokenEntity, UserEntity } from '../entities';
import { RoleEntity } from '../../roles/entities';
import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from '../../products/entities';

describe('Users integration', () => {
  let module: TestingModule;

  let usersService: UsersService;
  let rolesService: RolesService;

  let usersRepository: Repository<UserEntity>;
  let rolesRepository: Repository<RoleEntity>;

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
      ],
      providers: [
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

    usersService = module.get(UsersService);
    rolesService = module.get(RolesService);

    usersRepository = module.get(getRepositoryToken(UserEntity));

    rolesRepository = module.get(getRepositoryToken(RoleEntity));

    await createStandardRole();
  }, 30000);

  afterAll(async () => {
    await module.close();
  }, 30000);

  async function createStandardRole(): Promise<RoleEntity> {
    const existingRole = await rolesService.findOneByName('STANDARD');

    if (existingRole) {
      return existingRole;
    }

    return rolesRepository.save(
      rolesRepository.create({
        name: 'STANDARD',
      }),
    );
  }

  describe('findAll', () => {
    it('should return users from database', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const result = await usersService.findAll();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username,
            email: `${username}@test.pl`,
            role: 'STANDARD',
          }),
        ]),
      );
    });
  });

  describe('findOneById', () => {
    it('should return user by id', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const createdUser = await usersService.findOneByUsername(username);

      expect(createdUser).toBeDefined();

      const result = await usersService.findOneById(createdUser!.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(createdUser!.id);
      expect(result?.username).toBe(username);
      expect(result?.email).toBe(`${username}@test.pl`);
      expect(result?.role.name).toBe('STANDARD');
    });

    it('should return null when user does not exist', async () => {
      const result = await usersService.findOneById(
        '00000000-0000-0000-0000-000000000000',
      );

      expect(result).toBeNull();
    });
  });

  describe('findOneByUsername', () => {
    it('should return user by username', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const result = await usersService.findOneByUsername(username);

      expect(result).toBeDefined();
      expect(result?.username).toBe(username);
      expect(result?.email).toBe(`${username}@test.pl`);
      expect(result?.role.name).toBe('STANDARD');
    });

    it('should return null when username does not exist', async () => {
      const result = await usersService.findOneByUsername(
        'user-that-does-not-exist',
      );

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should register user and persist it in database', async () => {
      const username = `integration-${Date.now()}`;
      const email = `${username}@test.pl`;
      const password = 'Password123!';

      const result = await usersService.register({
        username,
        email,
        password,
      });

      expect(result).toEqual({
        username,
        email,
      });

      const user = await usersService.findOneByUsername(username);

      expect(user).toBeDefined();
      expect(user?.username).toBe(username);
      expect(user?.email).toBe(email);
      expect(user?.role.name).toBe('STANDARD');
      expect(user?.refreshToken).toBeUndefined();

      expect(user?.password).toBeDefined();
      expect(user?.password).not.toBe(password);
    });

    it('should reject duplicate username', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      await expect(
        usersService.register({
          username,
          email: `different-${username}@test.pl`,
          password: 'Password123!',
        }),
      ).rejects.toThrow();
    });

    it('should reject duplicate email', async () => {
      const username = `integration-${Date.now()}`;
      const email = `${username}@test.pl`;

      await usersService.register({
        username,
        email,
        password: 'Password123!',
      });

      await expect(
        usersService.register({
          username: `different-${username}`,
          email,
          password: 'Password123!',
        }),
      ).rejects.toThrow();
    });
  });

  describe('updateActive', () => {
    it('should update user active state in database', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const user = await usersService.findOneByUsername(username);

      expect(user).toBeDefined();

      const result = await usersService.updateActive(user!.id, false);

      expect(result).toBeDefined();
      expect(result.username).toBe(username);
      expect(result.active).toBe(false);

      const updatedUser = await usersService.findOneByUsername(username);

      expect(updatedUser?.active).toBe(false);
    });

    it('should activate inactive user', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const user = await usersService.findOneByUsername(username);

      expect(user).toBeDefined();

      await usersService.updateActive(user!.id, false);

      const result = await usersService.updateActive(user!.id, true);

      expect(result.active).toBe(true);

      const updatedUser = await usersService.findOneByUsername(username);

      expect(updatedUser?.active).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove user from database', async () => {
      const username = `integration-${Date.now()}`;

      await usersService.register({
        username,
        email: `${username}@test.pl`,
        password: 'Password123!',
      });

      const user = await usersService.findOneByUsername(username);

      expect(user).toBeDefined();

      await usersService.remove(user.id);

      const result = await usersService.findOneByUsername(username);

      expect(result).toBeNull();
    });
  });
});
