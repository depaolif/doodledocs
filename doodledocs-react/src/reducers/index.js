import { combineReducers } from 'redux'
import colorReducer from './color'
import accountReducer from './account'
import imagesReducer from './images'

const appReducer = combineReducers({
  color: colorReducer,
  account: accountReducer,
  images: imagesReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
