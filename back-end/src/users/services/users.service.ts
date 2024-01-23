import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from '../dto';
import { RoleEntity, UserEntity } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findOneById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async register(registerUserDto: RegisterUserDto): Promise<boolean> {
    try {
      const saltOrRounds = 10;
      const { password } = registerUserDto;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const role = await this.rolesRepository.findOneBy({ id: 1 });

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
