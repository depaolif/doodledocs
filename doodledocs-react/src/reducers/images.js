export default function imagesReducer(state = {}, action) {
  switch (action.type) {
    case "SET_IMAGE_LIST":
      return Object.assign({}, state, {list: action.payload})
    case "ADD_IMAGE":
   	  return Object.assign({}, state, {list: [...state.list, action.payload]})
   	case "REMOVE_IMAGE":
   	  let filteredImageList = state.list.filter(i => i.id != action.payload)
      return Object.assign({}, state, {list: filteredImageList})
   	case "SET_CURRENT_IMAGE":
   	  return Object.assign({}, state, {current: action.payload})
    case "RESET_IMAGE":
      return Object.assign({}, state, {current: null})
    default:
      return state
  }
}
