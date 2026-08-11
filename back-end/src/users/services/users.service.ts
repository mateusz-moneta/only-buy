import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from '../dto';
import { RolesService } from '../../roles/services';
import { UserEntity } from '../entities';
import { User } from '../models';
import { UploadService } from '../../uploads/services';

@Injectable()
export class UsersService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
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
      .getRawMany();
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

  async updateActive(id: string, active: boolean): Promise<User> {
    await this.usersRepository.update(id, {
      active,
    });

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
  ): Promise<boolean> {
    try {
      const { username, email, password } = registerUserDto;

      const existingUser = await this.usersRepository.findOne({
        where: [{ username }, { email }],
      });

      if (existingUser) {
        return false;
      }

      const role = await this.rolesService.findOneByName('STANDARD');

      if (!role) {
        return false;
      }

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

      return true;
    } catch (exception: unknown) {
      console.error('User registration failed:', exception);

      return false;
    }
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
