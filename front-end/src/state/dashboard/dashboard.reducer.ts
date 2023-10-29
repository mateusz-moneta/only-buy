import { Product } from '../../models';
import { DashboardActions, DashboardAction } from './dashboard.actions';

export interface DashboardState {
  active: boolean;
  promo: boolean;
  products: Product[];
  loading: boolean;
}

export const dashboardInitialState: DashboardState = {
  active: true,
  promo: false,
  products: [],
  loading: false
};

export const dashboardReducer = (
  state: DashboardState = dashboardInitialState,
  action: DashboardAction
) => {
  switch (action.type) {
    case DashboardActions.LOAD_PRODUCTS:
      return {
        ...state,
        loading: true
      };

    case DashboardActions.LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: [],
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
