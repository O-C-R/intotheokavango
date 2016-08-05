
const expeditions = (
    state = {
      expeditions: [],
      currentExpedition: ''
    }, 
    action
  ) => {
  switch (action.type) {
    case 'INIT-EXPEDITIONS':
      if(action.expeditions){
        var newProps = {}
        newProps.expeditions = action.expeditions
        if(action.currentExpedition) newProps.currentExpedition = action.currentExpedition
        return Object.assign({}, state, newProps)
      } else {
        return state
      }
      break
    case 'SET-EXPEDITION':
      if(action.value){
        var newProps = {currentExpedition:action.value}
        return Object.assign({}, state, newProps)
      } else {
        return state
      }
      break
    default:
      return state
  }
}

export default expeditions