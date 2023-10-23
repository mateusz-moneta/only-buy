import { applyMiddleware, compose, createStore } from 'redux';

import { createEpicMiddleware } from 'redux-observable';
import { rootEffects, rootReducer } from './state';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;

const effectsMiddleware = createEpicMiddleware();

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(effectsMiddleware)));

effectsMiddleware.run(rootEffects);

export default store;
