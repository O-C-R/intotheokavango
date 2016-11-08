
/*

  move 360 videos to side

  GENERAL
    expedition year selection
    deep linking
    Fix intro
    animate timeline cursor and direction
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
  MISC
    Upgrade react-three-renderer to NPM version
  CODE
    optimize with shouldComponentUpdate
    switch state and props to immutable.js
    properly set key props
    swith to sylus
    replace vars with consts or lets
  BACKEND
    provide thumbnail for images

*/

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import { fetchExpeditions } from './actions'
import okavangoApp from './reducers'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import OkavangoContainer from './containers/OkavangoContainer'
import MapPage from './components/MapPage'
import JournalPageContainer from './containers/JournalPageContainer'
import DataPage from './components/DataPage'
import AboutPage from './components/AboutPage'
import SharePage from './components/SharePage'

document.getElementById('root').remove()

let store = createStore(
  okavangoApp,
  applyMiddleware(
    thunkMiddleware)
)

const routes = (
  <Route path="/" component={OkavangoContainer}>
    <IndexRoute component={MapPage}/>
    <Route path="map" component={MapPage}/>
    <Route path="journal" component={JournalPageContainer}/>
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

