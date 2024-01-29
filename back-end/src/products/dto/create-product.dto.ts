import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  readonly name: string;

  @ApiProperty({ description: 'The description of the product' })
  readonly description: string;

  @ApiProperty({ description: 'The price of the product' })
  readonly price: string;

  @ApiProperty({ description: 'The code of the product' })
  readonly code: string;

  @ApiProperty({ description: 'The status of active' })
  readonly isActive: string;

  @ApiProperty({ description: 'The status of promo' })
  readonly isPromo: string;

  @ApiProperty({ description: 'Files for images' })
  readonly productImages: Express.Multer.File[];
}
