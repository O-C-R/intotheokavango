/*

  okavango_15 +1
  okavango_14 +1
  bike_angola_16 +1

  expedition starts on expeditionDay=1

  LIVERELOAD:
    node_modules/.bin/  static/js/index.js -t babelify -p livereactload -o static/js/index-babel.js

  TODO:
    URL
    load data
    look at changes to API
    think of loading strategy

  DATA LOADING

    load entirety of beacon path and map it to timeline
    all other features are loaded based on location

    get dates of expedition to draw timeline
    get last records
    start 24h earlier
    load features through tiling
    ask multiple features at once

QUESTIONS
    dates of expeditions
    teams and core
    querying through space boundaries
    inventory of sensors and media types

    TEAM : river main

    can I query all features
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
    thunkMiddleware
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

