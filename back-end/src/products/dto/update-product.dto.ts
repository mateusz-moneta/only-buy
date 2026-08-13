import { CreateProductDto } from './create-product.dto';
import { IsString } from 'class-validator';

export class UpdateProductDto extends CreateProductDto {
  @IsString({ each: true })
  deletedImageIds?: string[] = [];
}
