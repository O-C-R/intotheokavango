import { combineReducers } from 'redux'
import currentPage from './currentPage'
import control from './control'

const okavangoApp = combineReducers({
  currentPage,
  control
})

export default okavangoApp