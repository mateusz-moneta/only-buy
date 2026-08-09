export interface CreateProductRequest {
  code: string;
  description: string;
  isActive: boolean;
  isPromo: boolean;
  name: string;
  price: string;
  productImages: File[];
}
