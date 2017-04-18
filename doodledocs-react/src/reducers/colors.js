export default function colorsReducer(state = '#fff', action){
  switch (action.type) {
    case "CHANGE_COLOR":
      return action.color_change
    default:
      return state
  }
}
