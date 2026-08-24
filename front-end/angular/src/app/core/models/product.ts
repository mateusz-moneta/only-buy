import { ProductImage } from './product-image';
import { ProductRate } from './product-rate';

export interface Product extends ProductRate {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  code: string;
  isActive: boolean;
  isPromo: boolean;
  images: ProductImage[];
  ratingCount: number;
  createdDate: string;
  updatedDate: string;
}
