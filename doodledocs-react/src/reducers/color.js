export default function colorReducer(state = '#000', action) {
  switch (action.type) {
    case "SET_COLOR":
      return action.payload
    default:
      return state
  }
}
