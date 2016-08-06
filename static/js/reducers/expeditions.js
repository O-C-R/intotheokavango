
const expeditions = (
    state = {
      expeditions: [],
      currentExpedition: '',
      currentDate: new Date(0),
      isFetching: false
    },
    action
  ) => {
  var newProps

  const setCurrentDate = (e) => {
    return new Date(e.StartDate.getTime() + (e.Days - 1) * (1000 * 3600 * 24))
  }

  switch (action.type) {
    case 'INIT-EXPEDITIONS':
      if (action.expeditions) {
        newProps = {}
        newProps.expeditions = action.expeditions
        if (action.currentExpedition) newProps.currentExpedition = action.currentExpedition
        newProps.currentDate = setCurrentDate(action.expeditions[action.currentExpedition])
        return Object.assign({}, state, newProps)
      } else {
        return state
      }
    case 'SET-EXPEDITION':
      if (action.value && action.value !== state.currentExpedition) {
        newProps = {currentExpedition: action.value}
        newProps.currentDate = setCurrentDate(state.expeditions[action.value])
        return Object.assign({}, state, newProps)
      } else {
        return state
      }
    default:
      return state
  }
}

export default expeditions
