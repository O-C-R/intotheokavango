

/*

  LIVERELOAD: 
    node_modules/.bin/watchify static/js/index.js -t babelify -p livereactload -o static/js/index-babel.js

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


import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import OkavangoContainer from './containers/OkavangoContainer'
// import Okavango from './components/Okavango'
import { Provider } from 'react-redux'
import okavangoApp from './reducers'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import MapPage from './components/MapPage'
import JournalPage from './components/JournalPage'
import DataPage from './components/DataPage'
import AboutPage from './components/AboutPage'
import SharePage from './components/SharePage'


let store = createStore(okavangoApp)

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

var render = function(){
  
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

d3.json('http://intotheokavango.org/api/expeditions', function(err,res){
  if(err) throw('error loading expeditions', err)
  var data = res.results
  var currentExpedition
  var mostRecentDate = new Date(0)

  for(var k in data){
    var expedition = data[k]
    expedition.StartDate = new Date(expedition.StartDate)
    if(expedition.StartDate.getTime() + expedition.Days*(1000*3600*24) > mostRecentDate.getTime()){
      mostRecentDate = new Date(expedition.StartDate.getTime() + expedition.Days*(1000*3600*24))
      currentExpedition = k
    }
  }

  store.dispatch({type: 'INIT-EXPEDITIONS',expeditions: data, currentExpedition: currentExpedition})
})



window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

