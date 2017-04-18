export default function colorsReducer(state = '#000', action){
  switch (action.type) {
    case "CHANGE_COLOR":
      return action.color_change
    default:
      return state
  }
}
