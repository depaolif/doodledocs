export default function imagesReducer(state = [], action) {
  switch (action.type) {
    case "SET_IMAGE_LIST":
      return action.payload
    case "ADD_IMAGE":
   	  return [...state, action.payload]
   	case "REMOVE_IMAGE":
   	  let filteredImageList = state.filter(i => i.id != action.playload)
   	  return filteredImageList
    default:
      return state
  }
}