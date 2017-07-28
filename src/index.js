/***
 * By Veta
 * 基于 Redux 的数据获取与管理库，简化数据流
 */

// import config from './config';
// import dataReducers from './dataReducers';
import { requestAction, setGlobalConfig } from './requestAction';

let dispatch;

// 将 dataReducers 中的内容转换为 reducer 需要的 defaultState
// 该方法返回的是数组
const generateDefaultStateList = (list) => {
  return list.map((item) => {
    let obj = {};
    obj.key = item.key;
    obj.defaultValue = item.defaultValue;
    obj.value = obj.defaultValue;

    // 处理 request 相关内容
    if (item.requests && item.requests.length > 0) {

      obj.state = item.initialState;
      obj.error = null;
      // 添加 request 方法
      for (let req of item.requests) {
        if (req.funcName && req.url && req.method) {
          obj[req.funcName] = function (options) {
            if (dispatch) {
              return new requestAction({
                key: item.key,
                reqInfo: req,
                dispatch,
                options
              }).run();
            } else {
              console.error(`Please call 'setDispatch' first.`);
            }
          };
        }
      }
    }

    obj.on = function(state) {
      return this.state === state;
    }

    obj.set = function(newValue) {
      if (dispatch) {
        dispatch({
          type: `${this.key}/diff`,
          subKey: 'value',
          value: newValue
        });
      } else {
        console.error(`Please call 'setDispatch' first.`);
      }
    };

    obj.clean = function() {
      this.set(this.defaultValue);
    };

    if (item.methods && item.methods.length > 0) {
      item.methods.forEach((item) => {
        obj[item.funcName] = item.funcBody;
      });
    }

    return obj;
  });
};

// 根据 defaultStateList 生成相应的 reducer 函数
const generateReducerObj = function(defaultStateList) {
  let obj = {};
  defaultStateList.forEach(item => {
    const partDefaultState = Object.assign({}, item);
    obj[item.key] = function(state = partDefaultState, action) {
      if (action.type === `${item.key}/diff`) {
        return Object.assign({}, state, {[action.subKey]: action.value});
      } else {
        return state;
      }
    };
  });
  return obj;
};


const generateReducer = (dataReducers, config) => {
  setGlobalConfig(config);
  const defaultStateList = generateDefaultStateList(dataReducers);
  const reducer = generateReducerObj(defaultStateList);
  return reducer;
};

// request action 里面需要使用 dispatch，但是在生成 request 时并没有 dispatch
// 所以要在 dispatch 可用的时候，调用 setDispatch 将 dispatch 传入
// 在添加 request 方法时也需要判断 dispatch 是否存在
const setDispatch = function(dis) {
  dispatch = dis;
};

export {
  generateReducer,
  setDispatch
};
