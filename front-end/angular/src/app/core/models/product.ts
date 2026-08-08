import { ProductImage } from './product-image';
import { ProductRate } from './product-rate';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  isActive: boolean;
  isPromo: boolean;
  images: ProductImage[];
  rates: ProductRate[];
  createdDate: string;
  updatedDate: string;
}
