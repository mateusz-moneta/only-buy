import {
  DashboardActions,
  DashboardAction,
  LoadProductsSuccessAction,
  ChangePhraseAction
} from './dashboard.actions';
import { Product } from '../../models';

export interface DashboardState {
  active: boolean;
  phrase: string;
  promo: boolean;
  products: Product[];
  loading: boolean;
}

export const dashboardInitialState: DashboardState = {
  active: true,
  phrase: '',
  promo: false,
  products: [],
  loading: false
};

export const dashboardReducer = (
  state: DashboardState = dashboardInitialState,
  action: DashboardAction
) => {
  switch (action.type) {
    case DashboardActions.CHANGE_PHRASE:
      return {
        ...state,
        phrase: (action as ChangePhraseAction).payload.phrase
      };

    case DashboardActions.LOAD_PRODUCTS:
      return {
        ...state,
        loading: true
      };

    case DashboardActions.LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: (action as LoadProductsSuccessAction).payload.products,
        loading: false
      };

    case DashboardActions.LOAD_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false
      };

    case DashboardActions.TOGGLE_ACTIVE:
      return {
        ...state,
        active: !state.active,
        loading: true
      };

    case DashboardActions.TOGGLE_ACTIVE_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case DashboardActions.TOGGLE_ACTIVE_FAIL:
      return {
        ...state,
        loading: false
      };

    case DashboardActions.TOGGLE_PROMO:
      return {
        ...state,
        promo: !state.promo,
        loading: true
      };

    case DashboardActions.TOGGLE_PROMO_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case DashboardActions.TOGGLE_PROMO_FAIL:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
};
