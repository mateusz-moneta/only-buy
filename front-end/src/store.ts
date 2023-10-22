import { applyMiddleware, createStore } from 'redux';

import { rootReducer } from './state';
import { createEpicMiddleware } from 'redux-observable';
import rootEffects from './state/root.effects';

const effectsMiddleware = createEpicMiddleware();

const store = createStore(rootReducer, applyMiddleware(effectsMiddleware));

effectsMiddleware.run(rootEffects);

export default store;
