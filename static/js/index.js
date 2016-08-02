

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

*/


import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import Okavango from './components/Okavango'
import { Provider } from 'react-redux'
import okavangoApp from './reducers'


let store = createStore(okavangoApp)
       

var render = function(){
  
  console.log('rendering', store.getState())

  ReactDOM.render(
    (
      <Provider store={store}>
        <Okavango/>
      </Provider>
    ),
    document.getElementById('okavango')
  )
}

store.subscribe(render)
render()


// d3.json('http://intotheokavango.org/api/expeditions', function(err,res){
//   if(err) throw('error loading expeditions', err)
//   var data = res.results

//   var expeditions = Object.keys(data).map(function (k) {
//     var expedition = data[k];
//     var value = {
//       id:k, 
//       days:expedition.Days, 
//       startDate: new Date(expedition.StartDate)
//     }
//     return value
//   })

  // store.dispatch({type: 'INIT-EXPEDITIONS',expeditions: expeditions})
  
// })



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

