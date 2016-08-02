
const Actions = {

  changeCurrentPage: function(state = initialState, action){
    switch(action.type){
      case 'NAV-MAP':
        state.currentPage = 'map'
        break
      case 'NAV-JOURNAL':
        state.currentPage = 'journal'
        break
      case 'NAV-DATA':
        state.currentPage = 'data'
        break
      case 'NAV-ABOUT':
        state.currentPage = 'about'  
        break
      case 'INIT-EXPEDITIONS':
        state.expeditions = action.expeditions
        break
    }
    return state
  }

}


export default Actions