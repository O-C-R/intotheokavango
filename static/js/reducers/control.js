


const control = (
    state = {
      expedition: 'okavango_15',
      date: new Date(),
      playback: 'forward',
      mainFocus: 'explorers',
      secondaryFocus: 'steve',
      zoom: 7,
      layout: 'rows'
    }, 
    action
  ) => {
  switch (action.type) {
    case 'CONTROL':

      var newProps = {}
      if(action.target === 'zoom') {
        newProps[action.target] = Math.max(1,Math.min(15,state.zoom + (action.value === 'increment' ? 1 : -1)))
      }
      else newProps[action.target] = action.value
      return Object.assign({}, state, newProps)

    default:
      return state
  }
}

export default control