import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'The name of the product' })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(350)
  @ApiProperty({ description: 'The description of the product' })
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The price of the product' })
  readonly price: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'The status of active' })
  readonly isActive: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'The status of promo' })
  readonly isPromo: boolean;

  @IsArray()
  productImages: Express.Multer.File[];
}
