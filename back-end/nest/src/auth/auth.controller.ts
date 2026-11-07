import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
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
import { Login, RefreshUser, RegisterUser } from '../users/models';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login of user' })
  @ApiResponse({
    status: 200,
    description: 'Auth and refresh tokens',
    type: 'Login',
  })
  login(@Body() loginUserDto: LoginUserDto): Promise<Login> {
    return this.authService.login(loginUserDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get access token based on refresh token' })
  @ApiResponse({
    status: 200,
    description: 'The access token',
    type: 'UserData',
  })
  async getAccessFromRefreshToken(
    @Body()
    getAccessTokenFromRefreshTokenDto: GetAccessTokenFromRefreshTokenDto,
  ): Promise<RefreshUser> {
    return this.authService.getUserDataFromRefreshToken(
      getAccessTokenFromRefreshTokenDto.refreshToken,
    );
  }

  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Register of user' })
  @ApiResponse({
    status: 201,
    description: 'Status of register',
    type: 'RegisterUser',
  })
  create(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<RegisterUser> {
    return this.usersService.register(registerUserDto, avatar);
  }
}
