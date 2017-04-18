import { combineReducers } from 'redux';
import colorReducer from './color'
import accountReducer from './account'

export default combineReducers({
  color: colorReducer,
  account: accountReducer
});
