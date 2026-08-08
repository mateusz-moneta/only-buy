import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  CreateProductRateRequest,
  ProductRate,
  CreateProductRequest,
  EditProductRateRequest,
  Product,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  public createProduct(payload: CreateProductRequest): Observable<Product> {
    return this.httpClient.post<Product>('/api/products', payload);
  }

  public createProductRate(payload: CreateProductRateRequest): Observable<ProductRate> {
    return this.httpClient.post<ProductRate>('/api/products/rate', payload);
  }

  public deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/products/${id}`);
  }

  public editProduct(id: string, payload: CreateProductRequest): Observable<Product> {
    return this.httpClient.put<Product>(`/api/products/${id}`, payload);
  }

  public editProductRate(payload: EditProductRateRequest): Observable<ProductRate> {
    return this.httpClient.patch<ProductRate>(`/api/products/rate`, payload);
  }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/products');
  }
}
