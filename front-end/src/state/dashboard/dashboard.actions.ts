import { LoadProductsSuccessPayload } from './models';

const LOAD_PRODUCTS = 'LOAD_PRODUCTS';
const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS';
const LOAD_PRODUCTS_FAIL = 'LOAD_PRODUCTS_FAIL';

const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';
const TOGGLE_ACTIVE_SUCCESS = 'TOGGLE_ACTIVE_SUCCESS';
const TOGGLE_ACTIVE_FAIL = 'TOGGLE_ACTIVE_FAIL';

const TOGGLE_PROMO = 'TOGGLE_PROMO';
const TOGGLE_PROMO_SUCCESS = 'TOGGLE_PROMO_SUCCESS';
const TOGGLE_PROMO_FAIL = 'TOGGLE_PROMO_FAIL';

export const DashboardActions = {
  LOAD_PRODUCTS,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAIL,
  TOGGLE_ACTIVE,
  TOGGLE_ACTIVE_SUCCESS,
  TOGGLE_ACTIVE_FAIL,
  TOGGLE_PROMO,
  TOGGLE_PROMO_SUCCESS,
  TOGGLE_PROMO_FAIL
};

export interface LoadProductsAction {
  type: typeof LOAD_PRODUCTS;
}

export interface LoadProductsSuccessAction {
  type: typeof LOAD_PRODUCTS_SUCCESS;
  payload: LoadProductsSuccessPayload;
}

export interface LoadProductsFailAction {
  type: typeof LOAD_PRODUCTS_FAIL;
}

export interface ToggleActiveAction {
  type: typeof TOGGLE_ACTIVE;
}

export interface ToggleActiveSuccessAction {
  type: typeof TOGGLE_ACTIVE_SUCCESS;
}

export interface ToggleActiveFailAction {
  type: typeof TOGGLE_ACTIVE_FAIL;
}

export interface TogglePromoAction {
  type: typeof TOGGLE_PROMO;
}

export interface TogglePromoSuccessAction {
  type: typeof TOGGLE_PROMO_SUCCESS;
}

export interface TogglePromoFailAction {
  type: typeof TOGGLE_PROMO_FAIL;
}

export const loadProducts = (): LoadProductsAction => ({
  type: LOAD_PRODUCTS
});

export const loadProductsSuccess = (
  payload: LoadProductsSuccessPayload
): LoadProductsSuccessAction => ({
  type: LOAD_PRODUCTS_SUCCESS,
  payload
});

export const loadProductsFail = (): LoadProductsFailAction => ({
  type: LOAD_PRODUCTS_FAIL
});

export const toggleActive = (): ToggleActiveAction => ({
  type: TOGGLE_ACTIVE
});

export const toggleActiveSuccess = (): ToggleActiveSuccessAction => ({
  type: TOGGLE_ACTIVE_SUCCESS
});

export const toggleActiveFail = (): ToggleActiveFailAction => ({
  type: TOGGLE_ACTIVE_FAIL
});

export const togglePromo = (): TogglePromoAction => ({
  type: TOGGLE_PROMO
});

export const togglePromoSuccess = (): TogglePromoSuccessAction => ({
  type: TOGGLE_PROMO_SUCCESS
});

export const togglePromoFail = (): TogglePromoFailAction => ({
  type: TOGGLE_PROMO_FAIL
});

export type DashboardAction =
  | LoadProductsAction
  | LoadProductsSuccessAction
  | LoadProductsFailAction
  | ToggleActiveAction
  | ToggleActiveSuccessAction
  | ToggleActiveFailAction
  | TogglePromoAction
  | TogglePromoSuccessAction
  | TogglePromoFailAction;

export default {
  loadProducts,
  loadProductsSuccess,
  loadProductsFail,
  toggleActive,
  toggleActiveSuccess,
  toggleActiveFail,
  togglePromo,
  togglePromoSuccess,
  togglePromoFail
};
