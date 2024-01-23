import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAccessTokenFromRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Refresh token' })
  readonly refreshToken: string;
}
