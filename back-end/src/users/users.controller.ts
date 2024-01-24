import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleEntity, UserEntity } from './entities';
import { RolesService, UsersService } from './services';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiOperation({ summary: 'List of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: UserEntity,
    isArray: true,
  })
  findAllUsers(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('roles')
  @ApiOperation({ summary: 'List of roles' })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    type: RoleEntity,
    isArray: true,
  })
  findAllRoles(): Promise<RoleEntity[]> {
    return this.rolesService.findAll();
  }
}
