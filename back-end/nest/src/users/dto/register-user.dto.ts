import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The e-mail of the user' })
  readonly email: string;
}
