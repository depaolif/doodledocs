import { createStore } from 'redux'
import rootReducer from './reducers'

function configureStore(){
  return createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}


const store = configureStore()
const token = localStorage.getItem('token')
store.dispatch({type: "SET_TOKEN", payload: token})
export default store
