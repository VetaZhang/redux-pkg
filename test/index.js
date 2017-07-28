"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import { Router, Route, Link, hashHistory, browserHistory, IndexRoute} from 'react-router';

import config from './config';
import dataConfig from './reducers';
import { generateReducer, setDispatch } from '../src';

// 生成 reducer 
const reducers = generateReducer(dataConfig, config);
// 若果原来使用了 redux，可以将原有的 reducers 通过 Object.assign 合并
const allRedux = combineReducers(reducers);
const store = createStore(allRedux);
// 使用之前先设置 dispatch
setDispatch(store.dispatch);

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick () {
    const { count } = this.props;
    count.set(count.value + 1);
  }
  render () {
    const { count } = this.props;
    return (<div>
      {count.on('get') ? 'getting' : 'finish'}
      <div onClick={() => this.handleClick()}>hello {count.value}</div>
      <div onClick={() => count.clean()}>Clean</div>
      <div onClick={() => count.get().then((value) => console.log(value))}>Get</div>
      <div onClick={() => count.addTen()}>addTen</div>
    </div>);
  }
}

const App = connect((state) => {
  return {
    count: state.count
  };
})(Main);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
