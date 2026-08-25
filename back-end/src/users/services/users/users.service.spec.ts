import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from '../../dto';
import { UserEntity } from '../../entities';
import { RolesService } from '../../../roles';
import { RoleEntity } from '../../../roles/entities';
import { UploadService } from '../../../uploads';
import {
  AuditAction,
  AuditEntity,
  AuditLogsService,
} from '../../../audit-logs';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe(UsersService.name, () => {
  let service: UsersService;

  const configService = {
    get: jest.fn(),
  };

  const auditLogsService = {
    create: jest.fn(),
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

        if (key === 'BCRYPT_SALT_ROUNDS') {
          return 10;
        }

        return defaultValue;
      },
    );

    (bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>).mockResolvedValue(
      'hashed-password' as never,
    );

    service = new UsersService(
      auditLogsService as unknown as AuditLogsService,
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
        createUserEntity({
          id: 'user-1',
          username: 'john',
          email: 'john@example.com',
          active: true,
          avatar: null,
          role: createRoleEntity({
            name: 'STANDARD',
          }),
        }),
        createUserEntity({
          id: 'user-2',
          username: 'admin',
          email: 'admin@example.com',
          active: true,
          avatar: '/avatars/admin.png',
          role: createRoleEntity({
            name: 'ADMIN',
          }),
        }),
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

      expect(result).toEqual({
        data: [
          {
            id: 'user-1',
            active: true,
            avatar: null,
            username: 'john',
            email: 'john@example.com',
            role: 'STANDARD',
            createdDate: users[0].createdDate,
            updatedDate: users[0].updatedDate,
          },
          {
            id: 'user-2',
            active: true,
            avatar: '/avatars/admin.png',
            username: 'admin',
            email: 'admin@example.com',
            role: 'ADMIN',
            createdDate: users[1].createdDate,
            updatedDate: users[1].updatedDate,
          },
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should return empty array when there are no users', async () => {
      const query = createQueryBuilder();

      query.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll(1, 20);

      expect(query.skip).toHaveBeenCalledWith(0);
      expect(query.take).toHaveBeenCalledWith(20);

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
        createUserEntity({
          id: 'user-11',
          username: 'user11',
          email: 'user11@example.com',
        }),
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

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: 'user-11',
          username: 'user11',
          email: 'user11@example.com',
          active: true,
          role: 'STANDARD',
        }),
      );
    });

    it('should filter users by username', async () => {
      const users = [
        createUserEntity({
          id: 'user-1',
          username: 'john',
          email: 'john@example.com',
        }),
      ];

      const query = createQueryBuilder();

      query.getManyAndCount.mockResolvedValue([users, 1]);

      const result = await service.findAll(1, 20, 'john');

      expect(query.andWhere).toHaveBeenCalledWith(
        'user.username ILIKE :username',
        {
          username: '%john%',
        },
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].username).toBe('john');
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
    it('should deactivate user and create audit log', async () => {
      const user = createUserEntity({
        id: 'user-id',
        username: 'john',
        active: true,
      });

      usersRepository.findOne.mockResolvedValue(user);

      usersRepository.update.mockResolvedValue({
        affected: 1,
      });

      const query = createQueryBuilder();

      const updatedUser = {
        id: 'user-id',
        username: 'john',
        email: 'john@example.com',
        active: false,
        avatar: null,
        role: 'STANDARD',
      };

      query.getRawOne.mockResolvedValue(updatedUser);

      const changedBy = 'admin-id';

      const result = await service.updateActive('user-id', false, changedBy);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
      });

      expect(usersRepository.update).toHaveBeenCalledWith('user-id', {
        active: false,
      });

      expect(auditLogsService.create).toHaveBeenCalledTimes(1);

      expect(auditLogsService.create).toHaveBeenCalledWith({
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: changedBy,
        oldValue: {
          active: true,
        },
        newValue: {
          active: false,
        },
      });

      expect(result).toBe(updatedUser);
    });

    it('should activate user and create audit log', async () => {
      const user = createUserEntity({
        id: 'user-id',
        username: 'john',
        active: false,
      });

      usersRepository.findOne.mockResolvedValue(user);

      usersRepository.update.mockResolvedValue({
        affected: 1,
      });

      const query = createQueryBuilder();

      const updatedUser = {
        id: 'user-id',
        username: 'john',
        email: 'john@example.com',
        active: true,
        avatar: null,
        role: 'STANDARD',
      };

      query.getRawOne.mockResolvedValue(updatedUser);

      const changedBy = 'admin-id';

      const result = await service.updateActive('user-id', true, changedBy);

      expect(usersRepository.update).toHaveBeenCalledWith('user-id', {
        active: true,
      });

      expect(auditLogsService.create).toHaveBeenCalledWith({
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: changedBy,
        oldValue: {
          active: false,
        },
        newValue: {
          active: true,
        },
      });

      expect(result).toBe(updatedUser);
    });

    it('should not create audit log when active status does not change', async () => {
      const user = createUserEntity({
        id: 'user-id',
        active: true,
      });

      usersRepository.findOne.mockResolvedValue(user);

      usersRepository.update.mockResolvedValue({
        affected: 1,
      });

      const query = createQueryBuilder();

      query.getRawOne.mockResolvedValue({
        id: 'user-id',
        active: true,
      });

      await service.updateActive('user-id', true, 'admin-id');

      expect(usersRepository.update).toHaveBeenCalledWith('user-id', {
        active: true,
      });

      expect(auditLogsService.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateActive('unknown-id', true, 'admin-id'),
      ).rejects.toThrow(new NotFoundException('User not found'));

      expect(usersRepository.update).not.toHaveBeenCalled();

      expect(auditLogsService.create).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerUserDto: RegisterUserDto = {
      username: 'john',
      email: 'john@example.com',
      password: 'password123',
    };

    const role = createRoleEntity();

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

      const savedUser = mockUserSave();

      const result = await service.register(registerUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      expect(uploadService.saveFile).not.toHaveBeenCalled();

      expect(savedUser().password).toBe('hashed-password');

      expect(savedUser().avatar).toBeNull();

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

      const savedUser = mockUserSave();

      const result = await service.register(registerUserDto, avatar);

      expect(uploadService.saveFile).toHaveBeenCalledTimes(1);

      expect(uploadService.saveFile).toHaveBeenCalledWith(avatar, 'avatars');

      expect(savedUser().avatar).toBe('uploads/avatars/avatar.png');

      expect(result).toEqual({
        email: 'john@example.com',
        username: 'john',
      });
    });

    it('should hash password with configured salt rounds', async () => {
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

      const savedUser = mockUserSave();

      await service.register(registerUserDto);

      expect(savedUser().password).toBe('hashed-password');

      expect(savedUser().password).not.toBe('password123');
    });

    it('should set refreshToken to null for new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const savedUser = mockUserSave();

      await service.register(registerUserDto);

      expect(savedUser().refreshToken).toBeNull();
    });

    it('should assign STANDARD role to new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const savedUser = mockUserSave();

      await service.register(registerUserDto);

      expect(savedUser().role).toBe(role);
    });

    it('should assign username and email to new user', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      rolesService.findOneByName.mockResolvedValue(role);

      const savedUser = mockUserSave();

      await service.register(registerUserDto);

      expect(savedUser().username).toBe('john');
      expect(savedUser().email).toBe('john@example.com');
    });
  });

  describe('remove', () => {
    it('should remove user and create audit log', async () => {
      const user = createUserEntity({
        id: 'user-id',
        username: 'john',
        email: 'john@example.com',
        active: true,
        avatar: null,
        role: createRoleEntity({
          name: 'STANDARD',
        }),
      });

      usersRepository.findOne.mockResolvedValue(user);

      usersRepository.delete.mockResolvedValue({
        affected: 1,
      });

      const changedBy = 'admin-id';

      await service.remove('user-id', changedBy);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'user-id',
        },
        relations: {
          role: true,
        },
      });

      expect(auditLogsService.create).toHaveBeenCalledTimes(1);

      expect(auditLogsService.create).toHaveBeenCalledWith({
        action: AuditAction.DELETE,
        entity: AuditEntity.USER,
        entityId: 'user-id',
        userId: changedBy,
        oldValue: {
          id: user.id,
          username: user.username,
          email: user.email,
          active: user.active,
          avatar: user.avatar,
          role: user.role?.name ?? null,
        },
        newValue: null,
      });

      expect(usersRepository.delete).toHaveBeenCalledTimes(1);

      expect(usersRepository.delete).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('unknown-id', 'admin-id')).rejects.toThrow(
        new NotFoundException('User not found'),
      );

      expect(auditLogsService.create).not.toHaveBeenCalled();

      expect(usersRepository.delete).not.toHaveBeenCalled();
    });
  });

  function createQueryBuilder() {
    const query = {
      leftJoinAndSelect: jest.fn(),
      leftJoin: jest.fn(),
      select: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
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
    query.andWhere.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.take.mockReturnValue(query);

    usersRepository.createQueryBuilder.mockReturnValue(query);

    return query;
  }

  function mockUserSave(): () => UserEntity {
    let savedUser: UserEntity | undefined;

    jest.spyOn(UserEntity.prototype, 'save').mockImplementation(function (
      this: UserEntity,
    ) {
      savedUser = this;

      return Promise.resolve(this);
    });

    return () => {
      if (!savedUser) {
        throw new Error('User was not saved');
      }

      return savedUser;
    };
  }

  function createRoleEntity(overrides: Partial<RoleEntity> = {}): RoleEntity {
    return {
      id: 'role-id',
      name: 'STANDARD',
      ...overrides,
    } as RoleEntity;
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
      role: createRoleEntity(),
      ...overrides,
    } as UserEntity;
  }
});
