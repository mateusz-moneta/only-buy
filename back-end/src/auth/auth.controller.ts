import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './services';
import { Public } from './decorators';
import { RegisterUserDto, LoginUserDto } from '../users/dto';
import { UsersService } from '../users/services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
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

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login of user' })
  @ApiResponse({
    status: 200,
    description: 'The auth token',
    type: 'string',
  })
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string } | UnauthorizedException> {
    return this.authService.login(loginUserDto);
  }
}
