import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, LoginUserDto } from '../users/dto';
import { UsersService } from '../users/services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register of user' })
  @ApiResponse({
    status: 200,
    description: 'Status of register',
    type: 'boolean',
  })
  create(@Body() registerUserDto: RegisterUserDto): Promise<boolean> {
    return this.usersService.register(registerUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login of user' })
  @ApiResponse({
    status: 200,
    description: 'The auth token',
    type: 'string',
  })
  login(): Promise<string> {
    return null;
  }
}
