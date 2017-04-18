import { createStore } from 'redux'
import rootReducer from './reducers/index'

function configureStore(){
  return createStore(rootReducer)
}

export const store = configureStore()
