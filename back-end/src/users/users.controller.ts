import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models';
import { UsersService } from './services';
import { Admin } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { UpdateActiveStateDto } from './dto';

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

  @UseGuards(RolesGuard)
  @Admin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
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
  ): Promise<User> {
    return this.usersService.updateActive(id, updateActiveStateDto.active);
  }
}
