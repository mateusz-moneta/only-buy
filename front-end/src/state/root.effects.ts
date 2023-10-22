import { combineEpics } from 'redux-observable';
import { authEffects } from './auth';

export const rootEffects = combineEpics(authEffects);

export default rootEffects;
