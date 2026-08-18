import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DEFAULT_PAGE } from '@core/constants';
import {
  CreateProductRateRequest,
  CreateProductRequest,
  EditProductRateRequest,
  EditProductRequest,
  Page,
  Product,
  ProductRate,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  private readonly basePath = '/api/products';

  public createProduct(payload: CreateProductRequest): Observable<Product> {
    return this.httpClient.post<Product>(
      `${this.basePath}/new`,
      this.productFormData(payload)
    );
  }

  public createProductRate(
    payload: CreateProductRateRequest
  ): Observable<ProductRate> {
    return this.httpClient.post<ProductRate>(`${this.basePath}/rate`, payload);
  }

  public deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.basePath}/${id}`);
  }

  public editProduct(
    id: string,
    payload: EditProductRequest
  ): Observable<Product> {
    return this.httpClient.put<Product>(
      `${this.basePath}/${id}`,
      this.productFormData(payload)
    );
  }

  public editProductRate(
    payload: EditProductRateRequest
  ): Observable<ProductRate> {
    return this.httpClient.patch<ProductRate>(`${this.basePath}/rate`, payload);
  }

  public getProduct(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.basePath}/${id}`);
  }

  public getProducts(
    isActive = true,
    isPromo = true,
    phrase = '',
    page = DEFAULT_PAGE
  ): Observable<Page<Product>> {
    const params = new HttpParams()
      .append('isActive', isActive)
      .append('isPromo', isPromo)
      .append('page', page)
      .append('phrase', phrase);

    return this.httpClient.get<Page<Product>>(this.basePath, {
      params,
    });
  }

  private productFormData(
    payload: CreateProductRequest | EditProductRequest
  ): FormData {
    const formData = new FormData();

    formData.append('code', payload.code);
    formData.append('description', payload.description);
    formData.append('isActive', String(payload.isActive));
    formData.append('isPromo', String(payload.isPromo));
    formData.append('name', payload.name);
    formData.append('price', payload.price);

    payload.productImages?.forEach((image: File) => {
      formData.append('productImages', image);
    });

    if ('deletedImageIds' in payload) {
      payload.deletedImageIds?.forEach((id: string) => {
        formData.append('deletedImageIds', id);
      });
    }

    return formData;
  }
}
