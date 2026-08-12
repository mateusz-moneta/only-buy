import { CreateProductRequest } from './create-product-request';

export interface EditProductRequest extends CreateProductRequest {
  deletedImageIds?: string[];
}
