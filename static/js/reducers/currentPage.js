


const currentPage = (state = 'map', action) => {
  switch (action.type) {
    case 'NAV':
      return action.target
    default:
      return state
  }
}

export default currentPage