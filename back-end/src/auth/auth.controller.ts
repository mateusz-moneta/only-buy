import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, LoginUserDto } from './dto';
import { UserEntity } from './entities';
import { AuthService } from './services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register of user' })
  @ApiResponse({
    status: 200,
    description: 'Status of register',
    type: 'boolean',
  })
  create(@Body() registerUserDto: RegisterUserDto): Promise<boolean> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login of user' })
  @ApiResponse({
    status: 200,
    description: 'The auth token',
    type: 'string',
  })
  findAll(): Promise<string> {
    return null;
  }
}
