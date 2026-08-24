import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from '../../dto';
import { UserEntity } from '../../entities';
import { RolesService } from '../../../roles/services';
import { UploadService } from '../../../uploads/services';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe(UsersService.name, () => {
  let service: UsersService;

  const configService = {
    get: jest.fn(),
  };

  const usersRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const rolesService = {
    findOneByName: jest.fn(),
  };

  const uploadService = {
    saveFile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    configService.get.mockImplementation(
      (key: string, defaultValue?: number) => {
        if (key === 'DEFAULT_LIMIT') {
          return 20;
        }

        if (key === 'MAX_LIMIT') {
          return 100;
        }

        return defaultValue;
      },
    );

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    service = new UsersService(
      configService as unknown as ConfigService,
      rolesService as unknown as RolesService,
      uploadService as unknown as UploadService,
      usersRepository as unknown as Repository<UserEntity>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 'user-1',
          username: 'john',
          email: 'john@example.com',
          active: true,
          avatar: null,
          role: {
            name: 'STANDARD',
          },
        },
        {
          id: 'user-2',
          username: 'admin',
          email: 'admin@example.com',
          active: true,
          avatar: '/avatars/admin.png',
          role: {
            name: 'ADMIN',
          },
        },
      ];

      const query = createQueryBuilder();

      query.getManyAndCount.mockResolvedValue([users, users.length]);

      const result = await service.findAll(1, 20);

      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');

      expect(query.leftJoinAndSelect).toHaveBeenCalledWith('user.role', 'role');

      expect(query.select).toHaveBeenCalledWith([
        'user.active',
        'user.avatar',
        'user.id',
        'user.username',
        'user.email',
        'user.createdDate',
        'user.updatedDate',
        'role.name',
      ]);

      expect(query.skip).toHaveBeenCalledWith(0);
      expect(query.take).toHaveBeenCalledWith(20);
      expect(query.getManyAndCount).toHaveBeenCalledTimes(1);

      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);

      expect(result.data).toEqual([
        expect.objectContaining({
          id: 'user-1',
          username: 'john',
          email: 'john@example.com',
          active: true,
          avatar: null,
          role: 'STANDARD',
        }),
        expect.objectContaining({
          id: 'user-2',
          username: 'admin',
          email: 'admin@example.com',
          active: true,
          avatar: '/avatars/admin.png',
          role: 'ADMIN',
        }),
      ]);
    });

    it('should return empty array when there are no users', async () => {
      const query = createQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll(1, 20);

      expect(query.skip).toHaveBeenCalledWith(0);
      expect(query.take).toHaveBeenCalledWith(20);
      expect(query.getManyAndCount).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });
    });

    it('should calculate pagination offset', async () => {
      const users = [
        {
          id: 'user-11',
          username: 'user11',
          email: 'user11@example.com',
          active: true,
          avatar: null,
          role: {
            name: 'STANDARD',
          },
        },
      ];

      const query = createQueryBuilder();

      query.getManyAndCount.mockResolvedValue([users, 21]);

      const result = await service.findAll(2, 10);

      expect(query.skip).toHaveBeenCalledWith(10);
      expect(query.take).toHaveBeenCalledWith(10);

      expect(result.total).toBe(21);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);

      expect(result.data).toEqual([
        expect.objectContaining({
          id: 'user-11',
          username: 'user11',
          email: 'user11@example.com',
          active: true,
          avatar: null,
          role: 'STANDARD',
        }),
      ]);
    });
  });

  describe('findOneById', () => {
    it('should return user by id', async () => {
      const user = createUserEntity({
        id: 'user-id',
        username: 'john',
      });

      const query = createQueryBuilder();

      query.getOne.mockResolvedValue(user);

      const result = await service.findOneById('user-id');

      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');

      expect(query.leftJoinAndSelect).toHaveBeenCalledWith('user.role', 'role');

      expect(query.where).toHaveBeenCalledWith({
        id: 'user-id',
      });

      expect(query.getOne).toHaveBeenCalledTimes(1);

      expect(result).toBe(user);
    });

    it('should return null when user does not exist', async () => {
      const query = createQueryBuilder();

      query.getOne.mockResolvedValue(null);

      const result = await service.findOneById('unknown-id');

      expect(result).toBeNull();
    });
  });

  describe('findOneByUsername', () => {
    it('should return user by username', async () => {
      const user = createUserEntity({
        username: 'john',
      });

      const query = createQueryBuilder();

      query.getOne.mockResolvedValue(user);

      const result = await service.findOneByUsername('john');

      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');

      expect(query.leftJoinAndSelect).toHaveBeenCalledWith('user.role', 'role');

      expect(query.where).toHaveBeenCalledWith({
        username: 'john',
      });

      expect(query.getOne).toHaveBeenCalledTimes(1);

      expect(result).toBe(user);
    });

    it('should return null when username does not exist', async () => {
      const query = createQueryBuilder();

      query.getOne.mockResolvedValue(null);

      const result = await service.findOneByUsername('unknown');

      expect(result).toBeNull();
    });
  });

  describe('updateActive', () => {
    it('should update user active status', async () => {
      const user = {
        id: 'user-id',
        username: 'john',
        email: 'john@example.com',
        active: false,
        avatar: null,
        role: 'STANDARD',
      };

      const query = createQueryBuilder();

      usersRepository.update.mockResolvedValue({
        affected: 1,
      });

      query.getRawOne.mockResolvedValue(user);

      const result = await service.updateActive('user-id', false);

      expect(usersRepository.update).toHaveBeenCalledWith('user-id', {
        active: false,
      });

      expect(query.leftJoin).toHaveBeenCalledWith('user.role', 'role');

      expect(query.select).toHaveBeenCalledWith([
        'user.active AS active',
        'user.avatar AS avatar',
        'user.id AS id',
        'user.username AS username',
        'user.email AS email',
        'user.createdDate AS "createdDate"',
        'user.updatedDate AS "updatedDate"',
        'role.name AS role',
      ]);

      expect(query.where).toHaveBeenCalledWith('user.id = :id', {
        id: 'user-id',
      });

      expect(query.getRawOne).toHaveBeenCalledTimes(1);

      expect(result).toBe(user);
    });

    it('should activate user', async () => {
      const user = {
        id: 'user-id',
        username: 'john',
        active: true,
      };

      const query = createQueryBuilder();

      usersRepository.update.mockResolvedValue({
        affected: 1,
      });

      query.getRawOne.mockResolvedValue(user);

      const result = await service.updateActive('user-id', true);

      expect(usersRepository.update).toHaveBeenCalledWith('user-id', {
        active: true,
      });

      expect(result).toBe(user);
    });
  });

  describe('register', () => {
    const registerUserDto: RegisterUserDto = {
      username: 'john',
      email: 'john@example.com',
      password: 'password123',
    };

    const role = {
      id: 'role-id',
      name: 'STANDARD',
    } as any;

    it('should throw ConflictException when user already exists', async () => {
      const existingUser = createUserEntity({
        username: 'john',
        email: 'john@example.com',
      });

      usersRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.register(registerUserDto)).rejects.toThrow(
        new ConflictException(),
      );

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            username: 'john',
          },
          {
            email: 'john@example.com',
          },
        ],
      });

      expect(rolesService.findOneByName).not.toHaveBeenCalled();

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when STANDARD role does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(null);

      await expect(service.register(registerUserDto)).rejects.toThrow(
        new InternalServerErrorException('Standard role is not configured'),
      );

      expect(rolesService.findOneByName).toHaveBeenCalledWith('STANDARD');

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should register user without avatar', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const { getSavedUser } = mockUserSave();

      const result = await service.register(registerUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      expect(uploadService.saveFile).not.toHaveBeenCalled();

      expect(getSavedUser()).toBeDefined();

      expect(result).toEqual({
        email: 'john@example.com',
        username: 'john',
      });
    });

    it('should register user with avatar', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const avatar = {
        originalname: 'avatar.png',
        mimetype: 'image/png',
        buffer: Buffer.from('image'),
      } as Express.Multer.File;

      uploadService.saveFile.mockReturnValue('uploads/avatars/avatar.png');

      const { getSavedUser } = mockUserSave();

      const result = await service.register(registerUserDto, avatar);

      expect(uploadService.saveFile).toHaveBeenCalledTimes(1);

      expect(uploadService.saveFile).toHaveBeenCalledWith(avatar, 'avatars');

      expect(getSavedUser().avatar).toBe('uploads/avatars/avatar.png');

      expect(result).toEqual({
        email: 'john@example.com',
        username: 'john',
      });
    });

    it('should hash password with salt rounds 10', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      mockUserSave();

      await service.register(registerUserDto);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should save hashed password instead of plain password', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const { getSavedUser } = mockUserSave();

      await service.register(registerUserDto);

      expect(getSavedUser().password).toBe('hashed-password');

      expect(getSavedUser().password).not.toBe('password123');
    });

    it('should set refreshToken to null for new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const { getSavedUser } = mockUserSave();

      await service.register(registerUserDto);

      expect(getSavedUser().refreshToken).toBeNull();
    });

    it('should assign STANDARD role to new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const { getSavedUser } = mockUserSave();

      await service.register(registerUserDto);

      expect(getSavedUser().role).toBe(role);
    });

    it('should assign username and email to new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const { getSavedUser } = mockUserSave();

      await service.register(registerUserDto);

      expect(getSavedUser().username).toBe('john');

      expect(getSavedUser().email).toBe('john@example.com');
    });
  });

  describe('remove', () => {
    it('should remove user by id', async () => {
      usersRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await service.remove('123');

      expect(usersRepository.delete).toHaveBeenCalledTimes(1);

      expect(usersRepository.delete).toHaveBeenCalledWith('123');
    });
  });

  function createQueryBuilder() {
    const query = {
      leftJoinAndSelect: jest.fn(),
      leftJoin: jest.fn(),
      select: jest.fn(),
      where: jest.fn(),

      skip: jest.fn(),
      take: jest.fn(),
      getManyAndCount: jest.fn(),

      getOne: jest.fn(),
      getRawOne: jest.fn(),
    };

    query.leftJoinAndSelect.mockReturnValue(query);

    query.leftJoin.mockReturnValue(query);

    query.select.mockReturnValue(query);

    query.where.mockReturnValue(query);

    query.skip.mockReturnValue(query);

    query.take.mockReturnValue(query);

    usersRepository.createQueryBuilder.mockReturnValue(query);

    return query;
  }

  function mockUserSave(): {
    getSavedUser: () => UserEntity;
  } {
    let savedUser: UserEntity | undefined;

    jest.spyOn(UserEntity.prototype, 'save').mockImplementation(function (
      this: UserEntity,
    ) {
      savedUser = this;

      return Promise.resolve(this);
    });

    return {
      getSavedUser: () => {
        if (!savedUser) {
          throw new Error('User was not saved');
        }

        return savedUser;
      },
    };
  }

  function createUserEntity(overrides: Partial<UserEntity> = {}): UserEntity {
    return {
      id: 'user-id',
      username: 'john',
      email: 'john@example.com',
      password: 'hashed-password',
      avatar: null,
      active: true,
      refreshToken: null,
      role: {} as UserEntity['role'],
      ...overrides,
    } as unknown as UserEntity;
  }
});
