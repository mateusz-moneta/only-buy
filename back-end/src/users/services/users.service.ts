import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from '../dto';
import { RolesService } from '../../roles/services';
import { UserEntity } from '../entities';
import { User } from '../models';

@Injectable()
export class UsersService {
  constructor(
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

  async register(registerUserDto: RegisterUserDto): Promise<boolean> {
    try {
      const saltOrRounds = 10;
      const { password } = registerUserDto;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const role = await this.rolesService.findOneById(1);

      const user = new UserEntity({
        ...registerUserDto,
        password: hash,
        refreshToken: null,
        role,
      });

      return !!(await user.save());
    } catch (exception: unknown) {
      return false;
    }
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
