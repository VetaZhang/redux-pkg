import { combineReducers } from 'redux';

let store;
let dispatch;

export const init = (config) => {
  store = config.store;
  dispatch = config.dispatch;
};

const generateReducer = (key, defaultState) => {
  // 往默认的 state 里添加通用方法
  defaultState.set = function(obj) {
    if (dispatch) {
      dispatch({ type: `${key}/diff`, obj });
    } else {
      console.error(`Can not found dispatch`);
    }
  };
  // 生成 reducer 方法
  const reducer = function(state = defaultState, action) {
    if (action.type === `${key}/diff`) {
      let value = Object.assign({}, state.value, action.obj);
      return Object.assign({}, state, {value});
    } else {
      return state;
    }
  };
  // 注入 reducer
  if (store) {
    if (!store.asyncReducers[key]) {
      store.asyncReducers[key] = reducer;
      store.replaceReducer((reducer => combineReducers({
        ...reducer
      }))(store.asyncReducers));
    }
  } else {
    console.error(`Can not found store`);
  }
};

export {
  generateReducer
};