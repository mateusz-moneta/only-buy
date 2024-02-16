import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductRateDto {
  @IsString()
  @ApiProperty({ description: 'The id of the product' })
  readonly productId: string;

  @IsNumber()
  @ApiProperty({ description: 'The rating of the product' })
  readonly rating: number;
}
