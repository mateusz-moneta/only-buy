import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './models';
import { UsersService } from './services';
import { Admin } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Admin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiOperation({ summary: 'List of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: 'User',
    isArray: true,
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
