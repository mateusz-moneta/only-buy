import { BaseModel } from './base-model.interface';

export interface Product extends BaseModel {
  productId: number;
  name: string;
  description: string;
  isActive: string;
  isPromo: string;
  images: string[];
}
