import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserEntity } from './entities';
import { UsersService } from './services';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiOperation({ summary: 'List of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: 'User',
  })
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }
}
