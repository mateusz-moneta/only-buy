import { CreateProductDto } from './create-product.dto';
import { IsArray, IsString } from 'class-validator';

export class UpdateProductDto extends CreateProductDto {
  @IsString({ each: true })
  deletedImageIds: string[] = [];
}
