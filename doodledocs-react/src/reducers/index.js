import { combineReducers } from 'redux'
import colorReducer from './color'
import accountReducer from './account'
import imagesReducer from './images'

export default combineReducers({
  color: colorReducer,
  account: accountReducer,
  images: imagesReducer
});
