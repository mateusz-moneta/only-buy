import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './services';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Register of user' })
  @ApiResponse({
    status: 200,
    description: 'Status of register',
    type: 'boolean',
  })
  findAll(): Promise<boolean> {
    return null;
  }
}
