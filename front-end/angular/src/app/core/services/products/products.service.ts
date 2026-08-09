import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private readonly basePath = '/api/products';

  public createProduct(payload: CreateProductRequest): Observable<Product> {
    return this.httpClient.post<Product>(this.basePath, payload);
  }

  public createProductRate(payload: CreateProductRateRequest): Observable<ProductRate> {
    return this.httpClient.post<ProductRate>(`${this.basePath}/rate`, payload);
  }

  public deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.basePath}/${id}`);
  }

  public editProduct(id: string, payload: CreateProductRequest): Observable<Product> {
    return this.httpClient.put<Product>(`${this.basePath}/${id}`, payload);
  }

  public editProductRate(payload: EditProductRateRequest): Observable<ProductRate> {
    return this.httpClient.patch<ProductRate>(`${this.basePath}/rate`, payload);
  }

  public getProduct(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.basePath}/${id}`);
  }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.basePath);
  }
}
