import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ConnectedApp } from './App';
import './index.css';
import { store } from './store.js'


ReactDOM.render(
  <Provider store={store} >
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
