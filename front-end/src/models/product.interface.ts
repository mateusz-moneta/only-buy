import { BaseModel } from './base-model.interface';
import { ProductImage } from './product-image.interface';

export interface Product extends BaseModel {
  id: number;
  name: string;
  description: string;
  isActive: string;
  isPromo: string;
  productsImages: ProductImage[];
  rate: number;
}
