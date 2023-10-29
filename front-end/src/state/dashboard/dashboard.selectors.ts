import { RootState } from '../root.reducer';

export const selectActive = (state: RootState) => state.dashboard.active;

export const selectProducts = (state: RootState) => state.dashboard.products;

export const selectPromo = (state: RootState) => state.dashboard.promo;
