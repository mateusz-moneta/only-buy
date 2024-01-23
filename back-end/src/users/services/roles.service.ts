import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '../entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
  ) {}

  findAll(): Promise<RoleEntity[]> {
    return this.rolesRepository.find();
  }

  findOneById(id: number): Promise<RoleEntity | null> {
    return this.rolesRepository.findOneBy({ id });
  }
}
