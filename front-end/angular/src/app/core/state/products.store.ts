import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import {
  CreateProductRateRequest,
  CreateProductRequest,
  EditProductRateRequest,
  Product,
} from '../models';
import { ProductsService } from '../services';

export interface ProductsState {
  isLoading: boolean;
  products: Product[];
  selectedProduct: Product | null;
}

const initialState: ProductsState = {
  isLoading: false,
  products: [],
  selectedProduct: null,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, productsService = inject(ProductsService)) => ({
    loadProduct: rxMethod<{ id: string }>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(({ id }) => productsService.getProduct(id)),
        tap((product: Product) => {
          patchState(store, {
            selectedProduct: product,
            isLoading: false,
          });
        }),
      ),
    ),
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(() => productsService.getProducts()),
        tap((products) => {
          patchState(store, {
            products,
            isLoading: false,
          });
        }),
      ),
    ),
    createProduct: rxMethod<CreateProductRequest>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((payload) => productsService.createProduct(payload)),
        tap((product) => {
          patchState(store, {
            products: [...store.products(), product],
            isLoading: false,
          });
        }),
      ),
    ),
    editProduct: rxMethod<{
      id: string;
      payload: CreateProductRequest;
    }>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(({ id, payload }) =>
          productsService.editProduct(id, payload),
        ),
        tap((updatedProduct) => {
          patchState(store, {
            products: store
              .products()
              .map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product,
              ),
            selectedProduct: updatedProduct,
            isLoading: false,
          });
        }),
      ),
    ),
    deleteProduct: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((id) =>
          productsService.deleteProduct(id).pipe(
            tap(() => {
              patchState(store, {
                products: store
                  .products()
                  .filter((product) => product.id !== id),
                selectedProduct: null,
                isLoading: false,
              });
            }),
          ),
        ),
      ),
    ),
    selectProduct(product: Product | null): void {
      patchState(store, {
        selectedProduct: product,
      });
    },
    clearSelectedProduct(): void {
      patchState(store, {
        selectedProduct: null,
      });
    },
    createProductRate: rxMethod<CreateProductRateRequest>(
      pipe(switchMap((payload) => productsService.createProductRate(payload))),
    ),
    editProductRate: rxMethod<EditProductRateRequest>(
      pipe(switchMap((payload) => productsService.editProductRate(payload))),
    ),
  })),
);
