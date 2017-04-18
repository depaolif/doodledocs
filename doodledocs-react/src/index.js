import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App';
import './index.css';

import { createStore } from 'redux'
import rootReducer from './reducers/index'

function configureStore(){
  return createStore(rootReducer)
}

export const store = configureStore()

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
