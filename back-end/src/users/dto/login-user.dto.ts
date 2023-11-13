import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'The name of the user' })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The password of the user' })
  readonly password: string;
}
