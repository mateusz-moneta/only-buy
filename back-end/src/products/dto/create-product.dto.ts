import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'The name of the product' })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The price of the product' })
  readonly price: string;
}