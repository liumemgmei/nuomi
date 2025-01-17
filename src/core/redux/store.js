import { createStore, compose } from 'redux';
import warning from 'warning';
import applyMiddleware from './applyMiddleware';
import { isFunction } from '../../utils';

const rootReducer = () => {};
const stores = {};
let middlewares = [];
let usedDispatch = false;
const composeEnhancers =
  /* eslint-disable no-underscore-dangle */
  process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#trace
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 20 })
    : compose;

const rootStore = createStore(
  rootReducer,
  // eslint-disable-next-line no-return-assign
  composeEnhancers(applyMiddleware(() => middlewares, () => (usedDispatch = true))),
);

const getStore = (id) => {
  return stores[id];
};

const setStore = (id, store) => {
  if (!stores[id]) {
    stores[id] = store;
  } else if (!store) {
    delete stores[id];
  }
};

rootStore.getStore = getStore;

rootStore.applyMiddleware = (...args) => {
  if (!usedDispatch) {
    middlewares = middlewares.concat(args.filter((middleware) => isFunction(middleware)));
  } else {
    warning(false, 'dispatch已经被使用，不能添加中间件，请确保添加中间件操作发生在dispatch之前');
  }
};

export { getStore, setStore };

export default rootStore;
