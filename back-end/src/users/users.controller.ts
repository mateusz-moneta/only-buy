import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models';
import { UsersService } from './services';
import { Admin, CurrentUser } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { UpdateActiveStateDto } from './dto';
import { Page } from '../shared/models';
import { JwtPayload } from '../auth/payloads';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Admin()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('username') username?: string,
  ): Promise<Page<User>> {
    return this.usersService.findAll(page, limit, username);
  }

  @UseGuards(RolesGuard)
  @Admin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The update user active state',
    type: 'User',
  })
  @ApiParam({ name: 'id' })
  update(
    @Param('id') id: string,
    @Body() updateActiveStateDto: UpdateActiveStateDto,
    @CurrentUser() { sub: userId }: JwtPayload,
  ): Promise<User> {
    return this.usersService.updateActive(
      id,
      updateActiveStateDto.active,
      userId,
    );
  }
}
