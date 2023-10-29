import { combineReducers } from 'redux';

import { authReducer } from './auth';
import { dashboardReducer } from './dashboard';

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer
});

export type RootState = ReturnType<typeof rootReducer>;
