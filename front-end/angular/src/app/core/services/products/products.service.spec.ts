import { DEFAULT_PAGE } from '@core/constants';
import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it } from 'vitest';
import {
  CreateProductRateRequest,
  CreateProductRequest,
  EditProductRateRequest,
  EditProductRequest,
} from '../../models';
import { ProductsService } from './products.service';

describe(ProductsService.name, () => {
  let spectator: SpectatorHttp<ProductsService>;

  const createService = createHttpFactory(ProductsService);

  it('should be created', () => {
    spectator = createService();

    expect(spectator.service).toBeTruthy();
  });

  it('should create product', () => {
    spectator = createService();

    const payload: CreateProductRequest = {
      code: 'PROD-001',
      description: 'Test product',
      details: '<p>Product</p>',
      isActive: true,
      isPromo: false,
      name: 'Test Product',
      price: '100',
      productImages: [],
    };

    spectator.service.createProduct(payload).subscribe();

    const request = spectator.expectOne('/api/products/new', HttpMethod.POST);

    expect(request.request.body).toBeInstanceOf(FormData);

    const formData = request.request.body as FormData;

    expect(formData.get('code')).toBe(payload.code);
    expect(formData.get('description')).toBe(payload.description);
    expect(formData.get('details')).toBe(payload.details);
    expect(formData.get('isActive')).toBe(String(payload.isActive));
    expect(formData.get('isPromo')).toBe(String(payload.isPromo));
    expect(formData.get('name')).toBe(payload.name);
    expect(formData.get('price')).toBe(payload.price);
    expect(formData.getAll('productImages')).toEqual([]);
  });

  it('should create product with images', () => {
    spectator = createService();

    const image1 = new File(['image-1'], 'image1.png', {
      type: 'image/png',
    });

    const image2 = new File(['image-2'], 'image2.png', {
      type: 'image/png',
    });

    const payload: CreateProductRequest = {
      code: 'PROD-001',
      description: 'Test product',
      details: '<p>Product</p>',
      isActive: true,
      isPromo: false,
      name: 'Test Product',
      price: '100',
      productImages: [image1, image2],
    };

    spectator.service.createProduct(payload).subscribe();

    const request = spectator.expectOne('/api/products/new', HttpMethod.POST);

    const formData = request.request.body as FormData;

    expect(formData.getAll('productImages')).toEqual([image1, image2]);
  });

  it('should create product rate', () => {
    spectator = createService();

    const payload: CreateProductRateRequest = {
      productId: 'product-1',
      rating: 5,
    };

    spectator.service.createProductRate(payload).subscribe();

    const request = spectator.expectOne('/api/products/rate', HttpMethod.POST);

    expect(request.request.body).toEqual(payload);
  });

  it('should delete product', () => {
    spectator = createService();

    const productId = 'product-1';

    spectator.service.deleteProduct(productId).subscribe();

    const request = spectator.expectOne(
      `/api/products/${productId}`,
      HttpMethod.DELETE
    );

    request.flush({});
  });

  it('should edit product', () => {
    spectator = createService();

    const productId = 'product-1';

    const payload: EditProductRequest = {
      code: 'PROD-002',
      description: 'Updated product',
      details: '<p>Updated product</p>',
      isActive: true,
      isPromo: true,
      name: 'Updated Product',
      price: '250',
      productImages: [],
      deletedImageIds: [],
    };

    spectator.service.editProduct(productId, payload).subscribe();

    const request = spectator.expectOne(
      `/api/products/${productId}`,
      HttpMethod.PUT
    );

    expect(request.request.body).toBeInstanceOf(FormData);

    const formData = request.request.body as FormData;

    expect(formData.get('code')).toBe(payload.code);
    expect(formData.get('description')).toBe(payload.description);
    expect(formData.get('details')).toBe(payload.details);
    expect(formData.get('isActive')).toBe(String(payload.isActive));
    expect(formData.get('isPromo')).toBe(String(payload.isPromo));
    expect(formData.get('name')).toBe(payload.name);
    expect(formData.get('price')).toBe(payload.price);
    expect(formData.getAll('productImages')).toEqual([]);
    expect(formData.getAll('deletedImageIds')).toEqual([]);
  });

  it('should edit product with new images', () => {
    spectator = createService();

    const productId = 'product-1';

    const image = new File(['image'], 'new-image.png', {
      type: 'image/png',
    });

    const payload: EditProductRequest = {
      code: 'PROD-002',
      description: 'Updated product',
      details: '<p>Updated product</p>',
      isActive: true,
      isPromo: false,
      name: 'Updated Product',
      price: '250',
      productImages: [image],
      deletedImageIds: [],
    };

    spectator.service.editProduct(productId, payload).subscribe();

    const request = spectator.expectOne(
      `/api/products/${productId}`,
      HttpMethod.PUT
    );

    const formData = request.request.body as FormData;

    expect(formData.getAll('productImages')).toEqual([image]);
  });

  it('should edit product with deleted images', () => {
    spectator = createService();

    const productId = 'product-1';

    const payload: EditProductRequest = {
      code: 'PROD-002',
      description: 'Updated product',
      details: '<p>Updated product</p>',
      isActive: true,
      isPromo: false,
      name: 'Updated Product',
      price: '250',
      productImages: [],
      deletedImageIds: ['image-1', 'image-2'],
    };

    spectator.service.editProduct(productId, payload).subscribe();

    const request = spectator.expectOne(
      `/api/products/${productId}`,
      HttpMethod.PUT
    );

    const formData = request.request.body as FormData;

    expect(formData.getAll('deletedImageIds')).toEqual(['image-1', 'image-2']);
  });

  it('should edit product rate', () => {
    spectator = createService();

    const payload: EditProductRateRequest = {
      productId: 'product-1',
      rating: 4,
    };

    spectator.service.editProductRate(payload).subscribe();

    const request = spectator.expectOne('/api/products/rate', HttpMethod.PATCH);

    expect(request.request.body).toEqual(payload);
  });

  it('should get product by id', () => {
    spectator = createService();

    const productId = 'product-1';

    spectator.service.getProduct(productId).subscribe();

    const request = spectator.expectOne(
      `/api/products/${productId}`,
      HttpMethod.GET
    );

    request.flush({});
  });

  it('should get products with default filters', () => {
    spectator = createService();

    spectator.service.getProducts().subscribe();

    const request = spectator.expectOne(
      `/api/products?isActive=true&isPromo=true&page=${DEFAULT_PAGE}&phrase=`,
      HttpMethod.GET
    );

    request.flush({});
  });

  it('should get products with custom filters', () => {
    spectator = createService();

    spectator.service.getProducts(false, false, 'phone', 2).subscribe();

    const request = spectator.expectOne(
      '/api/products?isActive=false&isPromo=false&page=2&phrase=phone',
      HttpMethod.GET
    );

    request.flush({});
  });
});
