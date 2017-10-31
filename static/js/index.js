
/*

  background scroll

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

// const loggerMiddleware = createLogger()

// This hack allows saving 20% weight on tiles for browsers other than Chrome
// (function (open) {
//   XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
//     url = url.replace(/(\.png\?access)|(\.jpg\?access)|(\.jpeg\?access)/, '.jpg70?access')
//     open.call(this, method, url, async, user, pass)
//   }
// })(XMLHttpRequest.prototype.open)

document.getElementById('root').remove()

let store = createStore(
  okavangoApp,
  applyMiddleware(
    thunkMiddleware)
)

const routes = (
  <Route path="/" component={OkavangoContainer}>
    <IndexRoute component={AboutPage}/>
    <Route path="map" component={MapPage}/>
    <Route path="journal" component={JournalPageContainer}/>
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

