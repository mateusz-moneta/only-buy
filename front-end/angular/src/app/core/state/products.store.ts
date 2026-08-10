import { inject } from '@angular/core';
import { isActive } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import {
  CreateProductRateRequest,
  CreateProductRequest,
  EditProductRateRequest,
  Product,
  ProductRate,
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
        })
      )
    ),
    loadProducts: rxMethod<
      Partial<{
        isActive: boolean;
        isPromo: boolean;
        phrase: string;
      }>
    >(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(({ isActive, isPromo, phrase }) =>
          productsService.getProducts(isActive, isPromo, phrase)
        ),
        tap((products) => {
          patchState(store, {
            products,
            isLoading: false,
          });
        })
      )
    ),
    createProduct: rxMethod<CreateProductRequest>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((payload: CreateProductRequest) =>
          productsService.createProduct(payload)
        ),
        tap((product: Product) => {
          patchState(store, {
            products: [...store.products(), product],
            isLoading: false,
          });
        })
      )
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
          productsService.editProduct(id, payload)
        ),
        tap((updatedProduct) => {
          patchState(store, {
            products: store
              .products()
              .map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
              ),
            selectedProduct: updatedProduct,
            isLoading: false,
          });
        })
      )
    ),
    deleteProduct: rxMethod<{ productId: string }>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(({ productId }) =>
          productsService.deleteProduct(productId).pipe(
            tap(() => {
              patchState(store, {
                products: store
                  .products()
                  .filter((product) => product.id !== productId),
                selectedProduct: null,
                isLoading: false,
              });
            }),
            catchError(() => {
              patchState(store, {
                isLoading: false,
              });

              return of(null);
            })
          )
        )
      )
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
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((payload) =>
          productsService.createProductRate(payload).pipe(
            tap((productRate: ProductRate) => {
              patchState(store, {
                isLoading: false,
                products: store.products().map((product) => {
                  if (product.id === payload.productId) {
                    return {
                      ...product,
                      averageRating: productRate.averageRating,
                      rating: productRate.rating,
                    };
                  }

                  return product;
                }),
              });
            }),
            catchError(() => {
              patchState(store, {
                isLoading: false,
              });

              return of(null);
            })
          )
        )
      )
    ),
    editProductRate: rxMethod<EditProductRateRequest>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((payload) =>
          productsService.editProductRate(payload).pipe(
            tap((productRate: ProductRate) => {
              patchState(store, {
                isLoading: false,
                products: store.products().map((product) => {
                  if (product.id === payload.productId) {
                    return {
                      ...product,
                      averageRating: productRate.averageRating,
                      rating: productRate.rating,
                    };
                  }

                  return product;
                }),
              });
            }),
            catchError(() => {
              patchState(store, {
                isLoading: true,
              });

              return of(null);
            })
          )
        )
      )
    ),
  }))
);
