import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The e-mail of the user' })
  readonly email: string;
}
