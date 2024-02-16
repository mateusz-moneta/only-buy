import { BaseModel } from './base-model.interface';
import { ProductImage } from './product-image.interface';
import { Rate } from './rate.interface';

export interface Product extends BaseModel {
  id: number;
  code: string | null;
  name: string;
  description: string;
  price: number;
  isActive: string;
  isPromo: string;
  images: ProductImage[];
  rates: Rate[];
}
