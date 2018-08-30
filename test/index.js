"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import { Router, Route, Link, hashHistory, browserHistory, IndexRoute} from 'react-router';

import { generateReducer, init } from '../src';

const rootReducer = {
  root: () => ({}),
};
const middleware = window.devToolsExtension ? compose(applyMiddleware.apply(applyMiddleware), window.devToolsExtension()) : compose(applyMiddleware.apply(applyMiddleware));
const store = createStore(combineReducers(rootReducer), {}, middleware);
store.asyncReducers = rootReducer;
// 使用之前先初始化，设置 store 和 dispatch
init({
  store,
  dispatch: store.dispatch,
});

const test = {
  value: {
    name: 'Vate',
  },
  do() {
    this.set({ name: 'Hello Veta!' });
  },
};

generateReducer('test', test);

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick () {
    const { count } = this.props;
    count.set(count.value + 1);
  }
  render () {
    const { test } = this.props;
    return (<div>
      <div onClick={() => test.do()}>{test.value.name}</div>
    </div>);
  }
}

const App = connect((state) => {
  return {
    test: state.test
  };
})(Main);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
