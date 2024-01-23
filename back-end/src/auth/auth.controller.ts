import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './services';
import { Public } from './decorators';
import {
  RegisterUserDto,
  LoginUserDto,
  GetAccessTokenFromRefreshTokenDto,
} from '../users/dto';
import { UsersService } from '../users/services';
import { Login } from '../users/models';

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
    description: 'Auth and refresh tokens',
    type: 'Login',
  })
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<Login | UnauthorizedException> {
    return this.authService.login(loginUserDto);
  }

  @Get('refresh-token')
  @ApiOperation({ summary: 'Get access token based on refresh token' })
  @ApiResponse({
    status: 200,
    description: 'The access token',
    type: 'string',
  })
  async getAccessFromRefreshToken(
    @Body()
    getAccessTokenFromRefreshTokenDto: GetAccessTokenFromRefreshTokenDto,
  ) {
    return this.authService.getAccessTokenFromRefreshToken(
      getAccessTokenFromRefreshTokenDto.refreshToken,
    );
  }
}
