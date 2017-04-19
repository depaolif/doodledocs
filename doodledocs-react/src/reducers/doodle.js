export default function doodleReducer(state = {tool: 'free', color: '#000'}, action) {
  switch (action.type) {
    case "SET_COLOR":
      return Object.assign({}, state, {color: action.payload}
    case "SET_TOOL":
      return Object.assign({}, state, {tool: action.payload})
    default:
      return state
  }
}
