import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateProductRateDto {
  @IsNumber()
  @ApiProperty({ description: 'The id of the user' })
  readonly userId: string;

  @IsNumber()
  @ApiProperty({ description: 'The id of the product' })
  readonly productId: string;

  @IsNumber()
  @ApiProperty({ description: 'The rating of the product' })
  readonly rating: number;
}
