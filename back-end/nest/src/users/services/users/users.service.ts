import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import 'multer';
import { RegisterUserDto } from '../../dto';
import { RolesService } from '../../../roles';
import { UserEntity } from '../../entities';
import { RegisterUser, User } from '../../models';
import { UploadService } from '../../../uploads';
import { ConfigService } from '@nestjs/config';
import { Page } from '../../../shared/models';
import {
  AuditLogsService,
  AuditAction,
  AuditEntity,
} from '../../../audit-logs';

@Injectable()
export class UsersService {
  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
    private readonly uploadService: UploadService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    page?: number,
    limit?: number,
    username?: string,
  ): Promise<Page<User>> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.active',
        'user.avatar',
        'user.id',
        'user.username',
        'user.email',
        'user.createdDate',
        'user.updatedDate',
        'role.name',
      ]);

    if (username) {
      query.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    const defaultLimit = this.configService.get<number>('DEFAULT_LIMIT', 20);

    const maxLimit = this.configService.get<number>('MAX_LIMIT', 100);

    const currentPage = Math.max(1, Number(page) || 1);

    const pageSize = Math.min(
      Math.max(1, Number(limit) || defaultLimit),
      maxLimit,
    );

    const [users, total] = await query
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: users.map((user) => ({
        id: user.id,
        active: user.active,
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        role: user.role.name,
        createdDate: user.createdDate,
        updatedDate: user.updatedDate,
      })),
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  findOneById(id: string): Promise<UserEntity | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where({ id })
      .getOne();
  }

  findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where({ username })
      .getOne();
  }

  async updateActive(
    id: string,
    active: boolean,
    changedBy: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldActive = user.active;

    await this.usersRepository.update(id, {
      active,
    });

    if (oldActive !== active) {
      await this.auditLogsService.create({
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        entityId: id,
        userId: changedBy,
        oldValue: {
          active: oldActive,
        },
        newValue: {
          active,
        },
      });
    }

    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .select([
        'user.active AS active',
        'user.avatar AS avatar',
        'user.id AS id',
        'user.username AS username',
        'user.email AS email',
        'user.createdDate AS "createdDate"',
        'user.updatedDate AS "updatedDate"',
        'role.name AS role',
      ])
      .where('user.id = :id', { id })
      .getRawOne();
  }

  async register(
    registerUserDto: RegisterUserDto,
    avatar?: Express.Multer.File,
  ): Promise<RegisterUser> {
    const { username, email, password } = registerUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException();
    }

    const role = await this.rolesService.findOneByName('STANDARD');

    if (!role) {
      throw new InternalServerErrorException('Standard role is not configured');
    }

    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);

    const hash = await bcrypt.hash(password, 10);

    const user = new UserEntity({
      username,
      email,
      password: hash,
      refreshToken: null,
      role,
      avatar: avatar ? this.uploadService.saveFile(avatar, 'avatars') : null,
    });

    await user.save();

    return {
      email: user.email,
      username: user.username,
    };
  }

  async remove(id: string, changedBy: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.auditLogsService.create({
      action: AuditAction.DELETE,
      entity: AuditEntity.USER,
      entityId: id,
      userId: changedBy,
      oldValue: {
        id: user.id,
        username: user.username,
        email: user.email,
        active: user.active,
        avatar: user.avatar,
        role: user.role?.name,
      },
      newValue: null,
    });

    await this.usersRepository.delete(id);
  }
}
