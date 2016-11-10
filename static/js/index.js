
/*
  GENERAL
    expedition year selection
    deep linking
    Fix intro
    animate timeline cursor and direction
  LIGHTBOX
    Create generic lightbox
  MAP
    separate normal map interaction vs introduction
    round sightings location
    rollover member markers
    map interactions
  JOURNAL
    bind timeline
    permalinks and location buttons
    grid visualization
  API
    Data explorer
  CODE
    switch state and props to immutable.js
    properly set key props
    swith to sylus
  ICE BOX
    Upgrade react-three-renderer to NPM version
    move 360 videos to side
*/

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import { fetchExpeditions } from './actions'
import okavangoApp from './reducers'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'

import OkavangoContainer from './containers/OkavangoContainer'
import MapPage from './components/MapPage'
import JournalPageContainer from './containers/JournalPageContainer'
import DataPage from './components/DataPage'
import AboutPage from './components/AboutPage'
import SharePage from './components/SharePage'

import { getURLParameters } from './utils'

document.getElementById('root').remove()

export const attachPathNameToAction = store => next => action=>{
  action.pathname = store.getState().router.pathname
  next(action)
}

let store = createStore(
  okavangoApp,
  applyMiddleware(
    thunkMiddleware
  )
)

const routes = (
  <Route path="/" component={OkavangoContainer}>
    <IndexRoute component={MapPage}/>
    <Route path="map(/:featureID)" component={MapPage}/>
    <Route path="journal(/:featureID)" component={JournalPageContainer}/>
    <Route path="data" component={DataPage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="share" component={SharePage}/>
    <Route path="(:expeditionID)">
      <Route path="map(/:featureID)" component={MapPage}/>
      <Route path="journal(/:featureID)" component={JournalPageContainer}/>
      <Route path="data" component={DataPage}/>
      <Route path="about" component={AboutPage}/>
      <Route path="share" component={SharePage}/>
    </Route>
    <Redirect from="/" to="/map" />
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
store.dispatch(fetchExpeditions(getURLParameters()))

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

