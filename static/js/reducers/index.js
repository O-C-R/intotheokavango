import { combineReducers } from 'redux'
import currentPage from './currentPage'
import control from './control'
import expeditions from './expeditions'

const okavangoApp = combineReducers({
  currentPage,
  control,
  expeditions
})

export default okavangoApp