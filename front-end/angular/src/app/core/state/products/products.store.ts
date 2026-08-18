import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@core/constants';
import {
  CreateProductRateRequest,
  CreateProductRequest,
  EditProductRateRequest,
  EditProductRequest,
  Page,
  Pageable,
  Product,
  ProductRate,
} from '../../models';
import { ProductsService } from '../../services';

export interface ProductsState {
  isLoading: boolean;
  pageable: Pageable;
  products: Product[];
  selectedProduct: Product | null;
  totalPages: number;
}

const initialState: ProductsState = {
  isLoading: false,
  pageable: {
    page: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
  products: [],
  selectedProduct: null,
  totalPages: 1,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, productsService = inject(ProductsService)) => {
    const setLoading = (isLoading: boolean): void => {
      patchState(store, { isLoading });
    };

    const handleError = () => {
      setLoading(false);

      return of(null);
    };

    const updateProductRate = (
      productId: string,
      productRate: ProductRate
    ): void => {
      patchState(store, {
        products: store.products().map((product) =>
          product.id === productId
            ? {
                ...product,
                averageRating: productRate.averageRating,
                rating: productRate.rating,
              }
            : product
        ),
      });
    };

    return {
      loadProduct: rxMethod<{ id: string }>(
        pipe(
          tap(() => setLoading(true)),
          switchMap(({ id }) => productsService.getProduct(id)),
          tap((product: Product) => {
            patchState(store, {
              selectedProduct: product,
            });

            setLoading(false);
          })
        )
      ),
      loadProducts: rxMethod<
        Partial<{
          isActive: boolean;
          isPromo: boolean;
          page: number;
          phrase: string;
        }>
      >(
        pipe(
          tap(() => setLoading(true)),
          switchMap(({ isActive, isPromo, page, phrase }) =>
            productsService.getProducts(isActive, isPromo, phrase, page)
          ),
          tap(
            ({
              data: products,
              limit: size,
              page,
              totalPages,
            }: Page<Product>) => {
              patchState(store, {
                pageable: {
                  page,
                  size,
                },
                products,
                totalPages,
              });
              setLoading(false);
            }
          )
        )
      ),
      createProduct: rxMethod<CreateProductRequest>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((payload) =>
            productsService.createProduct(payload).pipe(
              tap(() => setLoading(false)),
              catchError(handleError)
            )
          )
        )
      ),
      editProduct: rxMethod<{
        id: string;
        payload: EditProductRequest;
      }>(
        pipe(
          tap(() => setLoading(true)),
          switchMap(({ id, payload }) =>
            productsService.editProduct(id, payload).pipe(
              tap((updatedProduct) => {
                patchState(store, {
                  products: store
                    .products()
                    .map((product) =>
                      product.id === updatedProduct.id
                        ? updatedProduct
                        : product
                    ),
                  selectedProduct: updatedProduct,
                });

                setLoading(false);
              }),
              catchError(handleError)
            )
          )
        )
      ),
      deleteProduct: rxMethod<{
        productId: string;
      }>(
        pipe(
          tap(() => setLoading(true)),
          switchMap(({ productId }) =>
            productsService.deleteProduct(productId).pipe(
              tap(() => {
                patchState(store, {
                  products: store
                    .products()
                    .filter((product) => product.id !== productId),
                  selectedProduct: null,
                });

                setLoading(false);
              }),
              catchError(handleError)
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
          tap(() => setLoading(true)),
          switchMap((payload) =>
            productsService.createProductRate(payload).pipe(
              tap((productRate: ProductRate) => {
                updateProductRate(payload.productId, productRate);

                setLoading(false);
              }),
              catchError(handleError)
            )
          )
        )
      ),
      editProductRate: rxMethod<EditProductRateRequest>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((payload) =>
            productsService.editProductRate(payload).pipe(
              tap((productRate: ProductRate) => {
                updateProductRate(payload.productId, productRate);

                setLoading(false);
              }),
              catchError(handleError)
            )
          )
        )
      ),
    };
  })
);
