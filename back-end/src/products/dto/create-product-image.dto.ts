import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Id of the product' })
  readonly productId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Path of the image' })
  readonly path: string;
}
