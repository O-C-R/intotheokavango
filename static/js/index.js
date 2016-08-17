
/*

  sighting popups
  responsive map

  introduction
  disconnect ambit paths when they are more than one day apart

  better night
  endpoint for Jane
  change animation speed based on framerate

  NICE TO HAVE:
  render features in webGL
  change initial map location
  timeline interaction / animation
  feature loading zoomed out
  focus
  fly to next location when there is no beacon or ambit for one day
  perlin noise moving sightings
  visual night

  KNOWN BUGS:
  pinterest extension breaks journal

  NOTES:
  Medium posts that have nothing to do with Okavango show up in blog query

*/

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
// import createLogger from 'redux-logger'
import { fetchExpeditions } from './actions'
import okavangoApp from './reducers'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import OkavangoContainer from './containers/OkavangoContainer'
import MapPage from './components/MapPage'
import JournalPageContainer from './containers/JournalPageContainer'
// import JournalPage from './components/JournalPage'
import DataPage from './components/DataPage'
import AboutPage from './components/AboutPage'
import SharePage from './components/SharePage'

// const loggerMiddleware = createLogger()

let store = createStore(
  okavangoApp,
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware
  )
)

// <Route path="data" component={DataPage}/>
// <Route path="share" component={SharePage}/>
const routes = (
  <Route path="/" component={OkavangoContainer}>
    <IndexRoute component={MapPage}/>
    <Route path="map" component={MapPage}/>
    <Route path="journal" component={JournalPageContainer}/>
    <Route path="about" component={AboutPage}/>
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

