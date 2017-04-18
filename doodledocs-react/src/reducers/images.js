export default function imagesReducer(state = {}, action) {
  switch (action.type) {
    case "SET_IMAGE_LIST":
      return {list: action.payload}
    case "ADD_IMAGE":
   	  return {list: [...state.images, action.payload]}
   	case "REMOVE_IMAGE":
   	  let filteredImageList = state.filter(i => i.id != action.playload)
   	  return {list: filteredImageList}
   	case "SET_CURRENT_IMAGE":
   	  return {current: action.payload}
    default:
      return state
  }
}