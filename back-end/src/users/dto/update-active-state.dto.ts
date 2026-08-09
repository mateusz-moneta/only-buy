import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActiveStateDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'The active state of the user' })
  readonly active: boolean;
}
