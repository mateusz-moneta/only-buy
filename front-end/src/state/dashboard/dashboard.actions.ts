import { ChangePhrasePayload, LoadProductsSuccessPayload } from './models';

const CHANGE_PHRASE = '[Dashboard] Change phrase';
const CHANGE_PHRASE_SUCCESS = '[Dashboard] Change phrase success';
const CHANGE_PHRASE_FAIL = '[Dashboard] Change phrase fail';

const LOAD_PRODUCTS = '[Dashboard] Load products';
const LOAD_PRODUCTS_SUCCESS = '[Dashboard] Load products success';
const LOAD_PRODUCTS_FAIL = '[Dashboard] Load products fail';

const TOGGLE_ACTIVE = '[Dashboard] Toggle active';
const TOGGLE_ACTIVE_SUCCESS = '[Dashboard] Toggle active success';
const TOGGLE_ACTIVE_FAIL = '[Dashboard] Toggle active fail';

const TOGGLE_PROMO = '[Dashboard] Toggle promo';
const TOGGLE_PROMO_SUCCESS = '[Dashboard] Toggle promo success';
const TOGGLE_PROMO_FAIL = '[Dashboard] Toggle promo fail';

export const DashboardActions = {
  CHANGE_PHRASE,
  CHANGE_PHRASE_FAIL,
  CHANGE_PHRASE_SUCCESS,
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

export interface ChangePhraseAction {
  type: typeof CHANGE_PHRASE;
  payload: ChangePhrasePayload;
}

export interface ChangePhraseSuccessAction {
  type: typeof CHANGE_PHRASE_SUCCESS;
}

export interface ChangePhraseFailAction {
  type: typeof CHANGE_PHRASE_FAIL;
}

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

export const changePhrase = (payload: ChangePhrasePayload): ChangePhraseAction => ({
  type: CHANGE_PHRASE,
  payload
});

export const changePhraseSuccess = (): ChangePhraseSuccessAction => ({
  type: CHANGE_PHRASE_SUCCESS
});

export const changePhraseFail = (): ChangePhraseFailAction => ({
  type: CHANGE_PHRASE_FAIL
});

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
  | ChangePhraseAction
  | ChangePhraseSuccessAction
  | ChangePhraseFailAction
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
  changePhrase,
  changePhraseSuccess,
  changePhraseFail,
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
