import { combineReducers } from 'redux'
import doodleReducer from './color'
import accountReducer from './account'
import imagesReducer from './images'

export default combineReducers({
  doodle: doodleReducer,
  account: accountReducer,
  images: imagesReducer
});
