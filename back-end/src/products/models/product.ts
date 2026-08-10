import { ProductRate } from './product-rate';
import { ProductImage } from './product-image';

export interface Product extends ProductRate {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  isActive: boolean;
  isPromo: boolean;
  images: ProductImage[];
}
