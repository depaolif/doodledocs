export default function accountsReducer(state = {}, action){
  switch (action.type) {
    case "SET_TOKEN":
      return Object.assign({}, state, {token: action.payload.token})
    case "SET_USERNAME":
   	  return Object.assign({}, state, {username: action.payload.username})
    default:
      return state
  }
}
