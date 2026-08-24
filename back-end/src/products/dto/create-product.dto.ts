import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the product' })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The description of the product' })
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The details of the product' })
  readonly details: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The price of the product' })
  readonly price: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The code of the product' })
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The status of active' })
  readonly isActive: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The status of promo' })
  readonly isPromo: string;
}
