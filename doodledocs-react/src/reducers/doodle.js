export default function doodleReducer(state = {tool: 'free', color: '#000', lineWidth: 1, imageSrc: '', fontSize: 12}, action) {
  switch (action.type) {
    case "SET_COLOR":
      return Object.assign({}, state, {color: action.payload})
    case "SET_TOOL":
      return Object.assign({}, state, {tool: action.payload})
    case "SET_LINE_WIDTH":
      return Object.assign({}, state, {lineWidth: action.payload})
    case "SET_IMAGE_SRC":
      return Object.assign({}, state, {imageSrc: action.payload})
    case "SET_FONT_SIZE":
      return Object.assign({}, state, {fontSize: action.payload})
    default:
      return state
  }
}