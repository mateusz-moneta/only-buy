import { BaseModel } from './base-model.interface';
import { ProductImage } from './product-image.interface';
import { Rate } from './rate.interface';

export interface Product extends BaseModel {
  id: number;
  name: string;
  description: string;
  isActive: string;
  isPromo: string;
  images: ProductImage[];
  rates: Rate[];
}
