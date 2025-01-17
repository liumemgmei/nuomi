import { compose } from 'redux';

export default (getMiddlewares, cb) => {
  return (createStore) => (...args) => {
    const store = createStore(...args);
    let dispatch;
    let middlewareDispatch = () => {
      throw new Error('dispatch未被创建，不允许使用');
    };
    const middlewareAPI = {
      getState: store.getState,
      // eslint-disable-next-line no-shadow
      dispatch: (...args) => middlewareDispatch(...args),
    };
    return {
      ...store,
      dispatch: (action) => {
        if (!dispatch) {
          const middlewares = getMiddlewares();
          const chain = middlewares.map((middleware) => middleware(middlewareAPI));
          dispatch = compose(...chain)(store.dispatch);
          middlewareDispatch = dispatch;
          cb && cb();
        }
        return dispatch(action);
      },
    };
  };
};
