
/*

  when updating map, check we're not missing days in viewport
  wtf is that N marker following beacon?
  update_map on jumpto

  MAP:
  STYLING
  night
  visual night
  focus
  UI icons
  preloader
  rollover species
  animation species
  timeline interaction / animation
  introduction
  feature loading zoomed out
  round path waypoints
  endpoint for Jane

  WILL DO:
  fix timeline graph

  load features by tile
  get feature days
  load all ambit_geo in that timespan

*/

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { fetchExpeditions } from './actions'
import okavangoApp from './reducers'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import OkavangoContainer from './containers/OkavangoContainer'
import MapPage from './components/MapPage'
import JournalPage from './components/JournalPage'
import DataPage from './components/DataPage'
import AboutPage from './components/AboutPage'
import SharePage from './components/SharePage'

const loggerMiddleware = createLogger()

let store = createStore(
  okavangoApp,
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware
  )
)

const routes = (
  <Route path="/" component={OkavangoContainer}>
    <IndexRoute component={MapPage}/>
    <Route path="map" component={MapPage}/>
    <Route path="journal" component={JournalPage}/>
    <Route path="data" component={DataPage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="share" component={SharePage}/>
  </Route>
)

var render = function () {
  ReactDOM.render(
    (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes}/>
      </Provider>
    ),
    document.getElementById('okavango')
  )
}

store.subscribe(render)
store.dispatch(fetchExpeditions())

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName('dropdown-content')
    var i
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show')
      }
    }
  }
}

