webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(332);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _redux = __webpack_require__(472);
	
	var _reactRedux = __webpack_require__(486);
	
	var _reduxThunk = __webpack_require__(495);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _actions = __webpack_require__(496);
	
	var _reducers = __webpack_require__(500);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var _reactRouter = __webpack_require__(502);
	
	var _OkavangoContainer = __webpack_require__(563);
	
	var _OkavangoContainer2 = _interopRequireDefault(_OkavangoContainer);
	
	var _MapPage = __webpack_require__(1012);
	
	var _MapPage2 = _interopRequireDefault(_MapPage);
	
	var _JournalPageContainer = __webpack_require__(1024);
	
	var _JournalPageContainer2 = _interopRequireDefault(_JournalPageContainer);
	
	var _DataPage = __webpack_require__(1027);
	
	var _DataPage2 = _interopRequireDefault(_DataPage);
	
	var _AboutPage = __webpack_require__(1030);
	
	var _AboutPage2 = _interopRequireDefault(_AboutPage);
	
	var _SharePage = __webpack_require__(1031);
	
	var _SharePage2 = _interopRequireDefault(_SharePage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// const loggerMiddleware = createLogger()
	
	document.getElementById('root').remove();
	// import JournalPage from './components/JournalPage'
	
	// import createLogger from 'redux-logger'
	
	/*
	
	  GENERAL
	    add skip to intro
	    expedition year selection
	    deep linking
	    Fix intro
	    animate timeline cursor and direction
	  MAP
	    popup cycle
	    round sightings location
	    sighting labels
	    rollover member markers
	    webGL paths
	    map interactions
	  JOURNAL
	    bind timeline
	    permalinks and location buttons
	    grid visualization
	  API
	    Documentation
	    Data explorer
	
	*/
	
	var store = (0, _redux.createStore)(_reducers2.default, (0, _redux.applyMiddleware)(_reduxThunk2.default));
	
	var routes = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _OkavangoContainer2.default },
	  _react2.default.createElement(_reactRouter.IndexRoute, { component: _MapPage2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'map', component: _MapPage2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'journal', component: _JournalPageContainer2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'data', component: _DataPage2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'about', component: _AboutPage2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'share', component: _SharePage2.default })
	);
	
	var render = function render() {
	  _reactDom2.default.render(_react2.default.createElement(
	    _reactRedux.Provider,
	    { store: store },
	    _react2.default.createElement(_reactRouter.Router, { history: _reactRouter.browserHistory, routes: routes })
	  ), document.getElementById('okavango'));
	};
	
	store.subscribe(render);
	store.dispatch((0, _actions.fetchExpeditions)());
	
	window.onclick = function (event) {
	  if (!event.target.matches('.dropbtn')) {
	    var dropdowns = document.getElementsByClassName('dropdown-content');
	    var i;
	    for (i = 0; i < dropdowns.length; i++) {
	      var openDropdown = dropdowns[i];
	      if (openDropdown.classList.contains('show')) {
	        openDropdown.classList.remove('show');
	      }
	    }
	  }
	};

/***/ },

/***/ 496:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.UNSELECT_FEATURE = exports.SELECT_FEATURE = exports.RECEIVE_FEATURES = exports.RECEIVE_DAY = exports.REQUEST_DAY = exports.SET_CONTROL = exports.SET_EXPEDITION = exports.RECEIVE_TOTAL_SIGHTINGS = exports.RECEIVE_EXPEDITIONS = exports.UPDATE_MAP = exports.UPDATE_TIME = exports.REQUEST_EXPEDITIONS = exports.START = exports.JUMP_TO = exports.HIDE_LOADING_WHEEL = exports.SHOW_LOADING_WHEEL = exports.COMPLETE_DAYS = exports.RECEIVE_POSTS = exports.FETCH_POSTS_BY_DAY = exports.SET_PAGE = exports.ENABLE_CONTENT = undefined;
	exports.enableContent = enableContent;
	exports.setPage = setPage;
	exports.checkFeedContent = checkFeedContent;
	exports.fetchPostsByDay = fetchPostsByDay;
	exports.receivePosts = receivePosts;
	exports.completeDays = completeDays;
	exports.showLoadingWheel = showLoadingWheel;
	exports.hideLoadingWheel = hideLoadingWheel;
	exports.jumpTo = jumpTo;
	exports.startAnimation = startAnimation;
	exports.requestExpeditions = requestExpeditions;
	exports.updateTime = updateTime;
	exports.updateMap = updateMap;
	exports.receiveExpeditions = receiveExpeditions;
	exports.fetchExpeditions = fetchExpeditions;
	exports.fetchTotalSightings = fetchTotalSightings;
	exports.receiveTotalSightings = receiveTotalSightings;
	exports.fetchDay = fetchDay;
	exports.setExpedition = setExpedition;
	exports.setControl = setControl;
	exports.requestDay = requestDay;
	exports.receiveDay = receiveDay;
	exports.receiveFeatures = receiveFeatures;
	exports.selectFeature = selectFeature;
	exports.unselectFeature = unselectFeature;
	
	var _isomorphicFetch = __webpack_require__(497);
	
	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import { animate } from './animation'
	
	function timestampToString(t) {
	  var d = new Date(t);
	  var year = d.getUTCFullYear();
	  var month = d.getUTCMonth() + 1 + '';
	  if (month.length === 1) month = '0' + month;
	  var date = d.getUTCDate() + '';
	  if (date.length === 1) date = '0' + date;
	  return year + '-' + month + '-' + date;
	}
	
	var ENABLE_CONTENT = exports.ENABLE_CONTENT = 'ENABLE_CONTENT';
	
	function enableContent() {
	  return {
	    type: ENABLE_CONTENT
	  };
	}
	
	var SET_PAGE = exports.SET_PAGE = 'SET_PATH';
	
	function setPage() {
	  return function (dispatch, getState) {
	    if (location.pathname === '/journal') dispatch(checkFeedContent());
	  };
	}
	
	function checkFeedContent() {
	  return function (dispatch, getState) {
	    var state = getState();
	    var expeditionID = state.selectedExpedition;
	    var expedition = state.expeditions[expeditionID];
	    var dayCount = expedition.dayCount;
	    var posts = d3.values(expedition.features);
	    var postsByDay = expedition.postsByDay;
	    var contentHeight = d3.select('#content').node().offsetHeight;
	    var scrollTop = d3.select('#content').node().scrollTop;
	    var feedElement = d3.select('#feed').node();
	    var viewRange = [scrollTop, scrollTop + contentHeight];
	
	    if (feedElement) {
	      var postElements = d3.select(feedElement).selectAll('div.post')._groups[0];
	      var visibleDays = [];
	      var visibleElements = [];
	      if (postElements) {
	        postElements.forEach(function (p) {
	          var postRange = [p.offsetTop - 100, p.offsetTop + p.offsetHeight - 100];
	          if (viewRange[0] > postRange[0] && viewRange[0] <= postRange[1] || viewRange[0] <= postRange[0] && viewRange[1] > postRange[0] || viewRange[1] > postRange[0] && viewRange[1] <= postRange[1]) {
	            visibleElements.push(p.className.split(' ')[1]);
	          }
	        });
	      }
	      visibleElements.forEach(function (p) {
	        var feature = expedition.features[p];
	        var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	        if (visibleDays.indexOf(day) === -1) visibleDays.push(day);
	      });
	      for (var i = 0; i < visibleDays.length - 1; i++) {
	        if (Math.abs(visibleDays[i] - visibleDays[i + 1])) {
	          dispatch(fetchPostsByDay(expeditionID, null, i));
	          break;
	        }
	      }
	
	      var feedHeight = feedElement.offsetHeight;
	      if (posts.length === 0 || feedHeight < contentHeight || scrollTop <= 100 && !postsByDay[dayCount] || scrollTop >= feedHeight - contentHeight - 100 && !postsByDay[0]) {
	        dispatch(fetchPostsByDay(expeditionID, expedition.currentDate));
	      }
	    } else {
	      if (posts.length === 0 || scrollTop <= 100 && !postsByDay[dayCount]) {
	        dispatch(fetchPostsByDay(expeditionID, expedition.currentDate));
	      }
	    }
	  };
	}
	
	var FETCH_POSTS_BY_DAY = exports.FETCH_POSTS_BY_DAY = 'FETCH_POSTS_BY_DAY';
	
	function fetchPostsByDay(_expeditionID, date, expeditionDay) {
	  return function (dispatch, getState) {
	    var i;
	    var state = getState();
	    // if (state.isFetchingPosts > 0) return
	    var expeditionID = _expeditionID || state.selectedExpedition;
	    var expedition = state.expeditions[expeditionID];
	    if (!expeditionDay) {
	      if (!date) date = expedition.currentDate;
	      expeditionDay = Math.floor((date.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	    }
	
	    var daysToFetch = [];
	
	    if (!expedition.postsByDay[expeditionDay]) daysToFetch.push(expeditionDay);else if (expedition.postsByDay[expeditionDay] === 'loading') return;else {
	      for (i = expeditionDay - 1; i >= 0; i--) {
	        if (expedition.postsByDay[i] === 'loading') break;
	        if (!expedition.postsByDay[i]) {
	          daysToFetch.push(i);
	          daysToFetch[0] = i;
	          break;
	        }
	      }
	      for (i = expeditionDay + 1; i < expedition.dayCount; i++) {
	        if (expedition.postsByDay[i] === 'loading') break;
	        if (!expedition.postsByDay[i]) {
	          daysToFetch.push(i);
	          break;
	        }
	      }
	    }
	
	    if (daysToFetch.length === 0) return;
	    var datesToFetch = [];
	    daysToFetch.forEach(function (d, i) {
	      var t = expedition.start.getTime() + d * (1000 * 3600 * 24);
	      datesToFetch[i] = t;
	    });
	    var range = [timestampToString(d3.min(datesToFetch)), timestampToString(d3.max(datesToFetch) + 1000 * 3600 * 24)];
	
	    dispatch({
	      type: FETCH_POSTS_BY_DAY,
	      expeditionID: expeditionID,
	      daysToFetch: daysToFetch
	    });
	
	    var queryString = 'https://intotheokavango.org/api/features?limit=0&FeatureType=blog,audio,image,tweet&limit=0&Expedition=' + state.selectedExpedition + '&startDate=' + range[0] + '&endDate=' + range[1];
	    // console.log('querying posts:', queryString)
	    (0, _isomorphicFetch2.default)(queryString).then(function (response) {
	      return response.json();
	    }).then(function (json) {
	      var results = json.results.features;
	      // console.log('done with post query! Received:' + results.length + ' features.')
	      return dispatch(receivePosts(expeditionID, results, range));
	    }).then(function () {
	      dispatch(checkFeedContent());
	    });
	  };
	}
	
	var RECEIVE_POSTS = exports.RECEIVE_POSTS = 'RECEIVE_POSTS';
	
	function receivePosts(expeditionID, data, timeRange) {
	  return {
	    type: RECEIVE_POSTS,
	    expeditionID: expeditionID,
	    data: data,
	    timeRange: timeRange
	  };
	}
	
	var COMPLETE_DAYS = exports.COMPLETE_DAYS = 'COMPLETE_DAYS';
	
	function completeDays(expeditionID) {
	  return {
	    type: COMPLETE_DAYS,
	    expeditionID: expeditionID
	  };
	}
	
	var SHOW_LOADING_WHEEL = exports.SHOW_LOADING_WHEEL = 'SHOW_LOADING_WHEEL';
	
	function showLoadingWheel() {
	  return {
	    type: SHOW_LOADING_WHEEL
	  };
	}
	
	var HIDE_LOADING_WHEEL = exports.HIDE_LOADING_WHEEL = 'HIDE_LOADING_WHEEL';
	
	function hideLoadingWheel() {
	  return {
	    type: HIDE_LOADING_WHEEL
	  };
	}
	
	var JUMP_TO = exports.JUMP_TO = 'JUMP_TO';
	
	function jumpTo(date, expeditionID) {
	  return function (dispatch, getState) {
	    var state = getState();
	    var expedition = state.expeditions[expeditionID];
	    var expeditionDay = Math.floor((date.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	    if (expedition.days[expeditionDay]) {
	      dispatch(updateTime(date, true, expeditionID));
	      return dispatch(fetchDay(date));
	    } else {
	      dispatch(showLoadingWheel());
	      return dispatch(fetchDay(date));
	    }
	  };
	}
	
	var START = exports.START = 'START';
	
	function startAnimation() {
	  return {
	    type: START
	  };
	}
	
	var REQUEST_EXPEDITIONS = exports.REQUEST_EXPEDITIONS = 'REQUEST_EXPEDITIONS';
	
	function requestExpeditions() {
	  return {
	    type: REQUEST_EXPEDITIONS
	  };
	}
	
	var UPDATE_TIME = exports.UPDATE_TIME = 'UPDATE_TIME';
	
	function updateTime(currentDate, updateMapState, expeditionID) {
	  return {
	    type: UPDATE_TIME,
	    currentDate: currentDate,
	    updateMapState: updateMapState,
	    expeditionID: expeditionID
	  };
	}
	
	var UPDATE_MAP = exports.UPDATE_MAP = 'UPDATE_MAP';
	
	function updateMap(currentDate, coordinates, viewGeoBounds, zoom, expeditionID) {
	  return function (dispatch, getState) {
	    var state = getState();
	    var expedition = state.expeditions[expeditionID];
	    var tiles = expedition.featuresByTile;
	    var tileResolution = Math.floor((expedition.geoBounds[2] - expedition.geoBounds[0]) * 111 / 10);
	
	    var coordinatesToTile = function coordinatesToTile(coordinates, geoBounds) {
	      var x = Math.floor((coordinates[0] - geoBounds[0]) * 111 / 10);
	      var y = Math.floor((coordinates[1] - geoBounds[3]) * 111 / 10);
	      return { x: x, y: y };
	    };
	
	    var tileToCoordinates = function tileToCoordinates(tile, geoBounds) {
	      var lng = tile.x * 10 / 111 + geoBounds[0];
	      var lat = tile.y * 10 / 111 + geoBounds[3];
	      return [lng, lat];
	    };
	
	    var west = viewGeoBounds[0];
	    var north = viewGeoBounds[1];
	    var east = viewGeoBounds[2];
	    var south = viewGeoBounds[3];
	
	    // TODO TEMPORARY: limiting max range
	    var centroid = [(west + east) / 2, (south + north) / 2];
	    west = centroid[0] + Math.max(west - centroid[0], -0.1);
	    east = centroid[0] + Math.min(east - centroid[0], 0.1);
	    north = centroid[1] + Math.min(north - centroid[1], 0.1);
	    south = centroid[1] + Math.max(south - centroid[1], -0.1);
	    // TEMPORARY
	
	    var northWestTile = coordinatesToTile([west, north], expedition.geoBounds);
	    var southEastTile = Object.assign({}, northWestTile);
	    while (tileToCoordinates(southEastTile, expedition.geoBounds)[0] <= east) {
	      southEastTile.x++;
	    }
	    while (tileToCoordinates(southEastTile, expedition.geoBounds)[1] >= south) {
	      southEastTile.y--;
	    }
	
	    var tileRange = [];
	    var tilesInView = [];
	    for (var x = northWestTile.x; x <= southEastTile.x; x++) {
	      for (var y = northWestTile.y; y >= southEastTile.y; y--) {
	        var tile = x + y * tileResolution;
	        if (!tiles[tile]) tileRange.push({ x: x, y: y });
	        tilesInView.push(x + y * tileResolution);
	      }
	    }
	
	    var queryNorthWest = [180, -90];
	    var querySouthEast = [-180, 90];
	    tileRange.forEach(function (t) {
	      var northWest = tileToCoordinates(t, expedition.geoBounds);
	      var southEast = tileToCoordinates({ x: t.x + 1, y: t.y - 1 }, expedition.geoBounds);
	      if (queryNorthWest[0] > northWest[0]) queryNorthWest[0] = northWest[0];
	      if (queryNorthWest[1] < northWest[1]) queryNorthWest[1] = northWest[1];
	      if (querySouthEast[0] < southEast[0]) querySouthEast[0] = southEast[0];
	      if (querySouthEast[1] > southEast[1]) querySouthEast[1] = southEast[1];
	    });
	    var queryGeoBounds = [queryNorthWest[0], queryNorthWest[1], querySouthEast[0], querySouthEast[1]];
	
	    tileRange.forEach(function (t, i, a) {
	      a[i] = t.x + t.y * tileResolution;
	    });
	
	    if (tileRange.length > 0) {
	      var queryString = 'https://intotheokavango.org/api/features?limit=0&FeatureType=blog,audio,image,tweet,sighting&Expedition=' + state.selectedExpedition + '&geoBounds=' + queryGeoBounds.toString();
	      // console.log('querying features by tile:', queryString)
	      (0, _isomorphicFetch2.default)(queryString).then(function (response) {
	        return response.json();
	      }).then(function (json) {
	        var results = json.results.features;
	        // console.log('done with feature query! Received ' + results.length + ' features.')
	        dispatch(receiveFeatures(state.selectedExpedition, results, tileRange));
	      });
	    }
	
	    return dispatch({
	      type: UPDATE_MAP,
	      expeditionID: expeditionID,
	      currentDate: currentDate,
	      coordinates: coordinates,
	      viewGeoBounds: viewGeoBounds,
	      tilesInView: tilesInView,
	      zoom: zoom,
	      tileRange: tileRange
	    });
	  };
	}
	
	var RECEIVE_EXPEDITIONS = exports.RECEIVE_EXPEDITIONS = 'RECEIVE_EXPEDITIONS';
	
	function receiveExpeditions(data) {
	  for (var k in data.results) {
	    if (data.results[k].Days < 1) {
	      delete data.results[k];
	    }
	  }
	
	  return {
	    type: RECEIVE_EXPEDITIONS,
	    data: data
	  };
	}
	
	function fetchExpeditions() {
	  return function (dispatch, getState) {
	    dispatch(requestExpeditions());
	    return (0, _isomorphicFetch2.default)('https://intotheokavango.org/api/expeditions').then(function (response) {
	      return response.json();
	    }).then(function (json) {
	      return dispatch(receiveExpeditions(json));
	    }).then(function () {
	      return dispatch(fetchDay(new Date('2016-08-30 00:00:00+00:00'), null, null, true));
	    }).then(function () {
	      var state = getState();
	      // Object.keys(state.expeditions).forEach((id) => {
	      //   if (id !== state.selectedExpedition) {
	      //     dispatch(fetchDay(null, null, id, false))
	      //   }
	      // })
	      dispatch(fetchTotalSightings(state.selectedExpedition));
	      if (location.pathname === '/journal') {
	        dispatch(checkFeedContent());
	      }
	    });
	  };
	}
	
	function fetchTotalSightings(id) {
	  return function (dispatch, getState) {
	    return (0, _isomorphicFetch2.default)('https://intotheokavango.org/api/sightings?FeatureType=sighting&limit=0&Expedition=' + id).then(function (response) {
	      return response.json();
	    }).then(function (json) {
	      return dispatch(receiveTotalSightings(id, json));
	    });
	  };
	}
	
	var RECEIVE_TOTAL_SIGHTINGS = exports.RECEIVE_TOTAL_SIGHTINGS = 'RECEIVE_TOTAL_SIGHTINGS';
	
	function receiveTotalSightings(id, data) {
	  return {
	    type: RECEIVE_TOTAL_SIGHTINGS,
	    id: id,
	    data: data
	  };
	}
	
	function fetchDay(date, initialDate, _expeditionID, initialize) {
	  if (!initialDate) initialDate = date;
	  return function (dispatch, getState) {
	    var state = getState();
	    var expeditionID = _expeditionID || state.selectedExpedition;
	    var expedition = state.expeditions[expeditionID];
	    if (!date) date = expedition.currentDate;
	    var expeditionDay = Math.floor((date.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	    var daysToFetch = [];
	    if (!expedition.days[expeditionDay - 1] && expeditionDay - 1 >= 0) daysToFetch.push(expeditionDay - 1);
	    if (!expedition.days[expeditionDay]) daysToFetch.push(expeditionDay);
	    if (!expedition.days[expeditionDay + 1] && expeditionDay + 1 < expedition.dayCount) daysToFetch.push(expeditionDay + 1);
	
	    if (daysToFetch.length === 0) return;
	
	    daysToFetch.forEach(function (d, i, a) {
	      var t = expedition.start.getTime() + d * (1000 * 3600 * 24);
	      a[i] = t;
	    });
	    var range = [timestampToString(d3.min(daysToFetch)), timestampToString(d3.max(daysToFetch) + 1000 * 3600 * 24)];
	
	    var goFetch = function goFetch(featureTypes, results, expeditionID) {
	      var type = featureTypes.shift();
	      var queryString = 'https://intotheokavango.org/api/features?limit=0&FeatureType=' + type + '&Expedition=' + expeditionID + '&startDate=' + range[0] + '&endDate=' + range[1];
	      if (type === 'ambit_geo') queryString += '&resolution=5';
	      // console.log('querying:', queryString)
	      (0, _isomorphicFetch2.default)(queryString).then(function (response) {
	        return response.json();
	      }).then(function (json) {
	        results = results.concat(json.results.features);
	        if (featureTypes.length > 0) {
	          // console.log('received ' + json.results.features.length + ' ' + type)
	          goFetch(featureTypes, results, expeditionID);
	        } else {
	          // console.log('done with query! Received ' + json.results.features.length + ' ' + type, initialize)
	          dispatch(receiveDay(expeditionID, results, range));
	          dispatch(completeDays(expeditionID));
	          var state = getState();
	          var expedition = state.expeditions[state.selectedExpedition];
	          var days = expedition.days;
	          var incompleteDays = [];
	          d3.keys(expedition.days).forEach(function (k) {
	            if (expedition.days[k].incomplete) incompleteDays.push(k);
	          });
	          if (incompleteDays.length === 0) {
	            // not sure why I need this '|| date'
	            if (!state.animate && initialize) dispatch(startAnimation());
	            // dispatch(updateTime(initialDate || date, false, expeditionID))
	            dispatch(updateTime(new Date('2016-08-30 00:00:00+00:00'), false, expeditionID));
	            dispatch(hideLoadingWheel());
	          } else {
	            // console.log('incomplete days', incompleteDays)
	            var nextTarget = -1;
	            for (var i = 0; i < incompleteDays.length; i++) {
	              var id = incompleteDays[i];
	              for (var j = Math.max(0, id - 1); j < expedition.dayCount; j++) {
	                if (!days[j]) {
	                  nextTarget = j;
	                  break;
	                }
	              }
	              if (nextTarget > -1) break;
	            }
	            if (nextTarget > -1) {
	              nextTarget = new Date(expedition.start.getTime() + nextTarget * (1000 * 3600 * 24));
	              dispatch(fetchDay(nextTarget, null, expeditionID, initialize));
	            }
	          }
	        }
	      });
	    };
	    goFetch(['ambit_geo', 'beacon'], [], expeditionID);
	  };
	}
	
	var SET_EXPEDITION = exports.SET_EXPEDITION = 'SET_EXPEDITION';
	
	function setExpedition(id) {
	  return function (dispatch, getState) {
	    var state = getState();
	    var expedition = state.expeditions[id];
	    if (expedition.totalSightings.length === 0) {
	      dispatch(fetchTotalSightings(id));
	    }
	    dispatch({
	      type: SET_EXPEDITION,
	      id: id
	    });
	  };
	}
	
	var SET_CONTROL = exports.SET_CONTROL = 'SET_CONTROL';
	
	function setControl(target, mode) {
	  return {
	    type: SET_CONTROL,
	    target: target,
	    mode: mode
	  };
	}
	
	var REQUEST_DAY = exports.REQUEST_DAY = 'REQUEST_DAY';
	
	function requestDay(expeditionID, dayID) {
	  return {
	    type: REQUEST_DAY,
	    expeditionID: expeditionID,
	    dayID: dayID
	  };
	}
	
	var RECEIVE_DAY = exports.RECEIVE_DAY = 'RECEIVE_DAY';
	
	function receiveDay(expeditionID, data, dateRange) {
	  return {
	    type: RECEIVE_DAY,
	    expeditionID: expeditionID,
	    data: data,
	    dateRange: dateRange
	  };
	}
	
	var RECEIVE_FEATURES = exports.RECEIVE_FEATURES = 'RECEIVE_FEATURES';
	
	function receiveFeatures(expeditionID, data, tileRange) {
	  return {
	    type: RECEIVE_FEATURES,
	    expeditionID: expeditionID,
	    data: data,
	    tileRange: tileRange
	  };
	}
	
	var SELECT_FEATURE = exports.SELECT_FEATURE = 'SELECT_FEATURE';
	
	function selectFeature() {
	  return {
	    type: SELECT_FEATURE
	  };
	}
	
	var UNSELECT_FEATURE = exports.UNSELECT_FEATURE = 'UNSELECT_FEATURE';
	
	function unselectFeature() {
	  return {
	    type: UNSELECT_FEATURE
	  };
	}

/***/ },

/***/ 500:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _actions = __webpack_require__(496);
	
	var actions = _interopRequireWildcard(_actions);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	var _randomcolor = __webpack_require__(501);
	
	var _randomcolor2 = _interopRequireDefault(_randomcolor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var okavangoReducer = function okavangoReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {
	    mapStateNeedsUpdate: false,
	    animate: false,
	    isFetching: false,
	    selectedExpedition: null,
	    expeditions: {},
	    speciesColors: {},
	    contentActive: !(location.pathname === '/' || location.pathname === '/map'),
	    initialPage: location.pathname
	  } : arguments[0];
	  var action = arguments[1];
	
	  var expeditions, features, id, expeditionID, expedition, days;
	
	  var timeRange;
	  var postsByDay;
	  var start;
	  var end;
	  var startDay;
	  var endDay;
	  var latestDate;
	  var latestExpedition;
	  var selectedExpedition;
	  var members;
	  var featuresByMember;
	  var featuresByDay;
	  var ambitsByTile;
	  var dateRange;
	  var i;
	  var tileResolution;
	  var coordinatesToTile;
	  var d;
	  var tileRange;
	  var featuresByTile;
	  var tileResolution;
	  var coordinatesToTile;
	  var k;
	  var feature;
	
	  var _ret = function () {
	    switch (action.type) {
	      case actions.ENABLE_CONTENT:
	        return {
	          v: _extends({}, state, {
	            contentActive: true
	          })
	        };
	      case actions.RECEIVE_POSTS:
	        // console.log('RECEIVED', action.data)
	        expeditionID = action.expeditionID;
	        expedition = state.expeditions[expeditionID];
	
	        // initializing days
	        timeRange = action.timeRange;
	        postsByDay = {};
	        start = new Date(timeRange[0]);
	        end = new Date(timeRange[1]);
	        startDay = Math.floor((start.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	        endDay = Math.floor((end.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	
	        for (i = startDay; i <= endDay; i++) {
	          postsByDay[i] = {};
	        }
	
	        features = {};
	        action.data.forEach(function (f) {
	          var id = f.id;
	          if (f.geometry) {
	            features[id] = featureReducer(expedition.features[id], action, f);
	          }
	        });
	
	        Object.keys(features).forEach(function (id) {
	          var feature = features[id];
	          var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	          if (!postsByDay[day]) postsByDay[day] = {};
	          postsByDay[day][id] = feature;
	        });
	        Object.keys(postsByDay).forEach(function (k) {
	          postsByDay[k] = Object.assign({}, expedition.postsByDay[k], postsByDay[k]);
	        });
	
	        return {
	          v: Object.assign({}, state, {
	            // isFetchingPosts: state.isFetchingPosts - 1,
	            mapStateNeedsUpdate: false,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, expeditionID, Object.assign({}, expedition, {
	              features: Object.assign({}, expedition.features, features),
	              postsByDay: Object.assign({}, expedition.postsByDay, postsByDay)
	            })))
	          })
	        };
	
	      case actions.FETCH_POSTS_BY_DAY:
	        id = action.expeditionID;
	        return {
	          v: Object.assign({}, state, {
	            // isFetchingPosts: state.isFetchingPosts + 1,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, id, expeditionReducer(state.expeditions[id], action)))
	          })
	        };
	
	      case actions.RECEIVE_TOTAL_SIGHTINGS:
	        id = action.id;
	        return {
	          v: Object.assign({}, state, {
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, id, Object.assign({}, state.expeditions[action.id], {
	              totalSightings: action.data.results
	            })))
	          })
	        };
	
	      case actions.COMPLETE_DAYS:
	        id = action.expeditionID;
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: false,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, id, expeditionReducer(state.expeditions[id], action)))
	          })
	        };
	
	      case actions.SHOW_LOADING_WHEEL:
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: false,
	            isFetching: true
	          })
	        };
	
	      case actions.HIDE_LOADING_WHEEL:
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: true,
	            isFetching: false
	          })
	        };
	
	      case actions.START:
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: true,
	            animate: true
	          })
	        };
	
	      case actions.UPDATE_TIME:
	        expeditionID = action.expeditionID;
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: action.updateMapState,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, expeditionID, expeditionReducer(state.expeditions[expeditionID], action)))
	          })
	        };
	
	      case actions.UPDATE_MAP:
	        expeditionID = action.expeditionID;
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: true,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, expeditionID, expeditionReducer(state.expeditions[expeditionID], action)))
	          })
	        };
	
	      case actions.RECEIVE_EXPEDITIONS:
	        expeditions = {};
	        latestDate = new Date(0);
	
	        Object.keys(action.data.results).forEach(function (id) {
	          var e = action.data.results[id];
	          expeditions[id] = expeditionReducer(state.expeditions[id], action, e);
	          if (expeditions[id].start.getTime() + expeditions[id].dayCount * (1000 * 3600 * 24) > latestDate.getTime()) {
	            latestDate = new Date(expeditions[id].start.getTime() + expeditions[id].dayCount * (1000 * 3600 * 24));
	            latestExpedition = id;
	          }
	        });
	
	        return {
	          v: Object.assign({}, state, {
	            expeditions: Object.assign({}, state.expeditions, expeditions),
	            isFetching: false,
	            selectedExpedition: latestExpedition
	          })
	        };
	
	      case actions.SET_EXPEDITION:
	        selectedExpedition = action.id;
	
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: true,
	            selectedExpedition: selectedExpedition
	          })
	        };
	
	      case actions.SET_CONTROL:
	        id = state.selectedExpedition;
	        expeditions = _defineProperty({}, id, expeditionReducer(state.expeditions[id], action));
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: action.target === 'zoom',
	            expeditions: Object.assign({}, state.expeditions, expeditions)
	          })
	        };
	
	      case actions.RECEIVE_DAY:
	        expeditionID = action.expeditionID;
	        expedition = state.expeditions[expeditionID];
	
	        // initialize feature buckets
	        members = _extends({}, expedition.members);
	        featuresByMember = {};
	        featuresByDay = {};
	        ambitsByTile = {};
	        dateRange = action.dateRange.map(function (d) {
	          return Math.floor((new Date(d).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	        });
	
	        for (i = dateRange[0]; i <= dateRange[1]; i++) {
	          featuresByDay[i] = {};
	        }
	
	        // initialize features
	        features = {};
	        action.data.forEach(function (f) {
	          var id = f.id;
	          if (f.properties.Team === 'RiverMain') {
	            if (f.properties.FeatureType !== 'ambit_geo' || f.properties.Member === 'Steve' || f.properties.Member === 'GB' || f.properties.Member === 'Jer' || f.properties.Member === 'Shah') {
	              features[id] = featureReducer(expedition.features[id], action, f);
	              if (f.properties.FeatureType === 'ambit_geo') {
	                if (!members[f.properties.Member]) {
	                  members[f.properties.Member] = {
	                    color: expedition.memberColors[d3.values(members).length % expedition.memberColors.length]
	                  };
	                }
	              }
	            }
	          }
	        });
	
	        tileResolution = Math.floor((expedition.geoBounds[2] - expedition.geoBounds[0]) * 111 / 10);
	
	        coordinatesToTile = function coordinatesToTile(coordinates, geoBounds) {
	          var x = Math.floor((coordinates[0] - geoBounds[0]) * 111 / 10);
	          var y = Math.floor((coordinates[1] - geoBounds[3]) * 111 / 10);
	          return { x: x, y: y };
	        };
	
	        // assign feature to day, tile and member
	
	
	        Object.keys(features).forEach(function (id) {
	          var feature = features[id];
	          // assign feature to day
	          var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	          var type = feature.properties.FeatureType;
	          if (!featuresByDay[day]) featuresByDay[day] = {};
	          if (!featuresByDay[day][type]) featuresByDay[day][type] = {};
	          featuresByDay[day][type][id] = feature;
	
	          if (feature.properties.FeatureType === 'ambit_geo') {
	            // assign feature to member
	            var memberID = feature.properties.Member;
	            if (!members[memberID]) {
	              members[memberID] = {
	                name: memberID,
	                color: expedition.memberColors[d3.values(members).length % expedition.memberColors.length]
	              };
	            }
	            var dayID = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	            if (!featuresByMember[memberID]) featuresByMember[memberID] = {};
	            if (!featuresByMember[memberID][dayID]) featuresByMember[memberID][dayID] = {};
	            featuresByMember[memberID][dayID][id] = feature;
	
	            // assign feature to tile
	            var tileCoordinates = coordinatesToTile(feature.geometry.coordinates, expedition.geoBounds);
	            var tileID = tileCoordinates.x + tileCoordinates.y * tileResolution;
	            if (!ambitsByTile[tileID]) ambitsByTile[tileID] = {};
	            ambitsByTile[tileID][id] = feature;
	          }
	        });
	
	        var extendFeatures = function extendFeatures(bucket) {
	          if (d3.values(bucket).length > 0) {
	            // pick the two earliest and latest features
	            var timeRange = [new Date(), new Date(0)];
	            var featureRange = [];
	            d3.values(bucket).forEach(function (f) {
	              var dateTime = new Date(f.properties.DateTime);
	              if (timeRange[0].getTime() > dateTime.getTime()) {
	                timeRange[0] = dateTime;
	                featureRange[0] = f;
	              }
	              if (timeRange[1].getTime() < dateTime.getTime()) {
	                timeRange[1] = dateTime;
	                featureRange[1] = f;
	              }
	            });
	
	            // clone features with new dates
	            var start = new Date(timeRange[0].getTime() - timeRange[0].getTime() % (1000 * 3600 * 24));
	            var end = new Date(start.getTime() + 1000 * 3600 * 24);
	            id = Date.now() + Math.floor(Math.random() * 10000) / 10000;
	            bucket[id] = Object.assign({}, featureRange[0]);
	            bucket[id].properties = Object.assign({}, bucket[id].properties, {
	              DateTime: start.toString()
	            });
	            id = Date.now() + Math.floor(Math.random() * 10000) / 10000;
	            bucket[id] = Object.assign({}, featureRange[1]);
	            bucket[id].properties = Object.assign({}, bucket[id].properties, {
	              DateTime: end.toString()
	            });
	          }
	        };
	        Object.keys(featuresByDay).forEach(function (d) {
	          featuresByDay[d] = Object.assign({}, expedition.featuresByDay[d], featuresByDay[d]);
	          extendFeatures(featuresByDay[d].beacon);
	        });
	        Object.keys(featuresByMember).forEach(function (m) {
	          Object.keys(featuresByMember[m]).forEach(function (d) {
	            extendFeatures(featuresByMember[m][d]);
	          });
	        });
	
	        featuresByDay = Object.assign({}, expedition.featuresByDay, featuresByDay);
	        days = Object.assign({}, featuresByDay);
	        for (d in days) {
	          days[d] = dayReducer(expedition.days[d], action, featuresByDay[d]);
	        }
	
	        Object.keys(featuresByMember).forEach(function (k) {
	          featuresByMember[k] = Object.assign({}, expedition.featuresByMember[k], featuresByMember[k]);
	        });
	
	        Object.keys(ambitsByTile).forEach(function (k) {
	          ambitsByTile[k] = Object.assign({}, expedition.ambitsByTile[k], ambitsByTile[k]);
	        });
	
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: false,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, expeditionID, Object.assign({}, expedition, {
	              days: Object.assign({}, expedition.days, days),
	              // features: Object.assign({}, expedition.features, features),
	              featuresByDay: featuresByDay,
	              featuresByMember: Object.assign({}, expedition.featuresByMember, featuresByMember),
	              ambitsByTile: Object.assign({}, expedition.ambitsByTile, ambitsByTile),
	              members: members
	            })))
	          })
	        };
	
	      case actions.RECEIVE_FEATURES:
	        expeditionID = action.expeditionID;
	        expedition = state.expeditions[expeditionID];
	
	        tileRange = action.tileRange;
	        featuresByTile = {};
	
	        tileRange.forEach(function (t, i) {
	          featuresByTile[t] = {};
	        });
	
	        var rgbToString = function rgbToString(rgb) {
	          return rgb.slice(4).slice(0, -1).split(',').map(function (c) {
	            return parseInt(c);
	          });
	        };
	
	        features = {};
	        action.data.forEach(function (f) {
	          var id = f.id;
	          if (f.properties.Team === 'RiverMain') {
	            var flag = true;
	            if (f.properties.FeatureType === 'sighting') {
	              if (!f.properties.Taxonomy) f.properties.color = rgbToString('rgb(180,180,180)');else {
	                var taxClass = f.properties.Taxonomy.Class;
	                if (!state.speciesColors[taxClass]) state.speciesColors[taxClass] = rgbToString((0, _randomcolor2.default)({ luminosity: 'light', format: 'rgb' }));
	                f.properties.color = state.speciesColors[taxClass];
	              }
	            }
	            if (f.properties.FeatureType === 'tweet' && f.properties.Text && f.properties.Text[0] === '@') flag = false;
	            if (flag) {
	              features[id] = featureReducer(expedition.features[id], action, f);
	            }
	          }
	        });
	
	        tileResolution = Math.floor((expedition.geoBounds[2] - expedition.geoBounds[0]) * 111 / 10);
	
	        coordinatesToTile = function coordinatesToTile(coordinates, geoBounds) {
	          var x = Math.floor((coordinates[0] - geoBounds[0]) * 111 / 10);
	          var y = Math.floor((coordinates[1] - geoBounds[3]) * 111 / 10);
	          return { x: x, y: y };
	        };
	
	        Object.keys(features).forEach(function (id) {
	          var feature = features[id];
	          var tileCoordinates = coordinatesToTile(feature.geometry.coordinates, expedition.geoBounds);
	          var tileID = tileCoordinates.x + tileCoordinates.y * tileResolution;
	          if (!featuresByTile[tileID]) featuresByTile[tileID] = {};
	          featuresByTile[tileID][id] = feature;
	        });
	        Object.keys(featuresByTile).forEach(function (k) {
	          featuresByTile[k] = Object.assign({}, expedition.featuresByTile[k], featuresByTile[k]);
	        });
	
	        for (k in features) {
	          feature = features[k];
	
	          if (feature.properties.FeatureType === 'sighting') {
	            delete features[k];
	          }
	        }
	
	        return {
	          v: Object.assign({}, state, {
	            mapStateNeedsUpdate: false,
	            expeditions: Object.assign({}, state.expeditions, _defineProperty({}, expeditionID, Object.assign({}, expedition, {
	              features: Object.assign({}, expedition.features, features),
	              featuresByTile: Object.assign({}, expedition.featuresByTile, featuresByTile)
	            })))
	          })
	        };
	
	      case actions.SELECT_FEATURE:
	        break;
	
	      case actions.UNSELECT_FEATURE:
	        break;
	      default:
	        return {
	          v: state
	        };
	    }
	  }();
	
	  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  return state;
	};
	
	var expeditionReducer = function expeditionReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {
	    name: '',
	    playback: 'forward',
	    layout: 'rows',
	    initialZoom: 4,
	    targetZoom: 15,
	    zoom: 15,
	    isFetching: false,
	    geoBounds: [-8, -21.5, 25.5, 12],
	    tileSize: 10,
	    start: new Date(),
	    end: new Date(0),
	    currentDate: new Date(),
	    dayCount: 0,
	    days: [],
	    features: {},
	    featuresByTile: {},
	    ambitsByTile: {},
	    featuresByDay: {},
	    postsByDay: {},
	    featuresByMember: {},
	    mainFocus: 'Explorers',
	    secondaryFocus: 'Steve',
	    coordinates: [0, 0],
	    currentPosts: [],
	    currentSightings: [],
	    currentAmbits: [],
	    totalSightings: [],
	    memberColors: ['rgba(253, 191, 111, 1)', 'rgba(166, 206, 227, 1)', 'rgba(178, 223, 138, 1)', 'rgba(251, 154, 153, 1)', 'rgba(202, 178, 214, 1)', 'rgba(252, 234, 151, 1)', 'rgba(180, 240, 209, 1)', 'rgba(191, 191, 255, 1)', 'rgba(255, 171, 213, 1)'],
	    members: {},
	    currentMembers: []
	  } : arguments[0];
	  var action = arguments[1];
	  var data = arguments[2];
	
	  var i;
	  switch (action.type) {
	    case actions.FETCH_POSTS_BY_DAY:
	      var postsByDay = [];
	      // var start = new Date(action.range[0])
	      // var end = new Date(action.range[1])
	      // var startDay = Math.floor((start.getTime() - state.start.getTime()) / (1000 * 3600 * 24))
	      // var endDay = Math.floor((end.getTime() - state.start.getTime()) / (1000 * 3600 * 24))
	      // for (i = startDay; i <= endDay; i++) {
	      action.daysToFetch.forEach(function (d) {
	        postsByDay[d] = 'loading';
	      });
	      return Object.assign({}, state, {
	        postsByDay: Object.assign({}, state.postsByDay, postsByDay)
	      });
	
	    case actions.COMPLETE_DAYS:
	      var days = Object.assign({}, state.days);
	
	      // add mock days at both ends of the expedition
	      for (i = 0; i < state.dayCount; i++) {
	        if (days[i] && !days[i].incomplete) {
	          days[-1] = Object.assign({}, days[i]);
	          break;
	        }
	      }
	      for (i = state.dayCount; i >= 0; i--) {
	        if (days[i] && !days[i].incomplete) {
	          days[state.dayCount] = Object.assign({}, days[i]);
	          break;
	        }
	      }
	
	      // detect incomplete days
	      var incompleteRange = [-1, -1];
	      var completedDays = [];
	      for (i = 0; i < state.dayCount; i++) {
	        var day = days[i];
	        if (!day) {
	          incompleteRange = [-1, -1];
	        } else {
	          if (day.incomplete && days[i - 1] && !days[i - 1].incomplete) {
	            incompleteRange[0] = i;
	            incompleteRange[1] = -1;
	          }
	          if (day.incomplete && days[i + 1] && !days[i + 1].incomplete) {
	            incompleteRange[1] = i;
	          }
	        }
	
	        // full data gap detected, filling in
	        if (incompleteRange[0] > -1 && incompleteRange[1] > -1) {
	          // look for filling values bordering the gap
	          var fillingDays = [days[+incompleteRange[0] - 1], days[+incompleteRange[1] + 1]];
	          var fillingBeacons = [d3.values(fillingDays[0].beacons).slice(0).sort(function (a, b) {
	            return new Date(b.properties.DateTime).getTime() - new Date(a.properties.DateTime).getTime();
	          })[0], d3.values(fillingDays[1].beacons).slice(0).sort(function (a, b) {
	            return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime();
	          })[0]];
	
	          // fill in gaps
	          var l2 = Math.ceil((incompleteRange[1] - incompleteRange[0] + 1) / 2);
	          for (var j = 0; j < l2; j++) {
	            var dayIndex = [+incompleteRange[0] + j, +incompleteRange[1] - j];
	            for (var k = 0; k < 2; k++) {
	              for (var l = 0; l < 2; l++) {
	                // here k === 0 removes gradual translation between day 1 to day 2
	                if (k === 0 || days[dayIndex[0]] !== days[dayIndex[1]] || l === 0) {
	                  var dayID = dayIndex[k];
	                  day = days[dayID];
	                  var date = new Date(state.start.getTime() + 1000 * 3600 * 24 * (dayID + (k === l ? 0 : 1)));
	                  var beaconID = Date.now() + Math.floor(Math.random() * 10000) / 10000;
	                  day.beacons[beaconID] = Object.assign({}, fillingBeacons[k]);
	                  day.beacons[beaconID].properties = Object.assign({}, day.beacons[beaconID].properties, {
	                    DateTime: date
	                  });
	                  day.incomplete = false;
	                  if (completedDays.indexOf(dayID) === -1) completedDays.push(dayID);
	                }
	              }
	            }
	          }
	          incompleteRange = [-1, -1];
	        }
	      }
	
	      // remove mock days at both ends of the expedition
	      delete days[-1];
	      delete days[state.dayCount];
	
	      // console.log('fill following days:', completedDays, days)
	      return Object.assign({}, state, {
	        days: days
	      });
	
	    case actions.UPDATE_TIME:
	      return Object.assign({}, state, {
	        currentDate: action.currentDate
	      });
	
	    case actions.UPDATE_MAP:
	
	      // initializing featuresByTile entries so they won't be queries multiple times
	      action.tileRange.forEach(function (t) {
	        if (!state.featuresByTile[t]) state.featuresByTile[t] = {};
	      });
	
	      var currentSightings = [];
	      var currentPosts = [];
	      var currentDays = [];
	      var currentAmbits = {};
	      var currentMembers = [];
	
	      var allAmbits = [];
	      action.tilesInView.forEach(function (t) {
	        // sort features by type
	        var features = {};
	        d3.values(state.featuresByTile[t]).forEach(function (f) {
	          if (!features[f.properties.FeatureType]) features[f.properties.FeatureType] = [];
	          features[f.properties.FeatureType].push(f);
	          var day = Math.floor((new Date(f.properties.DateTime).getTime() - state.start.getTime()) / (1000 * 3600 * 24));
	          if (currentDays.indexOf(day) === -1) currentDays.push(day);
	        });
	
	        // this def could be written more elegantly...
	        d3.values(state.ambitsByTile[t]).forEach(function (f) {
	          var day = Math.floor((new Date(f.properties.DateTime).getTime() - state.start.getTime()) / (1000 * 3600 * 24));
	          if (currentDays.indexOf(day) === -1) currentDays.push(day);
	        });
	
	        if (features.sighting) {
	          var sightings = features.sighting.map(function (f) {
	            return {
	              position: {
	                x: f.geometry.coordinates[0],
	                y: f.geometry.coordinates[1],
	                z: 0
	              },
	              radius: f.properties.radius,
	              color: f.properties.color,
	              type: f.properties.FeatureType
	            };
	          });
	          currentSightings = currentSightings.concat(sightings);
	        }
	
	        var allPosts = [];
	        if (features.tweet) allPosts = allPosts.concat(features.tweet);
	        if (features.audio) allPosts = allPosts.concat(features.audio);
	        if (features.blog) allPosts = allPosts.concat(features.blog);
	        if (features.image) allPosts = allPosts.concat(features.image);
	        if (allPosts) {
	          var posts = allPosts.map(function (f) {
	            return {
	              position: [f.geometry.coordinates[0], f.geometry.coordinates[1]],
	              type: f.properties.FeatureType,
	              id: f.id,
	              properties: f.properties
	            };
	          });
	          currentPosts = currentPosts.concat(posts);
	        }
	      });
	
	      var paddingDays = [];
	      currentDays.forEach(function (d) {
	        var flag = false;
	        for (i = d - 1; i <= d + 1; i++) {
	          if (currentDays.indexOf(i) === -1 && paddingDays.indexOf(i) === -1) {
	            paddingDays.push(i);
	            flag = true;
	          }
	        }
	        if (flag) actions.fetchDay(new Date(state.start.getTime() + 1000 * 3600 * 24 * d));
	      });
	      currentDays = currentDays.concat(paddingDays);
	
	      currentDays = currentDays.sort(function (a, b) {
	        return a - b;
	      }).forEach(function (d) {
	        if (state.featuresByDay[d]) {
	          allAmbits = allAmbits.concat(d3.values(state.featuresByDay[d].ambit_geo));
	        }
	      });
	
	      allAmbits.sort(function (a, b) {
	        return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime();
	      }).forEach(function (f) {
	        var memberID = f.properties.Member;
	        if (!currentAmbits[memberID]) {
	          currentAmbits[memberID] = {
	            color: state.members[memberID].color,
	            coordinates: [],
	            dates: []
	          };
	        }
	        if (!currentMembers[memberID]) currentMembers[memberID] = {};
	        currentAmbits[memberID].coordinates.push(f.geometry.coordinates);
	        currentAmbits[memberID].dates.push(f.properties.DateTime);
	      });
	
	      currentAmbits = d3.values(currentAmbits);
	
	      return Object.assign({}, state, {
	        currentSightings: currentSightings,
	        currentAmbits: currentAmbits,
	        currentMembers: currentMembers,
	        currentPosts: currentPosts,
	        currentDate: action.currentDate,
	        coordinates: action.coordinates,
	        zoom: action.zoom
	      });
	
	    case actions.RECEIVE_EXPEDITIONS:
	      var dayCount = data.Days + 1;
	      // removing +1 here because we receive beacons before any other features on current day
	      // var dayCount = data.Days
	      var start = new Date(new Date(data.StartDate).getTime() + 2 * (1000 * 3600));
	      var end = new Date(start.getTime() + dayCount * (1000 * 3600 * 24));
	      // currentDate is 2 days before last beacon
	      var currentDate = new Date(end.getTime() - 2 * (1000 * 3600 * 24));
	
	      var name = data.Name;
	
	      // 111 km per latitude degree
	      // ~ 10km per screen at zoom level 14
	      // [west, north, east, south]
	      var geoBounds = data.GeoBounds;
	      // var geoBoundsDistance = [(geoBounds[2] - geoBounds[0]) * 111, (geoBounds[3] - geoBounds[1]) * 111]
	
	      return Object.assign({}, state, {
	        name: name,
	        start: start,
	        currentDate: currentDate,
	        end: end,
	        dayCount: dayCount,
	        geoBounds: geoBounds
	      });
	
	    case actions.SET_CONTROL:
	      if (action.target === 'zoom') {
	        if (action.mode === 'increment') action.mode = Math.max(1, Math.min(15, state.zoom + 1));
	        if (action.mode === 'decrement') action.mode = Math.max(1, Math.min(15, state.zoom - 1));
	      }
	      return Object.assign({}, state, _defineProperty({}, action.target, action.mode));
	
	    default:
	      break;
	  }
	  return state;
	};
	
	var dayReducer = function dayReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {
	    isFetching: false,
	    start: new Date(),
	    end: new Date(0),
	    beacons: {},
	    ambits: {},
	    incomplete: true
	  } : arguments[0];
	  var action = arguments[1];
	  var features = arguments[2];
	
	  var start, end;
	  switch (action.type) {
	    case actions.RECEIVE_DAY:
	      start = new Date();
	      end = new Date(0);
	      if (!features.beacon) break;
	      var incomplete = Object.keys(features.beacon).length === 0;
	
	      Object.keys(features.beacon).forEach(function (k) {
	        var f = features.beacon[k];
	        var d = new Date(f.properties.DateTime);
	        if (d.getTime() < start.getTime()) start = d;
	        if (d.getTime() > end.getTime()) end = d;
	      });
	
	      return Object.assign({}, state, {
	        isFetching: false,
	        start: start,
	        end: end,
	        beacons: Object.assign({}, state.beacons, features.beacon),
	        ambits: Object.assign({}, state.ambits, features.ambit),
	        incomplete: incomplete
	      });
	
	    default:
	      break;
	  }
	
	  return state;
	};
	
	var featureReducer = function featureReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var action = arguments[1];
	  var feature = arguments[2];
	
	  switch (action.type) {
	    case actions.RECEIVE_POSTS:
	      feature.properties.scatter = [(Math.random() * 2 - 1) * 0.00075, (Math.random() * 2 - 1) * 0.00075];
	      return Object.assign({}, state, feature);
	    case actions.RECEIVE_DAY:
	      return Object.assign({}, state, feature);
	    case actions.RECEIVE_FEATURES:
	      feature.properties.scatter = [(Math.random() * 2 - 1) * 0.00075, (Math.random() * 2 - 1) * 0.00075];
	      if (feature.properties.FeatureType === 'sighting') {
	        feature.properties.radius = 2 + Math.sqrt(feature.properties.Count) * 2;
	      }
	      return Object.assign({}, state, feature);
	    default:
	      break;
	  }
	
	  return state;
	};
	
	exports.default = okavangoReducer;

/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _reactRedux = __webpack_require__(486);
	
	var _Okavango = __webpack_require__(564);
	
	var _Okavango2 = _interopRequireDefault(_Okavango);
	
	var _actions = __webpack_require__(496);
	
	var actions = _interopRequireWildcard(_actions);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mapStateToProps = function mapStateToProps(state, ownProps) {
	  return {
	    expedition: state.expeditions[state.selectedExpedition],
	    children: ownProps.children,
	    animate: state.animate,
	    isFetching: state.isFetching,
	    mapStateNeedsUpdate: state.mapStateNeedsUpdate,
	    expeditionID: state.selectedExpedition,
	    contentActive: state.contentActive,
	    initialPage: state.initialPage
	  };
	};
	
	var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	  return {
	    fetchDay: function fetchDay(currentDate) {
	      return dispatch(actions.fetchDay(currentDate));
	    },
	    updateMap: function updateMap(currentDate, coordinates, viewGeoBounds, zoom, expeditionID) {
	      return dispatch(actions.updateMap(currentDate, coordinates, viewGeoBounds, zoom, expeditionID));
	    },
	    setControl: function setControl(target, mode) {
	      return dispatch(actions.setControl(target, mode));
	    },
	    jumpTo: function jumpTo(date, expeditionID) {
	      return dispatch(actions.jumpTo(date, expeditionID));
	    },
	    setPage: function setPage() {
	      return dispatch(actions.setPage());
	    },
	    enableContent: function enableContent() {
	      return dispatch(actions.enableContent());
	    }
	  };
	};
	
	var OkavangoContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_Okavango2.default);
	
	exports.default = OkavangoContainer;

/***/ },

/***/ 564:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _BackgroundMap = __webpack_require__(565);
	
	var _BackgroundMap2 = _interopRequireDefault(_BackgroundMap);
	
	var _LightBox = __webpack_require__(998);
	
	var _LightBox2 = _interopRequireDefault(_LightBox);
	
	var _Timeline = __webpack_require__(1000);
	
	var _Timeline2 = _interopRequireDefault(_Timeline);
	
	var _Navigation = __webpack_require__(1002);
	
	var _Navigation2 = _interopRequireDefault(_Navigation);
	
	var _IntroductionBox = __webpack_require__(1004);
	
	var _IntroductionBox2 = _interopRequireDefault(_IntroductionBox);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Okavango = function (_React$Component) {
	  _inherits(Okavango, _React$Component);
	
	  function Okavango() {
	    _classCallCheck(this, Okavango);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Okavango).apply(this, arguments));
	  }
	
	  _createClass(Okavango, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var children = _props.children;
	      var expedition = _props.expedition;
	      var animate = _props.animate;
	      var updateMap = _props.updateMap;
	      var fetchDay = _props.fetchDay;
	      var setControl = _props.setControl;
	      var jumpTo = _props.jumpTo;
	      var isFetching = _props.isFetching;
	      var mapStateNeedsUpdate = _props.mapStateNeedsUpdate;
	      var setPage = _props.setPage;
	      var expeditionID = _props.expeditionID;
	      var contentActive = _props.contentActive;
	      var enableContent = _props.enableContent;
	      var initialPage = _props.initialPage;
	
	      var height = { height: window.innerWidth > 768 ? window.innerHeight - 100 : window.innerHeight - 120 };
	
	      return _react2.default.createElement(
	        'div',
	        { id: 'root' },
	        _react2.default.createElement(_BackgroundMap2.default, { initialPage: initialPage, expeditionID: expeditionID, isFetching: isFetching, animate: animate, expedition: expedition, updateMap: updateMap, fetchDay: fetchDay, setControl: setControl, mapStateNeedsUpdate: mapStateNeedsUpdate }),
	        _react2.default.createElement('div', { id: 'mapOverlay', style: { display: location.pathname === '/map' || location.pathname === '/' ? 'block' : 'none' } }),
	        _react2.default.createElement('div', { id: 'nightOverlay', style: { opacity: location.pathname === '/map' || location.pathname === '/' ? 0 : 1 } }),
	        _react2.default.createElement(_Navigation2.default, { setPage: setPage, pathName: location.pathname }),
	        _react2.default.createElement(
	          'div',
	          { id: 'content', style: height, className: contentActive ? '' : 'hidden' },
	          isFetching ? _react2.default.createElement(
	            'div',
	            { id: 'loadingWheel' },
	            _react2.default.createElement('div', { className: 'wheel' })
	          ) : null,
	          _react2.default.createElement(_LightBox2.default, { active: false }),
	          _react2.default.createElement(_Timeline2.default, { expeditionID: expeditionID, expedition: expedition, jumpTo: jumpTo }),
	          _react2.default.createElement(
	            'div',
	            { id: 'pageContainer' },
	            children
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'logos', style: { display: location.pathname === '/map' || location.pathname === '/' ? 'block' : 'none' } },
	            _react2.default.createElement(
	              'a',
	              { href: 'http://www.nationalgeographic.com/' },
	              _react2.default.createElement('img', { src: 'static/img/natgeoLogo.svg', alt: 'National Geographic Logo', height: '35px' })
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: 'http://conservify.org/' },
	              _react2.default.createElement('img', { src: 'static/img/conservify.png', alt: 'Conservify Logo', height: '35px' })
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: 'http://www.o-c-r.org/' },
	              _react2.default.createElement('img', { src: 'static/img/ocrLogo.svg', alt: 'The Office for Creative Research Logo', height: '35px' })
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: 'http://www.wildbirdtrust.com/' },
	              _react2.default.createElement('img', { src: 'static/img/wbtLogo.png', alt: 'Wild Bird Trust Logo', height: '35px' })
	            )
	          )
	        ),
	        _react2.default.createElement(_IntroductionBox2.default, { enableContent: enableContent })
	      );
	    }
	  }]);
	
	  return Okavango;
	}(_react2.default.Component);
	
	exports.default = Okavango;
	
	
	Okavango.propTypes = {
	  animate: _react.PropTypes.bool,
	  children: _react.PropTypes.node.isRequired,
	  expedition: _react.PropTypes.object,
	  expeditionID: _react.PropTypes.string,
	  updateMap: _react.PropTypes.func.isRequired,
	  fetchDay: _react.PropTypes.func.isRequired,
	  setControl: _react.PropTypes.func.isRequired,
	  jumpTo: _react.PropTypes.func.isRequired,
	  isFetching: _react.PropTypes.bool.isRequired,
	  mapStateNeedsUpdate: _react.PropTypes.bool.isRequired,
	  setPage: _react.PropTypes.func.isRequired,
	  contentActive: _react.PropTypes.bool.isRequired,
	  enableContent: _react.PropTypes.func.isRequired,
	  initialPage: _react.PropTypes.string.isRequired
	};

/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _desc, _value, _class;
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMapGl = __webpack_require__(566);
	
	var _reactMapGl2 = _interopRequireDefault(_reactMapGl);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	var _utils = __webpack_require__(790);
	
	var utils = _interopRequireWildcard(_utils);
	
	var _viewportMercatorProject = __webpack_require__(781);
	
	var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);
	
	var _deck = __webpack_require__(791);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	var BackgroundMap = (_class = function (_React$Component) {
	  _inherits(BackgroundMap, _React$Component);
	
	  function BackgroundMap(props) {
	    _classCallCheck(this, BackgroundMap);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundMap).call(this, props));
	
	    _this.state = {
	      animate: false,
	      coordinates: [0, 0],
	      viewport: {
	        latitude: -18.5699229,
	        longitude: 22.115456,
	        zoom: 4,
	        width: window.innerWidth,
	        height: window.innerHeight,
	        startDragLngLat: null,
	        isDragging: false
	      }
	    };
	    return _this;
	  }
	
	  _createClass(BackgroundMap, [{
	    key: 'tick',
	    value: function tick(pastFrameDate) {
	      var _this2 = this;
	
	      var speedFactor = (Date.now() - pastFrameDate) / (1000 / 60);
	      var currentFrameDate = Date.now();
	      var _props = this.props;
	      var expeditionID = _props.expeditionID;
	      var animate = _props.animate;
	      var expedition = _props.expedition;
	      var fetchDay = _props.fetchDay;
	      var setControl = _props.setControl;
	      var isFetching = _props.isFetching;
	      var updateMap = _props.updateMap;
	      var initialPage = _props.initialPage;
	
	      var b1, b2;
	      if (animate && !isFetching && location.pathname === '/map' || location.pathname === '/') {
	        var dateOffset;
	        var forward;
	        var offset;
	        var currentDate;
	        var currentDay;
	        var beacons;
	        var beaconCount;
	        var beaconIndex;
	        var timeToNextBeacon;
	        var ratioBetweenBeacons;
	        var i;
	        var currentBeacon;
	        var nextBeacon;
	        var coordinates;
	        var zoom;
	
	        (function () {
	          // increment time
	          dateOffset = 0;
	          forward = expedition.playback === 'fastForward' || expedition.playback === 'forward' || expedition.playback === 'pause';
	
	          if (_this2.state.beaconIndex === (forward ? 0 : 1) || _this2.state.beaconIndex === (forward ? d3.values(_this2.state.day.beacons).length - 2 : d3.values(_this2.state.day.beacons).length - 1)) {
	            offset = _this2.state.timeToNextBeacon > 0 ? Math.min(100000, _this2.state.timeToNextBeacon + 1) : 100000;
	
	            if (expedition.playback === 'fastBackward' || expedition.playback === 'backward') dateOffset = -1 * offset;
	            if (expedition.playback === 'forward' || expedition.playback === 'fastForward') dateOffset = offset;
	          } else {
	            if (expedition.playback === 'fastBackward') dateOffset = -25000;
	            if (expedition.playback === 'backward') dateOffset = -4000;
	            if (expedition.playback === 'forward') dateOffset = 4000;
	            if (expedition.playback === 'fastForward') dateOffset = 25000;
	          }
	          currentDate = new Date(Math.min(expedition.end.getTime() - 1, Math.max(expedition.start.getTime() + 1, _this2.state.currentDate.getTime() + dateOffset)));
	
	          // pause playback if time reaches beginning or end
	
	          if (currentDate.getTime() === expedition.end.getTime() - 1 && (expedition.playback === 'forward' || expedition.playback === 'fastForward') || currentDate.getTime() === expedition.start.getTime() + 1 && (expedition.playback === 'backward' || expedition.playback === 'fastBackward')) setControl('playback', 'pause');
	
	          // checks current day
	          currentDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	
	          if (currentDay !== _this2.state.currentDay) {
	            // new day
	            fetchDay(currentDate);
	          }
	
	          // look for most current beacon
	          var day = expedition.days[currentDay];
	          beacons = d3.values(day.beacons).sort(function (a, b) {
	            return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime();
	          });
	          beaconCount = beacons.length;
	          timeToNextBeacon = 0;
	          ratioBetweenBeacons = 0;
	
	          if (expedition.playback === 'forward' || expedition.playback === 'fastForward' || expedition.playback === 'pause') {
	            for (i = 0; i < beaconCount - 1; i++) {
	              b1 = new Date(beacons[i].properties.DateTime).getTime();
	              b2 = new Date(beacons[i + 1].properties.DateTime).getTime();
	              if (currentDate.getTime() >= b1 && currentDate.getTime() < b2) {
	                beaconIndex = i;
	                timeToNextBeacon = b2 - currentDate.getTime();
	                ratioBetweenBeacons = (currentDate.getTime() - b1) / (b2 - b1);
	                break;
	              }
	            }
	            if (beaconIndex < 0) beaconIndex = beaconCount - 1;
	          } else {
	            for (i = beaconCount - 1; i > 0; i--) {
	              b1 = new Date(beacons[i].properties.DateTime).getTime();
	              b2 = new Date(beacons[i - 1].properties.DateTime).getTime();
	              if (currentDate.getTime() <= b1 && currentDate.getTime() > b2) {
	                beaconIndex = i;
	                timeToNextBeacon = currentDate.getTime() - b2;
	                ratioBetweenBeacons = (currentDate.getTime() - b1) / (b2 - b1);
	                break;
	              }
	            }
	            if (beaconIndex < 0) beaconIndex = 0;
	          }
	          // set map coordinates to current beacon
	          currentBeacon = beacons[beaconIndex + (forward ? 0 : 0)];
	          nextBeacon = beacons[beaconIndex + (forward ? 1 : -1)];
	          coordinates = [(0, _utils.lerp)(currentBeacon.geometry.coordinates[0], nextBeacon.geometry.coordinates[0], ratioBetweenBeacons), (0, _utils.lerp)(currentBeacon.geometry.coordinates[1], nextBeacon.geometry.coordinates[1], ratioBetweenBeacons)];
	
	          // look for most current ambit_geo
	
	          var members = _extends({}, expedition.members);
	          Object.keys(members).forEach(function (memberID) {
	            var member = members[memberID];
	            var ambits = d3.values(expedition.featuresByMember[memberID][currentDay]).sort(function (a, b) {
	              return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime();
	            });
	            var ambitCount = ambits.length;
	            var ambitIndex = -1;
	            var ratioBetweenAmbits = 0;
	            if (expedition.playback === 'forward' || expedition.playback === 'fastForward' || expedition.playback === 'pause') {
	              for (var i = 0; i < ambitCount - 1; i++) {
	                b1 = new Date(ambits[i].properties.DateTime).getTime();
	                b2 = new Date(ambits[i + 1].properties.DateTime).getTime();
	                if (currentDate.getTime() >= b1 && currentDate.getTime() < b2) {
	                  ambitIndex = i;
	                  ratioBetweenAmbits = (currentDate.getTime() - b1) / (b2 - b1);
	                  break;
	                }
	              }
	              if (ambitIndex < 0) {
	                ambitIndex = ambitCount - 2;
	                ratioBetweenAmbits = 1;
	              }
	            } else {
	              for (i = ambitCount - 1; i > 0; i--) {
	                b1 = new Date(ambits[i].properties.DateTime).getTime();
	                b2 = new Date(ambits[i - 1].properties.DateTime).getTime();
	                if (currentDate.getTime() <= b1 && currentDate.getTime() > b2) {
	                  ambitIndex = i;
	                  ratioBetweenAmbits = (currentDate.getTime() - b1) / (b2 - b1);
	                  break;
	                }
	              }
	              if (ambitIndex < 0) {
	                ambitIndex = 1;
	                ratioBetweenAmbits = 1;
	              }
	            }
	            // set member coordinates
	            var currentID = ambitIndex;
	            var nextID = ambitIndex + (forward ? 1 : -1);
	            if (currentID >= 0 && currentID < ambits.length && nextID >= 0 && nextID < ambits.length) {
	              var currentAmbits = ambits[currentID];
	              var nextAmbit = ambits[nextID];
	              member.coordinates = [(0, _utils.lerp)(currentAmbits.geometry.coordinates[0], nextAmbit.geometry.coordinates[0], ratioBetweenAmbits), (0, _utils.lerp)(currentAmbits.geometry.coordinates[1], nextAmbit.geometry.coordinates[1], ratioBetweenAmbits)];
	            } else {
	              member.coordinates = [-180, 90];
	            }
	          });
	
	          zoom = (0, _utils.lerp)(_this2.state.viewport.zoom, _this2.state.viewport.targetZoom, Math.pow(_this2.state.viewport.zoom / _this2.state.viewport.targetZoom, 2) / 250 * speedFactor);
	
	          if (!(initialPage === '/' || initialPage === '/map')) zoom = _this2.state.viewport.targetZoom;
	
	          _this2.setState({
	            currentDate: currentDate,
	            animate: animate,
	            currentDay: currentDay,
	            day: day,
	            beaconIndex: beaconIndex,
	            timeToNextBeacon: timeToNextBeacon,
	            members: members,
	            viewport: _extends({}, _this2.state.viewport, {
	              longitude: coordinates[0],
	              latitude: coordinates[1],
	              zoom: zoom
	            })
	          });
	
	          if (_this2.state.frameCount % 60 === 0) {
	            var _ViewportMercator = (0, _viewportMercatorProject2.default)(_extends({}, _this2.state.viewport));
	
	            var unproject = _ViewportMercator.unproject;
	
	            var nw = unproject([0, 0]);
	            var se = unproject([window.innerWidth, window.innerHeight]);
	            var viewGeoBounds = [nw[0], nw[1], se[0], se[1]];
	            updateMap(_this2.state.currentDate, [_this2.state.viewport.longitude, _this2.state.viewport.latitude], viewGeoBounds, _this2.state.viewport.zoom, expeditionID);
	          }
	        })();
	      }
	      this.state.animate = animate;
	      this.state.frameCount++;
	      requestAnimationFrame(function () {
	        _this2.tick(currentFrameDate);
	      });
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var animate = nextProps.animate;
	      var expedition = nextProps.expedition;
	      var mapStateNeedsUpdate = nextProps.mapStateNeedsUpdate;
	      // console.log('new', animate, this.state.animate)
	
	      if (animate) {
	        var currentDate = expedition.currentDate;
	        // note: currentDay has a 1 day offset with API expeditionDay, which starts at 1
	        var currentDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	        var day = expedition.days[currentDay];
	
	        if (mapStateNeedsUpdate) {
	          this.state.currentDate = currentDate;
	          this.state.currentDay = currentDay;
	          this.state.day = day;
	          this.state.frameCount = 0;
	        }
	
	        if (!this.state.animate) {
	          this.state.animate = animate;
	          this.state.viewport = _extends({}, this.state.viewport, {
	            zoom: expedition.initialZoom,
	            targetZoom: expedition.targetZoom
	          });
	          // console.log('starting animation')
	          this.tick(Math.round(Date.now() - 1000 / 60));
	        }
	      }
	    }
	  }, {
	    key: 'redrawSVGOverlay',
	    value: function redrawSVGOverlay(_ref) {
	      var project = _ref.project;
	      var expedition = this.props.expedition;
	
	      return _react2.default.createElement(
	        'g',
	        null,
	        _react2.default.createElement(
	          'g',
	          null,
	          this.drawAmbits(project)
	        ),
	        _react2.default.createElement(
	          'g',
	          null,
	          this.drawMembers(project)
	        ),
	        _react2.default.createElement(
	          'g',
	          null,
	          this.drawPosts(project)
	        )
	      );
	    }
	  }, {
	    key: 'drawPosts',
	    value: function drawPosts(project) {
	      return ''; // TRIMMING
	      var expedition = this.props.expedition;
	      // console.log(expedition.currentPosts.length)
	
	      var icons = expedition.currentPosts.map(function (post) {
	        var translate = function translate(position) {
	          var coords = project(position);
	          var x = Math.round(coords[0]);
	          var y = Math.round(coords[1]);
	          return 'translate(' + x + ',' + y + ')';
	        };
	        return _react2.default.createElement(
	          'g',
	          { transform: translate(post.position), key: post.id },
	          _react2.default.createElement('image', { xlinkHref: '/static/img/icon-map-' + post.type + '.png', x: -12, y: -24, height: 31, width: 24 })
	        );
	      });
	      return icons;
	    }
	  }, {
	    key: 'drawMembers',
	    value: function drawMembers(project) {
	      var members = this.state.members;
	      // if (this.state.frameCount % 60 === 0) console.log(members)
	
	      if (!members || members.length === 0) return '';
	      var markers = Object.keys(members).map(function (memberID) {
	        var member = members[memberID];
	        var translate = function translate(member) {
	          var coords = project(member.coordinates);
	          var x = Math.round((coords[0] - 27 / 2) * 10) / 10;
	          var y = Math.round((coords[1] - 34) * 10) / 10;
	          return 'translate(' + x + ',' + y + ')';
	        };
	        return _react2.default.createElement(
	          'g',
	          { transform: translate(member), key: memberID },
	          _react2.default.createElement('path', { fill: 'rgba(4,0,26,0.7)', d: 'M27,13.8C27,22.2,13.5,34,13.5,34S0,22.2,0,13.8C0,6.3,6,0.3,13.5,0.3S27,6.3,27,13.8z' }),
	          _react2.default.createElement(
	            'text',
	            { style: { textAnchor: 'middle' }, x: 13.5, y: 19, fill: 'white' },
	            memberID.slice(0, 1).toUpperCase()
	          )
	        );
	      });
	      return markers;
	    }
	  }, {
	    key: 'drawAmbits',
	    value: function drawAmbits(project) {
	      var expedition = this.props.expedition;
	
	      var paths = expedition.currentAmbits.map(function (route, index) {
	        var points = route.coordinates.map(project).map(function (p) {
	          return [p[0], p[1]];
	        });
	        return _react2.default.createElement(
	          'g',
	          { key: index },
	          _react2.default.createElement(
	            'g',
	            { style: { pointerEvents: 'click', cursor: 'pointer' } },
	            _react2.default.createElement(
	              'g',
	              { style: { pointerEvents: 'visibleStroke' } },
	              _react2.default.createElement('path', {
	                style: {
	                  fill: 'none',
	                  stroke: route.color,
	                  strokeWidth: 2
	                },
	                d: 'M' + points.join('L')
	              })
	            )
	          )
	        );
	      });
	      return paths;
	    }
	
	    // @autobind
	    // onChangeViewport (newViewport) {
	    //   newViewport.width = window.innerWidth
	    //   newViewport.height = window.innerHeight
	    //   this.setState({
	    //     ...this.state,
	    //     viewport: newViewport
	    //   })
	    // }
	
	  }, {
	    key: 'render',
	    value: function render() {
	      var expedition = this.props.expedition;
	      var viewport = this.state.viewport;
	
	      var MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaWFhYWFuIiwiYSI6ImNpbXF1ZW4xOTAwbnl3Ymx1Y2J6Mm5xOHYifQ.6wlNzSdcTlonLBH-xcmUdQ';
	      var MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9';
	
	      // <div id="mapbox" style={{zIndex: (location.pathname === '/map' || location.pathname === '/' ? 0 : -100)}}>
	      // onChangeViewport={this.onChangeViewport}
	      return _react2.default.createElement(
	        'div',
	        { id: 'mapbox', style: { zIndex: location.pathname === '/map' || location.pathname === '/' ? -100 : -100 } },
	        _react2.default.createElement(
	          _reactMapGl2.default,
	          _extends({}, viewport, {
	            mapStyle: MAPBOX_STYLE,
	            mapboxApiAccessToken: MAPBOX_ACCESS_TOKEN
	          }),
	          expedition ? _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(_reactMapGl.SVGOverlay, _extends({}, viewport, {
	              startDragLngLat: [0, 0],
	              redraw: this.redrawSVGOverlay
	            })),
	            _react2.default.createElement(_deck.DeckGLOverlay, _extends({}, viewport, {
	              startDragLngLat: [0, 0],
	              layers: [new _deck.ScatterplotLayer(_extends({}, viewport, {
	                id: 'sightings',
	                data: expedition.currentSightings
	              }))]
	            }))
	          ) : ''
	        )
	      );
	    }
	  }]);
	
	  return BackgroundMap;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, 'tick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'tick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'redrawSVGOverlay', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'redrawSVGOverlay'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drawPosts', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'drawPosts'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drawMembers', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'drawMembers'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drawAmbits', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'drawAmbits'), _class.prototype)), _class);
	
	
	BackgroundMap.propTypes = {
	  animate: _react.PropTypes.bool.isRequired,
	  expedition: _react.PropTypes.object,
	  updateMap: _react.PropTypes.func.isRequired,
	  fetchDay: _react.PropTypes.func.isRequired,
	  setControl: _react.PropTypes.func.isRequired,
	  mapStateNeedsUpdate: _react.PropTypes.bool.isRequired,
	  initialPage: _react.PropTypes.string.isRequired
	};
	
	exports.default = BackgroundMap;

/***/ },

/***/ 776:
/***/ function(module, exports) {

	/* (ignored) */

/***/ },

/***/ 790:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.dateToString = dateToString;
	exports.lerp = lerp;
	function dateToString(d, short) {
	  var month = d.getUTCMonth() + 1;
	  var day = d.getUTCDate();
	  var hour = d.getUTCHours() + '';
	  if (hour.length === 1) hour = '0' + hour;
	  var minute = d.getUTCMinutes() + '';
	  if (minute.length === 1) minute = '0' + minute;
	
	  var monthString = '';
	  if (month === 1) monthString = 'January';
	  if (month === 2) monthString = 'February';
	  if (month === 3) monthString = 'March';
	  if (month === 4) monthString = 'April';
	  if (month === 5) monthString = 'May';
	  if (month === 6) monthString = 'June';
	  if (month === 7) monthString = 'July';
	  if (month === 8) monthString = 'August';
	  if (month === 9) monthString = 'September';
	  if (month === 10) monthString = 'October';
	  if (month === 11) monthString = 'November';
	  if (month === 12) monthString = 'December';
	  if (short) monthString = monthString.slice(0, 3);
	
	  return monthString + ' ' + day + ', ' + hour + ':' + minute;
	}
	
	function lerp(start, end, ratio) {
	  return start + (end - start) * ratio;
	}

/***/ },

/***/ 791:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(792);

/***/ },

/***/ 792:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _deckglOverlay = __webpack_require__(793);
	
	var _deckglOverlay2 = _interopRequireDefault(_deckglOverlay);
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _hexagonLayer = __webpack_require__(983);
	
	var _hexagonLayer2 = _interopRequireDefault(_hexagonLayer);
	
	var _choroplethLayer = __webpack_require__(985);
	
	var _choroplethLayer2 = _interopRequireDefault(_choroplethLayer);
	
	var _scatterplotLayer = __webpack_require__(990);
	
	var _scatterplotLayer2 = _interopRequireDefault(_scatterplotLayer);
	
	var _gridLayer = __webpack_require__(992);
	
	var _gridLayer2 = _interopRequireDefault(_gridLayer);
	
	var _arcLayer = __webpack_require__(994);
	
	var _arcLayer2 = _interopRequireDefault(_arcLayer);
	
	var _lineLayer = __webpack_require__(996);
	
	var _lineLayer2 = _interopRequireDefault(_lineLayer);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	// Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	module.exports = {
	  DeckGLOverlay: _deckglOverlay2.default,
	  Layer: _layer2.default,
	  HexagonLayer: _hexagonLayer2.default,
	  ChoroplethLayer: _choroplethLayer2.default,
	  ScatterplotLayer: _scatterplotLayer2.default,
	  GridLayer: _gridLayer2.default,
	  ArcLayer: _arcLayer2.default,
	  LineLayer: _lineLayer2.default
	};

/***/ },

/***/ 793:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	/* global window */
	
	// TODO move this to react-map-gl utility
	
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	var _webglRenderer = __webpack_require__(794);
	
	var _webglRenderer2 = _interopRequireDefault(_webglRenderer);
	
	var _luma = __webpack_require__(795);
	
	var _config = __webpack_require__(968);
	
	var _layerManager = __webpack_require__(969);
	
	var _viewport = __webpack_require__(971);
	
	var _viewport2 = _interopRequireDefault(_viewport);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	// TODO - move default to WebGL renderer
	var DEFAULT_PIXEL_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
	
	var PROP_TYPES = {
	  width: _react.PropTypes.number.isRequired,
	  height: _react.PropTypes.number.isRequired,
	  layers: _react.PropTypes.array.isRequired,
	  blending: _react.PropTypes.object,
	  gl: _react.PropTypes.object,
	  debug: _react.PropTypes.bool,
	  camera: _react.PropTypes.instanceOf(_luma.Camera),
	  pixelRatio: _react.PropTypes.number,
	  onWebGLInitialized: _react.PropTypes.func
	};
	
	var DEFAULT_PROPS = {
	  blending: _config.DEFAULT_BLENDING,
	  camera: null,
	  pixelRatio: DEFAULT_PIXEL_RATIO,
	  gl: null,
	  debug: false,
	  onWebGLInitialized: function onWebGLInitialized() {}
	};
	
	var DeckGLOverlay = (_class = function (_React$Component) {
	  _inherits(DeckGLOverlay, _React$Component);
	
	  _createClass(DeckGLOverlay, null, [{
	    key: 'propTypes',
	    get: function get() {
	      return PROP_TYPES;
	    }
	  }, {
	    key: 'defaultProps',
	    get: function get() {
	      return DEFAULT_PROPS;
	    }
	  }]);
	
	  function DeckGLOverlay(props) {
	    _classCallCheck(this, DeckGLOverlay);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeckGLOverlay).call(this, props));
	
	    _this.state = {};
	    _this.needsRedraw = true;
	    return _this;
	  }
	
	  _createClass(DeckGLOverlay, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _state = this.state;
	      var gl = _state.gl;
	      var scene = _state.scene;
	
	      (0, _layerManager.updateLayers)({
	        oldLayers: this.props.layers,
	        newLayers: nextProps.layers,
	        gl: gl,
	        scene: scene
	      });
	    }
	  }, {
	    key: '_onRendererInitialized',
	    value: function _onRendererInitialized(_ref) {
	      var gl = _ref.gl;
	
	      this.props.onWebGLInitialized(gl);
	      var scene = new _luma.Scene(gl, {
	        lights: _config.DEFAULT_LIGHTING,
	        backgroundColor: _config.DEFAULT_BACKGROUND_COLOR
	      });
	      // Note: Triggers React component update, rerending updated layers
	      this.setState({
	        gl: gl,
	        scene: scene
	      });
	      // Note: throws on error, don't adjust state after this call
	      (0, _layerManager.updateLayers)({
	        oldLayers: [],
	        newLayers: this.props.layers,
	        gl: gl,
	        scene: scene
	      });
	    }
	
	    // Route events to layers
	
	  }, {
	    key: '_onClick',
	    value: function _onClick(info) {
	      var picked = info.picked;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = picked[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var item = _step.value;
	
	          if (item.model.userData.layer.onClick(_extends({ color: item.color }, info))) {
	            return;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	
	    // Route events to layers
	
	  }, {
	    key: '_onMouseMove',
	    value: function _onMouseMove(info) {
	      var picked = info.picked;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = picked[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var item = _step2.value;
	
	          if (item.model.userData.layer.onHover(_extends({ color: item.color }, info))) {
	            return;
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: '_checkIfNeedRedraw',
	    value: function _checkIfNeedRedraw() {
	      var layers = this.props.layers;
	
	      return (0, _layerManager.layersNeedRedraw)(layers, { clearRedrawFlags: true });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var width = _props.width;
	      var height = _props.height;
	      var layers = _props.layers;
	      var blending = _props.blending;
	      var pixelRatio = _props.pixelRatio;
	      var latitude = _props.latitude;
	      var longitude = _props.longitude;
	      var zoom = _props.zoom;
	      var pitch = _props.pitch;
	      var bearing = _props.bearing;
	      var altitude = _props.altitude;
	      var gl = _props.gl;
	      var debug = _props.debug;
	
	      var otherProps = _objectWithoutProperties(_props, ['width', 'height', 'layers', 'blending', 'pixelRatio', 'latitude', 'longitude', 'zoom', 'pitch', 'bearing', 'altitude', 'gl', 'debug']);
	
	      var camera = this.props.camera;
	      var scene = this.state.scene;
	
	      function convertToMat4(toMatrix, fromMatrix) {
	        for (var i = 0; i < fromMatrix.length; ++i) {
	          toMatrix[i] = fromMatrix[i];
	        }
	      }
	
	      // Create a "disposable" camera and overwrite matrices
	      if (!camera) {
	        var viewport = new _viewport2.default({
	          width: width, height: height, latitude: latitude, longitude: longitude, zoom: zoom, pitch: pitch, bearing: bearing, altitude: altitude
	        });
	
	        camera = new _luma.PerspectiveCamera();
	        camera.view = new _luma.Mat4().id();
	        convertToMat4(camera.projection, viewport.getProjectionMatrix());
	      }
	
	      return _react2.default.createElement(_webglRenderer2.default, _extends({}, otherProps, {
	
	        width: width,
	        height: height,
	
	        gl: gl,
	        debug: debug,
	        viewport: { x: 0, y: 0, width: width, height: height },
	        camera: camera,
	        scene: scene,
	        blending: blending,
	        pixelRatio: pixelRatio,
	
	        onRendererInitialized: this._onRendererInitialized,
	        onNeedRedraw: this._checkIfNeedRedraw,
	        onMouseMove: this._onMouseMove,
	        onClick: this._onClick }));
	    }
	  }]);
	
	  return DeckGLOverlay;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, '_onRendererInitialized', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onRendererInitialized'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onClick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_checkIfNeedRedraw', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_checkIfNeedRedraw'), _class.prototype)), _class);
	exports.default = DeckGLOverlay;

/***/ },

/***/ 794:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	/* eslint-disable no-console, no-try-catch */
	/* global console */
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	var _luma = __webpack_require__(795);
	
	var _lodash = __webpack_require__(965);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	var PROP_TYPES = {
	  id: _react.PropTypes.string,
	
	  width: _react.PropTypes.number.isRequired,
	  height: _react.PropTypes.number.isRequired,
	
	  pixelRatio: _react.PropTypes.number,
	  viewport: _react.PropTypes.object.isRequired,
	  camera: _react.PropTypes.instanceOf(_luma.Camera).isRequired,
	  scene: _react.PropTypes.instanceOf(_luma.Scene),
	  blending: _react.PropTypes.object,
	  events: _react.PropTypes.object,
	  gl: _react.PropTypes.object,
	  debug: _react.PropTypes.bool,
	
	  onRendererInitialized: _react.PropTypes.func.isRequired,
	  onInitializationFailed: _react.PropTypes.func,
	  onError: _react.PropTypes.func,
	
	  onBeforeRenderFrame: _react.PropTypes.func,
	  onAfterRenderFrame: _react.PropTypes.func,
	  onBeforeRenderPickingScene: _react.PropTypes.func,
	  onAfterRenderPickingScene: _react.PropTypes.func,
	
	  onNeedRedraw: _react.PropTypes.func,
	  onMouseMove: _react.PropTypes.func,
	  onClick: _react.PropTypes.func
	};
	
	var DEFAULT_PROPS = {
	  id: 'webgl-canvas',
	  scene: null,
	
	  gl: null,
	  debug: false,
	
	  onRendererInitialized: function onRendererInitialized() {},
	  onInitializationFailed: function onInitializationFailed(error) {
	    return console.error(error);
	  },
	  onError: function onError(error) {
	    throw error;
	  },
	  onBeforeRenderFrame: function onBeforeRenderFrame() {},
	  onAfterRenderFrame: function onAfterRenderFrame() {},
	  onBeforeRenderPickingScene: function onBeforeRenderPickingScene() {},
	  onAfterRenderPickingScene: function onAfterRenderPickingScene() {},
	
	  onNeedRedraw: function onNeedRedraw() {
	    return true;
	  },
	  onMouseMove: function onMouseMove() {},
	  onClick: function onClick() {}
	};
	
	var WebGLRenderer = (_class = function (_React$Component) {
	  _inherits(WebGLRenderer, _React$Component);
	
	  _createClass(WebGLRenderer, null, [{
	    key: 'propTypes',
	    get: function get() {
	      return PROP_TYPES;
	    }
	  }, {
	    key: 'defaultProps',
	    get: function get() {
	      return DEFAULT_PROPS;
	    }
	
	    /**
	     * @classdesc
	     * Small react component that uses Luma.GL to initialize a WebGL context.
	     *
	     * Returns a canvas, creates a basic WebGL context, a camera and a scene,
	     * sets up a renderloop, and registers some basic event handlers
	     *
	     * @class
	     * @param {Object} props - see propTypes documentation
	     */
	
	  }]);
	
	  function WebGLRenderer(props) {
	    _classCallCheck(this, WebGLRenderer);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebGLRenderer).call(this, props));
	
	    _this.state = {
	      gl: null
	    };
	    return _this;
	  }
	
	  _createClass(WebGLRenderer, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var canvas = this.refs.overlay;
	      this._initWebGL(canvas);
	    }
	
	    /**
	     * Initialize LumaGL library and through it WebGL
	     * @param {string} canvas
	     */
	
	  }, {
	    key: '_initWebGL',
	    value: function _initWebGL(canvas) {
	      var debug = this.props.debug;
	      var gl = this.props.gl;
	
	      if (!gl) {
	        try {
	          gl = (0, _luma.createGLContext)({
	            canvas: canvas,
	            debug: debug,
	            preserveDrawingBuffer: true
	          });
	        } catch (error) {
	          this.props.onInitializationFailed(error);
	          return;
	        }
	      }
	
	      var events = (0, _luma.addEvents)(canvas, {
	        cacheSize: false,
	        cachePosition: false,
	        centerOrigin: false,
	        onClick: this._onClick,
	        onMouseMove: (0, _lodash2.default)(this._onMouseMove, 100)
	      });
	
	      this.setState({ gl: gl, events: events });
	
	      this._animationLoop();
	
	      // Call callback last, in case it throws
	      this.props.onRendererInitialized({ gl: gl });
	    }
	
	    // TODO - move this back to luma.gl/scene.js
	    /* eslint-disable max-statements */
	
	  }, {
	    key: '_pick',
	    value: function _pick(x, y) {
	      var gl = this.state.gl;
	      var _props = this.props;
	      var camera = _props.camera;
	      var scene = _props.scene;
	      var pixelRatio = _props.pixelRatio;
	
	      var pickedModels = scene.pickModels(gl, {
	        camera: camera,
	        x: x * pixelRatio,
	        y: y * pixelRatio
	      });
	
	      return pickedModels;
	    }
	  }, {
	    key: '_onClick',
	    value: function _onClick(event) {
	      var picked = this._pick(event.x, event.y);
	      this.props.onClick(_extends({}, event, { picked: picked }));
	    }
	  }, {
	    key: '_onMouseMove',
	    value: function _onMouseMove(event) {
	      var picked = this._pick(event.x, event.y);
	      this.props.onMouseMove(_extends({}, event, { picked: picked }));
	    }
	  }, {
	    key: '_renderFrame',
	    value: function _renderFrame() {
	      var _props2 = this.props;
	      var _props2$viewport = _props2.viewport;
	      var x = _props2$viewport.x;
	      var y = _props2$viewport.y;
	      var width = _props2$viewport.width;
	      var height = _props2$viewport.height;
	      var _props2$blending = _props2.blending;
	      var enable = _props2$blending.enable;
	      var blendFunc = _props2$blending.blendFunc;
	      var blendEquation = _props2$blending.blendEquation;
	      var pixelRatio = _props2.pixelRatio;
	      var camera = _props2.camera;
	      var scene = _props2.scene;
	      var gl = this.state.gl;
	
	      if (!gl || !scene) {
	        return;
	      }
	
	      // Note: Do this after gl check, in case onNeedRedraw clears flags
	      if (!this.props.onNeedRedraw()) {
	        return;
	      }
	
	      // clear depth and color buffers
	      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	      // update viewport to latest props
	      // (typically changed by app on browser resize etc)
	      gl.viewport(x * pixelRatio, y * pixelRatio, width * pixelRatio, height * pixelRatio);
	
	      // setup bledning
	      if (enable) {
	        gl.enable(gl.BLEND);
	        gl.blendFunc.apply(gl, _toConsumableArray(blendFunc.map(function (s) {
	          return (0, _luma.glGet)(gl, s);
	        })));
	        gl.blendEquation((0, _luma.glGet)(gl, blendEquation));
	      } else {
	        gl.disable(gl.BLEND);
	      }
	
	      this.props.onBeforeRenderFrame();
	      scene.render({ camera: camera });
	      this.props.onAfterRenderFrame();
	    }
	
	    /**
	     * Main WebGL animation loop
	     */
	
	  }, {
	    key: '_animationLoop',
	    value: function _animationLoop() {
	      this._renderFrame();
	      // Keep registering ourselves for the next animation frame
	      _luma.Fx.requestAnimationFrame(this._animationLoop);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props3 = this.props;
	      var id = _props3.id;
	      var width = _props3.width;
	      var height = _props3.height;
	      var pixelRatio = _props3.pixelRatio;
	
	      return _react2.default.createElement('canvas', {
	        ref: 'overlay',
	        id: id,
	        width: width * pixelRatio || 1,
	        height: height * pixelRatio || 1,
	        style: { width: width, height: height } });
	    }
	  }]);
	
	  return WebGLRenderer;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, '_onClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onClick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_animationLoop', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_animationLoop'), _class.prototype)), _class);
	exports.default = WebGLRenderer;

/***/ },

/***/ 852:
/***/ function(module, exports) {

	/* (ignored) */

/***/ },

/***/ 895:
/***/ function(module, exports) {

	/* (ignored) */

/***/ },

/***/ 968:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Copyright (c) 2016 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	var DEFAULT_LIGHTING = exports.DEFAULT_LIGHTING = {
	  enable: true,
	  ambient: { r: 1.0, g: 1.0, b: 1.0 },
	  points: [{
	    diffuse: { r: 0.8, g: 0.8, b: 0.8 },
	    specular: { r: 0.6, g: 0.6, b: 0.6 },
	    position: [0.5, 0.5, 3]
	  }]
	};
	
	var DEFAULT_BACKGROUND_COLOR = exports.DEFAULT_BACKGROUND_COLOR = { r: 0, g: 0, b: 0, a: 0 };
	
	var DEFAULT_BLENDING = exports.DEFAULT_BLENDING = {
	  enable: true,
	  blendFunc: ['SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA'],
	  blendEquation: 'FUNC_ADD'
	};

/***/ },

/***/ 969:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateLayers = updateLayers;
	exports.layersNeedRedraw = layersNeedRedraw;
	
	var _log = __webpack_require__(970);
	
	var _log2 = _interopRequireDefault(_log);
	
	var _assert = __webpack_require__(569);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	// IMLEMENTATION NOTES: Why new layers are created on every render
	//
	// The key here is to understand the declarative / functional
	// programming nature of React.
	//
	// - In React, the a representation of the entire "UI tree" is re-rendered
	//   every time something changes.
	// - React then diffs the rendered tree of "ReactElements" against the
	// previous tree and makes optimized changes to the DOM.
	//
	// - Due the difficulty of making non-DOM elements in React 14, our Layers
	// are a "pseudo-react" construct. So, the render function will indeed create
	// new layers every render call, however the new layers are immediately
	// matched against existing layers using layer index/layer id.
	// A new layers only has a props field pointing to the unmodified props
	// object supplied by the app on creation.
	// All calculated state (programs, attributes etc) are stored in a state object
	// and this state object is moved forward to the new layer every render.
	// The new layer ends up with the state of the old layer but the props of
	// the new layer, while the old layer is discarded.
	
	/* eslint-disable no-try-catch */
	/* eslint-disable no-console */
	/* global console */
	function updateLayers(_ref) {
	  var oldLayers = _ref.oldLayers;
	  var newLayers = _ref.newLayers;
	  var gl = _ref.gl;
	  var scene = _ref.scene;
	
	  // Match all layers, checking for caught errors
	  var error1 = matchLayers(oldLayers, newLayers);
	  var error2 = finalizeOldLayers(oldLayers);
	  var error3 = updateMatchedLayers(newLayers);
	  var error4 = initializeNewLayers(newLayers, { gl: gl });
	  addLayersToScene(newLayers, scene);
	  // Throw first error found, if any
	  var error = error1 || error2 || error3 || error4;
	  if (error) {
	    throw error;
	  }
	}
	
	function layersNeedRedraw(layers) {
	  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var _ref2$clearRedrawFlag = _ref2.clearRedrawFlags;
	  var clearRedrawFlags = _ref2$clearRedrawFlag === undefined ? false : _ref2$clearRedrawFlag;
	
	  var redraw = false;
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;
	
	  try {
	    for (var _iterator = layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var layer = _step.value;
	
	      redraw = redraw || layer.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }
	
	  return redraw;
	}
	
	function layerName(layer) {
	  return layer ? layer.constructor.name + '{id:\'' + layer.props.id + '\'}' : 'null layer';
	}
	
	function matchLayers(oldLayers, newLayers) {
	  var error = null;
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;
	
	  try {
	    for (var _iterator2 = newLayers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var newLayer = _step2.value;
	
	      try {
	        // 1. given a new coming layer, find its matching layer
	        var oldLayer = _findMatchingLayer(oldLayers, newLayer);
	
	        // Only transfer state at this stage. We must not generate exceptions
	        // until all layers' state have been transferred
	        if (oldLayer) {
	          (0, _log2.default)(3, 'matched ' + layerName(newLayer), oldLayer, '=>', newLayer);
	
	          _transferLayerState(oldLayer, newLayer);
	        }
	      } catch (err) {
	        console.error('deck.gl error during matching of ' + layerName(newLayer), err);
	        // Save first error
	        error = error || err;
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	
	  return error;
	}
	
	function _findMatchingLayer(oldLayers, newLayer) {
	  var candidates = oldLayers.filter(function (l) {
	    return l.props.id === newLayer.props.id;
	  });
	  if (candidates.length > 1) {
	    throw new Error('deck.gl error layer has more than one match ' + layerName(newLayer));
	  }
	  return candidates.length > 0 && candidates[0];
	}
	
	function _transferLayerState(oldLayer, newLayer) {
	  var state = oldLayer.state;
	  var props = oldLayer.props;
	
	  (0, _assert2.default)(state, 'Matching layer has no state');
	  (0, _assert2.default)(oldLayer !== newLayer, 'Matching layer is same');
	  // Move state
	  newLayer.state = state;
	  state.layer = newLayer;
	  // Update model layer reference
	  if (state.model) {
	    state.model.userData.layer = newLayer;
	  }
	  // Keep a temporary ref to the old props, for prop comparison
	  newLayer.oldProps = props;
	  oldLayer.state = null;
	}
	
	// Note: Layers can't be initialized until gl context is available
	// Therefore this method can be called repeatedly
	// This is a hack and should be cleaned up in calling code
	function initializeNewLayers(layers, _ref3) {
	  var gl = _ref3.gl;
	
	  if (!gl) {
	    return null;
	  }
	
	  var error = null;
	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;
	
	  try {
	    for (var _iterator3 = layers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      var layer = _step3.value;
	
	      // Check if new layer, and initialize it's state
	      if (!layer.state) {
	        (0, _log2.default)(1, 'initializing ' + layerName(layer));
	        try {
	          layer.initializeLayer({ gl: gl });
	        } catch (err) {
	          console.error('deck.gl error during initialization of ' + layerName(layer), err);
	          // Save first error
	          error = error || err;
	        }
	        // Set back pointer (used in picking)
	        if (layer.state) {
	          layer.state.layer = layer;
	          // Save layer on model for picking purposes
	          // TODO - store on model.userData rather than directly on model
	        }
	        if (layer.state && layer.state.model) {
	          layer.state.model.userData.layer = layer;
	        }
	      }
	    }
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }
	
	  return error;
	}
	
	// Update the matched layers
	function updateMatchedLayers(newLayers) {
	  var error = null;
	  var _iteratorNormalCompletion4 = true;
	  var _didIteratorError4 = false;
	  var _iteratorError4 = undefined;
	
	  try {
	    for (var _iterator4 = newLayers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	      var layer = _step4.value;
	      var oldProps = layer.oldProps;
	      var props = layer.props;
	
	      if (oldProps) {
	        try {
	          layer.updateLayer(oldProps, props);
	        } catch (err) {
	          console.error('deck.gl error during update of ' + layerName(layer), err);
	          // Save first error
	          error = error || err;
	        }
	        (0, _log2.default)(2, 'updating ' + layerName(layer));
	      }
	    }
	  } catch (err) {
	    _didIteratorError4 = true;
	    _iteratorError4 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion4 && _iterator4.return) {
	        _iterator4.return();
	      }
	    } finally {
	      if (_didIteratorError4) {
	        throw _iteratorError4;
	      }
	    }
	  }
	
	  return error;
	}
	
	// Update the old layers that were matched
	function finalizeOldLayers(oldLayers) {
	  var error = null;
	  // Unmatched layers still have state, it will be discarded
	  var _iteratorNormalCompletion5 = true;
	  var _didIteratorError5 = false;
	  var _iteratorError5 = undefined;
	
	  try {
	    for (var _iterator5 = oldLayers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	      var layer = _step5.value;
	      var state = layer.state;
	
	      if (state) {
	        try {
	          layer.finalizeLayer();
	        } catch (err) {
	          console.error('deck.gl error during finalization of ' + layerName(layer), err);
	          // Save first error
	          error = error || err;
	        }
	        layer.state = null;
	        (0, _log2.default)(1, 'finalizing ' + layerName(layer));
	      }
	    }
	  } catch (err) {
	    _didIteratorError5 = true;
	    _iteratorError5 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion5 && _iterator5.return) {
	        _iterator5.return();
	      }
	    } finally {
	      if (_didIteratorError5) {
	        throw _iteratorError5;
	      }
	    }
	  }
	
	  return error;
	}
	
	function addLayersToScene(layers, scene) {
	  if (!scene) {
	    return;
	  }
	  // clear scene and repopulate based on new layers
	  scene.removeAll();
	  var _iteratorNormalCompletion6 = true;
	  var _didIteratorError6 = false;
	  var _iteratorError6 = undefined;
	
	  try {
	    for (var _iterator6 = layers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	      var layer = _step6.value;
	
	      // Add model to scene
	      if (layer.state.model) {
	        scene.add(layer.state.model);
	      }
	    }
	  } catch (err) {
	    _didIteratorError6 = true;
	    _iteratorError6 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion6 && _iterator6.return) {
	        _iterator6.return();
	      }
	    } finally {
	      if (_didIteratorError6) {
	        throw _iteratorError6;
	      }
	    }
	  }
	}

/***/ },

/***/ 970:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = log;
	
	var _assert = __webpack_require__(569);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function log(priority) {
	  (0, _assert2.default)(typeof priority === 'number');
	  if (priority <= log.priority) {
	    var _console;
	
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }
	
	    (_console = console).debug.apply(_console, args);
	  }
	} /* eslint-disable no-console */
	/* global console, window */
	
	log.priority = 0;
	
	// Expose to browser
	if (typeof window !== 'undefined') {
	  window.log = log;
	}

/***/ },

/***/ 971:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _viewport = __webpack_require__(972);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_viewport).default;
	  }
	});
	Object.defineProperty(exports, 'Viewport', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_viewport).default;
	  }
	});
	
	var _mapboxTransform = __webpack_require__(973);
	
	Object.defineProperty(exports, 'MapboxTransform', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_mapboxTransform).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 972:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _slicedToArray = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;_e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }return _arr;
	  }return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (Symbol.iterator in Object(arr)) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}(); // View and Projection Matrix calculations for mapbox-js style
	// map view properties
	
	/* eslint-disable max-len */
	// ATTRIBUTION: Matrix creation algos are based on mapbox-gl-js source code
	// This is intentionally closely mapped to mapbox-gl-js implementation to
	// ensure seamless interoperation with react-map-gl
	// https://github.com/mapbox/mapbox-gl-js/blob/033043254d30a99a00b95660e296445a1ade2d01/js/geo/transform.js
	/* elsint-enable */
	
	// We define a couple of coordinate systems:
	// ------
	// LatLon             [lng, lat] = [-180 - 180, -81 - 81]
	// World (zoom 0)     [x, y] = [0-512, y: 0-512]
	// Zoomed (zoom N)    [x, y] = [0 - 512*2**N, 0 - 512*2**N]
	// Translated         [x, y] = zero centered
	// View (Camera)      unit cube around view
	// ------
	
	var _glMatrix = __webpack_require__(730);
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	var PI = Math.PI;
	var PI_2 = PI / 2;
	var PI_4 = PI / 4;
	var DEGREES_TO_RADIANS = PI / 180;
	var RADIANS_TO_DEGREES = 180 / PI;
	var TILE_SIZE = 512;
	var WORLD_SCALE = TILE_SIZE / PI_2;
	
	var Viewport = function () {
	  /* eslint-disable max-statements */
	  function Viewport(_ref) {
	    var _ref$width = _ref.width;
	    var width = _ref$width === undefined ? 0 : _ref$width;
	    var _ref$height = _ref.height;
	    var height = _ref$height === undefined ? 0 : _ref$height;
	    var _ref$latitude = _ref.latitude;
	    var latitude = _ref$latitude === undefined ? 0 : _ref$latitude;
	    var _ref$longitude = _ref.longitude;
	    var longitude = _ref$longitude === undefined ? 0 : _ref$longitude;
	    var _ref$zoom = _ref.zoom;
	    var zoom = _ref$zoom === undefined ? 0 : _ref$zoom;
	    var _ref$pitch = _ref.pitch;
	    var pitch = _ref$pitch === undefined ? 0 : _ref$pitch;
	    var _ref$bearing = _ref.bearing;
	    var bearing = _ref$bearing === undefined ? 0 : _ref$bearing;
	    var _ref$altitude = _ref.altitude;
	    var altitude = _ref$altitude === undefined ? 1.5 : _ref$altitude;
	
	    _classCallCheck(this, Viewport);
	
	    // Viewport
	    this.width = width;
	    this.height = height;
	    this.zoom = zoom;
	    this.latitude = latitude;
	    this.longitude = longitude;
	    this.bearing = bearing;
	
	    // Scale
	    this.scale = Math.pow(2, zoom);
	    this.worldSize = TILE_SIZE * this.scale;
	    this.tileZoom = Math.floor(zoom);
	    this.zoomFraction = zoom - Math.floor(zoom);
	
	    // Bearing
	    this.bearingRadians = bearing / 180 * Math.PI;
	    this.bearingRotationMatrix = _glMatrix.mat2.create();
	    _glMatrix.mat2.rotate(this.bearingRotationMatrix, this.bearingRotationMatrix, this.bearing);
	
	    // Pitch
	    this.originalPitch = pitch;
	    this.pitch = Math.min(60, pitch);
	    this.pitchRadians = Math.min(60, pitch) / 180 * Math.PI;
	
	    // Altitude
	    this.originalAltitude = altitude;
	    this.altitude = Math.max(0.75, altitude);
	
	    // Center x, y
	    var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));
	
	    this.centerX0 = (180 + longitude) / 360 * TILE_SIZE;
	    this.centerY0 = (180 - y) / 360 * TILE_SIZE;
	    this.centerX = this.centerX0 * this.scale;
	    this.centerY = this.centerY0 * this.scale;
	
	    // Find the distance from the center point to the center top
	    // in altitude units using law of sines.
	    this.halfFov = Math.atan(0.5 / this.altitude);
	    this.topHalfSurfaceDistance = Math.sin(this.halfFov) * this.altitude / Math.sin(Math.PI / 2 - this.pitchRadians - this.halfFov);
	
	    // Calculate z value of the farthest fragment that should be rendered.
	    this.farZ = Math.cos(Math.PI / 2 - this.pitchRadians) * this.topHalfSurfaceDistance + this.altitude;
	
	    this._precomputeMatrices();
	  }
	  /* eslint-enable max-statements */
	
	  _createClass(Viewport, [{
	    key: 'project',
	    value: function project(lngLatZ) {
	      var _projectZoom = this.projectZoom0(lngLatZ);
	
	      var _projectZoom2 = _slicedToArray(_projectZoom, 2);
	
	      var x = _projectZoom2[0];
	      var y = _projectZoom2[1];
	
	      var v = _glMatrix.vec4.fromValues(x, y, lngLatZ[2] || 0, 1);
	      _glMatrix.vec4.transformMat4(v, v, this.viewMatrix);
	      _glMatrix.vec4.transformMat4(v, v, this.projectionMatrix);
	      // vec4.transformMat4(v, v, this.viewportMatrix);
	    }
	
	    /**
	     * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
	     * Performs the nonlinear part of the web mercator projection.
	     * Remaining projection is done with 4x4 matrices which also handles
	     * perspective.
	     *
	     * @param {Array} lngLat - [lng, lat] coordinates
	     *   Specifies a point on the sphere to project onto the map.
	     * @return {Array} [x,y] coordinates.
	     */
	
	  }, {
	    key: 'projectZoom0',
	    value: function projectZoom0(_ref2) {
	      var _ref3 = _slicedToArray(_ref2, 2);
	
	      var lng = _ref3[0];
	      var lat = _ref3[1];
	
	      var lambda2 = lng * DEGREES_TO_RADIANS;
	      var phi2 = lat * DEGREES_TO_RADIANS;
	      var x = WORLD_SCALE * (lambda2 + PI);
	      var y = WORLD_SCALE * (PI - Math.log(Math.tan(PI_4 + phi2 * 0.5)));
	      return [x, y];
	    }
	
	    /**
	     * Unproject point {x,y} on map onto {lat, lon} on sphere
	     *
	     * @param {object|Vector} xy - object with {x,y} members
	     *  representing point on projected map plane
	     * @return {GeoCoordinates} - object with {lat,lon} of point on sphere.
	     *   Has toArray method if you need a GeoJSON Array.
	     *   Per cartographic tradition, lat and lon are specified as degrees.
	     */
	
	  }, {
	    key: 'unprojectZoom0',
	    value: function unprojectZoom0(_ref4) {
	      var _ref5 = _slicedToArray(_ref4, 2);
	
	      var x = _ref5[0];
	      var y = _ref5[1];
	
	      var lambda2 = x / WORLD_SCALE - PI;
	      var phi2 = 2 * (Math.atan(Math.exp(PI - y / WORLD_SCALE)) - PI_4);
	      return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
	    }
	  }, {
	    key: 'getProjectionMatrix',
	    value: function getProjectionMatrix() {
	      return this._glProjectionMatrix;
	    }
	
	    // fitBounds(lnglatSE, lnglatNW, {padding = 0} = {}) {
	    //   const bounds = new LngLatBounds(
	    //     [_bounds[0].reverse(),
	    //     _bounds[1].reverse()]
	    //   );
	    //   const offset = Point.convert([0, 0]);
	    //   const nw = this.project(lnglatNW);
	    //   const se = this.project(lnglatSE);
	    //   const size = se.sub(nw);
	    //   const scaleX =
	    //     (this.width - padding * 2 - Math.abs(offset.x) * 2) / size.x;
	    //   const scaleY =
	    //     (this.height - padding * 2 - Math.abs(offset.y) * 2) / size.y;
	
	    //   const center = this.unproject(nw.add(se).div(2));
	    //   const zoom = this.scaleZoom(this.scale * Math.min(scaleX, scaleY));
	    //   return {
	    //     latitude: center.lat,
	    //     longitude: center.lng,
	    //     zoom
	    //   };
	    // }
	
	  }, {
	    key: '_precomputeMatrices',
	    value: function _precomputeMatrices() {
	      this._glProjectionMatrix = this._calculateGLProjectionMatrix();
	
	      var m = _glMatrix.mat4.create();
	      _glMatrix.mat4.translate(m, m, [0.5, 0.5, 0]);
	      _glMatrix.mat4.scale(m, m, [this.width, this.height, 1]);
	      _glMatrix.mat4.multiply(m, m, this._glProjectionMatrix);
	      this._pixelProjectionMatrix = m;
	
	      var mInverse = _glMatrix.mat4.clone(m);
	      _glMatrix.mat4.invert(mInverse, mInverse);
	    }
	
	    // Transforms from Web Mercator Tile 0 [0-512,0-512] to "clip space"
	
	  }, {
	    key: '_calculateGLProjectionMatrix',
	    value: function _calculateGLProjectionMatrix() {
	      var m = _glMatrix.mat4.create();
	
	      _glMatrix.mat4.perspective(m, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, 0.1, this.farZ);
	
	      // Move camera to altitude
	      _glMatrix.mat4.translate(m, m, [0, 0, -this.altitude]);
	
	      // After the rotateX, z values are in pixel units. Convert them to
	      // altitude units. 1 altitude unit = the screen height.
	      _glMatrix.mat4.scale(m, m, [1, -1, 1 / this.height]);
	
	      _glMatrix.mat4.rotateX(m, m, this.pitchRadians);
	      _glMatrix.mat4.rotateZ(m, m, -this.bearingRadians);
	      _glMatrix.mat4.translate(m, m, [-this.centerX, -this.centerY, 0]);
	      // mat4.scale(m, m, [this.scale, this.scale, this.scale]);
	
	      return m;
	    }
	  }]);
	
	  return Viewport;
	}();
	
	/* xiaoji's shader
	uniform mat4 projMatrix;
	uniform float zoom;
	// convert (lng, lat) to screen positions in clip space.
	// mapbox-gl/js/geo/transform.js
	vec2 project(vec2 pt) {
	  float worldSize = 512.0 * pow(2.0, zoom);
	  float lngX = (180.0 + pt.x) / 360.0  * worldSize;
	  float latY = (180.0 - degrees(log(tan(radians(pt.y + 90.0)/2.0)))) / 360.0
	  * worldSize;
	  vec4 p = vec4(lngX, latY, 0, 1.0) * projMatrix;
	  return vec2(p.x/p.z, p.y/p.z);
	}
	*/
	
	exports.default = Viewport;

/***/ },

/***/ 973:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}(); /* eslint-disable max-len */
	// Paired down version of https://github.com/mapbox/mapbox-gl-js/blob/033043254d30a99a00b95660e296445a1ade2d01/js/geo/transform.js
	
	var _glMatrix = __webpack_require__(730);
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	/**
	 * Create a longitude, latitude object from a given longitude and latitude
	 * pair in degrees.
	 * Mapbox GL uses Longitude, Latitude coordinate order to match GeoJSON.
	 *
	 * Note that any Mapbox GL method that accepts a `LngLat` object can also
	 * accept an `Array` and will perform an implicit conversion.
	 * The following lines are equivalent:
	 ```
	 map.setCenter([-73.9749, 40.7736]);
	 map.setCenter( new mapboxgl.LngLat(-73.9749, 40.7736) );
	 ```
	 *
	 * @class LngLat
	 * @classdesc A representation of a longitude, latitude point, in degrees.
	 * @param {number} lng longitude
	 * @param {number} lat latitude
	 * @example
	 * var ll = new mapboxgl.LngLat(-73.9749, 40.7736);
	 */
	function LngLat(lng, lat) {
	  if (isNaN(lng) || isNaN(lat)) {
	    throw new Error('Invalid LngLat object: (' + lng + ', ' + lat + ')');
	  }
	  this.lng = Number(lng);
	  this.lat = Number(lat);
	  if (this.lat > 90 || this.lat < -90) {
	    throw new Error('Invalid LngLat latitude value: must be between -90 and 90');
	  }
	}
	
	/**
	 * A single transform, generally used for a single tile to be
	 * scaled, rotated, and zoomed.
	 */
	
	var MapboxTransform = function () {
	
	  /* eslint-disable max-statements */
	  function MapboxTransform(_ref) {
	    var _ref$width = _ref.width;
	    var width = _ref$width === undefined ? 0 : _ref$width;
	    var _ref$height = _ref.height;
	    var height = _ref$height === undefined ? 0 : _ref$height;
	    var _ref$latitude = _ref.latitude;
	    var latitude = _ref$latitude === undefined ? 0 : _ref$latitude;
	    var _ref$longitude = _ref.longitude;
	    var longitude = _ref$longitude === undefined ? 0 : _ref$longitude;
	    var _ref$zoom = _ref.zoom;
	    var zoom = _ref$zoom === undefined ? 0 : _ref$zoom;
	    var _ref$altitude = _ref.altitude;
	    var altitude = _ref$altitude === undefined ? 1.5 : _ref$altitude;
	    var _ref$pitch = _ref.pitch;
	    var pitch = _ref$pitch === undefined ? 0 : _ref$pitch;
	    var _ref$bearing = _ref.bearing;
	    var bearing = _ref$bearing === undefined ? 0 : _ref$bearing;
	
	    _classCallCheck(this, MapboxTransform);
	
	    // constant
	    this.tileSize = 512;
	
	    this.width = 0;
	    this.height = 0;
	    this._center = new LngLat(0, 0);
	    this.zoom = 0;
	    this.angle = 0;
	    this._altitude = 1.5;
	    this._pitch = 0;
	
	    this.width = width;
	    this.height = height;
	    this.zoom = zoom;
	    this.center = new LngLat(longitude, latitude);
	    this.altitude = altitude;
	    this.pitch = pitch;
	    this.bearing = bearing;
	    this._calcProjMatrix();
	  }
	  /* eslint-enable */
	
	  _createClass(MapboxTransform, [{
	    key: 'zoomScale',
	    value: function zoomScale(zoom) {
	      return Math.pow(2, zoom);
	    }
	  }, {
	    key: 'lngX',
	
	    /**
	     * latitude to absolute x coord
	     * @param {number} lon
	     * @param {number} [worldSize=this.worldSize]
	     * @returns {number} pixel coordinate
	     * @private
	     */
	    value: function lngX(lng, worldSize) {
	      return (180 + lng) * (worldSize || this.worldSize) / 360;
	    }
	    /**
	     * latitude to absolute y coord
	     * @param {number} lat
	     * @param {number} [worldSize=this.worldSize]
	     * @returns {number} pixel coordinate
	     * @private
	     */
	
	  }, {
	    key: 'latY',
	    value: function latY(lat, worldSize) {
	      var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
	      return (180 - y) * (worldSize || this.worldSize) / 360;
	    }
	  }, {
	    key: '_calcProjMatrix',
	    value: function _calcProjMatrix() {
	      var m = new Float32Array(16);
	
	      // Find the distance from the center point to the center top in altitude units using law of sines.
	      var halfFov = Math.atan(0.5 / this.altitude);
	      var topHalfSurfaceDistance = Math.sin(halfFov) * this.altitude / Math.sin(Math.PI / 2 - this._pitch - halfFov);
	
	      // Calculate z value of the farthest fragment that should be rendered.
	      var farZ = Math.cos(Math.PI / 2 - this._pitch) * topHalfSurfaceDistance + this.altitude;
	
	      _glMatrix.mat4.perspective(m, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, 0.1, farZ);
	
	      _glMatrix.mat4.translate(m, m, [0, 0, -this.altitude]);
	
	      // After the rotateX, z values are in pixel units. Convert them to
	      // altitude units. 1 altitude unit = the screen height.
	      _glMatrix.mat4.scale(m, m, [1, -1, 1 / this.height]);
	
	      _glMatrix.mat4.rotateX(m, m, this._pitch);
	      _glMatrix.mat4.rotateZ(m, m, this.angle);
	      _glMatrix.mat4.translate(m, m, [-this.x, -this.y, 0]);
	
	      this.projMatrix = m;
	    }
	  }, {
	    key: 'worldSize',
	    get: function get() {
	      return this.tileSize * this.scale;
	    }
	  }, {
	    key: 'bearing',
	    get: function get() {
	      return -this.angle / Math.PI * 180;
	    },
	    set: function set(bearing) {
	      // TODO: Bounds check
	      // var b =
	      var b = -bearing * Math.PI / 180;
	      if (this.angle === b) return;
	      this.angle = b;
	
	      // 2x2 matrix for rotating points
	      this.rotationMatrix = _glMatrix.mat2.create();
	      _glMatrix.mat2.rotate(this.rotationMatrix, this.rotationMatrix, this.angle);
	    }
	  }, {
	    key: 'pitch',
	    get: function get() {
	      return this._pitch / Math.PI * 180;
	    },
	    set: function set(pitch) {
	      var p = Math.min(60, pitch) / 180 * Math.PI;
	      if (this._pitch === p) return;
	      this._pitch = p;
	    }
	  }, {
	    key: 'altitude',
	    get: function get() {
	      return this._altitude;
	    },
	    set: function set(altitude) {
	      var a = Math.max(0.75, altitude);
	      if (this._altitude === a) return;
	      this._altitude = a;
	    }
	  }, {
	    key: 'zoom',
	    get: function get() {
	      return this._zoom;
	    },
	    set: function set(zoom) {
	      var z = zoom;
	      if (this._zoom === z) return;
	      this._zoom = z;
	      this.scale = this.zoomScale(z);
	      this.tileZoom = Math.floor(z);
	      this.zoomFraction = z - this.tileZoom;
	    }
	  }, {
	    key: 'center',
	    get: function get() {
	      return this._center;
	    },
	    set: function set(center) {
	      if (center.lat === this._center.lat && center.lng === this._center.lng) return;
	      this._center = center;
	    }
	  }, {
	    key: 'x',
	    get: function get() {
	      return this.lngX(this.center.lng);
	    }
	  }, {
	    key: 'y',
	    get: function get() {
	      return this.latY(this.center.lat);
	    }
	  }]);
	
	  return MapboxTransform;
	}();
	
	exports.default = MapboxTransform;

/***/ },

/***/ 974:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _slicedToArray = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;_e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }return _arr;
	  }return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (Symbol.iterator in Object(arr)) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}(); // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	/* eslint-disable guard-for-in */
	
	var _luma = __webpack_require__(795);
	
	var _util = __webpack_require__(975);
	
	var _log = __webpack_require__(970);
	
	var _log2 = _interopRequireDefault(_log);
	
	var _lodash = __webpack_require__(976);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _assert = __webpack_require__(569);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _viewportMercatorProject = __webpack_require__(781);
	
	var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	/*
	 * @param {string} props.id - layer name
	 * @param {array}  props.data - array of data instances
	 * @param {number} props.width - viewport width, synced with MapboxGL
	 * @param {number} props.height - viewport width, synced with MapboxGL
	 * @param {bool} props.isPickable - whether layer response to mouse event
	 * @param {bool} props.opacity - opacity of the layer
	 */
	var DEFAULT_PROPS = {
	  key: 0,
	  opacity: 0.8,
	  numInstances: undefined,
	  data: [],
	  isPickable: false,
	  deepCompare: false,
	  getValue: function getValue(x) {
	    return x;
	  },
	  onHover: function onHover() {},
	  onClick: function onClick() {},
	  // Update triggers: a key change detection mechanism in deck.gl
	  //
	  // The value of `updateTriggers` is a map with fields corresponding to
	  // attribute names (or `all`). Each field has a value which is an object,
	  // it can contain any amount of data. The data for each field is compared
	  // shallowly, and if a change is detected, the attribute is invalidated
	  // (all attributes are invalidated if the `all` key is used.)
	  // Note: updateTriggers are ignored by normal shallow comparison, so it is
	  // OK for the app to mint a new object on every render.
	  updateTriggers: {}
	};
	
	var ATTRIBUTES = {
	  instancePickingColors: { size: 3, '0': 'pickRed', '1': 'pickGreen', '2': 'pickBlue' }
	};
	
	var counter = 0;
	
	var Layer = function () {
	  _createClass(Layer, null, [{
	    key: 'attributes',
	    get: function get() {
	      return ATTRIBUTES;
	    }
	
	    /**
	     * @classdesc
	     * Base Layer class
	     *
	     * @class
	     * @param {object} props - See docs above
	     */
	    /* eslint-disable max-statements */
	
	  }]);
	
	  function Layer(props) {
	    _classCallCheck(this, Layer);
	
	    props = _extends({}, DEFAULT_PROPS, props);
	
	    // Add iterator to objects
	    // TODO - Modifying props is an anti-pattern
	    if (props.data) {
	      (0, _util.addIterator)(props.data);
	      (0, _assert2.default)(props.data[Symbol.iterator], 'data prop must have an iterator');
	    }
	
	    this.props = props;
	
	    this.checkProp(props.data, 'data');
	    this.checkProp(props.id, 'id');
	    this.checkProp(props.width, 'width');
	    this.checkProp(props.height, 'height');
	
	    this.checkProp(props.width, 'width');
	    this.checkProp(props.height, 'height');
	    this.checkProp(props.latitude, 'latitude');
	    this.checkProp(props.longitude, 'longitude');
	    this.checkProp(props.zoom, 'zoom');
	
	    this.count = counter++;
	  }
	  /* eslint-enable max-statements */
	
	  // //////////////////////////////////////////////////
	  // LIFECYCLE METHODS, overridden by the layer subclasses
	
	  // Called once to set up the initial state
	
	
	  _createClass(Layer, [{
	    key: 'initializeState',
	    value: function initializeState() {}
	
	    // gl context is now available
	
	  }, {
	    key: 'didMount',
	    value: function didMount() {}
	  }, {
	    key: 'shouldUpdate',
	    value: function shouldUpdate(oldProps, newProps) {
	      // Check update triggers, and invalidate props accordingly
	      if (this.checkUpdateTriggers(oldProps, newProps)) {
	        return true;
	      }
	      // If any props have changed, ignoring updateTriggers objects
	      // (updateTriggers are expected to be reminted on every update)
	      var equalShallow = (0, _util.areEqualShallow)(newProps, oldProps, {
	        ignore: { updateTriggers: true }
	      });
	      if (!equalShallow) {
	        if (newProps.data !== oldProps.data) {
	          this.setState({ dataChanged: true });
	        }
	        return true;
	      }
	      if (newProps.deepCompare && !(0, _lodash2.default)(newProps.data, oldProps.data)) {
	        // Support optional deep compare of data
	        // Note: this is quite inefficient, app should use buffer props instead
	        this.setState({ dataChanged: true });
	        return true;
	      }
	      return false;
	    }
	
	    // Default implementation, all attributeManager will be updated
	
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, newProps) {
	      var attributeManager = this.state.attributeManager;
	
	      if (this.state.dataChanged) {
	        attributeManager.invalidateAll();
	      }
	    }
	
	    // gl context still available
	
	  }, {
	    key: 'willUnmount',
	    value: function willUnmount() {}
	
	    // END LIFECYCLE METHODS
	    // //////////////////////////////////////////////////
	
	    // Public API
	
	  }, {
	    key: 'setNeedsRedraw',
	    value: function setNeedsRedraw() {
	      var redraw = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      if (this.state) {
	        this.state.needsRedraw = redraw;
	      }
	    }
	
	    // Checks state of attributes and model
	    // TODO - is attribute manager needed? - Model should be enough.
	
	  }, {
	    key: 'getNeedsRedraw',
	    value: function getNeedsRedraw() {
	      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	      var _ref$clearRedrawFlags = _ref.clearRedrawFlags;
	      var clearRedrawFlags = _ref$clearRedrawFlags === undefined ? false : _ref$clearRedrawFlags;
	
	      // this method may be called by the render loop as soon a the layer
	      // has been created, so guard against uninitialized state
	      if (!this.state) {
	        return false;
	      }
	
	      var _state = this.state;
	      var attributeManager = _state.attributeManager;
	      var model = _state.model;
	
	      var redraw = false;
	      redraw = redraw || this.state.needsRedraw;
	      this.state.needsRedraw = this.state.needsRedraw && !clearRedrawFlags;
	
	      redraw = redraw || attributeManager.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
	      redraw = redraw || model.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
	      return redraw;
	    }
	
	    // Updates selected state members and marks the object for redraw
	
	  }, {
	    key: 'setState',
	    value: function setState(updateObject) {
	      Object.assign(this.state, updateObject);
	      this.state.needsRedraw = true;
	    }
	
	    // Updates selected state members and marks the object for redraw
	
	  }, {
	    key: 'setUniforms',
	    value: function setUniforms(uniformMap) {
	      if (this.state.model) {
	        this.state.model.setUniforms(uniformMap);
	      }
	      // TODO - set needsRedraw on the model?
	      this.state.needsRedraw = true;
	      (0, _log2.default)(3, 'layer.setUniforms', uniformMap);
	    }
	
	    // Use iteration (the only required capability on data) to get first element
	
	  }, {
	    key: 'getFirstObject',
	    value: function getFirstObject() {
	      var data = this.props.data;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var object = _step.value;
	
	          return object;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return null;
	    }
	
	    // INTERNAL METHODS
	
	    // Deduces numer of instances. Intention is to support:
	    // - Explicit setting of numInstances
	    // - Auto-deduction for ES6 containers that define a size member
	    // - Auto-deduction for Classic Arrays via the built-in length attribute
	    // - Auto-deduction via arrays
	
	  }, {
	    key: 'getNumInstances',
	    value: function getNumInstances(props) {
	      props = props || this.props;
	
	      // First check if the layer has set its own value
	      if (this.state && this.state.numInstances !== undefined) {
	        return this.state.numInstances;
	      }
	
	      // Check if app has provided an explicit value
	      if (props.numInstances !== undefined) {
	        return props.numInstances;
	      }
	
	      var _props = props;
	      var data = _props.data;
	
	      // Check if ES6 collection "count" function is available
	
	      if (data && typeof data.count === 'function') {
	        return data.count();
	      }
	
	      // Check if ES6 collection "size" attribute is set
	      if (data && data.size !== undefined) {
	        return data.size;
	      }
	
	      // Check if array length attribute is set
	      // Note: checking this last since some ES6 collections (Immutable.js)
	      // emit profuse warnings when trying to access `length` attribute
	      if (data && data.length !== undefined) {
	        return data.length;
	      }
	
	      throw new Error('Could not deduce numInstances');
	    }
	
	    // Internal Helpers
	
	  }, {
	    key: 'checkProps',
	    value: function checkProps(oldProps, newProps) {
	      // Note: dataChanged might already be set
	      if (newProps.data !== oldProps.data) {
	        // Figure out data length
	        this.state.dataChanged = true;
	      }
	
	      var viewportChanged = newProps.width !== oldProps.width || newProps.height !== oldProps.height || newProps.latitude !== oldProps.latitude || newProps.longitude !== oldProps.longitude || newProps.zoom !== oldProps.zoom;
	
	      this.setState({ viewportChanged: viewportChanged });
	    }
	  }, {
	    key: 'updateAttributes',
	    value: function updateAttributes(props) {
	      var _state2 = this.state;
	      var attributeManager = _state2.attributeManager;
	      var model = _state2.model;
	
	      var numInstances = this.getNumInstances(props);
	      // Figure out data length
	      attributeManager.update({
	        numInstances: numInstances,
	        bufferMap: props,
	        context: this,
	        // Don't worry about non-attribute props
	        ignoreUnknownAttributes: true
	      });
	      if (model) {
	        var changedAttributes = attributeManager.getChangedAttributes({ clearChangedFlags: true });
	        model.setAttributes(changedAttributes);
	      }
	    }
	  }, {
	    key: 'updateBaseUniforms',
	    value: function updateBaseUniforms() {
	      this.setUniforms({
	        // apply gamma to opacity to make it visually "linear"
	        opacity: Math.pow(this.props.opacity || 0.8, 1 / 2.2)
	      });
	    }
	
	    // Check if any update triggers have changed, and invalidate
	    // attributes accordingly.
	
	  }, {
	    key: 'checkUpdateTriggers',
	    value: function checkUpdateTriggers(oldProps, newProps) {
	      var change = false;
	      var attributeManager = this.state.attributeManager;
	
	      for (var propName in newProps.updateTriggers) {
	        var oldTriggers = oldProps.updateTriggers[propName];
	        var newTriggers = newProps.updateTriggers[propName];
	        if (!(0, _util.areEqualShallow)(oldTriggers, newTriggers)) {
	          if (propName === 'all') {
	            attributeManager.invalidateAll();
	            change = true;
	          } else {
	            attributeManager.invalidate(propName);
	            change = true;
	          }
	        }
	      }
	      return change;
	    }
	
	    // LAYER MANAGER API
	
	    // Called by layer manager when a new layer is found
	    /* eslint-disable max-statements */
	
	  }, {
	    key: 'initializeLayer',
	    value: function initializeLayer(_ref2) {
	      var gl = _ref2.gl;
	
	      (0, _assert2.default)(gl);
	      this.state = { gl: gl };
	
	      // Initialize state only once
	      this.setState({
	        attributeManager: new _luma.AttributeManager({ id: this.props.id }),
	        model: null,
	        needsRedraw: true,
	        dataChanged: true
	      });
	
	      var attributeManager = this.state.attributeManager;
	      // All instanced layers get instancePickingColors attribute by default
	      // Their shaders can use it to render a picking scene
	
	      attributeManager.addInstanced(ATTRIBUTES, {
	        instancePickingColors: { update: this.calculateInstancePickingColors }
	      });
	
	      this.setViewport();
	      this.initializeState();
	      (0, _assert2.default)(this.state.model, 'Model must be set in initializeState');
	      this.setViewport();
	
	      // TODO - the app must be able to override
	
	      // Add any subclass attributes
	      this.updateAttributes(this.props);
	      this.updateBaseUniforms();
	
	      var model = this.state.model;
	
	      model.setInstanceCount(this.getNumInstances());
	      model.id = this.props.id;
	      model.program.id = this.props.id + '-program';
	      model.geometry.id = this.props.id + '-geometry';
	
	      // Create a model for the layer
	      this._updateModel({ gl: gl });
	
	      // Call life cycle method
	      this.didMount();
	    }
	    /* eslint-enable max-statements */
	
	    // Called by layer manager when existing layer is getting new props
	
	  }, {
	    key: 'updateLayer',
	    value: function updateLayer(oldProps, newProps) {
	      // Calculate standard change flags
	      this.checkProps(oldProps, newProps);
	
	      // Check if any props have changed
	      if (this.shouldUpdate(oldProps, newProps)) {
	        if (this.state.viewportChanged) {
	          this.setViewport();
	        }
	
	        // Let the subclass mark what is needed for update
	        this.willReceiveProps(oldProps, newProps);
	        // Run the attribute updaters
	        this.updateAttributes(newProps);
	        // Update the uniforms
	        this.updateBaseUniforms();
	
	        if (this.state.model) {
	          this.state.model.setInstanceCount(this.getNumInstances());
	        }
	      }
	
	      this.state.dataChanged = false;
	      this.state.viewportChanged = false;
	    }
	
	    // Called by manager when layer is about to be disposed
	    // Note: not guaranteed to be called on application shutdown
	
	  }, {
	    key: 'finalizeLayer',
	    value: function finalizeLayer() {
	      this.willUnmount();
	    }
	  }, {
	    key: 'calculateInstancePickingColors',
	    value: function calculateInstancePickingColors(attribute, numInstances) {
	      var value = attribute.value;
	      var size = attribute.size;
	      // add 1 to index to seperate from no selection
	
	      for (var i = 0; i < numInstances; i++) {
	        var pickingColor = this.encodePickingColor(i);
	        value[i * size + 0] = pickingColor[0];
	        value[i * size + 1] = pickingColor[1];
	        value[i * size + 2] = pickingColor[2];
	      }
	    }
	  }, {
	    key: 'decodePickingColor',
	    value: function decodePickingColor(color) {
	      (0, _assert2.default)(color instanceof Uint8Array);
	
	      var _color = _slicedToArray(color, 3);
	
	      var i1 = _color[0];
	      var i2 = _color[1];
	      var i3 = _color[2];
	      // 1 was added to seperate from no selection
	
	      var index = i1 + i2 * 256 + i3 * 65536 - 1;
	      return index;
	    }
	  }, {
	    key: 'encodePickingColor',
	    value: function encodePickingColor(i) {
	      return [(i + 1) % 256, Math.floor((i + 1) / 256) % 256, Math.floor((i + 1) / 256 / 256) % 256];
	    }
	
	    // VIRTUAL METHOD - Override to add or modify `info` object in sublayer
	    // The sublayer may know what object e.g. lat,lon corresponds to using math
	    // etc even when picking does not work
	
	  }, {
	    key: 'onGetHoverInfo',
	    value: function onGetHoverInfo(info) {
	      var color = info.color;
	
	      info.index = this.decodePickingColor(color);
	      // If props.data is an indexable array, get the object
	      if (Array.isArray(this.props.data)) {
	        info.object = this.props.data[info.index];
	      }
	      info.geoCoords = this.unproject({ x: info.x, y: info.y });
	      return info;
	    }
	  }, {
	    key: 'onHover',
	    value: function onHover(info) {
	      var _info = info;
	      var color = _info.color;
	
	      var selectedPickingColor = new Float32Array(3);
	      selectedPickingColor[0] = color[0];
	      selectedPickingColor[1] = color[1];
	      selectedPickingColor[2] = color[2];
	      this.setUniforms({ selectedPickingColor: selectedPickingColor });
	
	      info = this.onGetHoverInfo(info);
	      return this.props.onHover(info);
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(info) {
	      info = this.onGetHoverInfo(info);
	      return this.props.onClick(info);
	    }
	
	    // INTERNAL METHODS
	
	  }, {
	    key: '_updateModel',
	    value: function _updateModel(_ref3) {
	      var gl = _ref3.gl;
	      var _state3 = this.state;
	      var model = _state3.model;
	      var attributeManager = _state3.attributeManager;
	      var uniforms = _state3.uniforms;
	
	      (0, _assert2.default)(model);
	      model.setAttributes(attributeManager.getAttributes());
	      model.setUniforms(uniforms);
	      // whether current layer responds to mouse events
	      model.setPickable(this.props.isPickable);
	    }
	  }, {
	    key: 'checkProp',
	    value: function checkProp(property, propertyName) {
	      if (property === undefined || property === null) {
	        throw new Error('Property ' + propertyName + ' undefined in layer ' + this.props.id);
	      }
	    }
	
	    // MAP LAYER FUNCTIONALITY
	
	  }, {
	    key: 'setViewport',
	    value: function setViewport() {
	      var _props2 = this.props;
	      var width = _props2.width;
	      var height = _props2.height;
	      var latitude = _props2.latitude;
	      var longitude = _props2.longitude;
	      var zoom = _props2.zoom;
	
	      this.setState({
	        viewport: { x: 0, y: 0, width: width, height: height },
	        mercator: (0, _viewportMercatorProject2.default)({
	          width: width, height: height, latitude: latitude, longitude: longitude, zoom: zoom,
	          tileSize: 512
	        })
	      });
	      this.setUniforms({
	        viewport: [0, 0, width, height],
	        mercatorScale: Math.pow(2, zoom),
	        mercatorCenter: [longitude, latitude]
	      });
	      (0, _log2.default)(3, this.state.viewport, latitude, longitude, zoom);
	    }
	
	    /**
	     * Position conversion is done in shader, so in many cases there is no need
	     * for this function
	     * @param {Object|Array} latLng - Either [lat,lng] or {lat, lon}
	     * @return {Object} - x, y
	     */
	
	  }, {
	    key: 'project',
	    value: function project(latLng) {
	      var mercator = this.state.mercator;
	
	      var _ref4 = Array.isArray(latLng) ? mercator.project([latLng[1], latLng[0]]) : mercator.project([latLng.lon, latLng.lat]);
	
	      var _ref5 = _slicedToArray(_ref4, 2);
	
	      var x = _ref5[0];
	      var y = _ref5[1];
	
	      return { x: x, y: y };
	    }
	  }, {
	    key: 'unproject',
	    value: function unproject(xy) {
	      var mercator = this.state.mercator;
	
	      var _ref6 = Array.isArray(xy) ? mercator.unproject(xy) : mercator.unproject([xy.x, xy.y]);
	
	      var _ref7 = _slicedToArray(_ref6, 2);
	
	      var lon = _ref7[0];
	      var lat = _ref7[1];
	
	      return { lat: lat, lon: lon };
	    }
	  }]);
	
	  return Layer;
	}();
	
	exports.default = Layer;

/***/ },

/***/ 975:
/***/ function(module, exports) {

	'use strict';
	
	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};
	
	exports.addIterator = addIterator;
	exports.areEqualShallow = areEqualShallow;
	
	var _marked = [valueIterator].map(regeneratorRuntime.mark);
	
	// Enable classic JavaScript object maps to be used as data
	
	function addIterator(object) {
	  if (isPlainObject(object) && !object[Symbol.iterator]) {
	    object[Symbol.iterator] = function iterator() {
	      return valueIterator(this);
	    };
	  }
	}
	
	function valueIterator(obj) {
	  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;
	
	  return regeneratorRuntime.wrap(function valueIterator$(_context) {
	    while (1) {
	      switch (_context.prev = _context.next) {
	        case 0:
	          _iteratorNormalCompletion = true;
	          _didIteratorError = false;
	          _iteratorError = undefined;
	          _context.prev = 3;
	          _iterator = Object.keys(obj)[Symbol.iterator]();
	
	        case 5:
	          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	            _context.next = 13;
	            break;
	          }
	
	          key = _step.value;
	
	          if (!(obj.hasOwnProperty(key) && key !== Symbol.iterator)) {
	            _context.next = 10;
	            break;
	          }
	
	          _context.next = 10;
	          return obj[key];
	
	        case 10:
	          _iteratorNormalCompletion = true;
	          _context.next = 5;
	          break;
	
	        case 13:
	          _context.next = 19;
	          break;
	
	        case 15:
	          _context.prev = 15;
	          _context.t0 = _context['catch'](3);
	          _didIteratorError = true;
	          _iteratorError = _context.t0;
	
	        case 19:
	          _context.prev = 19;
	          _context.prev = 20;
	
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	
	        case 22:
	          _context.prev = 22;
	
	          if (!_didIteratorError) {
	            _context.next = 25;
	            break;
	          }
	
	          throw _iteratorError;
	
	        case 25:
	          return _context.finish(22);
	
	        case 26:
	          return _context.finish(19);
	
	        case 27:
	        case 'end':
	          return _context.stop();
	      }
	    }
	  }, _marked[0], this, [[3, 15, 19, 27], [20,, 22, 26]]);
	}
	
	function isPlainObject(o) {
	  return o !== null && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o.constructor === Object;
	}
	
	// Shallow compare
	/* eslint-disable complexity */
	function areEqualShallow(a, b) {
	  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  var _ref$ignore = _ref.ignore;
	  var ignore = _ref$ignore === undefined ? {} : _ref$ignore;
	
	  if (a === b) {
	    return true;
	  }
	
	  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || a === null || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object' || b === null) {
	    return false;
	  }
	
	  if (Object.keys(a).length !== Object.keys(b).length) {
	    return false;
	  }
	
	  for (var key in a) {
	    if (!(key in ignore) && (!(key in b) || a[key] !== b[key])) {
	      return false;
	    }
	  }
	  for (var _key in b) {
	    if (!(_key in ignore) && !(_key in a)) {
	      return false;
	    }
	  }
	  return true;
	}

/***/ },

/***/ 983:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _hexagonLayer = __webpack_require__(984);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_hexagonLayer).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 984:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;if (getter === undefined) {
	      return undefined;
	    }return getter.call(receiver);
	  }
	};
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _luma = __webpack_require__(795);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	} // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	/* eslint-disable func-style */
	
	var glslify = __webpack_require__(833);
	
	var ATTRIBUTES = {
	  instancePositions: { size: 2, '0': 'x', '1': 'y' },
	  instanceElevations: { size: 1, '0': 'z' },
	  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' }
	};
	
	var _getCentroid = function _getCentroid(x) {
	  return x.centroid;
	};
	var _getElevation = function _getElevation(x) {
	  return x.elevation || 0;
	};
	var _getColor = function _getColor(x) {
	  return x.color || [255, 0, 0];
	};
	var _getVertices = function _getVertices(x) {
	  return x.vertices;
	};
	
	var HexagonLayer = function (_Layer) {
	  _inherits(HexagonLayer, _Layer);
	
	  /**
	   * @classdesc
	   * HexagonLayer
	   *
	   * @class
	   * @param {object} opts
	   *
	   * @param {number} opts.dotRadius - hexagon radius
	   * @param {number} opts.elevation - hexagon height
	   *
	   * @param {function} opts.onHexagonHovered(index, e) - popup selected index
	   * @param {function} opts.onHexagonClicked(index, e) - popup selected index
	   */
	  function HexagonLayer() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$id = _ref.id;
	    var id = _ref$id === undefined ? 'hexagon-layer' : _ref$id;
	    var _ref$dotRadius = _ref.dotRadius;
	    var dotRadius = _ref$dotRadius === undefined ? 10 : _ref$dotRadius;
	    var _ref$elevation = _ref.elevation;
	    var elevation = _ref$elevation === undefined ? 100 : _ref$elevation;
	    var vertices = _ref.vertices;
	    var _ref$getCentroid = _ref.getCentroid;
	    var getCentroid = _ref$getCentroid === undefined ? _getCentroid : _ref$getCentroid;
	    var _ref$getElevation = _ref.getElevation;
	    var getElevation = _ref$getElevation === undefined ? _getElevation : _ref$getElevation;
	    var _ref$getColor = _ref.getColor;
	    var getColor = _ref$getColor === undefined ? _getColor : _ref$getColor;
	    var _ref$getVertices = _ref.getVertices;
	    var getVertices = _ref$getVertices === undefined ? _getVertices : _ref$getVertices;
	
	    var opts = _objectWithoutProperties(_ref, ['id', 'dotRadius', 'elevation', 'vertices', 'getCentroid', 'getElevation', 'getColor', 'getVertices']);
	
	    _classCallCheck(this, HexagonLayer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(HexagonLayer).call(this, _extends({
	      id: id,
	      dotRadius: dotRadius,
	      elevation: elevation,
	      vertices: vertices,
	      getCentroid: getCentroid,
	      getElevation: getElevation,
	      getColor: getColor,
	      getVertices: getVertices
	    }, opts)));
	  }
	
	  _createClass(HexagonLayer, [{
	    key: 'initializeState',
	    value: function initializeState() {
	      var _state = this.state;
	      var gl = _state.gl;
	      var attributeManager = _state.attributeManager;
	
	      this.setState({
	        model: this.getModel(gl)
	      });
	
	      attributeManager.addInstanced(ATTRIBUTES, {
	        instancePositions: { update: this.calculateInstancePositions },
	        instanceElevations: { update: this.calculateInstanceElevations },
	        instanceColors: { update: this.calculateInstanceColors }
	      });
	
	      this.calculateRadiusAndAngle();
	
	      this.setUniforms({
	        elevation: this.props.elevation
	      });
	    }
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, newProps) {
	      _get(Object.getPrototypeOf(HexagonLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);
	
	      var _state2 = this.state;
	      var dataChanged = _state2.dataChanged;
	      var viewportChanged = _state2.viewportChanged;
	      var attributeManager = _state2.attributeManager;
	
	      if (dataChanged || viewportChanged) {
	        this.calculateRadiusAndAngle();
	      }
	      if (dataChanged) {
	        attributeManager.invalidateAll();
	      }
	
	      this.setUniforms({
	        elevation: this.props.elevation
	      });
	    }
	  }, {
	    key: 'getModel',
	    value: function getModel(gl) {
	      var geometry = new _luma.CylinderGeometry({
	        radius: 1,
	        topRadius: 1,
	        bottomRadius: 1,
	        topCap: true,
	        bottomCap: true,
	        height: 1,
	        nradial: 6,
	        nvertical: 1
	      });
	
	      // const NUM_SEGMENTS = 6;
	      // const PI2 = Math.PI * 2;
	
	      // let vertices = [];
	      // for (let i = 0; i < NUM_SEGMENTS; i++) {
	      //   vertices = [
	      //     ...vertices,
	      //     Math.cos(PI2 * i / NUM_SEGMENTS),
	      //     Math.sin(PI2 * i / NUM_SEGMENTS),
	      //     0
	      //   ];
	      // }
	
	      // const geometry = new Geometry({
	      //   id: this.props.id,
	      //   drawMode: 'TRIANGLE_FAN',
	      //   vertices: new Float32Array(vertices)
	      // });
	
	      return new _luma.Model({
	        id: this.props.id,
	        program: new _luma.Program(gl, {
	          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the hexagon-layer */\n#define SHADER_NAME hexagon-layer-vs\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\n\nattribute vec2 instancePositions;\nattribute float instanceElevations;\nattribute vec3 instanceColors;\nattribute vec3 instancePickingColors;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nuniform float radius;\nuniform float opacity;\nuniform float angle;\nuniform float elevation;\n\nuniform float renderPickingBuffer;\nuniform vec3 selected;\nvarying vec4 vColor;\n\nvoid main(void) {\n  mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n  vec4 rotatedPosition = vec4(\n    vec2(rotationMatrix * positions.xz * radius),\n    0.,\n    1.\n  );\n\n  vec2 pos = mercatorProject(instancePositions.xy, mercatorScale);\n\n  vec4 centroidPosition =\n    vec4(pos.xy, instanceElevations * (positions.y + 0.5) * elevation, 0.0);\n  vec3 p = centroidPosition.xyz + rotatedPosition.xyz;\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, opacity);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
	          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the hexagon-layer */\n#define SHADER_NAME hexagon-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
	          id: 'hexagon'
	        }),
	        geometry: geometry,
	        isInstanced: true
	      });
	    }
	  }, {
	    key: 'calculateInstancePositions',
	    value: function calculateInstancePositions(attribute) {
	      var _props = this.props;
	      var data = _props.data;
	      var getCentroid = _props.getCentroid;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var hexagon = _step.value;
	
	          var centroid = getCentroid(hexagon);
	          value[i + 0] = centroid[0];
	          value[i + 1] = centroid[1];
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'calculateInstanceElevations',
	    value: function calculateInstanceElevations(attribute) {
	      var _props2 = this.props;
	      var data = _props2.data;
	      var getElevation = _props2.getElevation;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var hexagon = _step2.value;
	
	          var elevation = getElevation(hexagon) || 0;
	          value[i + 0] = elevation;
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'calculateInstanceColors',
	    value: function calculateInstanceColors(attribute) {
	      var _props3 = this.props;
	      var data = _props3.data;
	      var getColor = _props3.getColor;
	      var value = attribute.value;
	
	      var i = 0;
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;
	
	      try {
	        for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var hexagon = _step3.value;
	
	          var color = getColor(hexagon);
	          value[i + 0] = color[0];
	          value[i + 1] = color[1];
	          value[i + 2] = color[2];
	          i += 3;
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	
	    // TODO this is the only place that uses hexagon vertices
	    // consider move radius and angle calculation to the shader
	
	  }, {
	    key: 'calculateRadiusAndAngle',
	    value: function calculateRadiusAndAngle() {
	      var _props4 = this.props;
	      var data = _props4.data;
	      var getVertices = _props4.getVertices;
	
	      if (!data || data.length === 0) {
	        return;
	      }
	
	      // Either get vertices from prop, or from first hexagon
	      var vertices = this.props.vertices;
	
	      if (!vertices) {
	        var firstHexagon = this.getFirstObject();
	        vertices = getVertices(firstHexagon);
	      }
	      var vertex0 = vertices[0];
	      var vertex3 = vertices[3];
	
	      // transform to space coordinates
	      var spaceCoord0 = this.project({ lat: vertex0[1], lon: vertex0[0] });
	      var spaceCoord3 = this.project({ lat: vertex3[1], lon: vertex3[0] });
	
	      // distance between two close centroids
	      var dx = spaceCoord0.x - spaceCoord3.x;
	      var dy = spaceCoord0.y - spaceCoord3.y;
	      var dxy = Math.sqrt(dx * dx + dy * dy);
	
	      this.setUniforms({
	        // Calculate angle that the perpendicular hexagon vertex axis is tilted
	        angle: Math.acos(dx / dxy) * -Math.sign(dy) + Math.PI / 2,
	        // Allow user to fine tune radius
	        radius: dxy / 2 * Math.min(1, this.props.dotRadius)
	      });
	    }
	  }]);
	
	  return HexagonLayer;
	}(_layer2.default);
	
	exports.default = HexagonLayer;

/***/ },

/***/ 985:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _choroplethLayer = __webpack_require__(986);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_choroplethLayer).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 986:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;if (getter === undefined) {
	      return undefined;
	    }return getter.call(receiver);
	  }
	};
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _earcut = __webpack_require__(667);
	
	var _earcut2 = _interopRequireDefault(_earcut);
	
	var _lodash = __webpack_require__(987);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _geojsonNormalize = __webpack_require__(989);
	
	var _geojsonNormalize2 = _interopRequireDefault(_geojsonNormalize);
	
	var _luma = __webpack_require__(795);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	} // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	var glslify = __webpack_require__(833);
	
	var ATTRIBUTES = {
	  indices: { size: 1, '0': 'index', isIndexed: true },
	  positions: { size: 3, '0': 'x', '1': 'y', '2': 'unused' },
	  colors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' },
	  // Override picking colors to prevent auto allocation
	  pickingColors: { size: 3, '0': 'pickRed', '1': 'pickGreen', '2': 'pickBlue' }
	};
	
	var ChoroplethLayer = function (_Layer) {
	  _inherits(ChoroplethLayer, _Layer);
	
	  /**
	   * @classdesc
	   * ChoroplethLayer
	   *
	   * @class
	   * @param {object} props
	   * @param {bool} props.drawContour - ? drawContour : drawArea
	   * @param {function} props.onChoroplethHovered - provide proerties of the
	   * selected choropleth, together with the mouse event when mouse hovered
	   * @param {function} props.onChoroplethClicked - provide proerties of the
	   * selected choropleth, together with the mouse event when mouse clicked
	   */
	  function ChoroplethLayer(props) {
	    _classCallCheck(this, ChoroplethLayer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChoroplethLayer).call(this, _extends({
	      opacity: 1
	    }, props)));
	  }
	
	  _createClass(ChoroplethLayer, [{
	    key: 'initializeState',
	    value: function initializeState() {
	      var _state = this.state;
	      var gl = _state.gl;
	      var attributeManager = _state.attributeManager;
	
	      attributeManager.addDynamic(ATTRIBUTES, {
	        // Primtive attributes
	        indices: { update: this.calculateIndices },
	        positions: { update: this.calculatePositions },
	        colors: { update: this.calculateColors },
	        // Instanced attributes
	        pickingColors: { update: this.calculatePickingColors, noAlloc: true }
	      });
	
	      this.setUniforms({ opacity: this.props.opacity });
	      this.setState({
	        numInstances: 0,
	        model: this.getModel(gl)
	      });
	
	      this.extractChoropleths();
	    }
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, newProps) {
	      _get(Object.getPrototypeOf(ChoroplethLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);
	
	      var _state2 = this.state;
	      var dataChanged = _state2.dataChanged;
	      var attributeManager = _state2.attributeManager;
	
	      if (dataChanged) {
	        this.extractChoropleths();
	
	        attributeManager.invalidateAll();
	      }
	
	      if (oldProps.opacity !== newProps.opacity) {
	        this.setUniforms({ opacity: newProps.opacity });
	      }
	    }
	  }, {
	    key: 'getModel',
	    value: function getModel(gl) {
	      return new _luma.Model({
	        program: new _luma.Program(gl, {
	          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the choropleth-layer */\n#define SHADER_NAME choropleth-layer-vertex-shader\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 colors;\nattribute vec3 pickingColors;\n\nuniform mat4 projectionMatrix;\nuniform mat4 worldMatrix;\n\nuniform float opacity;\nuniform float renderPickingBuffer;\nuniform vec3 selectedPickingColor;\n\nvarying vec4 vColor;\n\nvec4 getColor(vec4 color, float opacity, vec3 pickingColor, float renderPickingBuffer) {\n  vec4 color4 = vec4(color.xyz / 255., color.w / 255. * opacity);\n  vec4 pickingColor4 = vec4(pickingColor / 255., 1.);\n  return mix(color4, pickingColor4, renderPickingBuffer);\n}\n\nvoid main(void) {\n  vec2 pos = mercatorProject(positions.xy, mercatorScale);\n  // For some reason, need to add one to elevation to show up in untilted mode\n  vec3 p = vec3(pos.xy, positions.z + 1.);\n  gl_Position = projectionMatrix * vec4(p, 1.);\n\n  vec4 color = vec4(colors / 255., opacity);\n  vec4 pickingColor = vec4(pickingColors / 255., 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n\n  // float alpha = pickingColors == selectedPickingColor ? 0.5 : opacity;\n  // vColor = vec4(mix(colors / 255., pickingColors / 255., renderPickingBuffer), alpha);\n}\n',
	          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the choropleth-layer */\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
	          id: 'choropleth'
	        }),
	        geometry: new _luma.Geometry({
	          id: this.props.id,
	          drawMode: this.props.drawContour ? 'LINES' : 'TRIANGLES'
	        }),
	        vertexCount: 0,
	        isIndexed: true
	      });
	    }
	  }, {
	    key: 'calculatePositions',
	    value: function calculatePositions(attribute) {
	      var vertices = (0, _lodash2.default)(this.state.groupedVertices);
	      attribute.value = new Float32Array(vertices);
	    }
	  }, {
	    key: 'calculateIndices',
	    value: function calculateIndices(attribute) {
	      var _this2 = this;
	
	      // adjust index offset for multiple choropleths
	      var offsets = this.state.groupedVertices.reduce(function (acc, vertices) {
	        return [].concat(_toConsumableArray(acc), [acc[acc.length - 1] + vertices.length]);
	      }, [0]);
	
	      var indices = this.state.groupedVertices.map(function (vertices, choroplethIndex) {
	        return _this2.props.drawContour ?
	        // 1. get sequentially ordered indices of each choropleth contour
	        // 2. offset them by the number of indices in previous choropleths
	        _this2.calculateContourIndices(vertices.length).map(function (index) {
	          return index + offsets[choroplethIndex];
	        }) :
	        // 1. get triangulated indices for the internal areas
	        // 2. offset them by the number of indices in previous choropleths
	        (0, _earcut2.default)((0, _lodash2.default)(vertices), null, 3).map(function (index) {
	          return index + offsets[choroplethIndex];
	        });
	      });
	
	      attribute.value = new Uint16Array((0, _lodash2.default)(indices));
	      attribute.target = this.state.gl.ELEMENT_ARRAY_BUFFER;
	      this.state.model.setVertexCount(attribute.value.length / attribute.size);
	    }
	  }, {
	    key: 'calculateColors',
	    value: function calculateColors(attribute) {
	      var _this3 = this;
	
	      var colors = this.state.groupedVertices.map(function (vertices) {
	        return vertices.map(function (vertex) {
	          return _this3.props.drawContour ? [0, 0, 0] : [128, 128, 128];
	        });
	      });
	
	      attribute.value = new Float32Array((0, _lodash2.default)(colors));
	    }
	
	    // Override the default picking colors calculation
	
	  }, {
	    key: 'calculatePickingColors',
	    value: function calculatePickingColors(attribute) {
	      var _this4 = this;
	
	      var colors = this.state.groupedVertices.map(function (vertices, choroplethIndex) {
	        return vertices.map(function (vertex) {
	          return _this4.props.drawContour ? [-1, -1, -1] : [(choroplethIndex + 1) % 256, Math.floor((choroplethIndex + 1) / 256) % 256, Math.floor((choroplethIndex + 1) / 256 / 256) % 256];
	        });
	      });
	
	      attribute.value = new Float32Array((0, _lodash2.default)(colors));
	    }
	  }, {
	    key: 'extractChoropleths',
	    value: function extractChoropleths() {
	      var data = this.props.data;
	
	      var normalizedGeojson = (0, _geojsonNormalize2.default)(data);
	
	      this.state.choropleths = normalizedGeojson.features.map(function (choropleth) {
	        var coordinates = choropleth.geometry.coordinates[0];
	        // flatten nested polygons
	        if (coordinates.length === 1 && coordinates[0].length > 2) {
	          coordinates = coordinates[0];
	        }
	        return {
	          properties: choropleth.properties,
	          coordinates: coordinates
	        };
	      });
	
	      this.state.groupedVertices = this.state.choropleths.map(function (choropleth) {
	        return choropleth.coordinates.map(function (coordinate) {
	          return [coordinate[0], coordinate[1], 0];
	        });
	      });
	    }
	  }, {
	    key: 'calculateContourIndices',
	    value: function calculateContourIndices(numVertices) {
	      // use vertex pairs for gl.LINES => [0, 1, 1, 2, 2, ..., n-1, n-1, 0]
	      var indices = [];
	      for (var i = 1; i < numVertices - 1; i++) {
	        indices = [].concat(_toConsumableArray(indices), [i, i]);
	      }
	      return [0].concat(_toConsumableArray(indices), [0]);
	    }
	  }, {
	    key: 'onHover',
	    value: function onHover(info) {
	      var index = info.index;
	      var data = this.props.data;
	
	      var feature = data.features[index];
	      this.props.onHover(_extends({}, info, { feature: feature }));
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(info) {
	      var index = info.index;
	      var data = this.props.data;
	
	      var feature = data.features[index];
	      this.props.onClick(_extends({}, info, { feature: feature }));
	    }
	  }]);
	
	  return ChoroplethLayer;
	}(_layer2.default);
	
	exports.default = ChoroplethLayer;

/***/ },

/***/ 990:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _scatterplotLayer = __webpack_require__(991);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_scatterplotLayer).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 991:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;if (getter === undefined) {
	      return undefined;
	    }return getter.call(receiver);
	  }
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _luma = __webpack_require__(795);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	} // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	var glslify = __webpack_require__(833);
	
	var ATTRIBUTES = {
	  instancePositions: { size: 3, '0': 'x', '1': 'y', '2': 'unused' },
	  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' },
	  instanceRadius: { size: 1, '0': 'radius' }
	};
	
	var ScatterplotLayer = function (_Layer) {
	  _inherits(ScatterplotLayer, _Layer);
	
	  _createClass(ScatterplotLayer, null, [{
	    key: 'attributes',
	    get: function get() {
	      return ATTRIBUTES;
	    }
	
	    /*
	     * @classdesc
	     * ScatterplotLayer
	     *
	     * @class
	     * @param {object} props
	     * @param {number} props.radius - point radius
	     */
	
	  }]);
	
	  function ScatterplotLayer(props) {
	    _classCallCheck(this, ScatterplotLayer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterplotLayer).call(this, props));
	  }
	
	  _createClass(ScatterplotLayer, [{
	    key: 'initializeState',
	    value: function initializeState() {
	      var gl = this.state.gl;
	      var attributeManager = this.state.attributeManager;
	
	      this.setState({
	        model: this.getModel(gl)
	      });
	
	      attributeManager.addInstanced(ATTRIBUTES, {
	        instancePositions: { update: this.calculateInstancePositions },
	        instanceColors: { update: this.calculateInstanceColors },
	        instanceRadius: { update: this.calculateInstanceRadius }
	      });
	    }
	  }, {
	    key: 'didMount',
	    value: function didMount() {
	      this.updateUniforms();
	    }
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, newProps) {
	      _get(Object.getPrototypeOf(ScatterplotLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);
	      this.updateUniforms();
	    }
	  }, {
	    key: 'getModel',
	    value: function getModel(gl) {
	      var NUM_SEGMENTS = 16;
	      var PI2 = Math.PI * 2;
	
	      var positions = [];
	      for (var i = 0; i < NUM_SEGMENTS; i++) {
	        positions = [].concat(_toConsumableArray(positions), [Math.cos(PI2 * i / NUM_SEGMENTS), Math.sin(PI2 * i / NUM_SEGMENTS), 0]);
	      }
	
	      return new _luma.Model({
	        program: new _luma.Program(gl, {
	          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the scatterplot-layer */\n#define SHADER_NAME scatterplot-layer-vs\n\nhighp float random(vec2 co) {\n  highp float a = 12.9898;\n  highp float b = 78.233;\n  highp float c = 43758.5453;\n  highp float dt= dot(co.xy ,vec2(a,b));\n  highp float sn= mod(dt,3.14);\n  return fract(sin(sn) / c) - .5;\n}\n\nconst float TILE_SIZE_1604150559 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1604150559 = TILE_SIZE_1604150559 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1604150559 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 instancePositions;\nattribute vec3 instanceColors;\nattribute vec3 instancePickingColors;\n\nattribute float instanceRadius;\nuniform float opacity;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec4 vColor;\nuniform float renderPickingBuffer;\n\nvoid main(void) {\n  // vec2 pos = mercatorProject(instancePositions.xy);\n  // vec3 p = vec3(pos, instancePositions.z) + positions * instanceRadius;\n  // // gl_Position = projectionMatrix * vec4(p, 1.0);\n  // // float rand = random(pos);\n  // // gl_Position = vec4(rand, rand, 0, 1.);\n\n  // vec4 color = vec4(instanceColors / 255.0, 1.);\n  // vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  // vColor = mix(color, pickingColor, renderPickingBuffer);\n\n  vec2 pos = mercatorProject(instancePositions.xy, mercatorScale);\n  // For some reason, need to add one to elevation to show up in untilted mode\n  vec3 p = vec3(pos, instancePositions.z + 1.) + positions * instanceRadius;\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, 1.);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
	          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the scatterplot-layer */\n#define SHADER_NAME scatterplot-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
	          id: 'scatterplot'
	        }),
	        geometry: new _luma.Geometry({
	          drawMode: 'TRIANGLE_FAN',
	          positions: new Float32Array(positions)
	        }),
	        isInstanced: true
	      });
	    }
	  }, {
	    key: 'updateUniforms',
	    value: function updateUniforms() {
	      // this.calculateRadius();
	      // var radius = this.state.radius;
	
	      // this.setUniforms({
	      // radius: radius
	      // });
	    }
	  }, {
	    key: 'calculateInstancePositions',
	    value: function calculateInstancePositions(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var point = _step.value;
	
	          value[i + 0] = point.position.x;
	          value[i + 1] = point.position.y;
	          value[i + 2] = point.position.z;
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'calculateInstanceRadius',
	    value: function calculateInstanceRadius(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var point = _step.value;
	
	          value[i + 0] = point.radius;
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'calculateInstanceColors',
	    value: function calculateInstanceColors(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var point = _step2.value;
	
	          value[i + 0] = point.color[0];
	          value[i + 1] = point.color[1];
	          value[i + 2] = point.color[2];
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }]);

	  return ScatterplotLayer;
	}(_layer2.default);

	exports.default = ScatterplotLayer;

/***/ },

/***/ 992:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _gridLayer = __webpack_require__(993);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_gridLayer).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 993:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;if (getter === undefined) {
	      return undefined;
	    }return getter.call(receiver);
	  }
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _luma = __webpack_require__(795);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	} // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	var glslify = __webpack_require__(833);
	
	var ATTRIBUTES = {
	  instancePositions: { size: 3, '0': 'x', '1': 'y', '2': 'unused' },
	  instanceColors: { size: 4, '0': 'red', '1': 'green', '2': 'blue', '3': 'alpha' }
	};
	
	var GridLayer = function (_Layer) {
	  _inherits(GridLayer, _Layer);
	
	  _createClass(GridLayer, null, [{
	    key: 'attributes',
	    get: function get() {
	      return ATTRIBUTES;
	    }
	
	    /**
	     * @classdesc
	     * GridLayer
	     *
	     * @class
	     * @param {object} opts
	     * @param {number} opts.unitWidth - width of the unit rectangle
	     * @param {number} opts.unitHeight - height of the unit rectangle
	     */
	
	  }]);
	
	  function GridLayer(opts) {
	    _classCallCheck(this, GridLayer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(GridLayer).call(this, _extends({
	      unitWidth: 100,
	      unitHeight: 100
	    }, opts)));
	  }
	
	  _createClass(GridLayer, [{
	    key: 'initializeState',
	    value: function initializeState() {
	      var _state = this.state;
	      var gl = _state.gl;
	      var attributeManager = _state.attributeManager;
	
	      this.setState({
	        model: this.getModel(gl)
	      });
	
	      attributeManager.addInstanced(ATTRIBUTES, {
	        instancePositions: { update: this.calculateInstancePositions },
	        instanceColors: { update: this.calculateInstanceColors }
	      });
	
	      this.updateCell();
	    }
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, newProps) {
	      _get(Object.getPrototypeOf(GridLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);
	
	      var cellSizeChanged = newProps.unitWidth !== oldProps.unitWidth || newProps.unitHeight !== oldProps.unitHeight;
	
	      if (cellSizeChanged || this.state.viewportChanged) {
	        this.updateCell();
	      }
	    }
	  }, {
	    key: 'getModel',
	    value: function getModel(gl) {
	      return new _luma.Model({
	        program: new _luma.Program(gl, {
	          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the grid-layer */\n#define SHADER_NAME grid-layer-vs\n\nattribute vec3 vertices;\nattribute vec3 instancePositions;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\n\nuniform float mercatorScale;\n\nuniform float maxCount;\nuniform float opacity;\nuniform float renderPickingBuffer;\nuniform vec3 scale;\nuniform vec3 selectedPickingColor;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  float alpha = instancePickingColors == selectedPickingColor ? 1.5 * instanceColors.w : instanceColors.w;\n  vColor = vec4(mix(instanceColors.xyz / maxCount, instancePickingColors / 255., renderPickingBuffer), alpha);\n\n  vec3 p = instancePositions + vertices * scale / mercatorScale;\n  gl_Position = projectionMatrix * worldMatrix * vec4(p, 1.0);\n}\n',
	          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the grid-layer */\n#define SHADER_NAME grid-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
	          id: 'grid'
	        }),
	        geometry: new _luma.Geometry({
	          id: this.props.id,
	          drawMode: 'TRIANGLE_FAN',
	          vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
	        }),
	        isInstanced: true
	      });
	    }
	  }, {
	    key: 'updateCell',
	    value: function updateCell() {
	      var _props = this.props;
	      var width = _props.width;
	      var height = _props.height;
	      var unitWidth = _props.unitWidth;
	      var unitHeight = _props.unitHeight;
	
	      var numCol = Math.ceil(width * 2 / unitWidth);
	      var numRow = Math.ceil(height * 2 / unitHeight);
	      this.setState({
	        numCol: numCol,
	        numRow: numRow,
	        numInstances: numCol * numRow
	      });
	
	      var attributeManager = this.state.attributeManager;
	
	      attributeManager.invalidateAll();
	
	      var MARGIN = 2;
	      var scale = new Float32Array([unitWidth - MARGIN * 2, unitHeight - MARGIN * 2, 1]);
	      this.setUniforms({ scale: scale });
	    }
	  }, {
	    key: 'calculateInstancePositions',
	    value: function calculateInstancePositions(attribute, numInstances) {
	      var _props2 = this.props;
	      var unitWidth = _props2.unitWidth;
	      var unitHeight = _props2.unitHeight;
	      var width = _props2.width;
	      var height = _props2.height;
	      var numCol = this.state.numCol;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      for (var i = 0; i < numInstances; i++) {
	        var x = i % numCol;
	        var y = Math.floor(i / numCol);
	        value[i * size + 0] = x * unitWidth - width;
	        value[i * size + 1] = y * unitHeight - height;
	        value[i * size + 2] = 0;
	      }
	    }
	  }, {
	    key: 'calculateInstanceColors',
	    value: function calculateInstanceColors(attribute) {
	      var _props3 = this.props;
	      var data = _props3.data;
	      var unitWidth = _props3.unitWidth;
	      var unitHeight = _props3.unitHeight;
	      var width = _props3.width;
	      var height = _props3.height;
	      var _state2 = this.state;
	      var numCol = _state2.numCol;
	      var numRow = _state2.numRow;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      value.fill(0.0);
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var point = _step.value;
	
	          var pixel = this.project([point.position.y, point.position.x]);
	          var colId = Math.floor((pixel.x + width) / unitWidth);
	          var rowId = Math.floor((pixel.y + height) / unitHeight);
	          if (colId < numCol && rowId < numRow) {
	            var i4 = (colId + rowId * numCol) * size;
	            value[i4 + 2] = value[i4 + 0] += 1;
	            value[i4 + 1] += 5;
	            value[i4 + 3] = 0.6;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      this.setUniforms({ maxCount: Math.max.apply(Math, _toConsumableArray(value)) });
	    }
	  }]);
	
	  return GridLayer;
	}(_layer2.default);
	
	exports.default = GridLayer;

/***/ },

/***/ 994:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _arcLayer = __webpack_require__(995);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_arcLayer).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 995:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;if (getter === undefined) {
	      return undefined;
	    }return getter.call(receiver);
	  }
	};
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _luma = __webpack_require__(795);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}
	
	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	} // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	var glslify = __webpack_require__(833);
	
	var ATTRIBUTES = {
	  instancePositions: { size: 4, '0': 'x0', '1': 'y0', '2': 'x1', '3': 'y1' },
	  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' }
	};
	
	var RED = [255, 0, 0];
	var BLUE = [0, 0, 255];
	
	var ArcLayer = function (_Layer) {
	  _inherits(ArcLayer, _Layer);
	
	  /**
	   * @classdesc
	   * ArcLayer
	   *
	   * @class
	   * @param {object} opts
	   */
	  function ArcLayer() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$strokeWidth = _ref.strokeWidth;
	    var strokeWidth = _ref$strokeWidth === undefined ? 1 : _ref$strokeWidth;
	    var _ref$color = _ref.color0;
	    var color0 = _ref$color === undefined ? RED : _ref$color;
	    var _ref$color2 = _ref.color1;
	    var color1 = _ref$color2 === undefined ? BLUE : _ref$color2;
	
	    var opts = _objectWithoutProperties(_ref, ['strokeWidth', 'color0', 'color1']);
	
	    _classCallCheck(this, ArcLayer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ArcLayer).call(this, _extends({
	      strokeWidth: strokeWidth,
	      color0: color0,
	      color1: color1
	    }, opts)));
	  }
	
	  _createClass(ArcLayer, [{
	    key: 'initializeState',
	    value: function initializeState() {
	      var _state = this.state;
	      var gl = _state.gl;
	      var attributeManager = _state.attributeManager;
	
	      var model = this.createModel(gl);
	      model.userData.strokeWidth = this.props.strokeWidth;
	      this.setState({ model: model });
	
	      attributeManager.addInstanced(ATTRIBUTES, {
	        instancePositions: { update: this.calculateInstancePositions },
	        instanceColors: { update: this.calculateInstanceColors }
	      });
	
	      this.updateColors();
	    }
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, nextProps) {
	      _get(Object.getPrototypeOf(ArcLayer.prototype), 'willReceiveProps', this).call(this, oldProps, nextProps);
	      this.state.model.userData.strokeWidth = nextProps.strokeWidth;
	      this.updateColors();
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel(gl) {
	      var positions = [];
	      var NUM_SEGMENTS = 50;
	      for (var i = 0; i < NUM_SEGMENTS; i++) {
	        positions = [].concat(_toConsumableArray(positions), [i, i, i]);
	      }
	
	      return new _luma.Model({
	        program: new _luma.Program(gl, {
	          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the arc-layer */\n#define SHADER_NAME arc-layer-vs\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nconst float N = 49.0;\n\nattribute vec3 positions;\nattribute vec3 instanceColors;\nattribute vec4 instancePositions;\nattribute vec3 instancePickingColors;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\nuniform float opacity;\nuniform float renderPickingBuffer;\n\nvarying vec4 vColor;\n\nfloat paraboloid(vec2 source, vec2 target, float index) {\n  float ratio = index / N;\n\n  vec2 x = mix(source, target, ratio);\n  vec2 center = mix(source, target, 0.5);\n\n  float dSourceCenter = distance(source, center);\n  float dXCenter = distance(x, center);\n  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);\n}\n\nvoid main(void) {\n  vec2 source = mercatorProject(instancePositions.xy, mercatorScale);\n  vec2 target = mercatorProject(instancePositions.zw, mercatorScale);\n\n  // TODO - are we only using x coordinate?\n  float segmentIndex = positions.x;\n  vec3 p = vec3(\n    // xy: linear interpolation of source & target\n    mix(source, target, segmentIndex / N),\n    // z: paraboloid interpolate of source & target\n    sqrt(paraboloid(source, target, segmentIndex))\n  );\n\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, opacity);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, opacity);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
	          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the arc-layer */\n#define SHADER_NAME arc-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
	          id: 'arc'
	        }),
	        geometry: new _luma.Geometry({
	          id: 'arc',
	          drawMode: 'LINE_STRIP',
	          positions: new Float32Array(positions)
	        }),
	        isInstanced: true,
	        onBeforeRender: function onBeforeRender() {
	          this.userData.oldStrokeWidth = gl.getParameter(gl.LINE_WIDTH);
	          this.program.gl.lineWidth(this.userData.strokeWidth || 1);
	        },
	        onAfterRender: function onAfterRender() {
	          this.program.gl.lineWidth(this.userData.oldStrokeWidth || 1);
	        }
	      });
	    }
	  }, {
	    key: 'updateColors',
	    value: function updateColors() {
	      this.setUniforms({
	        color0: this.props.color0,
	        color1: this.props.color1
	      });
	    }
	  }, {
	    key: 'calculateInstancePositions',
	    value: function calculateInstancePositions(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var arc = _step.value;
	
	          value[i + 0] = arc.position.x0;
	          value[i + 1] = arc.position.y0;
	          value[i + 2] = arc.position.x1;
	          value[i + 3] = arc.position.y1;
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'calculateInstanceColors',
	    value: function calculateInstanceColors(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var point = _step2.value;
	
	          value[i + 0] = point.color[0];
	          value[i + 1] = point.color[1];
	          value[i + 2] = point.color[2];
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }]);
	
	  return ArcLayer;
	}(_layer2.default);
	
	exports.default = ArcLayer;

/***/ },

/***/ 996:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _lineLayer = __webpack_require__(997);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_lineLayer).default;
	  }
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

/***/ },

/***/ 997:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();
	
	var _get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;if (getter === undefined) {
	      return undefined;
	    }return getter.call(receiver);
	  }
	};
	
	var _layer = __webpack_require__(974);
	
	var _layer2 = _interopRequireDefault(_layer);
	
	var _luma = __webpack_require__(795);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	function _objectWithoutProperties(obj, keys) {
	  var target = {};for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	  }return target;
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	} // Copyright (c) 2015 Uber Technologies, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	var glslify = __webpack_require__(833);
	
	var ATTRIBUTES = {
	  instancePositions: { size: 4, '0': 'x0', '1': 'y0', '2': 'x1', '3': 'y1' },
	  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' }
	};
	
	var LineLayer = function (_Layer) {
	  _inherits(LineLayer, _Layer);
	
	  /**
	   * @classdesc
	   * LineLayer
	   *
	   * @class
	   * @param {object} opts
	   */
	  function LineLayer() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$strokeWidth = _ref.strokeWidth;
	    var strokeWidth = _ref$strokeWidth === undefined ? 9 : _ref$strokeWidth;
	
	    var opts = _objectWithoutProperties(_ref, ['strokeWidth']);
	
	    _classCallCheck(this, LineLayer);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(LineLayer).call(this, _extends({
	      strokeWidth: strokeWidth
	    }, opts)));
	  }
	
	  _createClass(LineLayer, [{
	    key: 'initializeState',
	    value: function initializeState() {
	      var _state = this.state;
	      var gl = _state.gl;
	      var attributeManager = _state.attributeManager;
	
	      var model = this.createModel(gl);
	      model.userData.strokeWidth = this.props.strokeWidth;
	      this.setState({ model: model });
	
	      attributeManager.addInstanced(ATTRIBUTES, {
	        instancePositions: { update: this.calculateInstancePositions },
	        instanceColors: { update: this.calculateInstanceColors }
	      });
	    }
	  }, {
	    key: 'willReceiveProps',
	    value: function willReceiveProps(oldProps, nextProps) {
	      _get(Object.getPrototypeOf(LineLayer.prototype), 'willReceiveProps', this).call(this, oldProps, nextProps);
	      this.state.model.userData.strokeWidth = nextProps.strokeWidth;
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel(gl) {
	      var positions = [0, 0, 0, 1, 1, 1];
	
	      return new _luma.Model({
	        program: new _luma.Program(gl, {
	          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the line-layer */\n#define SHADER_NAME line-layer-vs\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 instanceColors;\nattribute vec4 instancePositions;\nattribute vec3 instancePickingColors;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\nuniform float opacity;\nuniform float renderPickingBuffer;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec2 source = mercatorProject(instancePositions.xy, mercatorScale);\n  vec2 target = mercatorProject(instancePositions.zw, mercatorScale);\n\n  float segmentIndex = positions.x;\n  vec3 p = vec3(\n    // xy: linear interpolation of source & target\n    mix(source, target, segmentIndex),\n    // As per similar comment in choropleth-layer-vertex.glsl\n    // For some reason, need to add one to elevation to show up in untilted mode\n    // This seems to be only a problem on a Mac and not in Windows.\n    1.0\n  );\n\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, opacity);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, opacity);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
	          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the line-layer */\n#define SHADER_NAME line-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
	          id: 'line'
	        }),
	        geometry: new _luma.Geometry({
	          id: 'line',
	          drawMode: 'LINE_STRIP',
	          positions: new Float32Array(positions)
	        }),
	        isInstanced: true,
	        onBeforeRender: function onBeforeRender() {
	          this.userData.oldStrokeWidth = gl.getParameter(gl.LINE_WIDTH);
	          this.program.gl.lineWidth(this.userData.strokeWidth || 1);
	        },
	        onAfterRender: function onAfterRender() {
	          this.program.gl.lineWidth(this.userData.oldStrokeWidth || 1);
	        }
	      });
	    }
	  }, {
	    key: 'calculateInstancePositions',
	    value: function calculateInstancePositions(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var line = _step.value;
	
	          value[i + 0] = line.position.x0;
	          value[i + 1] = line.position.y0;
	          value[i + 2] = line.position.x1;
	          value[i + 3] = line.position.y1;
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'calculateInstanceColors',
	    value: function calculateInstanceColors(attribute) {
	      var data = this.props.data;
	      var value = attribute.value;
	      var size = attribute.size;
	
	      var i = 0;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var point = _step2.value;
	
	          value[i + 0] = point.color[0];
	          value[i + 1] = point.color[1];
	          value[i + 2] = point.color[2];
	          i += size;
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }]);
	
	  return LineLayer;
	}(_layer2.default);
	
	exports.default = LineLayer;

/***/ },

/***/ 998:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Post = __webpack_require__(999);
	
	var _Post2 = _interopRequireDefault(_Post);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LightBox = function LightBox(_ref) {
	  var active = _ref.active;
	
	
	  var height = { height: window.innerHeight - 200 };
	
	  var post = {
	    'key': 1,
	    'type': 'tweet',
	    'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies facilisis ipsum, non sagittis velit venenatis gravida.',
	    'date': Date.now(),
	    'location': [0, 0],
	    'link': 'http://www.google.com',
	    'image': '../static/img/photo.png'
	  };
	
	  var meta = {
	    'type': post.type,
	    'date': post.date,
	    'location': post.location,
	    'link': post.link
	  };
	
	  if (active) {
	    return _react2.default.createElement(
	      'div',
	      { id: 'lightBox' },
	      _react2.default.createElement(
	        'div',
	        { className: 'contentWrapper', style: height },
	        _react2.default.createElement(
	          _Post2.default,
	          { format: 'lightBox', meta: meta },
	          post.image
	        )
	      )
	    );
	  } else {
	    return null;
	  }
	};
	
	LightBox.propTypes = {
	  active: _react.PropTypes.bool.isRequired
	};
	exports.default = LightBox;

/***/ },

/***/ 999:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utils = __webpack_require__(790);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Post = function Post(_ref) {
	  var format = _ref.format;
	  var data = _ref.data;
	
	  if (format === 'full') {
	    var metaTypes = ['date'];
	    if (data.location) metaTypes.push('location');
	    if (data.link) metaTypes.push('link');
	    var meta = metaTypes.map(function (m, i) {
	      var value = function () {
	        if (m === 'date') {
	          var d = new Date(data.date);
	          return _react2.default.createElement(
	            'p',
	            null,
	            (0, _utils.dateToString)(d, true)
	          );
	        } else if (format === 'full') {
	          return _react2.default.createElement('img', { width: '16', height: '16', key: i, src: '/static/img/icon-' + m + '.png' });
	        }
	      }();
	      return _react2.default.createElement(
	        'div',
	        { className: m, key: i },
	        value
	      );
	    });
	
	    var content = function content(data) {
	      switch (data.type) {
	        case 'tweet':
	          var images = data.images ? data.images.map(function (url, i) {
	            return _react2.default.createElement('img', { src: url, key: i });
	          }) : '';
	          return _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'p',
	              { className: 'message' },
	              '"',
	              data.content,
	              '"'
	            ),
	            images
	          );
	        case 'image':
	          return _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement('img', { src: data.images[0] }),
	            _react2.default.createElement(
	              'p',
	              null,
	              data.content
	            )
	          );
	        case 'audio':
	          var soundCloudURL = 'https://w.soundcloud.com/player/?url=';
	          soundCloudURL += data.link;
	          soundCloudURL += '&color=F8D143&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false';
	
	          return _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'h2',
	              null,
	              data.title
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              'sound'
	            ),
	            _react2.default.createElement('iframe', { src: soundCloudURL })
	          );
	        case 'blog':
	          return _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	              'h2',
	              null,
	              data.title
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              data.content
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              _react2.default.createElement(
	                'a',
	                { href: data.link },
	                'Read more...'
	              )
	            )
	          );
	        default:
	          return '';
	      }
	    };
	
	    return _react2.default.createElement(
	      'div',
	      { className: 'post ' + data.key },
	      _react2.default.createElement(
	        'div',
	        { className: 'type' },
	        _react2.default.createElement('img', { width: '16', height: '16', src: '/static/img/icon-' + data.type + '.png' })
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'content' },
	        content(data),
	        _react2.default.createElement(
	          'div',
	          { className: 'meta' },
	          meta,
	          _react2.default.createElement(
	            'div',
	            { className: 'share' },
	            _react2.default.createElement('img', { width: '16', height: '16', src: 'static/img/icon-share.png' })
	          ),
	          _react2.default.createElement('div', { className: 'separator' })
	        )
	      )
	    );
	  }
	
	  return '';
	};
	
	Post.propTypes = {
	  format: _react.PropTypes.string.isRequired,
	  data: _react.PropTypes.object.isRequired
	};
	
	exports.default = Post;

/***/ },

/***/ 1000:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _desc, _value, _class;
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	var _SightingGraph = __webpack_require__(1001);
	
	var _SightingGraph2 = _interopRequireDefault(_SightingGraph);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	var Timeline = (_class = function (_React$Component) {
	  _inherits(Timeline, _React$Component);
	
	  function Timeline(props) {
	    _classCallCheck(this, Timeline);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Timeline).call(this, props));
	
	    _this.state = {
	      padding: [2, 8],
	      x: 0,
	      cursorY: 0,
	      width: 0,
	      height: 0,
	      data: [],
	      range: [0, 0],
	      domain: [0, 0],
	      scaleDays: null,
	      scaleTime: null,
	      totalSightings: [],
	      mouseOver: false
	    };
	    return _this;
	  }
	
	  _createClass(Timeline, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var expedition = nextProps.expedition;
	
	      if (expedition) {
	        var padding = this.state.padding;
	
	        var startDate = expedition.start;
	        var height = window.innerHeight - 72;
	        var width = window.innerWidth * 0.05;
	        var x = width * 0.58;
	        var dayCount = expedition.dayCount + 1;
	
	        var data = [];
	        for (var i = 0; i < dayCount; i++) {
	          var d = new Date(startDate.getTime() + i * (1000 * 3600 * 24));
	          data.push(d);
	        }
	
	        var range = [0 + padding[1], height - padding[1]];
	        var domain = [dayCount - 1, 0];
	        var scaleDays = d3.scaleLinear().domain(domain).range(range);
	        var scaleTime = d3.scaleLinear().domain([startDate.getTime() + (dayCount - 1) * (1000 * 3600 * 24), startDate.getTime()]).range(range);
	
	        var cursorY = this.state.mouseOver ? this.state.cursorY : scaleTime(expedition.currentDate.getTime()) - 8;
	
	        var totalSightings = expedition.totalSightings;
	
	        this.setState(_extends({}, this.state, {
	          x: x,
	          cursorY: cursorY,
	          width: width,
	          height: height,
	          data: data,
	          range: range,
	          domain: domain,
	          scaleDays: scaleDays,
	          scaleTime: scaleTime,
	          totalSightings: totalSightings
	        }));
	      }
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(e) {
	      var _state = this.state;
	      var scaleTime = _state.scaleTime;
	      var range = _state.range;
	      var _props = this.props;
	      var jumpTo = _props.jumpTo;
	      var expeditionID = _props.expeditionID;
	
	      var y = e.nativeEvent.offsetY;
	      jumpTo(new Date(scaleTime.invert(Math.max(range[0] + 1, Math.min(range[1] - 1, y)))), expeditionID);
	    }
	  }, {
	    key: 'onMouseMove',
	    value: function onMouseMove(e) {
	      var _state2 = this.state;
	      var range = _state2.range;
	      var padding = _state2.padding;
	
	      var cursorY = Math.max(range[0], Math.min(range[1], e.nativeEvent.offsetY)) - padding[1];
	      this.setState(_extends({}, this.state, {
	        cursorY: cursorY,
	        mouseOver: true
	      }));
	    }
	  }, {
	    key: 'onMouseOut',
	    value: function onMouseOut(e) {
	      var expedition = this.props.expedition;
	      var scaleTime = this.state.scaleTime;
	
	      var cursorY = scaleTime(expedition.currentDate.getTime()) - 8;
	      this.setState(_extends({}, this.state, {
	        cursorY: cursorY,
	        mouseOver: false
	      }));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var expedition = this.props.expedition;
	
	      if (!expedition) return _react2.default.createElement('svg', { id: 'timeline' });
	      var _state3 = this.state;
	      var width = _state3.width;
	      var height = _state3.height;
	      var data = _state3.data;
	      var x = _state3.x;
	      var range = _state3.range;
	      var scaleDays = _state3.scaleDays;
	      var cursorY = _state3.cursorY;
	      var totalSightings = _state3.totalSightings;
	      var padding = _state3.padding;
	
	
	      var days = data.map(function (d, i) {
	        return _react2.default.createElement('circle', { cx: x, cy: scaleDays(i), r: 3, key: i, fill: 'white' });
	      });
	
	      return _react2.default.createElement(
	        'svg',
	        {
	          id: 'timeline',
	          className: location.pathname === '/data' || location.pathname === '/about' ? 'invisible' : 'visible',
	          style: { height: height + 'px' },
	          onMouseOut: this.onMouseOut,
	          onMouseMove: this.onMouseMove,
	          onClick: this.onClick },
	        _react2.default.createElement(
	          'filter',
	          { id: 'dropshadow', height: '120%' },
	          _react2.default.createElement('feGaussianBlur', { 'in': 'SourceAlpha', stdDeviation: '3' }),
	          _react2.default.createElement('feOffset', { dx: '2', dy: '0', result: 'offsetblur' }),
	          _react2.default.createElement(
	            'feMerge',
	            null,
	            _react2.default.createElement('feMergeNode', null),
	            _react2.default.createElement('feMergeNode', { 'in': 'SourceGraphic' })
	          )
	        ),
	        _react2.default.createElement(
	          'g',
	          { transform: 'translate(' + 0 + ',' + padding[1] + ')', style: { pointerEvents: 'none' } },
	          _react2.default.createElement(_SightingGraph2.default, { sightings: totalSightings, width: width, height: height - padding[1] * 2 })
	        ),
	        _react2.default.createElement('line', { x1: x, x2: x, y1: range[0], y2: range[1], style: { stroke: 'white' } }),
	        _react2.default.createElement(
	          'g',
	          null,
	          days
	        ),
	        _react2.default.createElement(
	          'g',
	          { transform: 'translate(' + (x - 20) + ',' + cursorY + ')', style: { pointerEvents: 'none' } },
	          _react2.default.createElement('path', { fill: '#F9D144', d: 'M8,0c5,0,12,8,12,8s-7,8-12,8c-4.4,0-8-3.6-8-8C0,3.6,3.6,0,8,0z', style: { filter: 'url(#dropshadow)' } }),
	          _react2.default.createElement('circle', { fill: '#1F1426', cx: '7.9', cy: '7.8', r: '3' })
	        )
	      );
	    }
	  }]);
	
	  return Timeline;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, 'onClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'onClick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onMouseOut', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'onMouseOut'), _class.prototype)), _class);
	
	
	Timeline.propTypes = {
	  expedition: _react.PropTypes.object,
	  jumpTo: _react.PropTypes.func.isRequired,
	  expeditionID: _react.PropTypes.string
	};
	exports.default = Timeline;

/***/ },

/***/ 1001:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SightingGraph = function SightingGraph(_ref) {
	  var width = _ref.width;
	  var height = _ref.height;
	  var sightings = _ref.sightings;
	
	  var margin = 0.42;
	  width = width - margin * width;
	
	  var x = d3.scaleLinear().domain([0, d3.max(sightings)]).range([width, width * margin]);
	
	  var y = d3.scaleLinear().domain([0, sightings.length - 1]).range([0, height]);
	
	  return _react2.default.createElement(
	    'g',
	    null,
	    _react2.default.createElement('path', { fill: 'rgba(196,131,39,0.8)', d: d3.area().x0(width).x1(function (d) {
	        return x(d);
	      }).y(function (d, i) {
	        return y(i);
	      })(sightings) })
	  );
	};
	
	SightingGraph.propTypes = {
	  width: _react.PropTypes.number.isRequired,
	  height: _react.PropTypes.number.isRequired,
	  sightings: _react.PropTypes.array
	};
	
	exports.default = SightingGraph;

/***/ },

/***/ 1002:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _NavigationItem = __webpack_require__(1003);
	
	var _NavigationItem2 = _interopRequireDefault(_NavigationItem);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Navigation = function Navigation(_ref) {
	  var pathName = _ref.pathName;
	  var setPage = _ref.setPage;
	
	  // <NavigationItem setPage={setPage} active={pathName === '/data'}>Data</NavigationItem>
	  // <NavigationItem active={pathName === '/share'}>Share</NavigationItem>
	  return _react2.default.createElement(
	    'div',
	    { id: 'header' },
	    _react2.default.createElement(
	      'div',
	      { id: 'navigation' },
	      _react2.default.createElement(
	        'ul',
	        null,
	        _react2.default.createElement(
	          _NavigationItem2.default,
	          { setPage: setPage, active: pathName === '/' || pathName === '/map' },
	          'Map'
	        ),
	        _react2.default.createElement(
	          _NavigationItem2.default,
	          { setPage: setPage, active: pathName === '/journal' },
	          'Journal'
	        ),
	        _react2.default.createElement(
	          _NavigationItem2.default,
	          { setPage: setPage, active: pathName === '/data' },
	          'Data'
	        ),
	        _react2.default.createElement(
	          _NavigationItem2.default,
	          { setPage: setPage, active: pathName === '/about' },
	          'About'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      'h1',
	      null,
	      'INTO THE OKAVANGO'
	    ),
	    _react2.default.createElement('img', { id: 'logo', src: 'static/img/logo.svg', alt: 'Into the Okavango' })
	  );
	};
	
	Navigation.propTypes = {
	  pathName: _react.PropTypes.string.isRequired,
	  setPage: _react.PropTypes.func.isRequired
	};
	
	exports.default = Navigation;

/***/ },

/***/ 1003:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(502);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NavigationItem = function NavigationItem(_ref) {
	  var children = _ref.children;
	  var active = _ref.active;
	  var setPage = _ref.setPage;
	
	  if (!setPage) setPage = function setPage() {
	    return;
	  };
	  return _react2.default.createElement(
	    'li',
	    { className: active ? 'active' : '', onClick: setPage },
	    _react2.default.createElement(
	      _reactRouter.Link,
	      { to: children.toString().toLowerCase() },
	      children.toString()
	    )
	  );
	};
	
	NavigationItem.propTypes = {
	  children: _react.PropTypes.node.isRequired,
	  setPage: _react.PropTypes.func
	  // active: PropTypes.bool.isRequred
	  // pathName: PropTypes.node.
	};
	
	exports.default = NavigationItem;

/***/ },

/***/ 1004:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _desc, _value, _class;
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactAddonsCssTransitionGroup = __webpack_require__(1005);
	
	var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	var IntroductionBox = (_class = function (_React$Component) {
	  _inherits(IntroductionBox, _React$Component);
	
	  function IntroductionBox(props) {
	    _classCallCheck(this, IntroductionBox);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IntroductionBox).call(this, props));
	
	    _this.state = {
	      completed: false,
	      contentEnabled: false,
	      startDate: 0,
	      currentPosts: [],
	      posts: [{
	        content: _react2.default.createElement(
	          'p',
	          { key: '0' },
	          'The Okavango Delta is one of the world’s last great wetland wildernesses.'
	        ),
	        timeRange: [0, 6000]
	      }, {
	        content: _react2.default.createElement(
	          'p',
	          { key: '1' },
	          'A team of Ba’Yei, scientists, engineers and adventurers is journeying a 345 kilometers crossing the delta, finding new species and exploring new ground.'
	        ),
	        timeRange: [6000, 13000]
	      }, {
	        content: _react2.default.createElement(
	          'p',
	          { key: '2' },
	          'Join us in real-time as we explore',
	          _react2.default.createElement('br', null),
	          _react2.default.createElement(
	            'span',
	            null,
	            'the beating heart of our planet.'
	          )
	        ),
	        timeRange: [13000, 21000]
	      }]
	    };
	    return _this;
	  }
	
	  _createClass(IntroductionBox, [{
	    key: 'tick',
	    value: function tick() {
	      var enableContent = this.props.enableContent;
	      var _state = this.state;
	      var posts = _state.posts;
	      var startDate = _state.startDate;
	
	
	      if (!(location.pathname === '/' || location.pathname === '/map')) {
	        this.state.completed = true;
	        return;
	      }
	
	      var now = Date.now() - startDate;
	      var currentPosts = [];
	      posts.forEach(function (p) {
	        if (p.timeRange[0] <= now && p.timeRange[1] > now) {
	          currentPosts.push(p);
	        }
	      });
	
	      if (now > posts[posts.length - 1].timeRange[1] - 6000 && !this.state.contentEnabled) {
	        this.state.contentEnabled = true;
	        enableContent();
	      }
	
	      var flag = true;
	      if (currentPosts.length !== this.state.currentPosts.length) flag = false;else {
	        for (var i = 0; i < Math.max(currentPosts.length, this.state.currentPosts.length); i++) {
	          if (currentPosts[i] !== this.state.currentPosts[i]) {
	            flag = false;
	            break;
	          }
	        }
	      }
	
	      if (!flag) {
	        this.setState(_extends({}, this.state, {
	          currentPosts: currentPosts
	        }));
	      }
	      if (now > posts[posts.length - 1].timeRange[1]) {
	        this.state.completed = true;
	        return;
	      }
	      requestAnimationFrame(this.tick);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.setState(_extends({}, this.state, {
	        startDate: Date.now()
	      }));
	      // console.log('aga componentDidMount')
	      requestAnimationFrame(this.tick);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state2 = this.state;
	      var currentPosts = _state2.currentPosts;
	      var completed = _state2.completed;
	
	      var posts = currentPosts.map(function (p) {
	        return p.content;
	      });
	
	      var container = function container() {
	        if (completed) return '';else {
	          return _react2.default.createElement(
	            _reactAddonsCssTransitionGroup2.default,
	            { transitionName: 'notif', transitionEnterTimeout: 500, transitionLeaveTimeout: 200 },
	            posts
	          );
	        }
	      };
	
	      return _react2.default.createElement(
	        'div',
	        { id: 'IntroductionBox' },
	        container()
	      );
	    }
	  }]);
	
	  return IntroductionBox;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, 'tick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'tick'), _class.prototype)), _class);
	
	
	IntroductionBox.propTypes = {
	  enableContent: _react.PropTypes.func.isRequired
	};
	
	exports.default = IntroductionBox;

/***/ },

/***/ 1012:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _NotificationPanelContainer = __webpack_require__(1013);
	
	var _NotificationPanelContainer2 = _interopRequireDefault(_NotificationPanelContainer);
	
	var _ControlPanelContainer = __webpack_require__(1016);
	
	var _ControlPanelContainer2 = _interopRequireDefault(_ControlPanelContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MapPage = function MapPage() {
	  var height = { height: window.innerWidth > 768 ? window.innerHeight - 100 : window.innerHeight - 120 };
	  return _react2.default.createElement(
	    'div',
	    { className: 'page', id: 'mapPage', style: height },
	    _react2.default.createElement(_ControlPanelContainer2.default, { pathName: location.pathname }),
	    _react2.default.createElement(_NotificationPanelContainer2.default, null)
	  );
	};
	
	// MapPage.propTypes = {
	//   active : PropTypes.bool.isRequired
	// }
	
	// import React, { PropTypes } from 'react'
	exports.default = MapPage;

/***/ },

/***/ 1013:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _reactRedux = __webpack_require__(486);
	
	var _NotificationPanel = __webpack_require__(1014);
	
	var _NotificationPanel2 = _interopRequireDefault(_NotificationPanel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import * as actions from '../actions.js'
	
	var mapStateToProps = function mapStateToProps(state, ownProps) {
	  var expedition = state.expeditions[state.selectedExpedition];
	  if (expedition) {
	    return {
	      posts: expedition.currentPosts,
	      currentDate: expedition.currentDate
	    };
	  } else {
	    return {};
	  }
	};
	
	var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	  return {};
	};
	
	var NotificationPanelContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_NotificationPanel2.default);
	
	exports.default = NotificationPanelContainer;

/***/ },

/***/ 1014:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Notification = __webpack_require__(1015);
	
	var _Notification2 = _interopRequireDefault(_Notification);
	
	var _reactAddonsCssTransitionGroup = __webpack_require__(1005);
	
	var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NotificationPanel = function NotificationPanel(_ref) {
	  var posts = _ref.posts;
	  var currentDate = _ref.currentDate;
	
	
	  var start;
	  var end;
	  if (currentDate) {
	    start = new Date(currentDate.getTime() - 0.5 * (1000 * 3600));
	    end = new Date(currentDate.getTime() + 0.5 * (1000 * 3600));
	  }
	
	  if (!posts) posts = [];
	  var notificationItems = posts.filter(function (post) {
	    var d = new Date(post.properties.DateTime);
	    return d.getTime() >= start && d.getTime() < end;
	  });
	
	  notificationItems = notificationItems.filter(function (post, i) {
	    return window.innerWidth > 768 || i === notificationItems.length - 1;
	  }).sort(function (a, b) {
	    return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime();
	  }).map(function (post, i) {
	    switch (post.type) {
	      case 'tweet':
	        var text = post.properties.Text;
	        text = text.split(' ').slice(0, text.split(' ').length - 1).join(' ');
	        if (post.properties.Tweet) text = post.properties.Tweet.text;
	        var images = post.properties.Images.filter(function (img, j) {
	          return j === 0;
	        }).map(function (img, j) {
	          return _react2.default.createElement('img', { src: img.Url.replace('http://', 'https://'), width: '100%', key: j });
	        });
	        return _react2.default.createElement(
	          _Notification2.default,
	          { type: post.type, key: post.id },
	          _react2.default.createElement(
	            'p',
	            { style: { position: window.innerWidth > 768 || post.properties.Images.length === 0 ? 'relative' : 'absolute' } },
	            text
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'images' },
	            images
	          )
	        );
	      case 'audio':
	        return _react2.default.createElement(
	          _Notification2.default,
	          { type: post.type, key: post.id },
	          _react2.default.createElement(
	            'div',
	            { className: 'title' },
	            post.properties.Title
	          )
	        );
	      case 'blog':
	        return _react2.default.createElement(
	          _Notification2.default,
	          { type: post.type, key: post.id },
	          _react2.default.createElement(
	            'div',
	            { className: 'title' },
	            post.properties.Title
	          )
	        );
	      case 'image':
	        var width = 0;
	        var height = 0;
	        if (post.properties.Dimensions) {
	          width = post.properties.Dimensions[0];
	          height = post.properties.Dimensions[1];
	        } else if (post.properties.Size) {
	          width = post.properties.Size[0];
	          height = post.properties.Size[1];
	        }
	        return _react2.default.createElement(
	          _Notification2.default,
	          { type: post.type, key: post.id },
	          _react2.default.createElement('img', { className: 'image', src: post.properties.Url.replace('http://', 'https://'), width: width, height: height })
	        );
	    }
	  });
	
	  var height = window.innerWidth > 768 ? { height: window.innerHeight - 100 } : {};
	
	  return _react2.default.createElement(
	    'div',
	    { id: 'notificationPanel', style: height },
	    _react2.default.createElement(
	      _reactAddonsCssTransitionGroup2.default,
	      { transitionName: 'notif', transitionEnterTimeout: 300, transitionLeaveTimeout: 150 },
	      notificationItems
	    )
	  );
	};
	
	NotificationPanel.propTypes = {
	  posts: _react.PropTypes.array,
	  currentDate: _react.PropTypes.object
	};
	
	exports.default = NotificationPanel;

/***/ },

/***/ 1015:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Notification = function Notification(_ref) {
	  var children = _ref.children;
	  var type = _ref.type;
	  return _react2.default.createElement(
	    "div",
	    { className: "notification" },
	    _react2.default.createElement(
	      "div",
	      { className: "content" },
	      children
	    ),
	    _react2.default.createElement(
	      "div",
	      { className: "type" },
	      _react2.default.createElement("img", { width: "16", height: "16", src: 'static/img/icon-' + type + '.png' })
	    )
	  );
	};
	
	Notification.propTypes = {
	  children: _react.PropTypes.node.isRequired,
	  type: _react.PropTypes.string.isRequired
	};
	
	exports.default = Notification;

/***/ },

/***/ 1016:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _reactRedux = __webpack_require__(486);
	
	var _ControlPanel = __webpack_require__(1017);
	
	var _ControlPanel2 = _interopRequireDefault(_ControlPanel);
	
	var _actions = __webpack_require__(496);
	
	var actions = _interopRequireWildcard(_actions);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mapStateToProps = function mapStateToProps(state, ownProps) {
	  var props = {
	    currentPage: state.currentPage,
	    expeditionID: state.selectedExpedition,
	    expeditions: state.expeditions
	  };
	
	  var expedition = state.expeditions[state.selectedExpedition];
	  if (props.expeditionID) {
	    props.currentDate = expedition.currentDate;
	    props.playback = expedition.playback;
	    props.mainFocus = expedition.mainFocus;
	    props.secondaryFocus = expedition.secondaryFocus;
	    props.zoom = expedition.zoom;
	    props.layout = expedition.layout;
	    props.viewport = {
	      width: window.innerWidth,
	      height: window.innerHeight,
	      longitude: expedition.coordinates[0],
	      latitude: expedition.coordinates[1],
	      zoom: expedition.zoom
	    };
	  }
	
	  return props;
	};
	
	var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	  return {
	    onYearChange: function onYearChange(value) {
	      return dispatch(actions.setExpedition(value));
	    },
	    onPlaybackChange: function onPlaybackChange(value) {
	      return dispatch(actions.setControl('playback', value));
	    },
	    onMainFocusChange: function onMainFocusChange(value) {
	      return dispatch(actions.setControl('mainFocus', value));
	    },
	    onSecondaryFocusChange: function onSecondaryFocusChange(value) {
	      return dispatch(actions.setControl('secondaryFocus', value));
	    },
	    onZoomChange: function onZoomChange(value) {
	      return dispatch(actions.setControl('zoom', value));
	    },
	    onLayoutChange: function onLayoutChange(value) {
	      return dispatch(actions.setControl('layout', value));
	    }
	  };
	};
	
	var ControlPanelContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_ControlPanel2.default);
	
	exports.default = ControlPanelContainer;

/***/ },

/***/ 1017:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _YearSelector = __webpack_require__(1018);
	
	var _YearSelector2 = _interopRequireDefault(_YearSelector);
	
	var _DateSelector = __webpack_require__(1019);
	
	var _DateSelector2 = _interopRequireDefault(_DateSelector);
	
	var _PlaybackSelector = __webpack_require__(1020);
	
	var _PlaybackSelector2 = _interopRequireDefault(_PlaybackSelector);
	
	var _FocusSelector = __webpack_require__(1021);
	
	var _FocusSelector2 = _interopRequireDefault(_FocusSelector);
	
	var _ZoomSelector = __webpack_require__(1022);
	
	var _ZoomSelector2 = _interopRequireDefault(_ZoomSelector);
	
	var _LayoutSelector = __webpack_require__(1023);
	
	var _LayoutSelector2 = _interopRequireDefault(_LayoutSelector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ControlPanel = function ControlPanel(_ref) {
	  var pathName = _ref.pathName;
	  var expeditionID = _ref.expeditionID;
	  var expeditions = _ref.expeditions;
	  var currentDate = _ref.currentDate;
	  var playback = _ref.playback;
	  var mainFocus = _ref.mainFocus;
	  var secondaryFocus = _ref.secondaryFocus;
	  var zoom = _ref.zoom;
	  var layout = _ref.layout;
	  var onYearChange = _ref.onYearChange;
	  var onPlaybackChange = _ref.onPlaybackChange;
	  var onMainFocusChange = _ref.onMainFocusChange;
	  var onSecondaryFocusChange = _ref.onSecondaryFocusChange;
	  var onZoomChange = _ref.onZoomChange;
	  var onLayoutChange = _ref.onLayoutChange;
	  var viewport = _ref.viewport;
	
	  if (!expeditionID) return _react2.default.createElement('div', { className: 'controlPanel' });
	
	  if (pathName === '/') pathName = '/map';
	
	  // {pathName === '/map' ? <FocusSelector mainFocus={mainFocus} secondaryFocus={secondaryFocus} onMainFocusChange={onMainFocusChange} onSecondaryFocusChange={onSecondaryFocusChange}/> : null}
	  // {pathName === '/journal' ? <LayoutSelector mode={layout} onLayoutChange={onLayoutChange}/> : null}
	  // <YearSelector expeditions={expeditions} expeditionID={expeditionID} onYearChange={onYearChange}/>
	  return _react2.default.createElement(
	    'div',
	    { className: 'controlPanel' },
	    _react2.default.createElement(_DateSelector2.default, { expeditions: expeditions, expeditionID: expeditionID, currentDate: currentDate }),
	    pathName === '/map' ? _react2.default.createElement(_PlaybackSelector2.default, { mode: playback, onPlaybackChange: onPlaybackChange }) : null,
	    pathName === '/map' && window.innerWidth > 768 ? _react2.default.createElement(_ZoomSelector2.default, { onZoomChange: onZoomChange, viewport: viewport }) : null
	  );
	};
	
	ControlPanel.propTypes = {
	  pathName: _react.PropTypes.string.isRequired,
	  expeditionID: _react.PropTypes.string,
	  expeditions: _react.PropTypes.object,
	  currentDate: _react.PropTypes.object,
	  playback: _react.PropTypes.string,
	  mainFocus: _react.PropTypes.string,
	  secondaryFocus: _react.PropTypes.string,
	  zoom: _react.PropTypes.number,
	  layout: _react.PropTypes.string,
	  onYearChange: _react.PropTypes.func.isRequired,
	  onPlaybackChange: _react.PropTypes.func.isRequired,
	  onMainFocusChange: _react.PropTypes.func.isRequired,
	  onSecondaryFocusChange: _react.PropTypes.func.isRequired,
	  onZoomChange: _react.PropTypes.func.isRequired,
	  onLayoutChange: _react.PropTypes.func.isRequired,
	  viewPort: _react.PropTypes.object
	};
	
	exports.default = ControlPanel;

/***/ },

/***/ 1018:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var YearSelector = function YearSelector(_ref) {
	  var expeditionID = _ref.expeditionID;
	  var expeditions = _ref.expeditions;
	  var onYearChange = _ref.onYearChange;
	
	  var toggleDropdown = function toggleDropdown() {
	    document.getElementById('YearSelectorDropdown').classList.toggle('show');
	  };
	
	  var currentExpeditionName = expeditions[expeditionID].name;
	  var expeditionList = Object.keys(expeditions).sort(function (a, b) {
	    return expeditions[b].end.getTime() - expeditions[a].end.getTime();
	  }).map(function (k, i) {
	    var expedition = expeditions[k];
	    return _react2.default.createElement(
	      'a',
	      { href: '#', onClick: function onClick() {
	          return onYearChange(k);
	        }, key: i },
	      expedition.name
	    );
	  });
	
	  return _react2.default.createElement(
	    'div',
	    { className: 'dropdown yearSelector controlSelector' },
	    _react2.default.createElement(
	      'button',
	      { onClick: toggleDropdown, className: 'dropbtn' },
	      currentExpeditionName,
	      _react2.default.createElement('span', null)
	    ),
	    _react2.default.createElement(
	      'div',
	      { id: 'YearSelectorDropdown', className: 'dropdown-content' },
	      expeditionList
	    )
	  );
	};
	
	YearSelector.propTypes = {
	  onYearChange: _react.PropTypes.func.isRequired,
	  expeditionID: _react.PropTypes.string.isRequired,
	  expeditions: _react.PropTypes.object.isRequired
	};
	
	exports.default = YearSelector;

/***/ },

/***/ 1019:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utils = __webpack_require__(790);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var DateSelector = function DateSelector(_ref) {
	  var expeditions = _ref.expeditions;
	  var expeditionID = _ref.expeditionID;
	  var currentDate = _ref.currentDate;
	
	  var expedition = expeditions[expeditionID];
	  var dayCount = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24));
	  var dateString = (0, _utils.dateToString)(currentDate);
	
	  return _react2.default.createElement(
	    'div',
	    { className: 'dateSelector controlSelector' },
	    _react2.default.createElement(
	      'p',
	      null,
	      'DAY ',
	      dayCount,
	      _react2.default.createElement('br', null),
	      dateString
	    )
	  );
	};
	
	DateSelector.propTypes = {
	  expeditions: _react.PropTypes.object.isRequired,
	  expeditionID: _react.PropTypes.string.isRequired,
	  currentDate: _react.PropTypes.object.isRequired
	};
	
	exports.default = DateSelector;

/***/ },

/***/ 1020:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _desc, _value, _class;
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	var PlaybackSelector = (_class = function (_React$Component) {
	  _inherits(PlaybackSelector, _React$Component);
	
	  function PlaybackSelector(props) {
	    _classCallCheck(this, PlaybackSelector);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlaybackSelector).call(this, props));
	
	    _this.state = {
	      mouseOver: ''
	    };
	    return _this;
	  }
	
	  _createClass(PlaybackSelector, [{
	    key: 'onMouseMove',
	    value: function onMouseMove(e) {
	      this.setState(_extends({}, this.state, {
	        mouseOver: e.nativeEvent.target.className
	      }));
	    }
	  }, {
	    key: 'onMouseOut',
	    value: function onMouseOut(e) {
	      this.setState(_extends({}, this.state, {
	        mouseOver: ''
	      }));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var mode = _props.mode;
	      var onPlaybackChange = _props.onPlaybackChange;
	      var mouseOver = this.state.mouseOver;
	
	      var onMouseMove = this.onMouseMove;
	      var types = ['fastBackward', 'backward', 'pause', 'forward', 'fastForward'];
	      var buttons = types.map(function (s, i) {
	        var className = 'playbackButton ' + (s === mode ? 'active' : 'inactive');
	
	        var src = function src() {
	          var url = '/static/img/icon-' + s;
	          if (s === mode || mouseOver === s) url += '-hover';
	          return url + '.png';
	        };
	
	        return _react2.default.createElement(
	          'li',
	          { className: className, key: i, onClick: function onClick() {
	              return onPlaybackChange(s);
	            }, onMouseMove: onMouseMove },
	          _react2.default.createElement('img', { className: s, width: '16', height: '16', src: src() })
	        );
	      });
	      return _react2.default.createElement(
	        'ul',
	        { className: 'playbackSelector buttonRow controlSelector', onMouseOut: this.onMouseOut },
	        buttons
	      );
	    }
	  }]);
	
	  return PlaybackSelector;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, 'onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onMouseOut', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'onMouseOut'), _class.prototype)), _class);
	
	
	PlaybackSelector.propTypes = {
	  mode: _react.PropTypes.string.isRequired,
	  onPlaybackChange: _react.PropTypes.func.isRequired
	};
	
	exports.default = PlaybackSelector;

/***/ },

/***/ 1021:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var FocusSelector = function FocusSelector(_ref) {
	  var mainFocus = _ref.mainFocus;
	  var secondaryFocus = _ref.secondaryFocus;
	  var onMainFocusChange = _ref.onMainFocusChange;
	  var onSecondaryFocusChange = _ref.onSecondaryFocusChange;
	
	
	  var toggleDropdown = function toggleDropdown(i) {
	    document.getElementById("FocusSelector" + i + "Options").classList.toggle("show");
	  };
	
	  return _react2.default.createElement(
	    "div",
	    { className: "focusSelector controlSelector" },
	    _react2.default.createElement(
	      "p",
	      null,
	      "Focus on:"
	    ),
	    _react2.default.createElement(
	      "div",
	      { className: "dropdown" },
	      _react2.default.createElement(
	        "button",
	        { onClick: function onClick() {
	            return toggleDropdown(1);
	          }, className: "dropbtn" },
	        mainFocus
	      ),
	      _react2.default.createElement(
	        "div",
	        { id: "FocusSelector1Options", className: "dropdown-content" },
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onMainFocusChange("explorers");
	            } },
	          "Explorers"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onMainFocusChange("sensors");
	            } },
	          "Sensors"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onMainFocusChange("animals");
	            } },
	          "Animals"
	        )
	      )
	    ),
	    _react2.default.createElement(
	      "div",
	      { className: "dropdown" },
	      _react2.default.createElement(
	        "button",
	        { onClick: function onClick() {
	            return toggleDropdown(2);
	          }, className: "dropbtn" },
	        secondaryFocus
	      ),
	      _react2.default.createElement(
	        "div",
	        { id: "FocusSelector2Options", className: "dropdown-content" },
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onSecondaryFocusChange("steve");
	            } },
	          "Steve"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onSecondaryFocusChange("jer");
	            } },
	          "Jer"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onSecondaryFocusChange("shah");
	            } },
	          "Shah"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "#", onClick: function onClick() {
	              return onSecondaryFocusChange("chris");
	            } },
	          "Chris"
	        )
	      )
	    )
	  );
	};
	
	FocusSelector.propTypes = {
	  mainFocus: _react.PropTypes.string.isRequired,
	  secondaryFocus: _react.PropTypes.string.isRequired,
	  onMainFocusChange: _react.PropTypes.func.isRequired,
	  onSecondaryFocusChange: _react.PropTypes.func.isRequired
	};
	
	exports.default = FocusSelector;

/***/ },

/***/ 1022:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _viewportMercatorProject = __webpack_require__(781);
	
	var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ZoomSelector = function (_React$Component) {
	  _inherits(ZoomSelector, _React$Component);
	
	  function ZoomSelector(props) {
	    _classCallCheck(this, ZoomSelector);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ZoomSelector).call(this, props));
	
	    _this.state = {
	      mouseOver: ''
	    };
	    return _this;
	  }
	
	  // @autobind
	  // onMouseMove (e) {
	  //   this.setState({
	  //     ...this.state,
	  //     mouseOver: e.nativeEvent.target.className
	  //   })
	  // }
	
	  // @autobind
	  // onMouseOut (e) {
	  //   this.setState({
	  //     ...this.state,
	  //     mouseOver: ''
	  //   })
	  // }
	
	  // componentWillReceiveProps (nextProps) {
	
	  // }
	
	  _createClass(ZoomSelector, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var onZoomChange = _props.onZoomChange;
	      var viewport = _props.viewport;
	
	      var onMouseMove = this.onMouseMove;
	      var mouseOver = this.state.mouseOver;
	
	      var types = ['decrement', 'increment'];
	
	      var buttons = types.map(function (s, i) {
	        var src = function src() {
	          var url = '/static/img/icon-' + s;
	          if (mouseOver === s) url += '-hover';
	          return url + '.png';
	        };
	        return _react2.default.createElement(
	          'li',
	          { className: 'zoomButton', key: i, onClick: function onClick() {
	              onZoomChange(s);
	            } },
	          _react2.default.createElement('img', { className: s, width: '16', height: '16', src: src() })
	        );
	      });
	
	      var _ViewportMercator = (0, _viewportMercatorProject2.default)(_extends({}, viewport));
	
	      var unproject = _ViewportMercator.unproject;
	
	      var scaleRange = (unproject([64, 0])[0] - unproject([0, 0])[0]) * 111;
	      var scaleString = Math.round(scaleRange) + 'km';
	      if (scaleRange < 1) scaleString = Math.round(scaleRange * 1000) + 'm';
	
	      return _react2.default.createElement(
	        'div',
	        { className: 'selector controlSelector' },
	        _react2.default.createElement(
	          'div',
	          { className: 'column' },
	          _react2.default.createElement(
	            'ul',
	            { className: 'buttonRow' },
	            buttons
	          )
	        ),
	        _react2.default.createElement(
	          'svg',
	          { className: 'column' },
	          _react2.default.createElement('line', { x1: 0, y1: 17.5, x2: 12, y2: 17.5, stroke: 'white' }),
	          _react2.default.createElement('line', { x1: 52, y1: 17.5, x2: 64, y2: 17.5, stroke: 'white' }),
	          _react2.default.createElement('line', { x1: 0.5, y1: 12, x2: 0.5, y2: 22, stroke: 'white' }),
	          _react2.default.createElement('line', { x1: 63.5, y1: 12, x2: 63.5, y2: 22, stroke: 'white' }),
	          _react2.default.createElement(
	            'text',
	            { x: 32, y: 18, fill: 'white', style: {
	                fontSize: '12px',
	                alignmentBaseline: 'middle',
	                textAnchor: 'middle'
	              } },
	            scaleString
	          )
	        )
	      );
	    }
	  }]);
	
	  return ZoomSelector;
	}(_react2.default.Component);
	
	ZoomSelector.propTypes = {
	  onZoomChange: _react.PropTypes.func.isRequired,
	  viewPort: _react.PropTypes.object
	};
	
	exports.default = ZoomSelector;

/***/ },

/***/ 1023:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LayoutSelector = function LayoutSelector(_ref) {
	  var mode = _ref.mode;
	  var onLayoutChange = _ref.onLayoutChange;
	
	  var types = ['rows', 'grid'];
	
	  var buttons = types.map(function (s, i) {
	
	    var className = 'layoutButton ' + (s === mode ? 'active' : 'inactive');
	
	    return _react2.default.createElement(
	      'li',
	      { className: className, key: i, onClick: function onClick() {
	          return onLayoutChange(s);
	        } },
	      _react2.default.createElement('img', { width: '16', height: '16' })
	    );
	  });
	  return _react2.default.createElement(
	    'div',
	    { className: 'selector' },
	    _react2.default.createElement(
	      'div',
	      { className: 'column' },
	      _react2.default.createElement(
	        'ul',
	        { className: 'buttonRow' },
	        buttons
	      )
	    )
	  );
	};
	
	LayoutSelector.propTypes = {
	  onLayoutChange: _react.PropTypes.func.isRequired,
	  mode: _react.PropTypes.string.isRequired
	};
	
	exports.default = LayoutSelector;

/***/ },

/***/ 1024:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _reactRedux = __webpack_require__(486);
	
	var _JournalPage = __webpack_require__(1025);
	
	var _JournalPage2 = _interopRequireDefault(_JournalPage);
	
	var _actions = __webpack_require__(496);
	
	var actions = _interopRequireWildcard(_actions);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mapStateToProps = function mapStateToProps(state, ownProps) {
	  var expeditionID = state.selectedExpedition;
	  var expedition = state.expeditions[expeditionID];
	  if (!expedition) return { posts: [] };
	
	  return {
	    expedition: expedition,
	    posts: d3.values(expedition.features).map(function (p) {
	      var key = p.id;
	      var type = p.properties.FeatureType;
	      var date = new Date(p.properties.DateTime);
	      var location = p.geometry.coordinates;
	      var author = p.properties.Member;
	      var title, content, images, link, dimensions;
	
	      if (type === 'tweet') {
	        if (expeditionID !== 'okavango_14') {
	          content = p.properties.Text;
	          images = p.properties.Images.map(function (i) {
	            return i.Url.replace('http://', 'https://');
	          });
	          link = p.properties.Url.replace('http://', 'https://');
	        } else {
	          content = p.properties.Tweet.text;
	        }
	      }
	
	      if (type === 'image') {
	        if (expeditionID !== 'okavango_14') {
	          content = p.properties.Notes;
	          images = [p.properties.Url.replace('http://', 'https://')];
	          link = p.properties.InstagramID;
	          dimensions = p.properties.Dimensions;
	        } else {
	          content = p.properties.Notes;
	          images = [p.properties.Url.replace('http://', 'https://')];
	          link = p.properties.InstagramID;
	          dimensions = p.properties.Size;
	        }
	      }
	
	      if (type === 'blog') {
	        title = p.properties.Title;
	        content = p.properties.Summary;
	        link = p.properties.Url.replace('http://', 'https://');
	      }
	
	      if (type === 'audio') {
	        title = p.properties.Title;
	        link = p.properties.SoundCloudURL.replace('http://', 'https://');
	      }
	
	      return {
	        key: key,
	        type: type,
	        title: title,
	        content: content,
	        images: images,
	        link: link,
	        date: date,
	        location: location,
	        author: author,
	        dimensions: dimensions
	      };
	    })
	  };
	};
	
	var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	  return {
	    checkFeedContent: function checkFeedContent() {
	      return dispatch(actions.checkFeedContent());
	    }
	  };
	};
	
	var JournalPageContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_JournalPage2.default);
	
	exports.default = JournalPageContainer;

/***/ },

/***/ 1025:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Feed = __webpack_require__(1026);
	
	var _Feed2 = _interopRequireDefault(_Feed);
	
	var _ControlPanelContainer = __webpack_require__(1016);
	
	var _ControlPanelContainer2 = _interopRequireDefault(_ControlPanelContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// import autobind from 'autobind-decorator'
	
	var JournalPage = function (_React$Component) {
	  _inherits(JournalPage, _React$Component);
	
	  function JournalPage() {
	    _classCallCheck(this, JournalPage);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(JournalPage).apply(this, arguments));
	  }
	
	  _createClass(JournalPage, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var posts = _props.posts;
	      var checkFeedContent = _props.checkFeedContent;
	      var expedition = _props.expedition;
	
	      return _react2.default.createElement(
	        'div',
	        { className: 'page', id: 'journalPage' },
	        _react2.default.createElement(_ControlPanelContainer2.default, { pathName: location.pathname }),
	        _react2.default.createElement(_Feed2.default, { posts: posts, checkFeedContent: checkFeedContent, expedition: expedition })
	      );
	    }
	  }]);
	
	  return JournalPage;
	}(_react2.default.Component);
	
	JournalPage.propTypes = {
	  posts: _react.PropTypes.array.isRequired,
	  expedition: _react.PropTypes.object,
	  checkFeedContent: _react.PropTypes.func.isRequired
	};
	
	exports.default = JournalPage;

/***/ },

/***/ 1026:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _desc, _value, _class;
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Post = __webpack_require__(999);
	
	var _Post2 = _interopRequireDefault(_Post);
	
	var _d = __webpack_require__(499);
	
	var d3 = _interopRequireWildcard(_d);
	
	var _autobindDecorator = __webpack_require__(573);
	
	var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;
	
	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }
	
	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);
	
	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }
	
	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }
	
	  return desc;
	}
	
	var Feed = (_class = function (_React$Component) {
	  _inherits(Feed, _React$Component);
	
	  function Feed(props) {
	    _classCallCheck(this, Feed);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Feed).call(this, props));
	  }
	
	  _createClass(Feed, [{
	    key: 'aga',
	    value: function aga() {
	      console.log('aga scroll!');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var posts = _props.posts;
	      var checkFeedContent = _props.checkFeedContent;
	
	
	      var format = 'full';
	      var postFeed = posts.slice(0).sort(function (a, b) {
	        return b.date - a.date;
	      }).map(function (post) {
	        return _react2.default.createElement(
	          _Post2.default,
	          { format: format, data: post, key: post.key },
	          post.content
	        );
	      });
	
	      return _react2.default.createElement(
	        'div',
	        { id: 'feed', onWheel: checkFeedContent },
	        postFeed
	      );
	    }
	  }]);
	
	  return Feed;
	}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, 'aga', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'aga'), _class.prototype)), _class);
	
	
	Feed.propTypes = {
	  posts: _react.PropTypes.array.isRequired,
	  expedition: _react.PropTypes.object,
	  checkFeedContent: _react.PropTypes.func.isRequired
	};
	
	exports.default = Feed;

/***/ },

/***/ 1027:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _DataPageIndex = __webpack_require__(1028);
	
	var _DataPageIndex2 = _interopRequireDefault(_DataPageIndex);
	
	var _APIExplorer = __webpack_require__(1029);
	
	var _APIExplorer2 = _interopRequireDefault(_APIExplorer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var DataPage = function DataPage() {
	
	  var sections = [{ 'key': 1, 'title': 'Overview', 'content': _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'p',
	        null,
	        'The Okavango Database is a growing record of data generated by the explorers and scientists on their 120 day expedition to the Okavango Delta. The database encompasses ',
	        _react2.default.createElement(
	          'em',
	          null,
	          'wildlife sightings, tweets, audio recordings'
	        ),
	        ' and ',
	        _react2.default.createElement(
	          'em',
	          null,
	          'images'
	        ),
	        ' taken by the participants, as well as ',
	        _react2.default.createElement(
	          'em',
	          null,
	          'sensor measurements'
	        ),
	        ' capturing things like ',
	        _react2.default.createElement(
	          'em',
	          null,
	          'temperature, pH levels, and heart rates'
	        ),
	        '.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The intention of the Okavango Database API is to share the data in almost real-time as it’s uploaded, so that people all over the world can follow the journey as it unfolds. It also allows for others to use the data for their own purposes. Below are examples of cool things people have build with our API.'
	      )
	    )
	  }, { 'key': 2, 'title': 'Explore', 'content': _react2.default.createElement(_APIExplorer2.default, null)
	  }, { 'key': 3, 'title': 'Documentation', 'content': _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'h3',
	        null,
	        'What is an API?'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'API stands for application programming interface, which usually involves a set of processes and commands that make it convenient for people to access computer code or information that someone has already produced. For instance, if you want to make your own app post a message to Facebook, you would probably use Facebook’s API to integrate your app with theirs.'
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'What is a Database?'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'A database is an organized collection of data. For the Okavango Wildlife Database, each type of data — a wildlife sighting, image, sensor reading or audio recording, to name a few — is uploaded to an online server via satellite. As the expedition unfolds, the database will grow, holding more and more records of what the explorers and scientists have witnessed on the trip.'
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'What is a Database API?'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The Okavango Database API is the interface that allows you to ask the database to show you what’s inside. Usually, API’s are software-to-software interfaces that aren’t that easy for humans to understand. To ask the database to give you data back, you make a specific query in the form of a URL. The database is able to parse and recognize this request, and returns the data to you in some kind of structured way, like an XML or JSON file. In our case, the Okavango Database returns information in JSON (Javascript Object Notation).'
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'Calling the API'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'Basically, it\'s like this: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          '/api/<view>/<output>?<query>'
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The view is what kind of thing you want back. The core of the API lies in the features view, but you can also view expeditions, members and species as general lists.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The output returns the data as JSON if nothing is specified, otherwise you can specify ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'map'
	        ),
	        ' to see the data plotted spatially or ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'viz'
	        ),
	        ' for a graph.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The query defines the filter (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'FeatureType=sighting'
	        ),
	        '). Multiple filters are appended with ',
	        _react2.default.createElement(
	          'code',
	          null,
	          '&'
	        ),
	        ' in between.'
	      ),
	      _react2.default.createElement(
	        'h3',
	        null,
	        'API Endpoints'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The following list outlines all possible methods for accessing features in the Okavango Database. These methods are also known as endpoints, and are requested with a URL. For example, to load all of the elephant sightings (limited to the first 100 by default), you would request: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          _react2.default.createElement(
	            'a',
	            { href: 'http://intotheokavango.org/api/features?FeatureType=sighting&SpeciesName=Elephant', target: '_blank' },
	            'http://intotheokavango.org/api/features?FeatureType=sighting&SpeciesName=Elephant'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The Elephant sightings could be filtered further, by the expedition member who saw them, geographic region, or day of expedition, for example. Each API endpoint call contains the following general information:'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'limit:'
	        ),
	        ' the amount of entries returned. The default limit is 100, but this can be changed (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'limit=30'
	        ),
	        '). Larger limits tax the database, so it is recommended to keep your limit request as small as possible.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'resolution:'
	        ),
	        ' returns a feature for every ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'resolution'
	        ),
	        ' seconds. This might be useful if you want a larger sample set or time period, but don’t want to overload a graph with every single data point. ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'full'
	        ),
	        ' returns all features.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'filter:'
	        ),
	        ' feature endpoints can be filtered by member, expedition, as well as general filters like ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'limit, resolution,'
	        ),
	        ' and ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'order.'
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'returned:'
	        ),
	        ' the amount of entries returned (this usually correlates to limit, but may be less than the limit indicated if there are fewer results in the database).'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'order:'
	        ),
	        ' results are returned by default in ascending order (indicated by setting ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'order'
	        ),
	        ' to ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'ascending'
	        ),
	        ' or ',
	        _react2.default.createElement(
	          'code',
	          null,
	          '1'
	        ),
	        '), or descending order (indicated by setting ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'order'
	        ),
	        ' to ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'descending'
	        ),
	        ' or ',
	        _react2.default.createElement(
	          'code',
	          null,
	          '-1'
	        ),
	        ').'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'total:'
	        ),
	        ' indicates the total amount of matching results for the query in the database, even if the amount returned is limited.'
	      ),
	      _react2.default.createElement(
	        'h4',
	        null,
	        'Additional Filters:'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'startDate:'
	        ),
	        ' specifies the starting date of the features to be returned. May be combined with ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'endDate.'
	        ),
	        ' Format is ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'yyyy-mm-dd'
	        ),
	        ' (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'startDate=2015-06-03'
	        ),
	        ').'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'endDate:'
	        ),
	        ' specifies the ending date of the features to be returned. May be combined with ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'startDate.'
	        ),
	        ' Format is ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'yyyy-mm-dd'
	        ),
	        ' (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'endDate=2015-06-03'
	        ),
	        ').'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'geoBounds:'
	        ),
	        ' upper left (NW), lower right (SE): lon_1,lat_1,lon_2,lat_2. So the Okavango Delta is something like ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'geoBounds=20,-17,26,-22'
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'expeditionDay:'
	        ),
	        ' returns data from a specific day of the expedition (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'expeditionDay=1'
	        ),
	        ')'
	      ),
	      _react2.default.createElement(
	        'h4',
	        null,
	        'View Endpoints:'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'These endpoints offer overviews of all the members, expeditions and species that could be used to further filter features in the database.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'members:'
	        ),
	        ' reveals an array of features associated with each member. Endpoint url: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          _react2.default.createElement(
	            'a',
	            { href: 'http://intotheokavango.org/api/members', target: '_blank' },
	            'http://intotheokavango.org/api/members'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'expeditions:'
	        ),
	        ' reveals all of the expeditions to the Okavango Delta, along with start date and duration. Endpoint url: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          _react2.default.createElement(
	            'a',
	            { href: 'http://intotheokavango.org/api/expeditions', target: '_blank' },
	            'http://intotheokavango.org/api/expeditions'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'species:'
	        ),
	        ' reveals all of the species sightings on the expeditions. Endpoint url: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          _react2.default.createElement(
	            'a',
	            { href: 'http://intotheokavango.org/api/species', target: '_blank' },
	            'http://intotheokavango.org/api/species'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'h4',
	        null,
	        'Features Endpoints:'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'If you try to call the features view, the format looks quite different from the other view endpoints. This is because the Features view contains the bulk of what’s in the database, and is the main collection to be searched and filtered.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'The primary way to filter the features is by ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'FeatureType'
	        ),
	        ' (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'FeatureType=ambit'
	        ),
	        ').'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        'Here is a list of the possible FeatureTypes, and the data they contain: '
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'ambit:'
	        ),
	        ' contains heart rate and other activity data captured from ambit watches worn by certain explorers.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'ambit_geo:'
	        ),
	        ' contains geolocation data from the ambit watches.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'audio:'
	        ),
	        ' audio recordings taken in the field.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'beacon:'
	        ),
	        ' geolocation data sent by beacons every 30 minutes.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'image:'
	        ),
	        ' all images uploaded to the database. These can be filtered further by ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'ImageType: GoPro, Documentary'
	        ),
	        ' or ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'Specimen.'
	        )
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'sensor:'
	        ),
	        ' sensor readings taken by environmental sensors attached to the expedition boat. Data includes temperature, pH levels and other environmental readings.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'sighting:'
	        ),
	        ' all species sightings on the expedition. You can further filter by ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'SpeciesName'
	        ),
	        ' (ex: ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'SpeciesName=Elephant'
	        ),
	        '). The results return a timestamped geolocated point, with a ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'Count'
	        ),
	        ' of how many species were sighted, as well as images if they were taken. A ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'Taxonomy'
	        ),
	        ' object returns the scientific name, and a ',
	        _react2.default.createElement(
	          'code',
	          null,
	          'Notes'
	        ),
	        ' field records a description uploaded with the sighting.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'tweet:'
	        ),
	        ' a list of all tweets with the hashtag #okavango15.'
	      ),
	      _react2.default.createElement(
	        'p',
	        null,
	        _react2.default.createElement(
	          'code',
	          null,
	          'longform:'
	        ),
	        ' returns longform blog entries posted to the okavango collection on ',
	        _react2.default.createElement(
	          'a',
	          { href: 'https://medium.com/tag/okavango15', target: '_blank' },
	          'Medium.'
	        )
	      )
	    )
	  }];
	
	  var index = sections.map(function (section) {
	    return _react2.default.createElement(
	      'h3',
	      { key: section.key },
	      section.key,
	      ' - ',
	      section.title
	    );
	  });
	
	  var content = sections.map(function (section) {
	    return _react2.default.createElement(
	      'div',
	      { key: section.key },
	      _react2.default.createElement(
	        'h2',
	        null,
	        section.key,
	        ' - ',
	        section.title
	      ),
	      section.content
	    );
	  });
	
	  return _react2.default.createElement(
	    'div',
	    { className: 'page', id: 'dataPage' },
	    _react2.default.createElement(
	      _DataPageIndex2.default,
	      null,
	      index
	    ),
	    _react2.default.createElement(
	      'div',
	      { id: 'dataPageContent' },
	      content
	    )
	  );
	};
	
	DataPage.propTypes = {
	  // active: PropTypes.bool.isRequired
	};
	
	exports.default = DataPage;

/***/ },

/***/ 1028:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var DataPageIndex = function DataPageIndex(_ref) {
	  var children = _ref.children;
	  return _react2.default.createElement(
	    "div",
	    { id: "APIIndex" },
	    children
	  );
	};
	
	DataPageIndex.propTypes = {
	  children: _react.PropTypes.node.isRequired
	};
	
	exports.default = DataPageIndex;

/***/ },

/***/ 1029:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var APIExplorer = function APIExplorer() {
	  return _react2.default.createElement(
	    'p',
	    null,
	    'Coming soon...'
	  );
	};
	
	exports.default = APIExplorer;

/***/ },

/***/ 1030:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var AboutPage = function AboutPage() {
	  return _react2.default.createElement(
	    'div',
	    { className: 'page', id: 'aboutPage' },
	    _react2.default.createElement(
	      'div',
	      { className: 'pageWrapper' },
	      _react2.default.createElement('iframe', { className: 'vimeo', src: 'https://player.vimeo.com/video/124421450?autoplay=0&api=1', width: window.innerWidth * 0.9, height: window.innerWidth * 0.9 * 0.525, frameBorder: '0', allowFullScreen: true }),
	      _react2.default.createElement(
	        'div',
	        { className: 'columnWrapper' },
	        _react2.default.createElement(
	          'div',
	          { className: 'column headline' },
	          _react2.default.createElement(
	            'p',
	            null,
	            '18 days, 345 kilometers,',
	            _react2.default.createElement('br', null),
	            '1 river, 31 adventurers, 100% open data.',
	            _react2.default.createElement('br', null),
	            'Join us in real-time as we explore'
	          ),
	          _react2.default.createElement(
	            'h1',
	            null,
	            'THE BEATING HEART OF OUR PLANET'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'column' },
	          _react2.default.createElement(
	            'p',
	            null,
	            'The Okavango Delta is one of the world’s last great wetland wildernesses. Although the Delta has been awarded UNESCO WHS Status its catchments in the highlands of Angola are still unprotected and largely unstudied. A team of Ba’Yei, scientists, engineers and adventurers will journey a 345 kilometers crossing the river, finding new species, exploring new ground, and taking the pulse of this mighty river that brings life-giving water to the Jewel of the Kalahari.'
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'This site displays data which is uploaded daily, via satellite, by the expedition team. Data is also available through a public API, allowing anyone to remix, analyze or visualize the collected information.'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'columnWrapper' },
	        _react2.default.createElement(
	          'div',
	          { className: 'column' },
	          _react2.default.createElement(
	            'div',
	            { className: 'goalIcon' },
	            _react2.default.createElement('img', { src: 'static/img/iconIntroUnderstand.png' })
	          ),
	          _react2.default.createElement(
	            'h2',
	            null,
	            'UNDERSTAND',
	            _react2.default.createElement('br', null),
	            'THE WILDERNESS'
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'To effectively protect the Okavango and its catchments it is essential to gain knowledge and insight into the functioning of the system as a whole. Starting in 2011 the Okavango Wilderness Project has conducted yearly transects of the Delta, gathering unique data and immersing the expedition members in the ebb and flow of this pristine wilderness. Traveling down the river, the team will collect data on insects, fish, birds, reptiles and mammals, as well as conduct water quality assessments and landscape surveys.'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'column' },
	          _react2.default.createElement(
	            'div',
	            { className: 'goalIcon' },
	            _react2.default.createElement('img', { src: 'static/img/iconIntroPreserve.png' })
	          ),
	          _react2.default.createElement(
	            'h2',
	            null,
	            'RAISE AWARENESS',
	            _react2.default.createElement('br', null),
	            'AND PRESERVE'
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'Although the Okavango itself is protected as a UNESCO World Heritage Site, its catchment and water supply in Angola and Namibia remain vulnerable to human interference. By gathering and freely disseminating information about the functioning and health of the entire system the 2016 expedition aims to raise the levels of both understanding and awareness of this unique and fragile system.'
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'Once base-line data on the system becomes freely available effective measures can then be implemented to insure the continued health and survival of this great African wilderness.'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'columnWrapper credits' },
	        _react2.default.createElement(
	          'div',
	          { className: 'column' },
	          _react2.default.createElement(
	            'h2',
	            null,
	            'EXPEDITION TEAM',
	            _react2.default.createElement('br', null),
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              _react2.default.createElement('span', { className: 'explorerBox legend' }),
	              ' National Geographic Emerging Explorers'
	            )
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'Adjany Costa ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Assistant Director & 2nd Fish'
	            ),
	            _react2.default.createElement('br', null),
	            'Chris Boyes ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Expeditions Leader'
	            ),
	            _react2.default.createElement('br', null),
	            'Gobonamang "GB" Kgetho ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Poler'
	            ),
	            _react2.default.createElement('br', null),
	            'Gotz Neef ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Scienetific Collections & Leader Invertebrates'
	            ),
	            _react2.default.createElement('br', null),
	            'Jer Thorp ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Data'
	            ),
	            _react2.default.createElement('br', null),
	            'John Hilton ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Project Director'
	            ),
	            _react2.default.createElement('br', null),
	            'Kerllen Costa ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Plants & Mammals'
	            ),
	            _react2.default.createElement('br', null),
	            'Kyle Gordon ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Expedition Logistics'
	            ),
	            _react2.default.createElement('br', null),
	            'Leilamang "Schnapps" Kgetho ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Poler'
	            ),
	            _react2.default.createElement('br', null),
	            'Luke Manson ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Expedition Logistics'
	            ),
	            _react2.default.createElement('br', null),
	            'Mia Maestro ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Photographer'
	            ),
	            _react2.default.createElement('br', null),
	            'Motiemang “Judge” Xhikabora ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Poler'
	            ),
	            _react2.default.createElement('br', null),
	            'Neil Gelinas ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Filmmaker'
	            ),
	            _react2.default.createElement('br', null),
	            'Ninda Baptista ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Reptiles'
	            ),
	            _react2.default.createElement('br', null),
	            'Nkeletsang “Ralph” Moshupa ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Poler'
	            ),
	            _react2.default.createElement('br', null),
	            'Rachel Sussman ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Photographer'
	            ),
	            _react2.default.createElement('br', null),
	            'Shah Selbe ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Tech'
	            ),
	            _react2.default.createElement('br', null),
	            'Steve Boyes ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Project Leader & Birds'
	            ),
	            _react2.default.createElement('br', null),
	            'Topho "Tom" Retiyo ',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Poler'
	            ),
	            _react2.default.createElement('br', null),
	            'Tumeleto "Water" Setlabosha',
	            _react2.default.createElement(
	              'span',
	              { className: 'job' },
	              'Poler'
	            ),
	            _react2.default.createElement('br', null)
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'column' },
	          _react2.default.createElement(
	            'div',
	            { className: 'logos' },
	            _react2.default.createElement(
	              'a',
	              { href: 'http://www.nationalgeographic.com/' },
	              _react2.default.createElement('img', { src: 'static/img/natgeoLogo.svg', alt: 'National Geographic Logo', height: '35px' })
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: 'http://conservify.org/' },
	              _react2.default.createElement('img', { src: 'static/img/conservify.png', alt: 'Conservify Logo', height: '35px' })
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: 'http://www.o-c-r.org/' },
	              _react2.default.createElement('img', { src: 'static/img/ocrLogo.svg', alt: 'The Office for Creative Research Logo', height: '35px' })
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: 'http://www.wildbirdtrust.com/' },
	              _react2.default.createElement('img', { src: 'static/img/wbtLogo.png', alt: 'Wild Bird Trust Logo', height: '35px' })
	            )
	          )
	        )
	      )
	    )
	  );
	};
	
	AboutPage.propTypes = {
	  // active: PropTypes.bool.isRequired
	};
	
	exports.default = AboutPage;

/***/ },

/***/ 1031:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(299);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SharePage = function SharePage() {
	  return _react2.default.createElement(
	    'div',
	    { className: 'page', id: 'sharePage' },
	    'Share page'
	  );
	};
	
	SharePage.propTypes = {
	  // active: PropTypes.bool.isRequired
	};
	
	exports.default = SharePage;

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2FjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL3JlZHVjZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb250YWluZXJzL09rYXZhbmdvQ29udGFpbmVyLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL09rYXZhbmdvLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL0JhY2tncm91bmRNYXAuanMiLCJ3ZWJwYWNrOi8vL21pbi1kb2N1bWVudCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9kZWNrLmdsL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL3NyYy9kZWNrZ2wtb3ZlcmxheS5qcyIsIndlYnBhY2s6Ly8vLi4vc3JjL3dlYmdsLXJlbmRlcmVyLmpzIiwid2VicGFjazovLy91dGlsIChpZ25vcmVkKSIsIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCk/ZjcxNyIsIndlYnBhY2s6Ly8vLi4vc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi4vc3JjL2xheWVyLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3NyYy9sb2cuanMiLCJ3ZWJwYWNrOi8vLy4uLy4uL3NyYy92aWV3cG9ydC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vc3JjL3ZpZXdwb3J0L3ZpZXdwb3J0LmpzIiwid2VicGFjazovLy8uLi8uLi9zcmMvdmlld3BvcnQvbWFwYm94LXRyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly8vLi4vc3JjL2xheWVyLmpzIiwid2VicGFjazovLy8uLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9oZXhhZ29uLWxheWVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi8uLi8uLi9zcmMvbGF5ZXJzL2hleGFnb24tbGF5ZXIvaGV4YWdvbi1sYXllci5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9jaG9yb3BsZXRoLWxheWVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi8uLi8uLi9zcmMvbGF5ZXJzL2Nob3JvcGxldGgtbGF5ZXIvY2hvcm9wbGV0aC1sYXllci5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9zY2F0dGVycGxvdC1sYXllci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9zY2F0dGVycGxvdC1sYXllci9zY2F0dGVycGxvdC1sYXllci5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9ncmlkLWxheWVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi8uLi8uLi9zcmMvbGF5ZXJzL2dyaWQtbGF5ZXIvZ3JpZC1sYXllci5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9hcmMtbGF5ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL2xheWVycy9saW5lLWxheWVyL2luZGV4LmpzIiwid2VicGFjazovLy8uLi8uLi8uLi9zcmMvbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9MaWdodEJveC5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9Qb3N0LmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL1NpZ2h0aW5nR3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvTmF2aWdhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9OYXZpZ2F0aW9uSXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9JbnRyb2R1Y3Rpb25Cb3guanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvTWFwUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29udGFpbmVycy9Ob3RpZmljYXRpb25QYW5lbENvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9Ob3RpZmljYXRpb25QYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9Ob3RpZmljYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbnRhaW5lcnMvQ29udHJvbFBhbmVsQ29udGFpbmVyLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL0NvbnRyb2xQYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9ZZWFyU2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvRGF0ZVNlbGVjdG9yLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL1BsYXliYWNrU2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvRm9jdXNTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9ab29tU2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvTGF5b3V0U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbnRhaW5lcnMvSm91cm5hbFBhZ2VDb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvSm91cm5hbFBhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3RhdGljL2pzL2NvbXBvbmVudHMvRmVlZC5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9EYXRhUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9EYXRhUGFnZUluZGV4LmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL0FQSUV4cGxvcmVyLmpzIiwid2VicGFjazovLy8uL3N0YXRpYy9qcy9jb21wb25lbnRzL0Fib3V0UGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zdGF0aWMvanMvY29tcG9uZW50cy9TaGFyZVBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7QUFFQSxVQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsTUFBaEM7QUFQQTs7QUFSQTs7QUFoQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpREEsS0FBSSxRQUFRLDRDQUVWLGlEQUZVLENBQVo7O0FBTUEsS0FBTSxTQUNKO0FBQUE7QUFBQSxLQUFPLE1BQUssR0FBWixFQUFnQixzQ0FBaEI7QUFDRSw0REFBWSw0QkFBWixHQURGO0FBRUUsdURBQU8sTUFBSyxLQUFaLEVBQWtCLDRCQUFsQixHQUZGO0FBR0UsdURBQU8sTUFBSyxTQUFaLEVBQXNCLHlDQUF0QixHQUhGO0FBSUUsdURBQU8sTUFBSyxNQUFaLEVBQW1CLDZCQUFuQixHQUpGO0FBS0UsdURBQU8sTUFBSyxPQUFaLEVBQW9CLDhCQUFwQixHQUxGO0FBTUUsdURBQU8sTUFBSyxPQUFaLEVBQW9CLDhCQUFwQjtBQU5GLEVBREY7O0FBV0EsS0FBSSxTQUFTLFNBQVQsTUFBUyxHQUFZO0FBQ3ZCLHNCQUFTLE1BQVQsQ0FFSTtBQUFBO0FBQUEsT0FBVSxP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LEVBQW9FLFFBQU8sTUFBM0U7QUFERixjQURGO0FBSUU7QUFBQTtBQUFBLGlCQUFHLE1BQUssd0JBQVI7QUFDRSxzREFBSyxLQUFJLDJCQUFULEVBQXFDLEtBQUksaUJBQXpDLEVBQTJELFFBQU8sTUFBbEU7QUFERixjQUpGO0FBT0U7QUFBQTtBQUFBLGlCQUFHLE1BQUssdUJBQVI7QUFDRSxzREFBSyxLQUFJLHdCQUFULEVBQWtDLEtBQUksdUNBQXRDLEVBQThFLFFBQU8sTUFBckY7QUFERixjQVBGO0FBVUU7QUFBQTtBQUFBLGlCQUFHLE1BQUssK0JBQVI7QUFDRSxzREFBSyxLQUFJLHdCQUFULEVBQWtDLEtBQUksc0JBQXRDLEVBQTZELFFBQU8sTUFBcEU7QUFERjtBQVZGO0FBREY7QUE1QkY7QUF6Q0Y7QUFGRixJQURGO0FBNkZELEVBOUZEOztBQWdHQSxXQUFVLFNBQVYsR0FBc0I7QUFDcEI7QUFEb0IsRUFBdEI7O21CQUllLFM7Ozs7Ozs7Ozs7Ozs7QUN0R2Y7Ozs7OztBQUVBLEtBQU0sWUFBWSxTQUFaLFNBQVksR0FBTTtBQUN0QixVQUNFO0FBQUE7QUFBQSxPQUFNLFdBQVUsTUFBaEIsRUFBd0IsSUFBRyxXQUEzQjtBQUFBO0FBQUEsSUFERjtBQUdELEVBSkQ7O0FBTUEsV0FBVSxTQUFWLEdBQXNCO0FBQ3BCO0FBRG9CLEVBQXRCOzttQkFJZSxTIiwiZmlsZSI6Im1haW4uM2I1MTM5ZWQyMDZhNjM5ZWFhZGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qXG5cbiAgR0VORVJBTFxuICAgIGFkZCBza2lwIHRvIGludHJvXG4gICAgZXhwZWRpdGlvbiB5ZWFyIHNlbGVjdGlvblxuICAgIGRlZXAgbGlua2luZ1xuICAgIEZpeCBpbnRyb1xuICAgIGFuaW1hdGUgdGltZWxpbmUgY3Vyc29yIGFuZCBkaXJlY3Rpb25cbiAgTUFQXG4gICAgcG9wdXAgY3ljbGVcbiAgICByb3VuZCBzaWdodGluZ3MgbG9jYXRpb25cbiAgICBzaWdodGluZyBsYWJlbHNcbiAgICByb2xsb3ZlciBtZW1iZXIgbWFya2Vyc1xuICAgIHdlYkdMIHBhdGhzXG4gICAgbWFwIGludGVyYWN0aW9uc1xuICBKT1VSTkFMXG4gICAgYmluZCB0aW1lbGluZVxuICAgIHBlcm1hbGlua3MgYW5kIGxvY2F0aW9uIGJ1dHRvbnNcbiAgICBncmlkIHZpc3VhbGl6YXRpb25cbiAgQVBJXG4gICAgRG9jdW1lbnRhdGlvblxuICAgIERhdGEgZXhwbG9yZXJcblxuKi9cblxuaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCdcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7IGNyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUgfSBmcm9tICdyZWR1eCdcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJ1xuLy8gaW1wb3J0IGNyZWF0ZUxvZ2dlciBmcm9tICdyZWR1eC1sb2dnZXInXG5pbXBvcnQgeyBmZXRjaEV4cGVkaXRpb25zIH0gZnJvbSAnLi9hY3Rpb25zJ1xuaW1wb3J0IG9rYXZhbmdvQXBwIGZyb20gJy4vcmVkdWNlcnMnXG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlLCBJbmRleFJvdXRlLCBicm93c2VySGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuaW1wb3J0IE9rYXZhbmdvQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVycy9Pa2F2YW5nb0NvbnRhaW5lcidcbmltcG9ydCBNYXBQYWdlIGZyb20gJy4vY29tcG9uZW50cy9NYXBQYWdlJ1xuaW1wb3J0IEpvdXJuYWxQYWdlQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVycy9Kb3VybmFsUGFnZUNvbnRhaW5lcidcbi8vIGltcG9ydCBKb3VybmFsUGFnZSBmcm9tICcuL2NvbXBvbmVudHMvSm91cm5hbFBhZ2UnXG5pbXBvcnQgRGF0YVBhZ2UgZnJvbSAnLi9jb21wb25lbnRzL0RhdGFQYWdlJ1xuaW1wb3J0IEFib3V0UGFnZSBmcm9tICcuL2NvbXBvbmVudHMvQWJvdXRQYWdlJ1xuaW1wb3J0IFNoYXJlUGFnZSBmcm9tICcuL2NvbXBvbmVudHMvU2hhcmVQYWdlJ1xuXG4vLyBjb25zdCBsb2dnZXJNaWRkbGV3YXJlID0gY3JlYXRlTG9nZ2VyKClcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKS5yZW1vdmUoKVxuXG5sZXQgc3RvcmUgPSBjcmVhdGVTdG9yZShcbiAgb2thdmFuZ29BcHAsXG4gIGFwcGx5TWlkZGxld2FyZShcbiAgICB0aHVua01pZGRsZXdhcmUsICApXG4pXG5cbmNvbnN0IHJvdXRlcyA9IChcbiAgPFJvdXRlIHBhdGg9XCIvXCIgY29tcG9uZW50PXtPa2F2YW5nb0NvbnRhaW5lcn0+XG4gICAgPEluZGV4Um91dGUgY29tcG9uZW50PXtNYXBQYWdlfS8+XG4gICAgPFJvdXRlIHBhdGg9XCJtYXBcIiBjb21wb25lbnQ9e01hcFBhZ2V9Lz5cbiAgICA8Um91dGUgcGF0aD1cImpvdXJuYWxcIiBjb21wb25lbnQ9e0pvdXJuYWxQYWdlQ29udGFpbmVyfS8+XG4gICAgPFJvdXRlIHBhdGg9XCJkYXRhXCIgY29tcG9uZW50PXtEYXRhUGFnZX0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiYWJvdXRcIiBjb21wb25lbnQ9e0Fib3V0UGFnZX0vPlxuICAgIDxSb3V0ZSBwYXRoPVwic2hhcmVcIiBjb21wb25lbnQ9e1NoYXJlUGFnZX0vPlxuICA8L1JvdXRlPlxuKVxuXG52YXIgcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgKFxuICAgICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICAgIDxSb3V0ZXIgaGlzdG9yeT17YnJvd3Nlckhpc3Rvcnl9IHJvdXRlcz17cm91dGVzfS8+XG4gICAgICA8L1Byb3ZpZGVyPlxuICAgICksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29rYXZhbmdvJylcbiAgKVxufVxuXG5zdG9yZS5zdWJzY3JpYmUocmVuZGVyKVxuc3RvcmUuZGlzcGF0Y2goZmV0Y2hFeHBlZGl0aW9ucygpKVxuXG53aW5kb3cub25jbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAoIWV2ZW50LnRhcmdldC5tYXRjaGVzKCcuZHJvcGJ0bicpKSB7XG4gICAgdmFyIGRyb3Bkb3ducyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Ryb3Bkb3duLWNvbnRlbnQnKVxuICAgIHZhciBpXG4gICAgZm9yIChpID0gMDsgaSA8IGRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9wZW5Ecm9wZG93biA9IGRyb3Bkb3duc1tpXVxuICAgICAgaWYgKG9wZW5Ecm9wZG93bi5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICBvcGVuRHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2luZGV4LmpzXG4gKiovIiwiXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCdcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJ1xuLy8gaW1wb3J0IHsgYW5pbWF0ZSB9IGZyb20gJy4vYW5pbWF0aW9uJ1xuXG5mdW5jdGlvbiB0aW1lc3RhbXBUb1N0cmluZyAodCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKHQpXG4gIHZhciB5ZWFyID0gZC5nZXRVVENGdWxsWWVhcigpXG4gIHZhciBtb250aCA9IChkLmdldFVUQ01vbnRoKCkgKyAxKSArICcnXG4gIGlmIChtb250aC5sZW5ndGggPT09IDEpIG1vbnRoID0gJzAnICsgbW9udGhcbiAgdmFyIGRhdGUgPSAoZC5nZXRVVENEYXRlKCkpICsgJydcbiAgaWYgKGRhdGUubGVuZ3RoID09PSAxKSBkYXRlID0gJzAnICsgZGF0ZVxuICByZXR1cm4geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZVxufVxuXG5leHBvcnQgY29uc3QgRU5BQkxFX0NPTlRFTlQgPSAnRU5BQkxFX0NPTlRFTlQnXG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVDb250ZW50ICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBFTkFCTEVfQ09OVEVOVFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBTRVRfUEFHRSA9ICdTRVRfUEFUSCdcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBhZ2UgKCkge1xuICByZXR1cm4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9qb3VybmFsJykgZGlzcGF0Y2goY2hlY2tGZWVkQ29udGVudCgpKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ZlZWRDb250ZW50ICgpIHtcbiAgcmV0dXJuIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IGdldFN0YXRlKClcbiAgICBjb25zdCBleHBlZGl0aW9uSUQgPSBzdGF0ZS5zZWxlY3RlZEV4cGVkaXRpb25cbiAgICBjb25zdCBleHBlZGl0aW9uID0gc3RhdGUuZXhwZWRpdGlvbnNbZXhwZWRpdGlvbklEXVxuICAgIGNvbnN0IGRheUNvdW50ID0gZXhwZWRpdGlvbi5kYXlDb3VudFxuICAgIGNvbnN0IHBvc3RzID0gZDMudmFsdWVzKGV4cGVkaXRpb24uZmVhdHVyZXMpXG4gICAgY29uc3QgcG9zdHNCeURheSA9IGV4cGVkaXRpb24ucG9zdHNCeURheVxuICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSBkMy5zZWxlY3QoJyNjb250ZW50Jykubm9kZSgpLm9mZnNldEhlaWdodFxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IGQzLnNlbGVjdCgnI2NvbnRlbnQnKS5ub2RlKCkuc2Nyb2xsVG9wXG4gICAgY29uc3QgZmVlZEVsZW1lbnQgPSBkMy5zZWxlY3QoJyNmZWVkJykubm9kZSgpXG4gICAgY29uc3Qgdmlld1JhbmdlID0gW3Njcm9sbFRvcCwgc2Nyb2xsVG9wICsgY29udGVudEhlaWdodF1cblxuICAgIGlmIChmZWVkRWxlbWVudCkge1xuICAgICAgY29uc3QgcG9zdEVsZW1lbnRzID0gZDMuc2VsZWN0KGZlZWRFbGVtZW50KS5zZWxlY3RBbGwoJ2Rpdi5wb3N0JykuX2dyb3Vwc1swXVxuICAgICAgdmFyIHZpc2libGVEYXlzID0gW11cbiAgICAgIHZhciB2aXNpYmxlRWxlbWVudHMgPSBbXVxuICAgICAgaWYgKHBvc3RFbGVtZW50cykge1xuICAgICAgICBwb3N0RWxlbWVudHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgIHZhciBwb3N0UmFuZ2UgPSBbcC5vZmZzZXRUb3AgLSAxMDAsIHAub2Zmc2V0VG9wICsgcC5vZmZzZXRIZWlnaHQgLSAxMDBdXG4gICAgICAgICAgaWYgKCh2aWV3UmFuZ2VbMF0gPiBwb3N0UmFuZ2VbMF0gJiYgdmlld1JhbmdlWzBdIDw9IHBvc3RSYW5nZVsxXSkgfHwgKHZpZXdSYW5nZVswXSA8PSBwb3N0UmFuZ2VbMF0gJiYgdmlld1JhbmdlWzFdID4gcG9zdFJhbmdlWzBdKSB8fCAodmlld1JhbmdlWzFdID4gcG9zdFJhbmdlWzBdICYmIHZpZXdSYW5nZVsxXSA8PSBwb3N0UmFuZ2VbMV0pKSB7XG4gICAgICAgICAgICB2aXNpYmxlRWxlbWVudHMucHVzaChwLmNsYXNzTmFtZS5zcGxpdCgnICcpWzFdKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHZpc2libGVFbGVtZW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICB2YXIgZmVhdHVyZSA9IGV4cGVkaXRpb24uZmVhdHVyZXNbcF1cbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoKG5ldyBEYXRlKGZlYXR1cmUucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpIC0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgICBpZiAodmlzaWJsZURheXMuaW5kZXhPZihkYXkpID09PSAtMSkgdmlzaWJsZURheXMucHVzaChkYXkpXG4gICAgICB9KVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNpYmxlRGF5cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHZpc2libGVEYXlzW2ldIC0gdmlzaWJsZURheXNbaSArIDFdKSkge1xuICAgICAgICAgIGRpc3BhdGNoKGZldGNoUG9zdHNCeURheShleHBlZGl0aW9uSUQsIG51bGwsIGkpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVlZEhlaWdodCA9IGZlZWRFbGVtZW50Lm9mZnNldEhlaWdodFxuICAgICAgaWYgKChwb3N0cy5sZW5ndGggPT09IDApIHx8IGZlZWRIZWlnaHQgPCBjb250ZW50SGVpZ2h0IHx8IChzY3JvbGxUb3AgPD0gMTAwICYmICFwb3N0c0J5RGF5W2RheUNvdW50XSkgfHwgKHNjcm9sbFRvcCA+PSBmZWVkSGVpZ2h0IC0gY29udGVudEhlaWdodCAtIDEwMCAmJiAhcG9zdHNCeURheVswXSkpIHtcbiAgICAgICAgZGlzcGF0Y2goZmV0Y2hQb3N0c0J5RGF5KGV4cGVkaXRpb25JRCwgZXhwZWRpdGlvbi5jdXJyZW50RGF0ZSkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgocG9zdHMubGVuZ3RoID09PSAwKSB8fCAoc2Nyb2xsVG9wIDw9IDEwMCAmJiAhcG9zdHNCeURheVtkYXlDb3VudF0pKSB7XG4gICAgICAgIGRpc3BhdGNoKGZldGNoUG9zdHNCeURheShleHBlZGl0aW9uSUQsIGV4cGVkaXRpb24uY3VycmVudERhdGUpKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgRkVUQ0hfUE9TVFNfQllfREFZID0gJ0ZFVENIX1BPU1RTX0JZX0RBWSdcblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUG9zdHNCeURheSAoX2V4cGVkaXRpb25JRCwgZGF0ZSwgZXhwZWRpdGlvbkRheSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIHZhciBpXG4gICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKVxuICAgIC8vIGlmIChzdGF0ZS5pc0ZldGNoaW5nUG9zdHMgPiAwKSByZXR1cm5cbiAgICB2YXIgZXhwZWRpdGlvbklEID0gX2V4cGVkaXRpb25JRCB8fCBzdGF0ZS5zZWxlY3RlZEV4cGVkaXRpb25cbiAgICB2YXIgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF1cbiAgICBpZiAoIWV4cGVkaXRpb25EYXkpIHtcbiAgICAgIGlmICghZGF0ZSkgZGF0ZSA9IGV4cGVkaXRpb24uY3VycmVudERhdGVcbiAgICAgIGV4cGVkaXRpb25EYXkgPSBNYXRoLmZsb29yKChkYXRlLmdldFRpbWUoKSAtIGV4cGVkaXRpb24uc3RhcnQuZ2V0VGltZSgpKSAvICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICB9XG5cbiAgICB2YXIgZGF5c1RvRmV0Y2ggPSBbXVxuXG4gICAgaWYgKCFleHBlZGl0aW9uLnBvc3RzQnlEYXlbZXhwZWRpdGlvbkRheV0pIGRheXNUb0ZldGNoLnB1c2goZXhwZWRpdGlvbkRheSlcbiAgICBlbHNlIGlmIChleHBlZGl0aW9uLnBvc3RzQnlEYXlbZXhwZWRpdGlvbkRheV0gPT09ICdsb2FkaW5nJykgcmV0dXJuXG4gICAgZWxzZSB7XG4gICAgICBmb3IgKGkgPSBleHBlZGl0aW9uRGF5IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKGV4cGVkaXRpb24ucG9zdHNCeURheVtpXSA9PT0gJ2xvYWRpbmcnKSBicmVha1xuICAgICAgICBpZiAoIWV4cGVkaXRpb24ucG9zdHNCeURheVtpXSkge1xuICAgICAgICAgIGRheXNUb0ZldGNoLnB1c2goaSlcbiAgICAgICAgICBkYXlzVG9GZXRjaFswXSA9IGlcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSBleHBlZGl0aW9uRGF5ICsgMTsgaSA8IGV4cGVkaXRpb24uZGF5Q291bnQ7IGkrKykge1xuICAgICAgICBpZiAoZXhwZWRpdGlvbi5wb3N0c0J5RGF5W2ldID09PSAnbG9hZGluZycpIGJyZWFrXG4gICAgICAgIGlmICghZXhwZWRpdGlvbi5wb3N0c0J5RGF5W2ldKSB7XG4gICAgICAgICAgZGF5c1RvRmV0Y2gucHVzaChpKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF5c1RvRmV0Y2gubGVuZ3RoID09PSAwKSByZXR1cm5cbiAgICBjb25zdCBkYXRlc1RvRmV0Y2ggPSBbXVxuICAgIGRheXNUb0ZldGNoLmZvckVhY2goZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgIHZhciB0ID0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkgKyBkICogKDEwMDAgKiAzNjAwICogMjQpXG4gICAgICBkYXRlc1RvRmV0Y2hbaV0gPSB0XG4gICAgfSlcbiAgICB2YXIgcmFuZ2UgPSBbXG4gICAgICB0aW1lc3RhbXBUb1N0cmluZyhkMy5taW4oZGF0ZXNUb0ZldGNoKSksXG4gICAgICB0aW1lc3RhbXBUb1N0cmluZyhkMy5tYXgoZGF0ZXNUb0ZldGNoKSArICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICBdXG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGRVRDSF9QT1NUU19CWV9EQVksXG4gICAgICBleHBlZGl0aW9uSUQ6IGV4cGVkaXRpb25JRCxcbiAgICAgIGRheXNUb0ZldGNoXG4gICAgfSlcblxuICAgIHZhciBxdWVyeVN0cmluZyA9ICdodHRwczovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL2ZlYXR1cmVzP2xpbWl0PTAmRmVhdHVyZVR5cGU9YmxvZyxhdWRpbyxpbWFnZSx0d2VldCZsaW1pdD0wJkV4cGVkaXRpb249JyArIHN0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbiArICcmc3RhcnREYXRlPScgKyByYW5nZVswXSArICcmZW5kRGF0ZT0nICsgcmFuZ2VbMV1cbiAgICAvLyBjb25zb2xlLmxvZygncXVlcnlpbmcgcG9zdHM6JywgcXVlcnlTdHJpbmcpXG4gICAgZmV0Y2gocXVlcnlTdHJpbmcpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBqc29uLnJlc3VsdHMuZmVhdHVyZXNcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RvbmUgd2l0aCBwb3N0IHF1ZXJ5ISBSZWNlaXZlZDonICsgcmVzdWx0cy5sZW5ndGggKyAnIGZlYXR1cmVzLicpXG4gICAgICAgIHJldHVybiBkaXNwYXRjaChyZWNlaXZlUG9zdHMoZXhwZWRpdGlvbklELCByZXN1bHRzLCByYW5nZSkpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBkaXNwYXRjaChjaGVja0ZlZWRDb250ZW50KCkpXG4gICAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSRUNFSVZFX1BPU1RTID0gJ1JFQ0VJVkVfUE9TVFMnXG5cbmV4cG9ydCBmdW5jdGlvbiByZWNlaXZlUG9zdHMgKGV4cGVkaXRpb25JRCwgZGF0YSwgdGltZVJhbmdlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogUkVDRUlWRV9QT1NUUyxcbiAgICBleHBlZGl0aW9uSUQsXG4gICAgZGF0YSxcbiAgICB0aW1lUmFuZ2VcbiAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBDT01QTEVURV9EQVlTID0gJ0NPTVBMRVRFX0RBWVMnXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wbGV0ZURheXMgKGV4cGVkaXRpb25JRCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IENPTVBMRVRFX0RBWVMsXG4gICAgZXhwZWRpdGlvbklEXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNIT1dfTE9BRElOR19XSEVFTCA9ICdTSE9XX0xPQURJTkdfV0hFRUwnXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93TG9hZGluZ1doZWVsICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBTSE9XX0xPQURJTkdfV0hFRUxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgSElERV9MT0FESU5HX1dIRUVMID0gJ0hJREVfTE9BRElOR19XSEVFTCdcblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVMb2FkaW5nV2hlZWwgKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEhJREVfTE9BRElOR19XSEVFTFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBKVU1QX1RPID0gJ0pVTVBfVE8nXG5cbmV4cG9ydCBmdW5jdGlvbiBqdW1wVG8gKGRhdGUsIGV4cGVkaXRpb25JRCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKClcbiAgICB2YXIgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF1cbiAgICB2YXIgZXhwZWRpdGlvbkRheSA9IE1hdGguZmxvb3IoKGRhdGUuZ2V0VGltZSgpIC0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgIGlmIChleHBlZGl0aW9uLmRheXNbZXhwZWRpdGlvbkRheV0pIHtcbiAgICAgIGRpc3BhdGNoKHVwZGF0ZVRpbWUoZGF0ZSwgdHJ1ZSwgZXhwZWRpdGlvbklEKSlcbiAgICAgIHJldHVybiBkaXNwYXRjaChmZXRjaERheShkYXRlKSlcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2goc2hvd0xvYWRpbmdXaGVlbCgpKVxuICAgICAgcmV0dXJuIGRpc3BhdGNoKGZldGNoRGF5KGRhdGUpKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgU1RBUlQgPSAnU1RBUlQnXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU1RBUlRcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUkVRVUVTVF9FWFBFRElUSU9OUyA9ICdSRVFVRVNUX0VYUEVESVRJT05TJ1xuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdEV4cGVkaXRpb25zICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRVFVRVNUX0VYUEVESVRJT05TXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFVQREFURV9USU1FID0gJ1VQREFURV9USU1FJ1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVGltZSAoY3VycmVudERhdGUsIHVwZGF0ZU1hcFN0YXRlLCBleHBlZGl0aW9uSUQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBVUERBVEVfVElNRSxcbiAgICBjdXJyZW50RGF0ZSxcbiAgICB1cGRhdGVNYXBTdGF0ZSxcbiAgICBleHBlZGl0aW9uSURcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVVBEQVRFX01BUCA9ICdVUERBVEVfTUFQJ1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTWFwIChjdXJyZW50RGF0ZSwgY29vcmRpbmF0ZXMsIHZpZXdHZW9Cb3VuZHMsIHpvb20sIGV4cGVkaXRpb25JRCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKClcbiAgICB2YXIgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF1cbiAgICB2YXIgdGlsZXMgPSBleHBlZGl0aW9uLmZlYXR1cmVzQnlUaWxlXG4gICAgdmFyIHRpbGVSZXNvbHV0aW9uID0gTWF0aC5mbG9vcigoZXhwZWRpdGlvbi5nZW9Cb3VuZHNbMl0gLSBleHBlZGl0aW9uLmdlb0JvdW5kc1swXSkgKiAxMTEgLyAxMClcblxuICAgIGNvbnN0IGNvb3JkaW5hdGVzVG9UaWxlID0gKGNvb3JkaW5hdGVzLCBnZW9Cb3VuZHMpID0+IHtcbiAgICAgIHZhciB4ID0gTWF0aC5mbG9vcigoY29vcmRpbmF0ZXNbMF0gLSBnZW9Cb3VuZHNbMF0pICogMTExIC8gMTApXG4gICAgICB2YXIgeSA9IE1hdGguZmxvb3IoKGNvb3JkaW5hdGVzWzFdIC0gZ2VvQm91bmRzWzNdKSAqIDExMSAvIDEwKVxuICAgICAgcmV0dXJuIHt4LCB5fVxuICAgIH1cblxuICAgIGNvbnN0IHRpbGVUb0Nvb3JkaW5hdGVzID0gKHRpbGUsIGdlb0JvdW5kcykgPT4ge1xuICAgICAgdmFyIGxuZyA9ICh0aWxlLnggKiAxMCAvIDExMSkgKyBnZW9Cb3VuZHNbMF1cbiAgICAgIHZhciBsYXQgPSAodGlsZS55ICogMTAgLyAxMTEpICsgZ2VvQm91bmRzWzNdXG4gICAgICByZXR1cm4gW2xuZywgbGF0XVxuICAgIH1cblxuICAgIHZhciB3ZXN0ID0gdmlld0dlb0JvdW5kc1swXVxuICAgIHZhciBub3J0aCA9IHZpZXdHZW9Cb3VuZHNbMV1cbiAgICB2YXIgZWFzdCA9IHZpZXdHZW9Cb3VuZHNbMl1cbiAgICB2YXIgc291dGggPSB2aWV3R2VvQm91bmRzWzNdXG5cbiAgICAvLyBUT0RPIFRFTVBPUkFSWTogbGltaXRpbmcgbWF4IHJhbmdlXG4gICAgdmFyIGNlbnRyb2lkID0gWyh3ZXN0ICsgZWFzdCkgLyAyLCAoc291dGggKyBub3J0aCkgLyAyXVxuICAgIHdlc3QgPSBjZW50cm9pZFswXSArIE1hdGgubWF4KHdlc3QgLSBjZW50cm9pZFswXSwgLTAuMSlcbiAgICBlYXN0ID0gY2VudHJvaWRbMF0gKyBNYXRoLm1pbihlYXN0IC0gY2VudHJvaWRbMF0sIDAuMSlcbiAgICBub3J0aCA9IGNlbnRyb2lkWzFdICsgTWF0aC5taW4obm9ydGggLSBjZW50cm9pZFsxXSwgMC4xKVxuICAgIHNvdXRoID0gY2VudHJvaWRbMV0gKyBNYXRoLm1heChzb3V0aCAtIGNlbnRyb2lkWzFdLCAtMC4xKVxuICAgIC8vIFRFTVBPUkFSWVxuXG4gICAgdmFyIG5vcnRoV2VzdFRpbGUgPSBjb29yZGluYXRlc1RvVGlsZShbd2VzdCwgbm9ydGhdLCBleHBlZGl0aW9uLmdlb0JvdW5kcylcbiAgICB2YXIgc291dGhFYXN0VGlsZSA9IE9iamVjdC5hc3NpZ24oe30sIG5vcnRoV2VzdFRpbGUpXG4gICAgd2hpbGUgKHRpbGVUb0Nvb3JkaW5hdGVzKHNvdXRoRWFzdFRpbGUsIGV4cGVkaXRpb24uZ2VvQm91bmRzKVswXSA8PSBlYXN0KSB7XG4gICAgICBzb3V0aEVhc3RUaWxlLngrK1xuICAgIH1cbiAgICB3aGlsZSAodGlsZVRvQ29vcmRpbmF0ZXMoc291dGhFYXN0VGlsZSwgZXhwZWRpdGlvbi5nZW9Cb3VuZHMpWzFdID49IHNvdXRoKSB7XG4gICAgICBzb3V0aEVhc3RUaWxlLnktLVxuICAgIH1cblxuICAgIHZhciB0aWxlUmFuZ2UgPSBbXVxuICAgIHZhciB0aWxlc0luVmlldyA9IFtdXG4gICAgZm9yICh2YXIgeCA9IG5vcnRoV2VzdFRpbGUueDsgeCA8PSBzb3V0aEVhc3RUaWxlLng7IHgrKykge1xuICAgICAgZm9yICh2YXIgeSA9IG5vcnRoV2VzdFRpbGUueTsgeSA+PSBzb3V0aEVhc3RUaWxlLnk7IHktLSkge1xuICAgICAgICB2YXIgdGlsZSA9IHggKyB5ICogdGlsZVJlc29sdXRpb25cbiAgICAgICAgaWYgKCF0aWxlc1t0aWxlXSkgdGlsZVJhbmdlLnB1c2goe3gsIHl9KVxuICAgICAgICB0aWxlc0luVmlldy5wdXNoKHggKyB5ICogdGlsZVJlc29sdXRpb24pXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHF1ZXJ5Tm9ydGhXZXN0ID0gWzE4MCwgLTkwXVxuICAgIHZhciBxdWVyeVNvdXRoRWFzdCA9IFstMTgwLCA5MF1cbiAgICB0aWxlUmFuZ2UuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgdmFyIG5vcnRoV2VzdCA9IHRpbGVUb0Nvb3JkaW5hdGVzKHQsIGV4cGVkaXRpb24uZ2VvQm91bmRzKVxuICAgICAgdmFyIHNvdXRoRWFzdCA9IHRpbGVUb0Nvb3JkaW5hdGVzKHt4OiB0LnggKyAxLCB5OiB0LnkgLSAxfSwgZXhwZWRpdGlvbi5nZW9Cb3VuZHMpXG4gICAgICBpZiAocXVlcnlOb3J0aFdlc3RbMF0gPiBub3J0aFdlc3RbMF0pIHF1ZXJ5Tm9ydGhXZXN0WzBdID0gbm9ydGhXZXN0WzBdXG4gICAgICBpZiAocXVlcnlOb3J0aFdlc3RbMV0gPCBub3J0aFdlc3RbMV0pIHF1ZXJ5Tm9ydGhXZXN0WzFdID0gbm9ydGhXZXN0WzFdXG4gICAgICBpZiAocXVlcnlTb3V0aEVhc3RbMF0gPCBzb3V0aEVhc3RbMF0pIHF1ZXJ5U291dGhFYXN0WzBdID0gc291dGhFYXN0WzBdXG4gICAgICBpZiAocXVlcnlTb3V0aEVhc3RbMV0gPiBzb3V0aEVhc3RbMV0pIHF1ZXJ5U291dGhFYXN0WzFdID0gc291dGhFYXN0WzFdXG4gICAgfSlcbiAgICB2YXIgcXVlcnlHZW9Cb3VuZHMgPSBbcXVlcnlOb3J0aFdlc3RbMF0sIHF1ZXJ5Tm9ydGhXZXN0WzFdLCBxdWVyeVNvdXRoRWFzdFswXSwgcXVlcnlTb3V0aEVhc3RbMV1dXG5cbiAgICB0aWxlUmFuZ2UuZm9yRWFjaCgodCwgaSwgYSkgPT4ge1xuICAgICAgYVtpXSA9IHQueCArIHQueSAqIHRpbGVSZXNvbHV0aW9uXG4gICAgfSlcblxuICAgIGlmICh0aWxlUmFuZ2UubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gJ2h0dHBzOi8vaW50b3RoZW9rYXZhbmdvLm9yZy9hcGkvZmVhdHVyZXM/bGltaXQ9MCZGZWF0dXJlVHlwZT1ibG9nLGF1ZGlvLGltYWdlLHR3ZWV0LHNpZ2h0aW5nJkV4cGVkaXRpb249JyArIHN0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbiArICcmZ2VvQm91bmRzPScgKyBxdWVyeUdlb0JvdW5kcy50b1N0cmluZygpXG4gICAgICAvLyBjb25zb2xlLmxvZygncXVlcnlpbmcgZmVhdHVyZXMgYnkgdGlsZTonLCBxdWVyeVN0cmluZylcbiAgICAgIGZldGNoKHF1ZXJ5U3RyaW5nKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICAgIHZhciByZXN1bHRzID0ganNvbi5yZXN1bHRzLmZlYXR1cmVzXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2RvbmUgd2l0aCBmZWF0dXJlIHF1ZXJ5ISBSZWNlaXZlZCAnICsgcmVzdWx0cy5sZW5ndGggKyAnIGZlYXR1cmVzLicpXG4gICAgICAgICAgZGlzcGF0Y2gocmVjZWl2ZUZlYXR1cmVzKHN0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbiwgcmVzdWx0cywgdGlsZVJhbmdlKSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgdHlwZTogVVBEQVRFX01BUCxcbiAgICAgIGV4cGVkaXRpb25JRCxcbiAgICAgIGN1cnJlbnREYXRlLFxuICAgICAgY29vcmRpbmF0ZXMsXG4gICAgICB2aWV3R2VvQm91bmRzLFxuICAgICAgdGlsZXNJblZpZXcsXG4gICAgICB6b29tLFxuICAgICAgdGlsZVJhbmdlXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUkVDRUlWRV9FWFBFRElUSU9OUyA9ICdSRUNFSVZFX0VYUEVESVRJT05TJ1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjZWl2ZUV4cGVkaXRpb25zIChkYXRhKSB7XG4gIGZvciAodmFyIGsgaW4gZGF0YS5yZXN1bHRzKSB7XG4gICAgaWYgKGRhdGEucmVzdWx0c1trXS5EYXlzIDwgMSkge1xuICAgICAgZGVsZXRlIGRhdGEucmVzdWx0c1trXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogUkVDRUlWRV9FWFBFRElUSU9OUyxcbiAgICBkYXRhXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoRXhwZWRpdGlvbnMgKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIGRpc3BhdGNoKHJlcXVlc3RFeHBlZGl0aW9ucygpKVxuICAgIHJldHVybiBmZXRjaCgnaHR0cHM6Ly9pbnRvdGhlb2thdmFuZ28ub3JnL2FwaS9leHBlZGl0aW9ucycpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbihqc29uID0+IGRpc3BhdGNoKHJlY2VpdmVFeHBlZGl0aW9ucyhqc29uKSkpXG4gICAgICAudGhlbigoKSA9PiBkaXNwYXRjaChmZXRjaERheShuZXcgRGF0ZSgnMjAxNi0wOC0zMCAwMDowMDowMCswMDowMCcpLCBudWxsLCBudWxsLCB0cnVlKSkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKClcbiAgICAgICAgLy8gT2JqZWN0LmtleXMoc3RhdGUuZXhwZWRpdGlvbnMpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIC8vICAgaWYgKGlkICE9PSBzdGF0ZS5zZWxlY3RlZEV4cGVkaXRpb24pIHtcbiAgICAgICAgLy8gICAgIGRpc3BhdGNoKGZldGNoRGF5KG51bGwsIG51bGwsIGlkLCBmYWxzZSkpXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9KVxuICAgICAgICBkaXNwYXRjaChmZXRjaFRvdGFsU2lnaHRpbmdzKHN0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbikpXG4gICAgICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9qb3VybmFsJykge1xuICAgICAgICAgIGRpc3BhdGNoKGNoZWNrRmVlZENvbnRlbnQoKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hUb3RhbFNpZ2h0aW5ncyAoaWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcbiAgICByZXR1cm4gZmV0Y2goJ2h0dHBzOi8vaW50b3RoZW9rYXZhbmdvLm9yZy9hcGkvc2lnaHRpbmdzP0ZlYXR1cmVUeXBlPXNpZ2h0aW5nJmxpbWl0PTAmRXhwZWRpdGlvbj0nICsgaWQpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbihqc29uID0+IGRpc3BhdGNoKHJlY2VpdmVUb3RhbFNpZ2h0aW5ncyhpZCwganNvbikpKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSRUNFSVZFX1RPVEFMX1NJR0hUSU5HUyA9ICdSRUNFSVZFX1RPVEFMX1NJR0hUSU5HUydcblxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVUb3RhbFNpZ2h0aW5ncyAoaWQsIGRhdGEpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRUNFSVZFX1RPVEFMX1NJR0hUSU5HUyxcbiAgICBpZCxcbiAgICBkYXRhXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoRGF5IChkYXRlLCBpbml0aWFsRGF0ZSwgX2V4cGVkaXRpb25JRCwgaW5pdGlhbGl6ZSkge1xuICBpZiAoIWluaXRpYWxEYXRlKSBpbml0aWFsRGF0ZSA9IGRhdGVcbiAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcbiAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZSgpXG4gICAgdmFyIGV4cGVkaXRpb25JRCA9IF9leHBlZGl0aW9uSUQgfHwgc3RhdGUuc2VsZWN0ZWRFeHBlZGl0aW9uXG4gICAgdmFyIGV4cGVkaXRpb24gPSBzdGF0ZS5leHBlZGl0aW9uc1tleHBlZGl0aW9uSURdXG4gICAgaWYgKCFkYXRlKSBkYXRlID0gZXhwZWRpdGlvbi5jdXJyZW50RGF0ZVxuICAgIHZhciBleHBlZGl0aW9uRGF5ID0gTWF0aC5mbG9vcigoZGF0ZS5nZXRUaW1lKCkgLSBleHBlZGl0aW9uLnN0YXJ0LmdldFRpbWUoKSkgLyAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgdmFyIGRheXNUb0ZldGNoID0gW11cbiAgICBpZiAoIWV4cGVkaXRpb24uZGF5c1tleHBlZGl0aW9uRGF5IC0gMV0gJiYgZXhwZWRpdGlvbkRheSAtIDEgPj0gMCkgZGF5c1RvRmV0Y2gucHVzaChleHBlZGl0aW9uRGF5IC0gMSlcbiAgICBpZiAoIWV4cGVkaXRpb24uZGF5c1tleHBlZGl0aW9uRGF5XSkgZGF5c1RvRmV0Y2gucHVzaChleHBlZGl0aW9uRGF5KVxuICAgIGlmICghZXhwZWRpdGlvbi5kYXlzW2V4cGVkaXRpb25EYXkgKyAxXSAmJiBleHBlZGl0aW9uRGF5ICsgMSA8IGV4cGVkaXRpb24uZGF5Q291bnQpIGRheXNUb0ZldGNoLnB1c2goZXhwZWRpdGlvbkRheSArIDEpXG5cbiAgICBpZiAoZGF5c1RvRmV0Y2gubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgIGRheXNUb0ZldGNoLmZvckVhY2goZnVuY3Rpb24gKGQsIGksIGEpIHtcbiAgICAgIHZhciB0ID0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkgKyBkICogKDEwMDAgKiAzNjAwICogMjQpXG4gICAgICBhW2ldID0gdFxuICAgIH0pXG4gICAgdmFyIHJhbmdlID0gW1xuICAgICAgdGltZXN0YW1wVG9TdHJpbmcoZDMubWluKGRheXNUb0ZldGNoKSksXG4gICAgICB0aW1lc3RhbXBUb1N0cmluZyhkMy5tYXgoZGF5c1RvRmV0Y2gpICsgKDEwMDAgKiAzNjAwICogMjQpKVxuICAgIF1cblxuICAgIGNvbnN0IGdvRmV0Y2ggPSAoZmVhdHVyZVR5cGVzLCByZXN1bHRzLCBleHBlZGl0aW9uSUQpID0+IHtcbiAgICAgIHZhciB0eXBlID0gZmVhdHVyZVR5cGVzLnNoaWZ0KClcbiAgICAgIHZhciBxdWVyeVN0cmluZyA9ICdodHRwczovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL2ZlYXR1cmVzP2xpbWl0PTAmRmVhdHVyZVR5cGU9JyArIHR5cGUgKyAnJkV4cGVkaXRpb249JyArIGV4cGVkaXRpb25JRCArICcmc3RhcnREYXRlPScgKyByYW5nZVswXSArICcmZW5kRGF0ZT0nICsgcmFuZ2VbMV1cbiAgICAgIGlmICh0eXBlID09PSAnYW1iaXRfZ2VvJykgcXVlcnlTdHJpbmcgKz0gJyZyZXNvbHV0aW9uPTUnXG4gICAgICAvLyBjb25zb2xlLmxvZygncXVlcnlpbmc6JywgcXVlcnlTdHJpbmcpXG4gICAgICBmZXRjaChxdWVyeVN0cmluZylcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQoanNvbi5yZXN1bHRzLmZlYXR1cmVzKVxuICAgICAgICAgIGlmIChmZWF0dXJlVHlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlY2VpdmVkICcgKyBqc29uLnJlc3VsdHMuZmVhdHVyZXMubGVuZ3RoICsgJyAnICsgdHlwZSlcbiAgICAgICAgICAgIGdvRmV0Y2goZmVhdHVyZVR5cGVzLCByZXN1bHRzLCBleHBlZGl0aW9uSUQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkb25lIHdpdGggcXVlcnkhIFJlY2VpdmVkICcgKyBqc29uLnJlc3VsdHMuZmVhdHVyZXMubGVuZ3RoICsgJyAnICsgdHlwZSwgaW5pdGlhbGl6ZSlcbiAgICAgICAgICAgIGRpc3BhdGNoKHJlY2VpdmVEYXkoZXhwZWRpdGlvbklELCByZXN1bHRzLCByYW5nZSkpXG4gICAgICAgICAgICBkaXNwYXRjaChjb21wbGV0ZURheXMoZXhwZWRpdGlvbklEKSlcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKClcbiAgICAgICAgICAgIHZhciBleHBlZGl0aW9uID0gc3RhdGUuZXhwZWRpdGlvbnNbc3RhdGUuc2VsZWN0ZWRFeHBlZGl0aW9uXVxuICAgICAgICAgICAgdmFyIGRheXMgPSBleHBlZGl0aW9uLmRheXNcbiAgICAgICAgICAgIHZhciBpbmNvbXBsZXRlRGF5cyA9IFtdXG4gICAgICAgICAgICBkMy5rZXlzKGV4cGVkaXRpb24uZGF5cykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXhwZWRpdGlvbi5kYXlzW2tdLmluY29tcGxldGUpIGluY29tcGxldGVEYXlzLnB1c2goaylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoaW5jb21wbGV0ZURheXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIC8vIG5vdCBzdXJlIHdoeSBJIG5lZWQgdGhpcyAnfHwgZGF0ZSdcbiAgICAgICAgICAgICAgaWYgKCFzdGF0ZS5hbmltYXRlICYmIGluaXRpYWxpemUpIGRpc3BhdGNoKHN0YXJ0QW5pbWF0aW9uKCkpXG4gICAgICAgICAgICAgIC8vIGRpc3BhdGNoKHVwZGF0ZVRpbWUoaW5pdGlhbERhdGUgfHwgZGF0ZSwgZmFsc2UsIGV4cGVkaXRpb25JRCkpXG4gICAgICAgICAgICAgIGRpc3BhdGNoKHVwZGF0ZVRpbWUobmV3IERhdGUoJzIwMTYtMDgtMzAgMDA6MDA6MDArMDA6MDAnKSwgZmFsc2UsIGV4cGVkaXRpb25JRCkpXG4gICAgICAgICAgICAgIGRpc3BhdGNoKGhpZGVMb2FkaW5nV2hlZWwoKSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmNvbXBsZXRlIGRheXMnLCBpbmNvbXBsZXRlRGF5cylcbiAgICAgICAgICAgICAgdmFyIG5leHRUYXJnZXQgPSAtMVxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluY29tcGxldGVEYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gaW5jb21wbGV0ZURheXNbaV1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gTWF0aC5tYXgoMCwgaWQgLSAxKTsgaiA8IGV4cGVkaXRpb24uZGF5Q291bnQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgaWYgKCFkYXlzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRUYXJnZXQgPSBqXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0VGFyZ2V0ID4gLTEpIGJyZWFrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKG5leHRUYXJnZXQgPiAtMSkge1xuICAgICAgICAgICAgICAgIG5leHRUYXJnZXQgPSBuZXcgRGF0ZShleHBlZGl0aW9uLnN0YXJ0LmdldFRpbWUoKSArIG5leHRUYXJnZXQgKiAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goZmV0Y2hEYXkobmV4dFRhcmdldCwgbnVsbCwgZXhwZWRpdGlvbklELCBpbml0aWFsaXplKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgZ29GZXRjaChbJ2FtYml0X2dlbycsICdiZWFjb24nXSwgW10sIGV4cGVkaXRpb25JRClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgU0VUX0VYUEVESVRJT04gPSAnU0VUX0VYUEVESVRJT04nXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRFeHBlZGl0aW9uIChpZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKClcbiAgICB2YXIgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2lkXVxuICAgIGlmIChleHBlZGl0aW9uLnRvdGFsU2lnaHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGlzcGF0Y2goZmV0Y2hUb3RhbFNpZ2h0aW5ncyhpZCkpXG4gICAgfVxuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFNFVF9FWFBFRElUSU9OLFxuICAgICAgaWRcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBTRVRfQ09OVFJPTCA9ICdTRVRfQ09OVFJPTCdcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENvbnRyb2wgKHRhcmdldCwgbW9kZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNFVF9DT05UUk9MLFxuICAgIHRhcmdldCxcbiAgICBtb2RlXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJFUVVFU1RfREFZID0gJ1JFUVVFU1RfREFZJ1xuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdERheSAoZXhwZWRpdGlvbklELCBkYXlJRCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFUVVFU1RfREFZLFxuICAgIGV4cGVkaXRpb25JRCxcbiAgICBkYXlJRFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSRUNFSVZFX0RBWSA9ICdSRUNFSVZFX0RBWSdcblxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVEYXkgKGV4cGVkaXRpb25JRCwgZGF0YSwgZGF0ZVJhbmdlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogUkVDRUlWRV9EQVksXG4gICAgZXhwZWRpdGlvbklELFxuICAgIGRhdGEsXG4gICAgZGF0ZVJhbmdlXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfRkVBVFVSRVMgPSAnUkVDRUlWRV9GRUFUVVJFUydcblxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVGZWF0dXJlcyAoZXhwZWRpdGlvbklELCBkYXRhLCB0aWxlUmFuZ2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRUNFSVZFX0ZFQVRVUkVTLFxuICAgIGV4cGVkaXRpb25JRCxcbiAgICBkYXRhLFxuICAgIHRpbGVSYW5nZVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RfRkVBVFVSRSA9ICdTRUxFQ1RfRkVBVFVSRSdcblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEZlYXR1cmUgKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNFTEVDVF9GRUFUVVJFXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFVOU0VMRUNUX0ZFQVRVUkUgPSAnVU5TRUxFQ1RfRkVBVFVSRSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVuc2VsZWN0RmVhdHVyZSAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogVU5TRUxFQ1RfRkVBVFVSRVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9hY3Rpb25zLmpzXG4gKiovIiwiXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4uL2FjdGlvbnMnXG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMydcbmltcG9ydCByYW5kb21Db2xvciBmcm9tICdyYW5kb21jb2xvcidcblxuY29uc3Qgb2thdmFuZ29SZWR1Y2VyID0gKFxuICBzdGF0ZSA9IHtcbiAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiBmYWxzZSxcbiAgICBhbmltYXRlOiBmYWxzZSxcbiAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICBzZWxlY3RlZEV4cGVkaXRpb246IG51bGwsXG4gICAgZXhwZWRpdGlvbnM6IHt9LFxuICAgIHNwZWNpZXNDb2xvcnM6IHt9LFxuICAgIGNvbnRlbnRBY3RpdmU6ICEobG9jYXRpb24ucGF0aG5hbWUgPT09ICcvJyB8fCBsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9tYXAnKSxcbiAgICBpbml0aWFsUGFnZTogbG9jYXRpb24ucGF0aG5hbWVcbiAgfSxcbiAgYWN0aW9uXG4pID0+IHtcbiAgdmFyIGV4cGVkaXRpb25zLCBmZWF0dXJlcywgaWQsIGV4cGVkaXRpb25JRCwgZXhwZWRpdGlvbiwgZGF5c1xuXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuRU5BQkxFX0NPTlRFTlQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgY29udGVudEFjdGl2ZTogdHJ1ZVxuICAgICAgfVxuICAgIGNhc2UgYWN0aW9ucy5SRUNFSVZFX1BPU1RTOlxuICAgICAgLy8gY29uc29sZS5sb2coJ1JFQ0VJVkVEJywgYWN0aW9uLmRhdGEpXG4gICAgICBleHBlZGl0aW9uSUQgPSBhY3Rpb24uZXhwZWRpdGlvbklEXG4gICAgICBleHBlZGl0aW9uID0gc3RhdGUuZXhwZWRpdGlvbnNbZXhwZWRpdGlvbklEXVxuXG4gICAgICAvLyBpbml0aWFsaXppbmcgZGF5c1xuICAgICAgdmFyIHRpbWVSYW5nZSA9IGFjdGlvbi50aW1lUmFuZ2VcbiAgICAgIHZhciBwb3N0c0J5RGF5ID0ge31cbiAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKHRpbWVSYW5nZVswXSlcbiAgICAgIHZhciBlbmQgPSBuZXcgRGF0ZSh0aW1lUmFuZ2VbMV0pXG4gICAgICB2YXIgc3RhcnREYXkgPSBNYXRoLmZsb29yKChzdGFydC5nZXRUaW1lKCkgLSBleHBlZGl0aW9uLnN0YXJ0LmdldFRpbWUoKSkgLyAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgICB2YXIgZW5kRGF5ID0gTWF0aC5mbG9vcigoZW5kLmdldFRpbWUoKSAtIGV4cGVkaXRpb24uc3RhcnQuZ2V0VGltZSgpKSAvICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICAgIGZvciAoaSA9IHN0YXJ0RGF5OyBpIDw9IGVuZERheTsgaSsrKSB7XG4gICAgICAgIHBvc3RzQnlEYXlbaV0gPSB7fVxuICAgICAgfVxuXG4gICAgICBmZWF0dXJlcyA9IHt9XG4gICAgICBhY3Rpb24uZGF0YS5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgIHZhciBpZCA9IGYuaWRcbiAgICAgICAgaWYgKGYuZ2VvbWV0cnkpIHtcbiAgICAgICAgICBmZWF0dXJlc1tpZF0gPSBmZWF0dXJlUmVkdWNlcihleHBlZGl0aW9uLmZlYXR1cmVzW2lkXSwgYWN0aW9uLCBmKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBPYmplY3Qua2V5cyhmZWF0dXJlcykuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgdmFyIGZlYXR1cmUgPSBmZWF0dXJlc1tpZF1cbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoKG5ldyBEYXRlKGZlYXR1cmUucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpIC0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgICBpZiAoIXBvc3RzQnlEYXlbZGF5XSkgcG9zdHNCeURheVtkYXldID0ge31cbiAgICAgICAgcG9zdHNCeURheVtkYXldW2lkXSA9IGZlYXR1cmVcbiAgICAgIH0pXG4gICAgICBPYmplY3Qua2V5cyhwb3N0c0J5RGF5KS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgIHBvc3RzQnlEYXlba10gPSBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLnBvc3RzQnlEYXlba10sIHBvc3RzQnlEYXlba10pXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgLy8gaXNGZXRjaGluZ1Bvc3RzOiBzdGF0ZS5pc0ZldGNoaW5nUG9zdHMgLSAxLFxuICAgICAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiBmYWxzZSxcbiAgICAgICAgZXhwZWRpdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmV4cGVkaXRpb25zLCB7XG4gICAgICAgICAgW2V4cGVkaXRpb25JRF06IE9iamVjdC5hc3NpZ24oe30sIGV4cGVkaXRpb24sIHtcbiAgICAgICAgICAgIGZlYXR1cmVzOiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmZlYXR1cmVzLCBmZWF0dXJlcyksXG4gICAgICAgICAgICBwb3N0c0J5RGF5OiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLnBvc3RzQnlEYXksIHBvc3RzQnlEYXkpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuRkVUQ0hfUE9TVFNfQllfREFZOlxuICAgICAgaWQgPSBhY3Rpb24uZXhwZWRpdGlvbklEXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgLy8gaXNGZXRjaGluZ1Bvc3RzOiBzdGF0ZS5pc0ZldGNoaW5nUG9zdHMgKyAxLFxuICAgICAgICBleHBlZGl0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZXhwZWRpdGlvbnMsIHtcbiAgICAgICAgICBbaWRdOiBleHBlZGl0aW9uUmVkdWNlcihzdGF0ZS5leHBlZGl0aW9uc1tpZF0sIGFjdGlvbilcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuUkVDRUlWRV9UT1RBTF9TSUdIVElOR1M6XG4gICAgICBpZCA9IGFjdGlvbi5pZFxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIGV4cGVkaXRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5leHBlZGl0aW9ucywge1xuICAgICAgICAgIFtpZF06IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmV4cGVkaXRpb25zW2FjdGlvbi5pZF0sIHtcbiAgICAgICAgICAgIHRvdGFsU2lnaHRpbmdzOiBhY3Rpb24uZGF0YS5yZXN1bHRzXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuQ09NUExFVEVfREFZUzpcbiAgICAgIGlkID0gYWN0aW9uLmV4cGVkaXRpb25JRFxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIG1hcFN0YXRlTmVlZHNVcGRhdGU6IGZhbHNlLFxuICAgICAgICBleHBlZGl0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZXhwZWRpdGlvbnMsIHtcbiAgICAgICAgICBbaWRdOiBleHBlZGl0aW9uUmVkdWNlcihzdGF0ZS5leHBlZGl0aW9uc1tpZF0sIGFjdGlvbilcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuU0hPV19MT0FESU5HX1dIRUVMOlxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIG1hcFN0YXRlTmVlZHNVcGRhdGU6IGZhbHNlLFxuICAgICAgICBpc0ZldGNoaW5nOiB0cnVlXG4gICAgICB9KVxuXG4gICAgY2FzZSBhY3Rpb25zLkhJREVfTE9BRElOR19XSEVFTDpcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiB0cnVlLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuICAgICAgfSlcblxuICAgIGNhc2UgYWN0aW9ucy5TVEFSVDpcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiB0cnVlLFxuICAgICAgICBhbmltYXRlOiB0cnVlXG4gICAgICB9KVxuXG4gICAgY2FzZSBhY3Rpb25zLlVQREFURV9USU1FOlxuICAgICAgZXhwZWRpdGlvbklEID0gYWN0aW9uLmV4cGVkaXRpb25JRFxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIG1hcFN0YXRlTmVlZHNVcGRhdGU6IGFjdGlvbi51cGRhdGVNYXBTdGF0ZSxcbiAgICAgICAgZXhwZWRpdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmV4cGVkaXRpb25zLCB7XG4gICAgICAgICAgW2V4cGVkaXRpb25JRF06IGV4cGVkaXRpb25SZWR1Y2VyKHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF0sIGFjdGlvbilcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuVVBEQVRFX01BUDpcbiAgICAgIGV4cGVkaXRpb25JRCA9IGFjdGlvbi5leHBlZGl0aW9uSURcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiB0cnVlLFxuICAgICAgICBleHBlZGl0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZXhwZWRpdGlvbnMsIHtcbiAgICAgICAgICBbZXhwZWRpdGlvbklEXTogZXhwZWRpdGlvblJlZHVjZXIoc3RhdGUuZXhwZWRpdGlvbnNbZXhwZWRpdGlvbklEXSwgYWN0aW9uKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIGNhc2UgYWN0aW9ucy5SRUNFSVZFX0VYUEVESVRJT05TOlxuICAgICAgZXhwZWRpdGlvbnMgPSB7fVxuICAgICAgdmFyIGxhdGVzdERhdGUgPSBuZXcgRGF0ZSgwKVxuICAgICAgdmFyIGxhdGVzdEV4cGVkaXRpb25cbiAgICAgIE9iamVjdC5rZXlzKGFjdGlvbi5kYXRhLnJlc3VsdHMpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIHZhciBlID0gYWN0aW9uLmRhdGEucmVzdWx0c1tpZF1cbiAgICAgICAgZXhwZWRpdGlvbnNbaWRdID0gZXhwZWRpdGlvblJlZHVjZXIoc3RhdGUuZXhwZWRpdGlvbnNbaWRdLCBhY3Rpb24sIGUpXG4gICAgICAgIGlmIChleHBlZGl0aW9uc1tpZF0uc3RhcnQuZ2V0VGltZSgpICsgZXhwZWRpdGlvbnNbaWRdLmRheUNvdW50ICogKDEwMDAgKiAzNjAwICogMjQpID4gbGF0ZXN0RGF0ZS5nZXRUaW1lKCkpIHtcbiAgICAgICAgICBsYXRlc3REYXRlID0gbmV3IERhdGUoZXhwZWRpdGlvbnNbaWRdLnN0YXJ0LmdldFRpbWUoKSArIGV4cGVkaXRpb25zW2lkXS5kYXlDb3VudCAqICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICAgICAgICBsYXRlc3RFeHBlZGl0aW9uID0gaWRcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIGV4cGVkaXRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5leHBlZGl0aW9ucywgZXhwZWRpdGlvbnMpLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgc2VsZWN0ZWRFeHBlZGl0aW9uOiBsYXRlc3RFeHBlZGl0aW9uXG4gICAgICB9KVxuXG4gICAgY2FzZSBhY3Rpb25zLlNFVF9FWFBFRElUSU9OOlxuICAgICAgdmFyIHNlbGVjdGVkRXhwZWRpdGlvbiA9IGFjdGlvbi5pZFxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIG1hcFN0YXRlTmVlZHNVcGRhdGU6IHRydWUsXG4gICAgICAgIHNlbGVjdGVkRXhwZWRpdGlvbjogc2VsZWN0ZWRFeHBlZGl0aW9uXG4gICAgICB9KVxuXG4gICAgY2FzZSBhY3Rpb25zLlNFVF9DT05UUk9MOlxuICAgICAgaWQgPSBzdGF0ZS5zZWxlY3RlZEV4cGVkaXRpb25cbiAgICAgIGV4cGVkaXRpb25zID0ge1xuICAgICAgICBbaWRdOiBleHBlZGl0aW9uUmVkdWNlcihzdGF0ZS5leHBlZGl0aW9uc1tpZF0sIGFjdGlvbilcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiBhY3Rpb24udGFyZ2V0ID09PSAnem9vbScsXG4gICAgICAgIGV4cGVkaXRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5leHBlZGl0aW9ucywgZXhwZWRpdGlvbnMpXG4gICAgICB9KVxuXG4gICAgY2FzZSBhY3Rpb25zLlJFQ0VJVkVfREFZOlxuICAgICAgZXhwZWRpdGlvbklEID0gYWN0aW9uLmV4cGVkaXRpb25JRFxuICAgICAgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF1cblxuICAgICAgLy8gaW5pdGlhbGl6ZSBmZWF0dXJlIGJ1Y2tldHNcbiAgICAgIHZhciBtZW1iZXJzID0geyAuLi5leHBlZGl0aW9uLm1lbWJlcnMgfVxuICAgICAgdmFyIGZlYXR1cmVzQnlNZW1iZXIgPSB7fVxuICAgICAgdmFyIGZlYXR1cmVzQnlEYXkgPSB7fVxuICAgICAgdmFyIGFtYml0c0J5VGlsZSA9IHt9XG4gICAgICB2YXIgZGF0ZVJhbmdlID0gYWN0aW9uLmRhdGVSYW5nZS5tYXAoKGQpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKG5ldyBEYXRlKGQpLmdldFRpbWUoKSAtIGV4cGVkaXRpb24uc3RhcnQuZ2V0VGltZSgpKSAvICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICAgIH0pXG4gICAgICBmb3IgKHZhciBpID0gZGF0ZVJhbmdlWzBdOyBpIDw9IGRhdGVSYW5nZVsxXTsgaSsrKSB7XG4gICAgICAgIGZlYXR1cmVzQnlEYXlbaV0gPSB7fVxuICAgICAgfVxuXG4gICAgICAvLyBpbml0aWFsaXplIGZlYXR1cmVzXG4gICAgICBmZWF0dXJlcyA9IHt9XG4gICAgICBhY3Rpb24uZGF0YS5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgIHZhciBpZCA9IGYuaWRcbiAgICAgICAgaWYgKGYucHJvcGVydGllcy5UZWFtID09PSAnUml2ZXJNYWluJykge1xuICAgICAgICAgIGlmKGYucHJvcGVydGllcy5GZWF0dXJlVHlwZSAhPT0gJ2FtYml0X2dlbycgfHwgZi5wcm9wZXJ0aWVzLk1lbWJlciA9PT0gJ1N0ZXZlJyB8fCBmLnByb3BlcnRpZXMuTWVtYmVyID09PSAnR0InIHx8IGYucHJvcGVydGllcy5NZW1iZXIgPT09ICdKZXInIHx8IGYucHJvcGVydGllcy5NZW1iZXIgPT09ICdTaGFoJyl7XG4gICAgICAgICAgICBmZWF0dXJlc1tpZF0gPSBmZWF0dXJlUmVkdWNlcihleHBlZGl0aW9uLmZlYXR1cmVzW2lkXSwgYWN0aW9uLCBmKVxuICAgICAgICAgICAgaWYgKGYucHJvcGVydGllcy5GZWF0dXJlVHlwZSA9PT0gJ2FtYml0X2dlbycpIHtcbiAgICAgICAgICAgICAgaWYgKCFtZW1iZXJzW2YucHJvcGVydGllcy5NZW1iZXJdKSB7XG4gICAgICAgICAgICAgICAgbWVtYmVyc1tmLnByb3BlcnRpZXMuTWVtYmVyXSA9IHtcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBleHBlZGl0aW9uLm1lbWJlckNvbG9yc1tkMy52YWx1ZXMobWVtYmVycykubGVuZ3RoICUgZXhwZWRpdGlvbi5tZW1iZXJDb2xvcnMubGVuZ3RoXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdmFyIHRpbGVSZXNvbHV0aW9uID0gTWF0aC5mbG9vcigoZXhwZWRpdGlvbi5nZW9Cb3VuZHNbMl0gLSBleHBlZGl0aW9uLmdlb0JvdW5kc1swXSkgKiAxMTEgLyAxMClcbiAgICAgIHZhciBjb29yZGluYXRlc1RvVGlsZSA9IChjb29yZGluYXRlcywgZ2VvQm91bmRzKSA9PiB7XG4gICAgICAgIHZhciB4ID0gTWF0aC5mbG9vcigoY29vcmRpbmF0ZXNbMF0gLSBnZW9Cb3VuZHNbMF0pICogMTExIC8gMTApXG4gICAgICAgIHZhciB5ID0gTWF0aC5mbG9vcigoY29vcmRpbmF0ZXNbMV0gLSBnZW9Cb3VuZHNbM10pICogMTExIC8gMTApXG4gICAgICAgIHJldHVybiB7eCwgeX1cbiAgICAgIH1cblxuICAgICAgLy8gYXNzaWduIGZlYXR1cmUgdG8gZGF5LCB0aWxlIGFuZCBtZW1iZXJcbiAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICB2YXIgZmVhdHVyZSA9IGZlYXR1cmVzW2lkXVxuICAgICAgICAvLyBhc3NpZ24gZmVhdHVyZSB0byBkYXlcbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoKG5ldyBEYXRlKGZlYXR1cmUucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpIC0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgICB2YXIgdHlwZSA9IGZlYXR1cmUucHJvcGVydGllcy5GZWF0dXJlVHlwZVxuICAgICAgICBpZiAoIWZlYXR1cmVzQnlEYXlbZGF5XSkgZmVhdHVyZXNCeURheVtkYXldID0ge31cbiAgICAgICAgaWYgKCFmZWF0dXJlc0J5RGF5W2RheV1bdHlwZV0pIGZlYXR1cmVzQnlEYXlbZGF5XVt0eXBlXSA9IHt9XG4gICAgICAgIGZlYXR1cmVzQnlEYXlbZGF5XVt0eXBlXVtpZF0gPSBmZWF0dXJlXG5cbiAgICAgICAgaWYgKGZlYXR1cmUucHJvcGVydGllcy5GZWF0dXJlVHlwZSA9PT0gJ2FtYml0X2dlbycpIHtcbiAgICAgICAgICAvLyBhc3NpZ24gZmVhdHVyZSB0byBtZW1iZXJcbiAgICAgICAgICB2YXIgbWVtYmVySUQgPSBmZWF0dXJlLnByb3BlcnRpZXMuTWVtYmVyXG4gICAgICAgICAgaWYgKCFtZW1iZXJzW21lbWJlcklEXSkge1xuICAgICAgICAgICAgbWVtYmVyc1ttZW1iZXJJRF0gPSB7XG4gICAgICAgICAgICAgIG5hbWU6IG1lbWJlcklELFxuICAgICAgICAgICAgICBjb2xvcjogZXhwZWRpdGlvbi5tZW1iZXJDb2xvcnNbZDMudmFsdWVzKG1lbWJlcnMpLmxlbmd0aCAlIGV4cGVkaXRpb24ubWVtYmVyQ29sb3JzLmxlbmd0aF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGRheUlEID0gTWF0aC5mbG9vcigobmV3IERhdGUoZmVhdHVyZS5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKCkgLSBleHBlZGl0aW9uLnN0YXJ0LmdldFRpbWUoKSkgLyAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgICAgICAgaWYgKCFmZWF0dXJlc0J5TWVtYmVyW21lbWJlcklEXSkgZmVhdHVyZXNCeU1lbWJlclttZW1iZXJJRF0gPSB7fVxuICAgICAgICAgIGlmICghZmVhdHVyZXNCeU1lbWJlclttZW1iZXJJRF1bZGF5SURdKSBmZWF0dXJlc0J5TWVtYmVyW21lbWJlcklEXVtkYXlJRF0gPSB7fVxuICAgICAgICAgIGZlYXR1cmVzQnlNZW1iZXJbbWVtYmVySURdW2RheUlEXVtpZF0gPSBmZWF0dXJlXG5cbiAgICAgICAgICAvLyBhc3NpZ24gZmVhdHVyZSB0byB0aWxlXG4gICAgICAgICAgdmFyIHRpbGVDb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzVG9UaWxlKGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIGV4cGVkaXRpb24uZ2VvQm91bmRzKVxuICAgICAgICAgIHZhciB0aWxlSUQgPSB0aWxlQ29vcmRpbmF0ZXMueCArIHRpbGVDb29yZGluYXRlcy55ICogdGlsZVJlc29sdXRpb25cbiAgICAgICAgICBpZiAoIWFtYml0c0J5VGlsZVt0aWxlSURdKSBhbWJpdHNCeVRpbGVbdGlsZUlEXSA9IHt9XG4gICAgICAgICAgYW1iaXRzQnlUaWxlW3RpbGVJRF1baWRdID0gZmVhdHVyZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBjb25zdCBleHRlbmRGZWF0dXJlcyA9IChidWNrZXQpID0+IHtcbiAgICAgICAgaWYgKGQzLnZhbHVlcyhidWNrZXQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBwaWNrIHRoZSB0d28gZWFybGllc3QgYW5kIGxhdGVzdCBmZWF0dXJlc1xuICAgICAgICAgIHZhciB0aW1lUmFuZ2UgPSBbbmV3IERhdGUoKSwgbmV3IERhdGUoMCldXG4gICAgICAgICAgdmFyIGZlYXR1cmVSYW5nZSA9IFtdXG4gICAgICAgICAgZDMudmFsdWVzKGJ1Y2tldCkuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICAgICAgdmFyIGRhdGVUaW1lID0gbmV3IERhdGUoZi5wcm9wZXJ0aWVzLkRhdGVUaW1lKVxuICAgICAgICAgICAgaWYgKHRpbWVSYW5nZVswXS5nZXRUaW1lKCkgPiBkYXRlVGltZS5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgICAgdGltZVJhbmdlWzBdID0gZGF0ZVRpbWVcbiAgICAgICAgICAgICAgZmVhdHVyZVJhbmdlWzBdID0gZlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRpbWVSYW5nZVsxXS5nZXRUaW1lKCkgPCBkYXRlVGltZS5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgICAgdGltZVJhbmdlWzFdID0gZGF0ZVRpbWVcbiAgICAgICAgICAgICAgZmVhdHVyZVJhbmdlWzFdID0gZlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAvLyBjbG9uZSBmZWF0dXJlcyB3aXRoIG5ldyBkYXRlc1xuICAgICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKHRpbWVSYW5nZVswXS5nZXRUaW1lKCkgLSAodGltZVJhbmdlWzBdLmdldFRpbWUoKSAlICgxMDAwICogMzYwMCAqIDI0KSkpXG4gICAgICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlKHN0YXJ0LmdldFRpbWUoKSArICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICAgICAgICBpZCA9IERhdGUubm93KCkgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApIC8gMTAwMDApXG4gICAgICAgICAgYnVja2V0W2lkXSA9IE9iamVjdC5hc3NpZ24oe30sIGZlYXR1cmVSYW5nZVswXSlcbiAgICAgICAgICBidWNrZXRbaWRdLnByb3BlcnRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBidWNrZXRbaWRdLnByb3BlcnRpZXMsIHtcbiAgICAgICAgICAgIERhdGVUaW1lOiBzdGFydC50b1N0cmluZygpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZCA9IERhdGUubm93KCkgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApIC8gMTAwMDApXG4gICAgICAgICAgYnVja2V0W2lkXSA9IE9iamVjdC5hc3NpZ24oe30sIGZlYXR1cmVSYW5nZVsxXSlcbiAgICAgICAgICBidWNrZXRbaWRdLnByb3BlcnRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBidWNrZXRbaWRdLnByb3BlcnRpZXMsIHtcbiAgICAgICAgICAgIERhdGVUaW1lOiBlbmQudG9TdHJpbmcoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVzQnlEYXkpLmZvckVhY2goZCA9PiB7XG4gICAgICAgIGZlYXR1cmVzQnlEYXlbZF0gPSBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmZlYXR1cmVzQnlEYXlbZF0sIGZlYXR1cmVzQnlEYXlbZF0pXG4gICAgICAgIGV4dGVuZEZlYXR1cmVzKGZlYXR1cmVzQnlEYXlbZF0uYmVhY29uKVxuICAgICAgfSlcbiAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVzQnlNZW1iZXIpLmZvckVhY2gobSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVzQnlNZW1iZXJbbV0pLmZvckVhY2goZCA9PiB7XG4gICAgICAgICAgZXh0ZW5kRmVhdHVyZXMoZmVhdHVyZXNCeU1lbWJlclttXVtkXSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGZlYXR1cmVzQnlEYXkgPSBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmZlYXR1cmVzQnlEYXksIGZlYXR1cmVzQnlEYXkpXG4gICAgICBkYXlzID0gT2JqZWN0LmFzc2lnbih7fSwgZmVhdHVyZXNCeURheSlcbiAgICAgIGZvciAodmFyIGQgaW4gZGF5cykge1xuICAgICAgICBkYXlzW2RdID0gZGF5UmVkdWNlcihleHBlZGl0aW9uLmRheXNbZF0sIGFjdGlvbiwgZmVhdHVyZXNCeURheVtkXSlcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXNCeU1lbWJlcikuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgICBmZWF0dXJlc0J5TWVtYmVyW2tdID0gT2JqZWN0LmFzc2lnbih7fSwgZXhwZWRpdGlvbi5mZWF0dXJlc0J5TWVtYmVyW2tdLCBmZWF0dXJlc0J5TWVtYmVyW2tdKVxuICAgICAgfSlcblxuICAgICAgT2JqZWN0LmtleXMoYW1iaXRzQnlUaWxlKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgIGFtYml0c0J5VGlsZVtrXSA9IE9iamVjdC5hc3NpZ24oe30sIGV4cGVkaXRpb24uYW1iaXRzQnlUaWxlW2tdLCBhbWJpdHNCeVRpbGVba10pXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgbWFwU3RhdGVOZWVkc1VwZGF0ZTogZmFsc2UsXG4gICAgICAgIGV4cGVkaXRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5leHBlZGl0aW9ucywge1xuICAgICAgICAgIFtleHBlZGl0aW9uSURdOiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLCB7XG4gICAgICAgICAgICBkYXlzOiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmRheXMsIGRheXMpLFxuICAgICAgICAgICAgLy8gZmVhdHVyZXM6IE9iamVjdC5hc3NpZ24oe30sIGV4cGVkaXRpb24uZmVhdHVyZXMsIGZlYXR1cmVzKSxcbiAgICAgICAgICAgIGZlYXR1cmVzQnlEYXk6IGZlYXR1cmVzQnlEYXksXG4gICAgICAgICAgICBmZWF0dXJlc0J5TWVtYmVyOiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmZlYXR1cmVzQnlNZW1iZXIsIGZlYXR1cmVzQnlNZW1iZXIpLFxuICAgICAgICAgICAgYW1iaXRzQnlUaWxlOiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmFtYml0c0J5VGlsZSwgYW1iaXRzQnlUaWxlKSxcbiAgICAgICAgICAgIG1lbWJlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIGNhc2UgYWN0aW9ucy5SRUNFSVZFX0ZFQVRVUkVTOlxuICAgICAgZXhwZWRpdGlvbklEID0gYWN0aW9uLmV4cGVkaXRpb25JRFxuICAgICAgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF1cblxuICAgICAgdmFyIHRpbGVSYW5nZSA9IGFjdGlvbi50aWxlUmFuZ2VcbiAgICAgIHZhciBmZWF0dXJlc0J5VGlsZSA9IHt9XG4gICAgICB0aWxlUmFuZ2UuZm9yRWFjaCgodCwgaSkgPT4ge1xuICAgICAgICBmZWF0dXJlc0J5VGlsZVt0XSA9IHt9XG4gICAgICB9KVxuXG4gICAgICBjb25zdCByZ2JUb1N0cmluZyA9IChyZ2IpID0+IHtcbiAgICAgICAgcmV0dXJuIHJnYi5zbGljZSg0KS5zbGljZSgwLCAtMSkuc3BsaXQoJywnKS5tYXAoYyA9PiBwYXJzZUludChjKSlcbiAgICAgIH1cblxuICAgICAgZmVhdHVyZXMgPSB7fVxuICAgICAgYWN0aW9uLmRhdGEuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICB2YXIgaWQgPSBmLmlkXG4gICAgICAgIGlmIChmLnByb3BlcnRpZXMuVGVhbSA9PT0gJ1JpdmVyTWFpbicpIHtcbiAgICAgICAgICB2YXIgZmxhZyA9IHRydWVcbiAgICAgICAgICBpZiAoZi5wcm9wZXJ0aWVzLkZlYXR1cmVUeXBlID09PSAnc2lnaHRpbmcnKSB7XG4gICAgICAgICAgICBpZiAoIWYucHJvcGVydGllcy5UYXhvbm9teSkgZi5wcm9wZXJ0aWVzLmNvbG9yID0gcmdiVG9TdHJpbmcoJ3JnYigxODAsMTgwLDE4MCknKVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhciB0YXhDbGFzcyA9IGYucHJvcGVydGllcy5UYXhvbm9teS5DbGFzc1xuICAgICAgICAgICAgICBpZiAoIXN0YXRlLnNwZWNpZXNDb2xvcnNbdGF4Q2xhc3NdKSBzdGF0ZS5zcGVjaWVzQ29sb3JzW3RheENsYXNzXSA9IHJnYlRvU3RyaW5nKHJhbmRvbUNvbG9yKHsgbHVtaW5vc2l0eTogJ2xpZ2h0JywgZm9ybWF0OiAncmdiJyB9KSlcbiAgICAgICAgICAgICAgZi5wcm9wZXJ0aWVzLmNvbG9yID0gc3RhdGUuc3BlY2llc0NvbG9yc1t0YXhDbGFzc11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGYucHJvcGVydGllcy5GZWF0dXJlVHlwZSA9PT0gJ3R3ZWV0JyAmJiBmLnByb3BlcnRpZXMuVGV4dCAmJiBmLnByb3BlcnRpZXMuVGV4dFswXSA9PT0gJ0AnKSBmbGFnID0gZmFsc2VcbiAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgZmVhdHVyZXNbaWRdID0gZmVhdHVyZVJlZHVjZXIoZXhwZWRpdGlvbi5mZWF0dXJlc1tpZF0sIGFjdGlvbiwgZilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHZhciB0aWxlUmVzb2x1dGlvbiA9IE1hdGguZmxvb3IoKGV4cGVkaXRpb24uZ2VvQm91bmRzWzJdIC0gZXhwZWRpdGlvbi5nZW9Cb3VuZHNbMF0pICogMTExIC8gMTApXG4gICAgICB2YXIgY29vcmRpbmF0ZXNUb1RpbGUgPSAoY29vcmRpbmF0ZXMsIGdlb0JvdW5kcykgPT4ge1xuICAgICAgICB2YXIgeCA9IE1hdGguZmxvb3IoKGNvb3JkaW5hdGVzWzBdIC0gZ2VvQm91bmRzWzBdKSAqIDExMSAvIDEwKVxuICAgICAgICB2YXIgeSA9IE1hdGguZmxvb3IoKGNvb3JkaW5hdGVzWzFdIC0gZ2VvQm91bmRzWzNdKSAqIDExMSAvIDEwKVxuICAgICAgICByZXR1cm4ge3gsIHl9XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICB2YXIgZmVhdHVyZSA9IGZlYXR1cmVzW2lkXVxuICAgICAgICB2YXIgdGlsZUNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNUb1RpbGUoZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcywgZXhwZWRpdGlvbi5nZW9Cb3VuZHMpXG4gICAgICAgIHZhciB0aWxlSUQgPSB0aWxlQ29vcmRpbmF0ZXMueCArIHRpbGVDb29yZGluYXRlcy55ICogdGlsZVJlc29sdXRpb25cbiAgICAgICAgaWYgKCFmZWF0dXJlc0J5VGlsZVt0aWxlSURdKSBmZWF0dXJlc0J5VGlsZVt0aWxlSURdID0ge31cbiAgICAgICAgZmVhdHVyZXNCeVRpbGVbdGlsZUlEXVtpZF0gPSBmZWF0dXJlXG4gICAgICB9KVxuICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXNCeVRpbGUpLmZvckVhY2goKGspID0+IHtcbiAgICAgICAgZmVhdHVyZXNCeVRpbGVba10gPSBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmZlYXR1cmVzQnlUaWxlW2tdLCBmZWF0dXJlc0J5VGlsZVtrXSlcbiAgICAgIH0pXG5cbiAgICAgIGZvciAodmFyIGsgaW4gZmVhdHVyZXMpIHtcbiAgICAgICAgdmFyIGZlYXR1cmUgPSBmZWF0dXJlc1trXVxuICAgICAgICBpZiAoZmVhdHVyZS5wcm9wZXJ0aWVzLkZlYXR1cmVUeXBlID09PSAnc2lnaHRpbmcnKSB7XG4gICAgICAgICAgZGVsZXRlIGZlYXR1cmVzW2tdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIG1hcFN0YXRlTmVlZHNVcGRhdGU6IGZhbHNlLFxuICAgICAgICBleHBlZGl0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZXhwZWRpdGlvbnMsIHtcbiAgICAgICAgICBbZXhwZWRpdGlvbklEXTogT2JqZWN0LmFzc2lnbih7fSwgZXhwZWRpdGlvbiwge1xuICAgICAgICAgICAgZmVhdHVyZXM6IE9iamVjdC5hc3NpZ24oe30sIGV4cGVkaXRpb24uZmVhdHVyZXMsIGZlYXR1cmVzKSxcbiAgICAgICAgICAgIGZlYXR1cmVzQnlUaWxlOiBPYmplY3QuYXNzaWduKHt9LCBleHBlZGl0aW9uLmZlYXR1cmVzQnlUaWxlLCBmZWF0dXJlc0J5VGlsZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIGNhc2UgYWN0aW9ucy5TRUxFQ1RfRkVBVFVSRTpcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIGFjdGlvbnMuVU5TRUxFQ1RfRkVBVFVSRTpcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZVxuICB9XG5cbiAgcmV0dXJuIHN0YXRlXG59XG5cbmNvbnN0IGV4cGVkaXRpb25SZWR1Y2VyID0gKFxuICBzdGF0ZSA9IHtcbiAgICBuYW1lOiAnJyxcbiAgICBwbGF5YmFjazogJ2ZvcndhcmQnLFxuICAgIGxheW91dDogJ3Jvd3MnLFxuICAgIGluaXRpYWxab29tOiA0LFxuICAgIHRhcmdldFpvb206IDE1LFxuICAgIHpvb206IDE1LFxuICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgIGdlb0JvdW5kczogWy04LCAtMjEuNSwgMjUuNSwgMTJdLFxuICAgIHRpbGVTaXplOiAxMCxcbiAgICBzdGFydDogbmV3IERhdGUoKSxcbiAgICBlbmQ6IG5ldyBEYXRlKDApLFxuICAgIGN1cnJlbnREYXRlOiBuZXcgRGF0ZSgpLFxuICAgIGRheUNvdW50OiAwLFxuICAgIGRheXM6IFtdLFxuICAgIGZlYXR1cmVzOiB7fSxcbiAgICBmZWF0dXJlc0J5VGlsZToge30sXG4gICAgYW1iaXRzQnlUaWxlOiB7fSxcbiAgICBmZWF0dXJlc0J5RGF5OiB7fSxcbiAgICBwb3N0c0J5RGF5OiB7fSxcbiAgICBmZWF0dXJlc0J5TWVtYmVyOiB7fSxcbiAgICBtYWluRm9jdXM6ICdFeHBsb3JlcnMnLFxuICAgIHNlY29uZGFyeUZvY3VzOiAnU3RldmUnLFxuICAgIGNvb3JkaW5hdGVzOiBbMCwgMF0sXG4gICAgY3VycmVudFBvc3RzOiBbXSxcbiAgICBjdXJyZW50U2lnaHRpbmdzOiBbXSxcbiAgICBjdXJyZW50QW1iaXRzOiBbXSxcbiAgICB0b3RhbFNpZ2h0aW5nczogW10sXG4gICAgbWVtYmVyQ29sb3JzOiBbXG4gICAgICAncmdiYSgyNTMsIDE5MSwgMTExLCAxKScsXG4gICAgICAncmdiYSgxNjYsIDIwNiwgMjI3LCAxKScsXG4gICAgICAncmdiYSgxNzgsIDIyMywgMTM4LCAxKScsXG4gICAgICAncmdiYSgyNTEsIDE1NCwgMTUzLCAxKScsXG4gICAgICAncmdiYSgyMDIsIDE3OCwgMjE0LCAxKScsXG4gICAgICAncmdiYSgyNTIsIDIzNCwgMTUxLCAxKScsXG4gICAgICAncmdiYSgxODAsIDI0MCwgMjA5LCAxKScsXG4gICAgICAncmdiYSgxOTEsIDE5MSwgMjU1LCAxKScsXG4gICAgICAncmdiYSgyNTUsIDE3MSwgMjEzLCAxKSdcbiAgICBdLFxuICAgIG1lbWJlcnM6IHt9LFxuICAgIGN1cnJlbnRNZW1iZXJzOiBbXVxuICB9LFxuICBhY3Rpb24sXG4gIGRhdGFcbikgPT4ge1xuICB2YXIgaVxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25zLkZFVENIX1BPU1RTX0JZX0RBWTpcbiAgICAgIHZhciBwb3N0c0J5RGF5ID0gW11cbiAgICAgIC8vIHZhciBzdGFydCA9IG5ldyBEYXRlKGFjdGlvbi5yYW5nZVswXSlcbiAgICAgIC8vIHZhciBlbmQgPSBuZXcgRGF0ZShhY3Rpb24ucmFuZ2VbMV0pXG4gICAgICAvLyB2YXIgc3RhcnREYXkgPSBNYXRoLmZsb29yKChzdGFydC5nZXRUaW1lKCkgLSBzdGF0ZS5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgLy8gdmFyIGVuZERheSA9IE1hdGguZmxvb3IoKGVuZC5nZXRUaW1lKCkgLSBzdGF0ZS5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgLy8gZm9yIChpID0gc3RhcnREYXk7IGkgPD0gZW5kRGF5OyBpKyspIHtcbiAgICAgIGFjdGlvbi5kYXlzVG9GZXRjaC5mb3JFYWNoKChkKSA9PiB7XG4gICAgICAgIHBvc3RzQnlEYXlbZF0gPSAnbG9hZGluZydcbiAgICAgIH0pXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgcG9zdHNCeURheTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucG9zdHNCeURheSwgcG9zdHNCeURheSlcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuQ09NUExFVEVfREFZUzpcbiAgICAgIHZhciBkYXlzID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZGF5cylcblxuICAgICAgLy8gYWRkIG1vY2sgZGF5cyBhdCBib3RoIGVuZHMgb2YgdGhlIGV4cGVkaXRpb25cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBzdGF0ZS5kYXlDb3VudDsgaSsrKSB7XG4gICAgICAgIGlmIChkYXlzW2ldICYmICFkYXlzW2ldLmluY29tcGxldGUpIHtcbiAgICAgICAgICBkYXlzWy0xXSA9IE9iamVjdC5hc3NpZ24oe30sIGRheXNbaV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpID0gc3RhdGUuZGF5Q291bnQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChkYXlzW2ldICYmICFkYXlzW2ldLmluY29tcGxldGUpIHtcbiAgICAgICAgICBkYXlzW3N0YXRlLmRheUNvdW50XSA9IE9iamVjdC5hc3NpZ24oe30sIGRheXNbaV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBkZXRlY3QgaW5jb21wbGV0ZSBkYXlzXG4gICAgICB2YXIgaW5jb21wbGV0ZVJhbmdlID0gWy0xLCAtMV1cbiAgICAgIHZhciBjb21wbGV0ZWREYXlzID0gW11cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBzdGF0ZS5kYXlDb3VudDsgaSsrKSB7XG4gICAgICAgIHZhciBkYXkgPSBkYXlzW2ldXG4gICAgICAgIGlmICghZGF5KSB7XG4gICAgICAgICAgaW5jb21wbGV0ZVJhbmdlID0gWy0xLCAtMV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZGF5LmluY29tcGxldGUgJiYgZGF5c1tpIC0gMV0gJiYgIWRheXNbaSAtIDFdLmluY29tcGxldGUpIHtcbiAgICAgICAgICAgIGluY29tcGxldGVSYW5nZVswXSA9IGlcbiAgICAgICAgICAgIGluY29tcGxldGVSYW5nZVsxXSA9IC0xXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXkuaW5jb21wbGV0ZSAmJiBkYXlzW2kgKyAxXSAmJiAhZGF5c1tpICsgMV0uaW5jb21wbGV0ZSkge1xuICAgICAgICAgICAgaW5jb21wbGV0ZVJhbmdlWzFdID0gaVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZ1bGwgZGF0YSBnYXAgZGV0ZWN0ZWQsIGZpbGxpbmcgaW5cbiAgICAgICAgaWYgKGluY29tcGxldGVSYW5nZVswXSA+IC0xICYmIGluY29tcGxldGVSYW5nZVsxXSA+IC0xKSB7XG4gICAgICAgICAgLy8gbG9vayBmb3IgZmlsbGluZyB2YWx1ZXMgYm9yZGVyaW5nIHRoZSBnYXBcbiAgICAgICAgICB2YXIgZmlsbGluZ0RheXMgPSBbZGF5c1sraW5jb21wbGV0ZVJhbmdlWzBdIC0gMV0sIGRheXNbK2luY29tcGxldGVSYW5nZVsxXSArIDFdXVxuICAgICAgICAgIHZhciBmaWxsaW5nQmVhY29ucyA9IFtcbiAgICAgICAgICAgIGQzLnZhbHVlcyhmaWxsaW5nRGF5c1swXS5iZWFjb25zKS5zbGljZSgwKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShiLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGEucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgICAgICB9KVswXSxcbiAgICAgICAgICAgIGQzLnZhbHVlcyhmaWxsaW5nRGF5c1sxXS5iZWFjb25zKS5zbGljZSgwKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShhLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgICAgICB9KVswXVxuICAgICAgICAgIF1cblxuICAgICAgICAgIC8vIGZpbGwgaW4gZ2Fwc1xuICAgICAgICAgIHZhciBsMiA9IE1hdGguY2VpbCgoaW5jb21wbGV0ZVJhbmdlWzFdIC0gaW5jb21wbGV0ZVJhbmdlWzBdICsgMSkgLyAyKVxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbDI7IGorKykge1xuICAgICAgICAgICAgdmFyIGRheUluZGV4ID0gWygraW5jb21wbGV0ZVJhbmdlWzBdICsgaiksICgraW5jb21wbGV0ZVJhbmdlWzFdIC0gaildXG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDI7IGsrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBsID0gMDsgbCA8IDI7IGwrKykge1xuICAgICAgICAgICAgICAgIC8vIGhlcmUgayA9PT0gMCByZW1vdmVzIGdyYWR1YWwgdHJhbnNsYXRpb24gYmV0d2VlbiBkYXkgMSB0byBkYXkgMlxuICAgICAgICAgICAgICAgIGlmIChrID09PSAwIHx8IChkYXlzW2RheUluZGV4WzBdXSAhPT0gZGF5c1tkYXlJbmRleFsxXV0pIHx8IGwgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgIHZhciBkYXlJRCA9IGRheUluZGV4W2tdXG4gICAgICAgICAgICAgICAgICBkYXkgPSBkYXlzW2RheUlEXVxuICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShzdGF0ZS5zdGFydC5nZXRUaW1lKCkgKyAoMTAwMCAqIDM2MDAgKiAyNCkgKiAoZGF5SUQgKyAoayA9PT0gbCA/IDAgOiAxKSkpXG4gICAgICAgICAgICAgICAgICB2YXIgYmVhY29uSUQgPSBEYXRlLm5vdygpICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSAvIDEwMDAwKVxuICAgICAgICAgICAgICAgICAgZGF5LmJlYWNvbnNbYmVhY29uSURdID0gT2JqZWN0LmFzc2lnbih7fSwgZmlsbGluZ0JlYWNvbnNba10pXG4gICAgICAgICAgICAgICAgICBkYXkuYmVhY29uc1tiZWFjb25JRF0ucHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIGRheS5iZWFjb25zW2JlYWNvbklEXS5wcm9wZXJ0aWVzLCB7XG4gICAgICAgICAgICAgICAgICAgIERhdGVUaW1lOiBkYXRlXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgZGF5LmluY29tcGxldGUgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZERheXMuaW5kZXhPZihkYXlJRCkgPT09IC0xKSBjb21wbGV0ZWREYXlzLnB1c2goZGF5SUQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGluY29tcGxldGVSYW5nZSA9IFstMSwgLTFdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIG1vY2sgZGF5cyBhdCBib3RoIGVuZHMgb2YgdGhlIGV4cGVkaXRpb25cbiAgICAgIGRlbGV0ZSBkYXlzWy0xXVxuICAgICAgZGVsZXRlIGRheXNbc3RhdGUuZGF5Q291bnRdXG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmaWxsIGZvbGxvd2luZyBkYXlzOicsIGNvbXBsZXRlZERheXMsIGRheXMpXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgZGF5czogZGF5c1xuICAgICAgfSlcblxuICAgIGNhc2UgYWN0aW9ucy5VUERBVEVfVElNRTpcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBjdXJyZW50RGF0ZTogYWN0aW9uLmN1cnJlbnREYXRlXG4gICAgICB9KVxuXG4gICAgY2FzZSBhY3Rpb25zLlVQREFURV9NQVA6XG5cbiAgICAgIC8vIGluaXRpYWxpemluZyBmZWF0dXJlc0J5VGlsZSBlbnRyaWVzIHNvIHRoZXkgd29uJ3QgYmUgcXVlcmllcyBtdWx0aXBsZSB0aW1lc1xuICAgICAgYWN0aW9uLnRpbGVSYW5nZS5mb3JFYWNoKHQgPT4ge1xuICAgICAgICBpZiAoIXN0YXRlLmZlYXR1cmVzQnlUaWxlW3RdKSBzdGF0ZS5mZWF0dXJlc0J5VGlsZVt0XSA9IHt9XG4gICAgICB9KVxuXG4gICAgICB2YXIgY3VycmVudFNpZ2h0aW5ncyA9IFtdXG4gICAgICB2YXIgY3VycmVudFBvc3RzID0gW11cbiAgICAgIHZhciBjdXJyZW50RGF5cyA9IFtdXG4gICAgICB2YXIgY3VycmVudEFtYml0cyA9IHt9XG4gICAgICB2YXIgY3VycmVudE1lbWJlcnMgPSBbXVxuXG4gICAgICB2YXIgYWxsQW1iaXRzID0gW11cbiAgICAgIGFjdGlvbi50aWxlc0luVmlldy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgIC8vIHNvcnQgZmVhdHVyZXMgYnkgdHlwZVxuICAgICAgICB2YXIgZmVhdHVyZXMgPSB7fVxuICAgICAgICBkMy52YWx1ZXMoc3RhdGUuZmVhdHVyZXNCeVRpbGVbdF0pLmZvckVhY2goKGYpID0+IHtcbiAgICAgICAgICBpZiAoIWZlYXR1cmVzW2YucHJvcGVydGllcy5GZWF0dXJlVHlwZV0pIGZlYXR1cmVzW2YucHJvcGVydGllcy5GZWF0dXJlVHlwZV0gPSBbXVxuICAgICAgICAgIGZlYXR1cmVzW2YucHJvcGVydGllcy5GZWF0dXJlVHlwZV0ucHVzaChmKVxuICAgICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKChuZXcgRGF0ZShmLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKSAtIHN0YXRlLnN0YXJ0LmdldFRpbWUoKSkgLyAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgICAgICAgaWYgKGN1cnJlbnREYXlzLmluZGV4T2YoZGF5KSA9PT0gLTEpIGN1cnJlbnREYXlzLnB1c2goZGF5KVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHRoaXMgZGVmIGNvdWxkIGJlIHdyaXR0ZW4gbW9yZSBlbGVnYW50bHkuLi5cbiAgICAgICAgZDMudmFsdWVzKHN0YXRlLmFtYml0c0J5VGlsZVt0XSkuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKChuZXcgRGF0ZShmLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKSAtIHN0YXRlLnN0YXJ0LmdldFRpbWUoKSkgLyAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgICAgICAgaWYgKGN1cnJlbnREYXlzLmluZGV4T2YoZGF5KSA9PT0gLTEpIGN1cnJlbnREYXlzLnB1c2goZGF5KVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChmZWF0dXJlcy5zaWdodGluZykge1xuICAgICAgICAgIHZhciBzaWdodGluZ3MgPSBmZWF0dXJlcy5zaWdodGluZy5tYXAoKGYpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgeDogZi5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcbiAgICAgICAgICAgICAgICB5OiBmLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLFxuICAgICAgICAgICAgICAgIHo6IDBcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmFkaXVzOiBmLnByb3BlcnRpZXMucmFkaXVzLFxuICAgICAgICAgICAgICBjb2xvcjogZi5wcm9wZXJ0aWVzLmNvbG9yLFxuICAgICAgICAgICAgICB0eXBlOiBmLnByb3BlcnRpZXMuRmVhdHVyZVR5cGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGN1cnJlbnRTaWdodGluZ3MgPSBjdXJyZW50U2lnaHRpbmdzLmNvbmNhdChzaWdodGluZ3MpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWxsUG9zdHMgPSBbXVxuICAgICAgICBpZiAoZmVhdHVyZXMudHdlZXQpIGFsbFBvc3RzID0gYWxsUG9zdHMuY29uY2F0KGZlYXR1cmVzLnR3ZWV0KVxuICAgICAgICBpZiAoZmVhdHVyZXMuYXVkaW8pIGFsbFBvc3RzID0gYWxsUG9zdHMuY29uY2F0KGZlYXR1cmVzLmF1ZGlvKVxuICAgICAgICBpZiAoZmVhdHVyZXMuYmxvZykgYWxsUG9zdHMgPSBhbGxQb3N0cy5jb25jYXQoZmVhdHVyZXMuYmxvZylcbiAgICAgICAgaWYgKGZlYXR1cmVzLmltYWdlKSBhbGxQb3N0cyA9IGFsbFBvc3RzLmNvbmNhdChmZWF0dXJlcy5pbWFnZSlcbiAgICAgICAgaWYgKGFsbFBvc3RzKSB7XG4gICAgICAgICAgdmFyIHBvc3RzID0gYWxsUG9zdHMubWFwKChmKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBwb3NpdGlvbjogW1xuICAgICAgICAgICAgICAgIGYuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sXG4gICAgICAgICAgICAgICAgZi5nZW9tZXRyeS5jb29yZGluYXRlc1sxXVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB0eXBlOiBmLnByb3BlcnRpZXMuRmVhdHVyZVR5cGUsXG4gICAgICAgICAgICAgIGlkOiBmLmlkLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBmLnByb3BlcnRpZXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGN1cnJlbnRQb3N0cyA9IGN1cnJlbnRQb3N0cy5jb25jYXQocG9zdHMpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHZhciBwYWRkaW5nRGF5cyA9IFtdXG4gICAgICBjdXJyZW50RGF5cy5mb3JFYWNoKGQgPT4ge1xuICAgICAgICB2YXIgZmxhZyA9IGZhbHNlXG4gICAgICAgIGZvciAoaSA9IGQgLSAxOyBpIDw9IGQgKyAxOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3VycmVudERheXMuaW5kZXhPZihpKSA9PT0gLTEgJiYgcGFkZGluZ0RheXMuaW5kZXhPZihpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHBhZGRpbmdEYXlzLnB1c2goaSlcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmbGFnKSBhY3Rpb25zLmZldGNoRGF5KG5ldyBEYXRlKHN0YXRlLnN0YXJ0LmdldFRpbWUoKSArICgxMDAwICogMzYwMCAqIDI0KSAqIGQpKVxuICAgICAgfSlcbiAgICAgIGN1cnJlbnREYXlzID0gY3VycmVudERheXNcbiAgICAgICAgLmNvbmNhdChwYWRkaW5nRGF5cylcblxuICAgICAgY3VycmVudERheXMgPSBjdXJyZW50RGF5c1xuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIHJldHVybiBhIC0gYlxuICAgICAgICB9KVxuICAgICAgICAuZm9yRWFjaChkID0+IHtcbiAgICAgICAgICBpZiAoc3RhdGUuZmVhdHVyZXNCeURheVtkXSkge1xuICAgICAgICAgICAgYWxsQW1iaXRzID0gYWxsQW1iaXRzLmNvbmNhdChkMy52YWx1ZXMoc3RhdGUuZmVhdHVyZXNCeURheVtkXS5hbWJpdF9nZW8pKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgYWxsQW1iaXRzXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGEucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYi5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKClcbiAgICAgICAgfSlcbiAgICAgICAgLmZvckVhY2goZiA9PiB7XG4gICAgICAgICAgdmFyIG1lbWJlcklEID0gZi5wcm9wZXJ0aWVzLk1lbWJlclxuICAgICAgICAgIGlmICghY3VycmVudEFtYml0c1ttZW1iZXJJRF0pIHtcbiAgICAgICAgICAgIGN1cnJlbnRBbWJpdHNbbWVtYmVySURdID0ge1xuICAgICAgICAgICAgICBjb2xvcjogc3RhdGUubWVtYmVyc1ttZW1iZXJJRF0uY29sb3IsXG4gICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgICAgICAgZGF0ZXM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghY3VycmVudE1lbWJlcnNbbWVtYmVySURdKSBjdXJyZW50TWVtYmVyc1ttZW1iZXJJRF0gPSB7fVxuICAgICAgICAgIGN1cnJlbnRBbWJpdHNbbWVtYmVySURdLmNvb3JkaW5hdGVzLnB1c2goZi5nZW9tZXRyeS5jb29yZGluYXRlcylcbiAgICAgICAgICBjdXJyZW50QW1iaXRzW21lbWJlcklEXS5kYXRlcy5wdXNoKGYucHJvcGVydGllcy5EYXRlVGltZSlcbiAgICAgICAgfSlcblxuICAgICAgY3VycmVudEFtYml0cyA9IGQzLnZhbHVlcyhjdXJyZW50QW1iaXRzKVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgY3VycmVudFNpZ2h0aW5ncyxcbiAgICAgICAgY3VycmVudEFtYml0cyxcbiAgICAgICAgY3VycmVudE1lbWJlcnMsXG4gICAgICAgIGN1cnJlbnRQb3N0cyxcbiAgICAgICAgY3VycmVudERhdGU6IGFjdGlvbi5jdXJyZW50RGF0ZSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGFjdGlvbi5jb29yZGluYXRlcyxcbiAgICAgICAgem9vbTogYWN0aW9uLnpvb21cbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuUkVDRUlWRV9FWFBFRElUSU9OUzpcbiAgICAgIHZhciBkYXlDb3VudCA9IGRhdGEuRGF5cyArIDFcbiAgICAgIC8vIHJlbW92aW5nICsxIGhlcmUgYmVjYXVzZSB3ZSByZWNlaXZlIGJlYWNvbnMgYmVmb3JlIGFueSBvdGhlciBmZWF0dXJlcyBvbiBjdXJyZW50IGRheVxuICAgICAgLy8gdmFyIGRheUNvdW50ID0gZGF0YS5EYXlzXG4gICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZShuZXcgRGF0ZShkYXRhLlN0YXJ0RGF0ZSkuZ2V0VGltZSgpICsgMiAqICgxMDAwICogMzYwMCkpXG4gICAgICB2YXIgZW5kID0gbmV3IERhdGUoc3RhcnQuZ2V0VGltZSgpICsgZGF5Q291bnQgKiAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gICAgICAvLyBjdXJyZW50RGF0ZSBpcyAyIGRheXMgYmVmb3JlIGxhc3QgYmVhY29uXG4gICAgICB2YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZShlbmQuZ2V0VGltZSgpIC0gMiAqICgxMDAwICogMzYwMCAqIDI0KSlcblxuICAgICAgdmFyIG5hbWUgPSBkYXRhLk5hbWVcblxuICAgICAgLy8gMTExIGttIHBlciBsYXRpdHVkZSBkZWdyZWVcbiAgICAgIC8vIH4gMTBrbSBwZXIgc2NyZWVuIGF0IHpvb20gbGV2ZWwgMTRcbiAgICAgIC8vIFt3ZXN0LCBub3J0aCwgZWFzdCwgc291dGhdXG4gICAgICB2YXIgZ2VvQm91bmRzID0gZGF0YS5HZW9Cb3VuZHNcbiAgICAgIC8vIHZhciBnZW9Cb3VuZHNEaXN0YW5jZSA9IFsoZ2VvQm91bmRzWzJdIC0gZ2VvQm91bmRzWzBdKSAqIDExMSwgKGdlb0JvdW5kc1szXSAtIGdlb0JvdW5kc1sxXSkgKiAxMTFdXG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgIGN1cnJlbnREYXRlOiBjdXJyZW50RGF0ZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIGRheUNvdW50OiBkYXlDb3VudCxcbiAgICAgICAgZ2VvQm91bmRzOiBnZW9Cb3VuZHNcbiAgICAgIH0pXG5cbiAgICBjYXNlIGFjdGlvbnMuU0VUX0NPTlRST0w6XG4gICAgICBpZiAoYWN0aW9uLnRhcmdldCA9PT0gJ3pvb20nKSB7XG4gICAgICAgIGlmIChhY3Rpb24ubW9kZSA9PT0gJ2luY3JlbWVudCcpIGFjdGlvbi5tb2RlID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oMTUsIHN0YXRlLnpvb20gKyAxKSlcbiAgICAgICAgaWYgKGFjdGlvbi5tb2RlID09PSAnZGVjcmVtZW50JykgYWN0aW9uLm1vZGUgPSBNYXRoLm1heCgxLCBNYXRoLm1pbigxNSwgc3RhdGUuem9vbSAtIDEpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIFthY3Rpb24udGFyZ2V0XTogYWN0aW9uLm1vZGVcbiAgICAgIH0pXG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWtcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblxuY29uc3QgZGF5UmVkdWNlciA9IChcbiAgc3RhdGUgPSB7XG4gICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgc3RhcnQ6IG5ldyBEYXRlKCksXG4gICAgZW5kOiBuZXcgRGF0ZSgwKSxcbiAgICBiZWFjb25zOiB7fSxcbiAgICBhbWJpdHM6IHt9LFxuICAgIGluY29tcGxldGU6IHRydWVcbiAgfSxcbiAgYWN0aW9uLFxuICBmZWF0dXJlc1xuKSA9PiB7XG4gIHZhciBzdGFydCwgZW5kXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuUkVDRUlWRV9EQVk6XG4gICAgICBzdGFydCA9IG5ldyBEYXRlKClcbiAgICAgIGVuZCA9IG5ldyBEYXRlKDApXG4gICAgICBpZiAoIWZlYXR1cmVzLmJlYWNvbikgYnJlYWtcbiAgICAgIHZhciBpbmNvbXBsZXRlID0gT2JqZWN0LmtleXMoZmVhdHVyZXMuYmVhY29uKS5sZW5ndGggPT09IDBcblxuICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXMuYmVhY29uKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgIHZhciBmID0gZmVhdHVyZXMuYmVhY29uW2tdXG4gICAgICAgIHZhciBkID0gbmV3IERhdGUoZi5wcm9wZXJ0aWVzLkRhdGVUaW1lKVxuICAgICAgICBpZiAoZC5nZXRUaW1lKCkgPCBzdGFydC5nZXRUaW1lKCkpIHN0YXJ0ID0gZFxuICAgICAgICBpZiAoZC5nZXRUaW1lKCkgPiBlbmQuZ2V0VGltZSgpKSBlbmQgPSBkXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIGJlYWNvbnM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmJlYWNvbnMsIGZlYXR1cmVzLmJlYWNvbiksXG4gICAgICAgIGFtYml0czogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYW1iaXRzLCBmZWF0dXJlcy5hbWJpdCksXG4gICAgICAgIGluY29tcGxldGU6IGluY29tcGxldGVcbiAgICAgIH0pXG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZVxufVxuXG5jb25zdCBmZWF0dXJlUmVkdWNlciA9IChcbiAgc3RhdGUgPSB7fSxcbiAgYWN0aW9uLFxuICBmZWF0dXJlXG4pID0+IHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5SRUNFSVZFX1BPU1RTOlxuICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnNjYXR0ZXIgPSBbKChNYXRoLnJhbmRvbSgpICogMikgLSAxKSAqIDAuMDAwNzUsICgoTWF0aC5yYW5kb20oKSAqIDIpIC0gMSkgKiAwLjAwMDc1XVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCBmZWF0dXJlKVxuICAgIGNhc2UgYWN0aW9ucy5SRUNFSVZFX0RBWTpcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgZmVhdHVyZSlcbiAgICBjYXNlIGFjdGlvbnMuUkVDRUlWRV9GRUFUVVJFUzpcbiAgICAgIGZlYXR1cmUucHJvcGVydGllcy5zY2F0dGVyID0gWygoTWF0aC5yYW5kb20oKSAqIDIpIC0gMSkgKiAwLjAwMDc1LCAoKE1hdGgucmFuZG9tKCkgKiAyKSAtIDEpICogMC4wMDA3NV1cbiAgICAgIGlmIChmZWF0dXJlLnByb3BlcnRpZXMuRmVhdHVyZVR5cGUgPT09ICdzaWdodGluZycpIHtcbiAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzLnJhZGl1cyA9IDIgKyBNYXRoLnNxcnQoZmVhdHVyZS5wcm9wZXJ0aWVzLkNvdW50KSAqIDJcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgZmVhdHVyZSlcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBva2F2YW5nb1JlZHVjZXJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL3JlZHVjZXJzL2luZGV4LmpzXG4gKiovIiwiXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgT2thdmFuZ28gZnJvbSAnLi4vY29tcG9uZW50cy9Pa2F2YW5nbydcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vYWN0aW9ucy5qcydcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBvd25Qcm9wcykgPT4ge1xuICByZXR1cm4ge1xuICAgIGV4cGVkaXRpb246IHN0YXRlLmV4cGVkaXRpb25zW3N0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbl0sXG4gICAgY2hpbGRyZW46IG93blByb3BzLmNoaWxkcmVuLFxuICAgIGFuaW1hdGU6IHN0YXRlLmFuaW1hdGUsXG4gICAgaXNGZXRjaGluZzogc3RhdGUuaXNGZXRjaGluZyxcbiAgICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiBzdGF0ZS5tYXBTdGF0ZU5lZWRzVXBkYXRlLFxuICAgIGV4cGVkaXRpb25JRDogc3RhdGUuc2VsZWN0ZWRFeHBlZGl0aW9uLFxuICAgIGNvbnRlbnRBY3RpdmU6IHN0YXRlLmNvbnRlbnRBY3RpdmUsXG4gICAgaW5pdGlhbFBhZ2U6IHN0YXRlLmluaXRpYWxQYWdlXG4gIH1cbn1cblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoLCBvd25Qcm9wcykgPT4ge1xuICByZXR1cm4ge1xuICAgIGZldGNoRGF5OiAoY3VycmVudERhdGUpID0+IHtcbiAgICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25zLmZldGNoRGF5KGN1cnJlbnREYXRlKSlcbiAgICB9LFxuICAgIHVwZGF0ZU1hcDogKGN1cnJlbnREYXRlLCBjb29yZGluYXRlcywgdmlld0dlb0JvdW5kcywgem9vbSwgZXhwZWRpdGlvbklEKSA9PiB7XG4gICAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9ucy51cGRhdGVNYXAoY3VycmVudERhdGUsIGNvb3JkaW5hdGVzLCB2aWV3R2VvQm91bmRzLCB6b29tLCBleHBlZGl0aW9uSUQpKVxuICAgIH0sXG4gICAgc2V0Q29udHJvbDogKHRhcmdldCwgbW9kZSkgPT4ge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbnMuc2V0Q29udHJvbCh0YXJnZXQsIG1vZGUpKVxuICAgIH0sXG4gICAganVtcFRvOiAoZGF0ZSwgZXhwZWRpdGlvbklEKSA9PiB7XG4gICAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9ucy5qdW1wVG8oZGF0ZSwgZXhwZWRpdGlvbklEKSlcbiAgICB9LFxuICAgIHNldFBhZ2U6ICgpID0+IHtcbiAgICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25zLnNldFBhZ2UoKSlcbiAgICB9LFxuICAgIGVuYWJsZUNvbnRlbnQ6ICgpID0+IHtcbiAgICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25zLmVuYWJsZUNvbnRlbnQoKSlcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgT2thdmFuZ29Db250YWluZXIgPSBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShPa2F2YW5nbylcblxuZXhwb3J0IGRlZmF1bHQgT2thdmFuZ29Db250YWluZXJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbnRhaW5lcnMvT2thdmFuZ29Db250YWluZXIuanNcbiAqKi8iLCJpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQmFja2dyb3VuZE1hcCBmcm9tICcuL0JhY2tncm91bmRNYXAnXG5cbmltcG9ydCBMaWdodEJveCBmcm9tICcuL0xpZ2h0Qm94J1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vVGltZWxpbmUnXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL05hdmlnYXRpb24nXG5pbXBvcnQgSW50cm9kdWN0aW9uQm94IGZyb20gJy4vSW50cm9kdWN0aW9uQm94J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPa2F2YW5nbyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3Qge2NoaWxkcmVuLCBleHBlZGl0aW9uLCBhbmltYXRlLCB1cGRhdGVNYXAsIGZldGNoRGF5LCBzZXRDb250cm9sLCBqdW1wVG8sIGlzRmV0Y2hpbmcsIG1hcFN0YXRlTmVlZHNVcGRhdGUsIHNldFBhZ2UsIGV4cGVkaXRpb25JRCwgY29udGVudEFjdGl2ZSwgZW5hYmxlQ29udGVudCwgaW5pdGlhbFBhZ2V9ID0gdGhpcy5wcm9wc1xuICAgIHZhciBoZWlnaHQgPSB7aGVpZ2h0OiB3aW5kb3cuaW5uZXJXaWR0aCA+IDc2OCA/IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwMCA6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwicm9vdFwiPlxuICAgICAgICA8QmFja2dyb3VuZE1hcCBpbml0aWFsUGFnZT17aW5pdGlhbFBhZ2V9IGV4cGVkaXRpb25JRD17ZXhwZWRpdGlvbklEfSBpc0ZldGNoaW5nPXtpc0ZldGNoaW5nfSBhbmltYXRlPXthbmltYXRlfSBleHBlZGl0aW9uPXtleHBlZGl0aW9ufSB1cGRhdGVNYXA9e3VwZGF0ZU1hcH0gZmV0Y2hEYXk9e2ZldGNoRGF5fSBzZXRDb250cm9sPXtzZXRDb250cm9sfSBtYXBTdGF0ZU5lZWRzVXBkYXRlPXttYXBTdGF0ZU5lZWRzVXBkYXRlfS8+XG4gICAgICAgIDxkaXYgaWQ9XCJtYXBPdmVybGF5XCIgc3R5bGU9e3tkaXNwbGF5OiAobG9jYXRpb24ucGF0aG5hbWUgPT09ICcvbWFwJyB8fCBsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nID8gJ2Jsb2NrJyA6ICdub25lJyl9fT48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cIm5pZ2h0T3ZlcmxheVwiIHN0eWxlPXt7b3BhY2l0eTogKGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL21hcCcgfHwgbG9jYXRpb24ucGF0aG5hbWUgPT09ICcvJyA/IDAgOiAxKX19PjwvZGl2PlxuICAgICAgICA8TmF2aWdhdGlvbiBzZXRQYWdlPXtzZXRQYWdlfSBwYXRoTmFtZT17bG9jYXRpb24ucGF0aG5hbWV9Lz5cbiAgICAgICAgPGRpdiBpZD1cImNvbnRlbnRcIiBzdHlsZT17aGVpZ2h0fSBjbGFzc05hbWU9e2NvbnRlbnRBY3RpdmUgPyAnJyA6ICdoaWRkZW4nfT5cbiAgICAgICAgICB7aXNGZXRjaGluZyA/IChcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJsb2FkaW5nV2hlZWxcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndoZWVsXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8TGlnaHRCb3ggYWN0aXZlPXtmYWxzZX0vPlxuICAgICAgICAgIDxUaW1lbGluZSBleHBlZGl0aW9uSUQ9e2V4cGVkaXRpb25JRH0gZXhwZWRpdGlvbj17ZXhwZWRpdGlvbn0ganVtcFRvPXtqdW1wVG99Lz5cbiAgICAgICAgICA8ZGl2IGlkPVwicGFnZUNvbnRhaW5lclwiPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2dvc1wiIHN0eWxlPXt7ZGlzcGxheTogKGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL21hcCcgfHwgbG9jYXRpb24ucGF0aG5hbWUgPT09ICcvJyA/ICdibG9jaycgOiAnbm9uZScpfX0+XG4gICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uYXRpb25hbGdlb2dyYXBoaWMuY29tL1wiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz1cInN0YXRpYy9pbWcvbmF0Z2VvTG9nby5zdmdcIiBhbHQ9XCJOYXRpb25hbCBHZW9ncmFwaGljIExvZ29cIiBoZWlnaHQ9XCIzNXB4XCIvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly9jb25zZXJ2aWZ5Lm9yZy9cIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCJzdGF0aWMvaW1nL2NvbnNlcnZpZnkucG5nXCIgYWx0PVwiQ29uc2VydmlmeSBMb2dvXCIgaGVpZ2h0PVwiMzVweFwiLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm8tYy1yLm9yZy9cIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCJzdGF0aWMvaW1nL29jckxvZ28uc3ZnXCIgYWx0PVwiVGhlIE9mZmljZSBmb3IgQ3JlYXRpdmUgUmVzZWFyY2ggTG9nb1wiIGhlaWdodD1cIjM1cHhcIi8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy53aWxkYmlyZHRydXN0LmNvbS9cIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCJzdGF0aWMvaW1nL3didExvZ28ucG5nXCIgYWx0PVwiV2lsZCBCaXJkIFRydXN0IExvZ29cIiBoZWlnaHQ9XCIzNXB4XCIvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEludHJvZHVjdGlvbkJveCBlbmFibGVDb250ZW50PXtlbmFibGVDb250ZW50fS8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuT2thdmFuZ28ucHJvcFR5cGVzID0ge1xuICBhbmltYXRlOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gIGV4cGVkaXRpb246IFByb3BUeXBlcy5vYmplY3QsXG4gIGV4cGVkaXRpb25JRDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdXBkYXRlTWFwOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBmZXRjaERheTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc2V0Q29udHJvbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAganVtcFRvOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0ZldGNoaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBzZXRQYWdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBjb250ZW50QWN0aXZlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBlbmFibGVDb250ZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpbml0aWFsUGFnZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb21wb25lbnRzL09rYXZhbmdvLmpzXG4gKiovIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IE1hcEdMLCB7IFNWR092ZXJsYXkgfSBmcm9tICdyZWFjdC1tYXAtZ2wnXG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJ1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuLi91dGlscydcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnXG5pbXBvcnQgeyBEZWNrR0xPdmVybGF5LCBTY2F0dGVycGxvdExheWVyIH0gZnJvbSAnLi4vZGVjay5nbCdcbmltcG9ydCB7IGxlcnAgfSBmcm9tICcuLi91dGlscydcblxuY2xhc3MgQmFja2dyb3VuZE1hcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhbmltYXRlOiBmYWxzZSxcbiAgICAgIGNvb3JkaW5hdGVzOiBbMCwgMF0sXG4gICAgICB2aWV3cG9ydDoge1xuICAgICAgICBsYXRpdHVkZTogLTE4LjU2OTkyMjksXG4gICAgICAgIGxvbmdpdHVkZTogMjIuMTE1NDU2LFxuICAgICAgICB6b29tOiA0LFxuICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICBzdGFydERyYWdMbmdMYXQ6IG51bGwsXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIHRpY2sgKHBhc3RGcmFtZURhdGUpIHtcbiAgICBjb25zdCBzcGVlZEZhY3RvciA9IChEYXRlLm5vdygpIC0gcGFzdEZyYW1lRGF0ZSkgLyAoMTAwMCAvIDYwKVxuICAgIGNvbnN0IGN1cnJlbnRGcmFtZURhdGUgPSBEYXRlLm5vdygpXG4gICAgY29uc3Qge2V4cGVkaXRpb25JRCwgYW5pbWF0ZSwgZXhwZWRpdGlvbiwgZmV0Y2hEYXksIHNldENvbnRyb2wsIGlzRmV0Y2hpbmcsIHVwZGF0ZU1hcCwgaW5pdGlhbFBhZ2V9ID0gdGhpcy5wcm9wc1xuICAgIHZhciBiMSwgYjJcbiAgICBpZiAoYW5pbWF0ZSAmJiAhaXNGZXRjaGluZyAmJiBsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9tYXAnIHx8IGxvY2F0aW9uLnBhdGhuYW1lID09PSAnLycpIHtcbiAgICAgIC8vIGluY3JlbWVudCB0aW1lXG4gICAgICB2YXIgZGF0ZU9mZnNldCA9IDBcbiAgICAgIHZhciBmb3J3YXJkID0gZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2Zhc3RGb3J3YXJkJyB8fCBleHBlZGl0aW9uLnBsYXliYWNrID09PSAnZm9yd2FyZCcgfHwgZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ3BhdXNlJ1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYmVhY29uSW5kZXggPT09IChmb3J3YXJkID8gMCA6IDEpIHx8IHRoaXMuc3RhdGUuYmVhY29uSW5kZXggPT09IChmb3J3YXJkID8gZDMudmFsdWVzKHRoaXMuc3RhdGUuZGF5LmJlYWNvbnMpLmxlbmd0aCAtIDIgOiBkMy52YWx1ZXModGhpcy5zdGF0ZS5kYXkuYmVhY29ucykubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuc3RhdGUudGltZVRvTmV4dEJlYWNvbiA+IDAgPyBNYXRoLm1pbigxMDAwMDAsIHRoaXMuc3RhdGUudGltZVRvTmV4dEJlYWNvbiArIDEpIDogMTAwMDAwXG4gICAgICAgIGlmIChleHBlZGl0aW9uLnBsYXliYWNrID09PSAnZmFzdEJhY2t3YXJkJyB8fCBleHBlZGl0aW9uLnBsYXliYWNrID09PSAnYmFja3dhcmQnKSBkYXRlT2Zmc2V0ID0gLTEgKiBvZmZzZXRcbiAgICAgICAgaWYgKGV4cGVkaXRpb24ucGxheWJhY2sgPT09ICdmb3J3YXJkJyB8fCBleHBlZGl0aW9uLnBsYXliYWNrID09PSAnZmFzdEZvcndhcmQnKSBkYXRlT2Zmc2V0ID0gb2Zmc2V0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2Zhc3RCYWNrd2FyZCcpIGRhdGVPZmZzZXQgPSAtMjUwMDBcbiAgICAgICAgaWYgKGV4cGVkaXRpb24ucGxheWJhY2sgPT09ICdiYWNrd2FyZCcpIGRhdGVPZmZzZXQgPSAtNDAwMFxuICAgICAgICBpZiAoZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2ZvcndhcmQnKSBkYXRlT2Zmc2V0ID0gNDAwMFxuICAgICAgICBpZiAoZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2Zhc3RGb3J3YXJkJykgZGF0ZU9mZnNldCA9IDI1MDAwXG4gICAgICB9XG4gICAgICB2YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZShNYXRoLm1pbihleHBlZGl0aW9uLmVuZC5nZXRUaW1lKCkgLSAxLCAoTWF0aC5tYXgoZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkgKyAxLCB0aGlzLnN0YXRlLmN1cnJlbnREYXRlLmdldFRpbWUoKSArIGRhdGVPZmZzZXQpKSkpXG5cbiAgICAgIC8vIHBhdXNlIHBsYXliYWNrIGlmIHRpbWUgcmVhY2hlcyBiZWdpbm5pbmcgb3IgZW5kXG4gICAgICBpZiAoKGN1cnJlbnREYXRlLmdldFRpbWUoKSA9PT0gZXhwZWRpdGlvbi5lbmQuZ2V0VGltZSgpIC0gMSAmJiAoZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2ZvcndhcmQnIHx8IGV4cGVkaXRpb24ucGxheWJhY2sgPT09ICdmYXN0Rm9yd2FyZCcpKSB8fCAoY3VycmVudERhdGUuZ2V0VGltZSgpID09PSBleHBlZGl0aW9uLnN0YXJ0LmdldFRpbWUoKSArIDEgJiYgKGV4cGVkaXRpb24ucGxheWJhY2sgPT09ICdiYWNrd2FyZCcgfHwgZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2Zhc3RCYWNrd2FyZCcpKSkgc2V0Q29udHJvbCgncGxheWJhY2snLCAncGF1c2UnKVxuXG4gICAgICAvLyBjaGVja3MgY3VycmVudCBkYXlcbiAgICAgIHZhciBjdXJyZW50RGF5ID0gTWF0aC5mbG9vcigoY3VycmVudERhdGUuZ2V0VGltZSgpIC0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgaWYgKGN1cnJlbnREYXkgIT09IHRoaXMuc3RhdGUuY3VycmVudERheSkge1xuICAgICAgICAvLyBuZXcgZGF5XG4gICAgICAgIGZldGNoRGF5KGN1cnJlbnREYXRlKVxuICAgICAgfVxuXG4gICAgICAvLyBsb29rIGZvciBtb3N0IGN1cnJlbnQgYmVhY29uXG4gICAgICBjb25zdCBkYXkgPSBleHBlZGl0aW9uLmRheXNbY3VycmVudERheV1cbiAgICAgIHZhciBiZWFjb25zID0gZDMudmFsdWVzKGRheS5iZWFjb25zKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShhLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICB9KVxuICAgICAgdmFyIGJlYWNvbkNvdW50ID0gYmVhY29ucy5sZW5ndGhcbiAgICAgIHZhciBiZWFjb25JbmRleFxuICAgICAgdmFyIHRpbWVUb05leHRCZWFjb24gPSAwXG4gICAgICB2YXIgcmF0aW9CZXR3ZWVuQmVhY29ucyA9IDBcbiAgICAgIGlmIChleHBlZGl0aW9uLnBsYXliYWNrID09PSAnZm9yd2FyZCcgfHwgZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2Zhc3RGb3J3YXJkJyB8fCBleHBlZGl0aW9uLnBsYXliYWNrID09PSAncGF1c2UnKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmVhY29uQ291bnQgLSAxOyBpKyspIHtcbiAgICAgICAgICBiMSA9IG5ldyBEYXRlKGJlYWNvbnNbaV0ucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgICAgYjIgPSBuZXcgRGF0ZShiZWFjb25zW2kgKyAxXS5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKClcbiAgICAgICAgICBpZiAoY3VycmVudERhdGUuZ2V0VGltZSgpID49IGIxICYmIGN1cnJlbnREYXRlLmdldFRpbWUoKSA8IGIyKSB7XG4gICAgICAgICAgICBiZWFjb25JbmRleCA9IGlcbiAgICAgICAgICAgIHRpbWVUb05leHRCZWFjb24gPSBiMiAtIGN1cnJlbnREYXRlLmdldFRpbWUoKVxuICAgICAgICAgICAgcmF0aW9CZXR3ZWVuQmVhY29ucyA9IChjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSBiMSkgLyAoYjIgLSBiMSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChiZWFjb25JbmRleCA8IDApIGJlYWNvbkluZGV4ID0gYmVhY29uQ291bnQgLSAxXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBiZWFjb25Db3VudCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICBiMSA9IG5ldyBEYXRlKGJlYWNvbnNbaV0ucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgICAgYjIgPSBuZXcgRGF0ZShiZWFjb25zW2kgLSAxXS5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKClcbiAgICAgICAgICBpZiAoY3VycmVudERhdGUuZ2V0VGltZSgpIDw9IGIxICYmIGN1cnJlbnREYXRlLmdldFRpbWUoKSA+IGIyKSB7XG4gICAgICAgICAgICBiZWFjb25JbmRleCA9IGlcbiAgICAgICAgICAgIHRpbWVUb05leHRCZWFjb24gPSBjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSBiMlxuICAgICAgICAgICAgcmF0aW9CZXR3ZWVuQmVhY29ucyA9IChjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSBiMSkgLyAoYjIgLSBiMSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChiZWFjb25JbmRleCA8IDApIGJlYWNvbkluZGV4ID0gMFxuICAgICAgfVxuICAgICAgLy8gc2V0IG1hcCBjb29yZGluYXRlcyB0byBjdXJyZW50IGJlYWNvblxuICAgICAgdmFyIGN1cnJlbnRCZWFjb24gPSBiZWFjb25zW2JlYWNvbkluZGV4ICsgKGZvcndhcmQgPyAwIDogMCldXG4gICAgICB2YXIgbmV4dEJlYWNvbiA9IGJlYWNvbnNbYmVhY29uSW5kZXggKyAoZm9yd2FyZCA/IDEgOiAtMSldXG4gICAgICB2YXIgY29vcmRpbmF0ZXMgPSBbXG4gICAgICAgIGxlcnAoY3VycmVudEJlYWNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXSwgbmV4dEJlYWNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXSwgcmF0aW9CZXR3ZWVuQmVhY29ucyksXG4gICAgICAgIGxlcnAoY3VycmVudEJlYWNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgbmV4dEJlYWNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgcmF0aW9CZXR3ZWVuQmVhY29ucylcbiAgICAgIF1cblxuICAgICAgIC8vIGxvb2sgZm9yIG1vc3QgY3VycmVudCBhbWJpdF9nZW9cbiAgICAgIGNvbnN0IG1lbWJlcnMgPSB7IC4uLmV4cGVkaXRpb24ubWVtYmVycyB9XG4gICAgICBPYmplY3Qua2V5cyhtZW1iZXJzKS5mb3JFYWNoKG1lbWJlcklEID0+IHtcbiAgICAgICAgdmFyIG1lbWJlciA9IG1lbWJlcnNbbWVtYmVySURdXG4gICAgICAgIHZhciBhbWJpdHMgPSBkMy52YWx1ZXMoZXhwZWRpdGlvbi5mZWF0dXJlc0J5TWVtYmVyW21lbWJlcklEXVtjdXJyZW50RGF5XSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShhLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgIH0pXG4gICAgICAgIHZhciBhbWJpdENvdW50ID0gYW1iaXRzLmxlbmd0aFxuICAgICAgICB2YXIgYW1iaXRJbmRleCA9IC0xXG4gICAgICAgIHZhciByYXRpb0JldHdlZW5BbWJpdHMgPSAwXG4gICAgICAgIGlmIChleHBlZGl0aW9uLnBsYXliYWNrID09PSAnZm9yd2FyZCcgfHwgZXhwZWRpdGlvbi5wbGF5YmFjayA9PT0gJ2Zhc3RGb3J3YXJkJyB8fCBleHBlZGl0aW9uLnBsYXliYWNrID09PSAncGF1c2UnKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbWJpdENvdW50IC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBiMSA9IG5ldyBEYXRlKGFtYml0c1tpXS5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKClcbiAgICAgICAgICAgIGIyID0gbmV3IERhdGUoYW1iaXRzW2kgKyAxXS5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKClcbiAgICAgICAgICAgIGlmIChjdXJyZW50RGF0ZS5nZXRUaW1lKCkgPj0gYjEgJiYgY3VycmVudERhdGUuZ2V0VGltZSgpIDwgYjIpIHtcbiAgICAgICAgICAgICAgYW1iaXRJbmRleCA9IGlcbiAgICAgICAgICAgICAgcmF0aW9CZXR3ZWVuQW1iaXRzID0gKGN1cnJlbnREYXRlLmdldFRpbWUoKSAtIGIxKSAvIChiMiAtIGIxKVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYW1iaXRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIGFtYml0SW5kZXggPSBhbWJpdENvdW50IC0gMlxuICAgICAgICAgICAgcmF0aW9CZXR3ZWVuQW1iaXRzID0gMVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGkgPSBhbWJpdENvdW50IC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgYjEgPSBuZXcgRGF0ZShhbWJpdHNbaV0ucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgICAgICBiMiA9IG5ldyBEYXRlKGFtYml0c1tpIC0gMV0ucHJvcGVydGllcy5EYXRlVGltZSkuZ2V0VGltZSgpXG4gICAgICAgICAgICBpZiAoY3VycmVudERhdGUuZ2V0VGltZSgpIDw9IGIxICYmIGN1cnJlbnREYXRlLmdldFRpbWUoKSA+IGIyKSB7XG4gICAgICAgICAgICAgIGFtYml0SW5kZXggPSBpXG4gICAgICAgICAgICAgIHJhdGlvQmV0d2VlbkFtYml0cyA9IChjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSBiMSkgLyAoYjIgLSBiMSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFtYml0SW5kZXggPCAwKSB7XG4gICAgICAgICAgICBhbWJpdEluZGV4ID0gMVxuICAgICAgICAgICAgcmF0aW9CZXR3ZWVuQW1iaXRzID0gMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgbWVtYmVyIGNvb3JkaW5hdGVzXG4gICAgICAgIHZhciBjdXJyZW50SUQgPSBhbWJpdEluZGV4XG4gICAgICAgIHZhciBuZXh0SUQgPSBhbWJpdEluZGV4ICsgKGZvcndhcmQgPyAxIDogLTEpXG4gICAgICAgIGlmIChjdXJyZW50SUQgPj0gMCAmJiBjdXJyZW50SUQgPCBhbWJpdHMubGVuZ3RoICYmIG5leHRJRCA+PSAwICYmIG5leHRJRCA8IGFtYml0cy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgY3VycmVudEFtYml0cyA9IGFtYml0c1tjdXJyZW50SURdXG4gICAgICAgICAgdmFyIG5leHRBbWJpdCA9IGFtYml0c1tuZXh0SURdXG4gICAgICAgICAgbWVtYmVyLmNvb3JkaW5hdGVzID0gW1xuICAgICAgICAgICAgbGVycChjdXJyZW50QW1iaXRzLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLCBuZXh0QW1iaXQuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sIHJhdGlvQmV0d2VlbkFtYml0cyksXG4gICAgICAgICAgICBsZXJwKGN1cnJlbnRBbWJpdHMuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sIG5leHRBbWJpdC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgcmF0aW9CZXR3ZWVuQW1iaXRzKVxuICAgICAgICAgIF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZW1iZXIuY29vcmRpbmF0ZXMgPSBbLTE4MCwgOTBdXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHZhciB6b29tID0gbGVycCh0aGlzLnN0YXRlLnZpZXdwb3J0Lnpvb20sIHRoaXMuc3RhdGUudmlld3BvcnQudGFyZ2V0Wm9vbSwgTWF0aC5wb3codGhpcy5zdGF0ZS52aWV3cG9ydC56b29tIC8gdGhpcy5zdGF0ZS52aWV3cG9ydC50YXJnZXRab29tLCAyKSAvIDI1MCAqIHNwZWVkRmFjdG9yKVxuICAgICAgaWYgKCEoaW5pdGlhbFBhZ2UgPT09ICcvJyB8fCBpbml0aWFsUGFnZSA9PT0gJy9tYXAnKSkgem9vbSA9IHRoaXMuc3RhdGUudmlld3BvcnQudGFyZ2V0Wm9vbVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudERhdGUsXG4gICAgICAgIGFuaW1hdGUsXG4gICAgICAgIGN1cnJlbnREYXksXG4gICAgICAgIGRheSxcbiAgICAgICAgYmVhY29uSW5kZXgsXG4gICAgICAgIHRpbWVUb05leHRCZWFjb24sXG4gICAgICAgIG1lbWJlcnMsXG4gICAgICAgIHZpZXdwb3J0OiB7XG4gICAgICAgICAgLi4udGhpcy5zdGF0ZS52aWV3cG9ydCxcbiAgICAgICAgICBsb25naXR1ZGU6IGNvb3JkaW5hdGVzWzBdLFxuICAgICAgICAgIGxhdGl0dWRlOiBjb29yZGluYXRlc1sxXSxcbiAgICAgICAgICB6b29tOiB6b29tXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmZyYW1lQ291bnQgJSA2MCA9PT0gMCkge1xuICAgICAgICBjb25zdCB7IHVucHJvamVjdCB9ID0gVmlld3BvcnRNZXJjYXRvcih7IC4uLnRoaXMuc3RhdGUudmlld3BvcnQgfSlcbiAgICAgICAgY29uc3QgbncgPSB1bnByb2plY3QoWzAsIDBdKVxuICAgICAgICBjb25zdCBzZSA9IHVucHJvamVjdChbd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodF0pXG4gICAgICAgIGNvbnN0IHZpZXdHZW9Cb3VuZHMgPSBbbndbMF0sIG53WzFdLCBzZVswXSwgc2VbMV1dXG4gICAgICAgIHVwZGF0ZU1hcCh0aGlzLnN0YXRlLmN1cnJlbnREYXRlLCBbdGhpcy5zdGF0ZS52aWV3cG9ydC5sb25naXR1ZGUsIHRoaXMuc3RhdGUudmlld3BvcnQubGF0aXR1ZGVdLCB2aWV3R2VvQm91bmRzLCB0aGlzLnN0YXRlLnZpZXdwb3J0Lnpvb20sIGV4cGVkaXRpb25JRClcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5hbmltYXRlID0gYW5pbWF0ZVxuICAgIHRoaXMuc3RhdGUuZnJhbWVDb3VudCsrXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsgdGhpcy50aWNrKGN1cnJlbnRGcmFtZURhdGUpIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICBjb25zdCB7YW5pbWF0ZSwgZXhwZWRpdGlvbiwgbWFwU3RhdGVOZWVkc1VwZGF0ZX0gPSBuZXh0UHJvcHNcbiAgICAvLyBjb25zb2xlLmxvZygnbmV3JywgYW5pbWF0ZSwgdGhpcy5zdGF0ZS5hbmltYXRlKVxuICAgIGlmIChhbmltYXRlKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGV4cGVkaXRpb24uY3VycmVudERhdGVcbiAgICAgIC8vIG5vdGU6IGN1cnJlbnREYXkgaGFzIGEgMSBkYXkgb2Zmc2V0IHdpdGggQVBJIGV4cGVkaXRpb25EYXksIHdoaWNoIHN0YXJ0cyBhdCAxXG4gICAgICBjb25zdCBjdXJyZW50RGF5ID0gTWF0aC5mbG9vcigoY3VycmVudERhdGUuZ2V0VGltZSgpIC0gZXhwZWRpdGlvbi5zdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiAzNjAwICogMjQpKVxuICAgICAgY29uc3QgZGF5ID0gZXhwZWRpdGlvbi5kYXlzW2N1cnJlbnREYXldXG5cbiAgICAgIGlmIChtYXBTdGF0ZU5lZWRzVXBkYXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZVxuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnREYXkgPSBjdXJyZW50RGF5XG4gICAgICAgIHRoaXMuc3RhdGUuZGF5ID0gZGF5XG4gICAgICAgIHRoaXMuc3RhdGUuZnJhbWVDb3VudCA9IDBcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnN0YXRlLmFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5hbmltYXRlID0gYW5pbWF0ZVxuICAgICAgICB0aGlzLnN0YXRlLnZpZXdwb3J0ID0ge1xuICAgICAgICAgIC4uLnRoaXMuc3RhdGUudmlld3BvcnQsXG4gICAgICAgICAgem9vbTogZXhwZWRpdGlvbi5pbml0aWFsWm9vbSxcbiAgICAgICAgICB0YXJnZXRab29tOiBleHBlZGl0aW9uLnRhcmdldFpvb21cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3RhcnRpbmcgYW5pbWF0aW9uJylcbiAgICAgICAgdGhpcy50aWNrKE1hdGgucm91bmQoRGF0ZS5ub3coKSAtICgxMDAwIC8gNjApKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgcmVkcmF3U1ZHT3ZlcmxheSAoeyBwcm9qZWN0IH0pIHtcbiAgICBjb25zdCB7IGV4cGVkaXRpb24gfSA9IHRoaXMucHJvcHNcbiAgICByZXR1cm4gKFxuICAgICAgPGc+XG4gICAgICAgIDxnPlxuICAgICAgICAgIHt0aGlzLmRyYXdBbWJpdHMocHJvamVjdCl9XG4gICAgICAgIDwvZz5cbiAgICAgICAgPGc+XG4gICAgICAgICAge3RoaXMuZHJhd01lbWJlcnMocHJvamVjdCl9XG4gICAgICAgIDwvZz5cbiAgICAgICAgPGc+XG4gICAgICAgICAge3RoaXMuZHJhd1Bvc3RzKHByb2plY3QpfVxuICAgICAgICA8L2c+XG4gICAgICA8L2c+XG4gICAgKVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyYXdQb3N0cyAocHJvamVjdCkge1xuICAgIHJldHVybiAnJyAvLyBUUklNTUlOR1xuICAgIGNvbnN0IHsgZXhwZWRpdGlvbiB9ID0gdGhpcy5wcm9wc1xuICAgIC8vIGNvbnNvbGUubG9nKGV4cGVkaXRpb24uY3VycmVudFBvc3RzLmxlbmd0aClcbiAgICBjb25zdCBpY29ucyA9IGV4cGVkaXRpb24uY3VycmVudFBvc3RzLm1hcChwb3N0ID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IChwb3NpdGlvbikgPT4ge1xuICAgICAgICB2YXIgY29vcmRzID0gcHJvamVjdChwb3NpdGlvbilcbiAgICAgICAgdmFyIHggPSBNYXRoLnJvdW5kKGNvb3Jkc1swXSlcbiAgICAgICAgdmFyIHkgPSBNYXRoLnJvdW5kKGNvb3Jkc1sxXSlcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHggKyAnLCcgKyB5ICsgJyknXG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZyB0cmFuc2Zvcm09eyB0cmFuc2xhdGUocG9zdC5wb3NpdGlvbikgfSBrZXk9e3Bvc3QuaWR9PlxuICAgICAgICAgIDxpbWFnZSB4bGlua0hyZWY9eycvc3RhdGljL2ltZy9pY29uLW1hcC0nICsgcG9zdC50eXBlICsgJy5wbmcnfSB4PXstMTJ9IHk9ey0yNH0gaGVpZ2h0PXszMX0gd2lkdGg9ezI0fSAvPlxuICAgICAgICA8L2c+XG4gICAgICApXG4gICAgfSlcbiAgICByZXR1cm4gaWNvbnNcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBkcmF3TWVtYmVycyAocHJvamVjdCkge1xuICAgIGNvbnN0IHsgbWVtYmVycyB9ID0gdGhpcy5zdGF0ZVxuICAgIC8vIGlmICh0aGlzLnN0YXRlLmZyYW1lQ291bnQgJSA2MCA9PT0gMCkgY29uc29sZS5sb2cobWVtYmVycylcbiAgICBpZiAoIW1lbWJlcnMgfHwgbWVtYmVycy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIGNvbnN0IG1hcmtlcnMgPSBPYmplY3Qua2V5cyhtZW1iZXJzKS5tYXAobWVtYmVySUQgPT4ge1xuICAgICAgdmFyIG1lbWJlciA9IG1lbWJlcnNbbWVtYmVySURdXG4gICAgICBjb25zdCB0cmFuc2xhdGUgPSAobWVtYmVyKSA9PiB7XG4gICAgICAgIHZhciBjb29yZHMgPSBwcm9qZWN0KG1lbWJlci5jb29yZGluYXRlcylcbiAgICAgICAgdmFyIHggPSBNYXRoLnJvdW5kKChjb29yZHNbMF0gLSAyNyAvIDIpICogMTApIC8gMTBcbiAgICAgICAgdmFyIHkgPSBNYXRoLnJvdW5kKChjb29yZHNbMV0gLSAzNCkgKiAxMCkgLyAxMFxuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgeCArICcsJyArIHkgKyAnKSdcbiAgICAgIH1cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxnIHRyYW5zZm9ybT17IHRyYW5zbGF0ZShtZW1iZXIpIH0ga2V5PXttZW1iZXJJRH0+XG4gICAgICAgICAgPHBhdGggZmlsbD1cInJnYmEoNCwwLDI2LDAuNylcIiBkPVwiTTI3LDEzLjhDMjcsMjIuMiwxMy41LDM0LDEzLjUsMzRTMCwyMi4yLDAsMTMuOEMwLDYuMyw2LDAuMywxMy41LDAuM1MyNyw2LjMsMjcsMTMuOHpcIi8+XG4gICAgICAgICAgPHRleHQgc3R5bGU9e3t0ZXh0QW5jaG9yOiAnbWlkZGxlJ319IHg9ezEzLjV9IHk9ezE5fSBmaWxsPXsnd2hpdGUnfSA+e21lbWJlcklELnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCl9PC90ZXh0PlxuICAgICAgICA8L2c+XG4gICAgICApXG4gICAgfSlcbiAgICByZXR1cm4gbWFya2Vyc1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIGRyYXdBbWJpdHMgKHByb2plY3QpIHtcbiAgICBjb25zdCB7IGV4cGVkaXRpb24gfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBwYXRocyA9IGV4cGVkaXRpb24uY3VycmVudEFtYml0cy5tYXAoKHJvdXRlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcG9pbnRzID0gcm91dGUuY29vcmRpbmF0ZXMubWFwKHByb2plY3QpLm1hcChcbiAgICAgICAgcCA9PiBbcFswXSwgcFsxXV1cbiAgICAgIClcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxnIGtleT17IGluZGV4IH0+XG4gICAgICAgICAgPGcgc3R5bGU9eyB7cG9pbnRlckV2ZW50czogJ2NsaWNrJywgY3Vyc29yOiAncG9pbnRlcid9IH0+XG4gICAgICAgICAgICA8ZyBzdHlsZT17IHtwb2ludGVyRXZlbnRzOiAndmlzaWJsZVN0cm9rZSd9IH0+XG4gICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIHN0cm9rZTogcm91dGUuY29sb3IsXG4gICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgZD17IGBNJHtwb2ludHMuam9pbignTCcpfWB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgPC9nPlxuICAgICAgICA8L2c+XG4gICAgICApXG4gICAgfSlcbiAgICByZXR1cm4gcGF0aHNcbiAgfVxuXG4gIC8vIEBhdXRvYmluZFxuICAvLyBvbkNoYW5nZVZpZXdwb3J0IChuZXdWaWV3cG9ydCkge1xuICAvLyAgIG5ld1ZpZXdwb3J0LndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgLy8gICBuZXdWaWV3cG9ydC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgLy8gICB0aGlzLnNldFN0YXRlKHtcbiAgLy8gICAgIC4uLnRoaXMuc3RhdGUsXG4gIC8vICAgICB2aWV3cG9ydDogbmV3Vmlld3BvcnRcbiAgLy8gICB9KVxuICAvLyB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IGV4cGVkaXRpb24gfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IHZpZXdwb3J0IH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgTUFQQk9YX0FDQ0VTU19UT0tFTiA9ICdway5leUoxSWpvaWFXRmhZV0Z1SWl3aVlTSTZJbU5wYlhGMVpXNHhPVEF3Ym5sM1lteDFZMko2TW01eE9IWWlmUS42d2xOelNkY1Rsb25MQkgteGNtVWRRJ1xuICAgIGNvbnN0IE1BUEJPWF9TVFlMRSA9ICdtYXBib3g6Ly9zdHlsZXMvbWFwYm94L3NhdGVsbGl0ZS12OSdcblxuICAgICAgLy8gPGRpdiBpZD1cIm1hcGJveFwiIHN0eWxlPXt7ekluZGV4OiAobG9jYXRpb24ucGF0aG5hbWUgPT09ICcvbWFwJyB8fCBsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nID8gMCA6IC0xMDApfX0+XG4gICAgICAgICAgLy8gb25DaGFuZ2VWaWV3cG9ydD17dGhpcy5vbkNoYW5nZVZpZXdwb3J0fVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwibWFwYm94XCIgc3R5bGU9e3t6SW5kZXg6IChsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9tYXAnIHx8IGxvY2F0aW9uLnBhdGhuYW1lID09PSAnLycgPyAtMTAwIDogLTEwMCl9fT5cbiAgICAgICAgPE1hcEdMXG4gICAgICAgICAgey4uLnZpZXdwb3J0fVxuICAgICAgICAgIG1hcFN0eWxlPXtNQVBCT1hfU1RZTEV9XG4gICAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW49e01BUEJPWF9BQ0NFU1NfVE9LRU59XG4gICAgICAgID5cbiAgICAgICAgICB7ZXhwZWRpdGlvblxuICAgICAgICAgID8gPGRpdj5cbiAgICAgICAgICAgIDxTVkdPdmVybGF5XG4gICAgICAgICAgICAgIHsuLi52aWV3cG9ydH1cbiAgICAgICAgICAgICAgc3RhcnREcmFnTG5nTGF0PXtbMCwgMF19XG4gICAgICAgICAgICAgIHJlZHJhdz17IHRoaXMucmVkcmF3U1ZHT3ZlcmxheSB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPERlY2tHTE92ZXJsYXlcbiAgICAgICAgICAgICAgey4uLnZpZXdwb3J0fVxuICAgICAgICAgICAgICBzdGFydERyYWdMbmdMYXQ9e1swLCAwXX1cbiAgICAgICAgICAgICAgbGF5ZXJzPXtbXG4gICAgICAgICAgICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAgICAgICAgICAgLi4udmlld3BvcnQsXG4gICAgICAgICAgICAgICAgICBpZDogJ3NpZ2h0aW5ncycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBleHBlZGl0aW9uLmN1cnJlbnRTaWdodGluZ3NcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA6ICcnfVxuICAgICAgICA8L01hcEdMPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbkJhY2tncm91bmRNYXAucHJvcFR5cGVzID0ge1xuICBhbmltYXRlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBleHBlZGl0aW9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICB1cGRhdGVNYXA6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGZldGNoRGF5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBzZXRDb250cm9sOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBtYXBTdGF0ZU5lZWRzVXBkYXRlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBpbml0aWFsUGFnZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhY2tncm91bmRNYXBcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvQmFja2dyb3VuZE1hcC5qc1xuICoqLyIsIi8qIChpZ25vcmVkKSAqL1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogbWluLWRvY3VtZW50IChpZ25vcmVkKVxuICoqIG1vZHVsZSBpZCA9IDc3NlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG5leHBvcnQgZnVuY3Rpb24gZGF0ZVRvU3RyaW5nIChkLCBzaG9ydCkge1xuICB2YXIgbW9udGggPSBkLmdldFVUQ01vbnRoKCkgKyAxXG4gIHZhciBkYXkgPSBkLmdldFVUQ0RhdGUoKVxuICB2YXIgaG91ciA9IGQuZ2V0VVRDSG91cnMoKSArICcnXG4gIGlmIChob3VyLmxlbmd0aCA9PT0gMSkgaG91ciA9ICcwJyArIGhvdXJcbiAgdmFyIG1pbnV0ZSA9IGQuZ2V0VVRDTWludXRlcygpICsgJydcbiAgaWYgKG1pbnV0ZS5sZW5ndGggPT09IDEpIG1pbnV0ZSA9ICcwJyArIG1pbnV0ZVxuXG4gIHZhciBtb250aFN0cmluZyA9ICcnXG4gIGlmIChtb250aCA9PT0gMSkgbW9udGhTdHJpbmcgPSAnSmFudWFyeSdcbiAgaWYgKG1vbnRoID09PSAyKSBtb250aFN0cmluZyA9ICdGZWJydWFyeSdcbiAgaWYgKG1vbnRoID09PSAzKSBtb250aFN0cmluZyA9ICdNYXJjaCdcbiAgaWYgKG1vbnRoID09PSA0KSBtb250aFN0cmluZyA9ICdBcHJpbCdcbiAgaWYgKG1vbnRoID09PSA1KSBtb250aFN0cmluZyA9ICdNYXknXG4gIGlmIChtb250aCA9PT0gNikgbW9udGhTdHJpbmcgPSAnSnVuZSdcbiAgaWYgKG1vbnRoID09PSA3KSBtb250aFN0cmluZyA9ICdKdWx5J1xuICBpZiAobW9udGggPT09IDgpIG1vbnRoU3RyaW5nID0gJ0F1Z3VzdCdcbiAgaWYgKG1vbnRoID09PSA5KSBtb250aFN0cmluZyA9ICdTZXB0ZW1iZXInXG4gIGlmIChtb250aCA9PT0gMTApIG1vbnRoU3RyaW5nID0gJ09jdG9iZXInXG4gIGlmIChtb250aCA9PT0gMTEpIG1vbnRoU3RyaW5nID0gJ05vdmVtYmVyJ1xuICBpZiAobW9udGggPT09IDEyKSBtb250aFN0cmluZyA9ICdEZWNlbWJlcidcbiAgaWYgKHNob3J0KSBtb250aFN0cmluZyA9IG1vbnRoU3RyaW5nLnNsaWNlKDAsIDMpXG5cbiAgcmV0dXJuIG1vbnRoU3RyaW5nICsgJyAnICsgZGF5ICsgJywgJyArIGhvdXIgKyAnOicgKyBtaW51dGVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAgKHN0YXJ0LCBlbmQsIHJhdGlvKSB7XG4gIHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiByYXRpb1xufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL3V0aWxzLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvaW5kZXguanMnKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2RlY2suZ2wvaW5kZXguanNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgRGVja0dMT3ZlcmxheSBmcm9tICcuL2RlY2tnbC1vdmVybGF5JztcblxuaW1wb3J0IExheWVyIGZyb20gJy4vbGF5ZXInO1xuXG5pbXBvcnQgSGV4YWdvbkxheWVyIGZyb20gJy4vbGF5ZXJzL2hleGFnb24tbGF5ZXInO1xuaW1wb3J0IENob3JvcGxldGhMYXllciBmcm9tICcuL2xheWVycy9jaG9yb3BsZXRoLWxheWVyJztcbmltcG9ydCBTY2F0dGVycGxvdExheWVyIGZyb20gJy4vbGF5ZXJzL3NjYXR0ZXJwbG90LWxheWVyJztcbmltcG9ydCBHcmlkTGF5ZXIgZnJvbSAnLi9sYXllcnMvZ3JpZC1sYXllcic7XG5pbXBvcnQgQXJjTGF5ZXIgZnJvbSAnLi9sYXllcnMvYXJjLWxheWVyJztcbmltcG9ydCBMaW5lTGF5ZXIgZnJvbSAnLi9sYXllcnMvbGluZS1sYXllcic7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBEZWNrR0xPdmVybGF5LFxuICBMYXllcixcbiAgSGV4YWdvbkxheWVyLFxuICBDaG9yb3BsZXRoTGF5ZXIsXG4gIFNjYXR0ZXJwbG90TGF5ZXIsXG4gIEdyaWRMYXllcixcbiAgQXJjTGF5ZXIsXG4gIExpbmVMYXllclxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uL3NyYy9pbmRleC5qc1xuICoqLyIsIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5cbmltcG9ydCBXZWJHTFJlbmRlcmVyIGZyb20gJy4vd2ViZ2wtcmVuZGVyZXInO1xuaW1wb3J0IHtTY2VuZSwgQ2FtZXJhLCBQZXJzcGVjdGl2ZUNhbWVyYSwgTWF0NH0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQge0RFRkFVTFRfTElHSFRJTkcsIERFRkFVTFRfQkxFTkRJTkcsIERFRkFVTFRfQkFDS0dST1VORF9DT0xPUn1cbiAgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHt1cGRhdGVMYXllcnMsIGxheWVyc05lZWRSZWRyYXd9IGZyb20gJy4vbGF5ZXItbWFuYWdlcic7XG4vLyBUT0RPIG1vdmUgdGhpcyB0byByZWFjdC1tYXAtZ2wgdXRpbGl0eVxuaW1wb3J0IFZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuXG4vLyBUT0RPIC0gbW92ZSBkZWZhdWx0IHRvIFdlYkdMIHJlbmRlcmVyXG5jb25zdCBERUZBVUxUX1BJWEVMX1JBVElPID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA6IDE7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXllcnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBibGVuZGluZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2w6IFByb3BUeXBlcy5vYmplY3QsXG4gIGRlYnVnOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2FtZXJhOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihDYW1lcmEpLFxuICBwaXhlbFJhdGlvOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbldlYkdMSW5pdGlhbGl6ZWQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBibGVuZGluZzogREVGQVVMVF9CTEVORElORyxcbiAgY2FtZXJhOiBudWxsLFxuICBwaXhlbFJhdGlvOiBERUZBVUxUX1BJWEVMX1JBVElPLFxuICBnbDogbnVsbCxcbiAgZGVidWc6IGZhbHNlLFxuICBvbldlYkdMSW5pdGlhbGl6ZWQ6ICgpID0+IHt9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWNrR0xPdmVybGF5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgZ2V0IHByb3BUeXBlcygpIHtcbiAgICByZXR1cm4gUFJPUF9UWVBFUztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiBERUZBVUxUX1BST1BTO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMubmVlZHNSZWRyYXcgPSB0cnVlO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBjb25zdCB7Z2wsIHNjZW5lfSA9IHRoaXMuc3RhdGU7XG4gICAgdXBkYXRlTGF5ZXJzKHtcbiAgICAgIG9sZExheWVyczogdGhpcy5wcm9wcy5sYXllcnMsXG4gICAgICBuZXdMYXllcnM6IG5leHRQcm9wcy5sYXllcnMsXG4gICAgICBnbCxcbiAgICAgIHNjZW5lXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uUmVuZGVyZXJJbml0aWFsaXplZCh7Z2x9KSB7XG4gICAgdGhpcy5wcm9wcy5vbldlYkdMSW5pdGlhbGl6ZWQoZ2wpO1xuICAgIGNvbnN0IHNjZW5lID0gbmV3IFNjZW5lKGdsLCB7XG4gICAgICBsaWdodHM6IERFRkFVTFRfTElHSFRJTkcsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IERFRkFVTFRfQkFDS0dST1VORF9DT0xPUlxuICAgIH0pO1xuICAgIC8vIE5vdGU6IFRyaWdnZXJzIFJlYWN0IGNvbXBvbmVudCB1cGRhdGUsIHJlcmVuZGluZyB1cGRhdGVkIGxheWVyc1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZ2wsXG4gICAgICBzY2VuZVxuICAgIH0pO1xuICAgIC8vIE5vdGU6IHRocm93cyBvbiBlcnJvciwgZG9uJ3QgYWRqdXN0IHN0YXRlIGFmdGVyIHRoaXMgY2FsbFxuICAgIHVwZGF0ZUxheWVycyh7XG4gICAgICBvbGRMYXllcnM6IFtdLFxuICAgICAgbmV3TGF5ZXJzOiB0aGlzLnByb3BzLmxheWVycyxcbiAgICAgIGdsLFxuICAgICAgc2NlbmVcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJvdXRlIGV2ZW50cyB0byBsYXllcnNcbiAgQGF1dG9iaW5kIF9vbkNsaWNrKGluZm8pIHtcbiAgICBjb25zdCB7cGlja2VkfSA9IGluZm87XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHBpY2tlZCkge1xuICAgICAgaWYgKGl0ZW0ubW9kZWwudXNlckRhdGEubGF5ZXIub25DbGljayh7Y29sb3I6IGl0ZW0uY29sb3IsIC4uLmluZm99KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgICAvLyBSb3V0ZSBldmVudHMgdG8gbGF5ZXJzXG4gIEBhdXRvYmluZCBfb25Nb3VzZU1vdmUoaW5mbykge1xuICAgIGNvbnN0IHtwaWNrZWR9ID0gaW5mbztcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcGlja2VkKSB7XG4gICAgICBpZiAoaXRlbS5tb2RlbC51c2VyRGF0YS5sYXllci5vbkhvdmVyKHtjb2xvcjogaXRlbS5jb2xvciwgLi4uaW5mb30pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmQgX2NoZWNrSWZOZWVkUmVkcmF3KCkge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gbGF5ZXJzTmVlZFJlZHJhdyhsYXllcnMsIHtjbGVhclJlZHJhd0ZsYWdzOiB0cnVlfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsIGhlaWdodCwgbGF5ZXJzLCBibGVuZGluZywgcGl4ZWxSYXRpbyxcbiAgICAgIGxhdGl0dWRlLCBsb25naXR1ZGUsIHpvb20sIHBpdGNoLCBiZWFyaW5nLCBhbHRpdHVkZSxcbiAgICAgIGdsLCBkZWJ1ZyxcbiAgICAgIC4uLm90aGVyUHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQge2NhbWVyYX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtzY2VuZX0gPSB0aGlzLnN0YXRlO1xuXG4gICAgZnVuY3Rpb24gY29udmVydFRvTWF0NCh0b01hdHJpeCwgZnJvbU1hdHJpeCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcm9tTWF0cml4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHRvTWF0cml4W2ldID0gZnJvbU1hdHJpeFtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSBcImRpc3Bvc2FibGVcIiBjYW1lcmEgYW5kIG92ZXJ3cml0ZSBtYXRyaWNlc1xuICAgIGlmICghY2FtZXJhKSB7XG4gICAgICBjb25zdCB2aWV3cG9ydCA9IG5ldyBWaWV3cG9ydCh7XG4gICAgICAgIHdpZHRoLCBoZWlnaHQsIGxhdGl0dWRlLCBsb25naXR1ZGUsIHpvb20sIHBpdGNoLCBiZWFyaW5nLCBhbHRpdHVkZVxuICAgICAgfSk7XG5cbiAgICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgICAgY2FtZXJhLnZpZXcgPSBuZXcgTWF0NCgpLmlkKCk7XG4gICAgICBjb252ZXJ0VG9NYXQ0KGNhbWVyYS5wcm9qZWN0aW9uLCB2aWV3cG9ydC5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8V2ViR0xSZW5kZXJlclxuICAgICAgICB7IC4uLm90aGVyUHJvcHMgfVxuXG4gICAgICAgIHdpZHRoPXsgd2lkdGggfVxuICAgICAgICBoZWlnaHQ9eyBoZWlnaHQgfVxuXG4gICAgICAgIGdsPXsgZ2wgfVxuICAgICAgICBkZWJ1Zz17IGRlYnVnIH1cbiAgICAgICAgdmlld3BvcnQ9eyB7eDogMCwgeTogMCwgd2lkdGgsIGhlaWdodH0gfVxuICAgICAgICBjYW1lcmE9eyBjYW1lcmEgfVxuICAgICAgICBzY2VuZT17IHNjZW5lIH1cbiAgICAgICAgYmxlbmRpbmc9eyBibGVuZGluZyB9XG4gICAgICAgIHBpeGVsUmF0aW89eyBwaXhlbFJhdGlvIH1cblxuICAgICAgICBvblJlbmRlcmVySW5pdGlhbGl6ZWQ9eyB0aGlzLl9vblJlbmRlcmVySW5pdGlhbGl6ZWQgfVxuICAgICAgICBvbk5lZWRSZWRyYXc9eyB0aGlzLl9jaGVja0lmTmVlZFJlZHJhdyB9XG4gICAgICAgIG9uTW91c2VNb3ZlPXsgdGhpcy5fb25Nb3VzZU1vdmUgfVxuICAgICAgICBvbkNsaWNrPXsgdGhpcy5fb25DbGljayB9Lz5cbiAgICApO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uL3NyYy9kZWNrZ2wtb3ZlcmxheS5qc1xuICoqLyIsIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUsIG5vLXRyeS1jYXRjaCAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQge2NyZWF0ZUdMQ29udGV4dCwgQ2FtZXJhLCBTY2VuZSwgYWRkRXZlbnRzLCBGeCwgZ2xHZXR9IGZyb20gJ2x1bWEuZ2wnO1xuaW1wb3J0IHRocm90dGxlIGZyb20gJ2xvZGFzaC50aHJvdHRsZSc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuXG4gIHBpeGVsUmF0aW86IFByb3BUeXBlcy5udW1iZXIsXG4gIHZpZXdwb3J0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNhbWVyYTogUHJvcFR5cGVzLmluc3RhbmNlT2YoQ2FtZXJhKS5pc1JlcXVpcmVkLFxuICBzY2VuZTogUHJvcFR5cGVzLmluc3RhbmNlT2YoU2NlbmUpLFxuICBibGVuZGluZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgZXZlbnRzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBnbDogUHJvcFR5cGVzLm9iamVjdCxcbiAgZGVidWc6IFByb3BUeXBlcy5ib29sLFxuXG4gIG9uUmVuZGVyZXJJbml0aWFsaXplZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25Jbml0aWFsaXphdGlvbkZhaWxlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uRXJyb3I6IFByb3BUeXBlcy5mdW5jLFxuXG4gIG9uQmVmb3JlUmVuZGVyRnJhbWU6IFByb3BUeXBlcy5mdW5jLFxuICBvbkFmdGVyUmVuZGVyRnJhbWU6IFByb3BUeXBlcy5mdW5jLFxuICBvbkJlZm9yZVJlbmRlclBpY2tpbmdTY2VuZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQWZ0ZXJSZW5kZXJQaWNraW5nU2NlbmU6IFByb3BUeXBlcy5mdW5jLFxuXG4gIG9uTmVlZFJlZHJhdzogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTW91c2VNb3ZlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIGlkOiAnd2ViZ2wtY2FudmFzJyxcbiAgc2NlbmU6IG51bGwsXG5cbiAgZ2w6IG51bGwsXG4gIGRlYnVnOiBmYWxzZSxcblxuICBvblJlbmRlcmVySW5pdGlhbGl6ZWQ6ICgpID0+IHt9LFxuICBvbkluaXRpYWxpemF0aW9uRmFpbGVkOiBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSxcbiAgb25FcnJvcjogZXJyb3IgPT4ge1xuICAgIHRocm93IGVycm9yO1xuICB9LFxuICBvbkJlZm9yZVJlbmRlckZyYW1lOiAoKSA9PiB7fSxcbiAgb25BZnRlclJlbmRlckZyYW1lOiAoKSA9PiB7fSxcbiAgb25CZWZvcmVSZW5kZXJQaWNraW5nU2NlbmU6ICgpID0+IHt9LFxuICBvbkFmdGVyUmVuZGVyUGlja2luZ1NjZW5lOiAoKSA9PiB7fSxcblxuICBvbk5lZWRSZWRyYXc6ICgpID0+IHRydWUsXG4gIG9uTW91c2VNb3ZlOiAoKSA9PiB7fSxcbiAgb25DbGljazogKCkgPT4ge31cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYkdMUmVuZGVyZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBnZXQgcHJvcFR5cGVzKCkge1xuICAgIHJldHVybiBQUk9QX1RZUEVTO1xuICB9XG5cbiAgc3RhdGljIGdldCBkZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIERFRkFVTFRfUFJPUFM7XG4gIH1cblxuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBTbWFsbCByZWFjdCBjb21wb25lbnQgdGhhdCB1c2VzIEx1bWEuR0wgdG8gaW5pdGlhbGl6ZSBhIFdlYkdMIGNvbnRleHQuXG4gICAqXG4gICAqIFJldHVybnMgYSBjYW52YXMsIGNyZWF0ZXMgYSBiYXNpYyBXZWJHTCBjb250ZXh0LCBhIGNhbWVyYSBhbmQgYSBzY2VuZSxcbiAgICogc2V0cyB1cCBhIHJlbmRlcmxvb3AsIGFuZCByZWdpc3RlcnMgc29tZSBiYXNpYyBldmVudCBoYW5kbGVyc1xuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIC0gc2VlIHByb3BUeXBlcyBkb2N1bWVudGF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZ2w6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5yZWZzLm92ZXJsYXk7XG4gICAgdGhpcy5faW5pdFdlYkdMKGNhbnZhcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBMdW1hR0wgbGlicmFyeSBhbmQgdGhyb3VnaCBpdCBXZWJHTFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FudmFzXG4gICAqL1xuICBfaW5pdFdlYkdMKGNhbnZhcykge1xuICAgIGNvbnN0IHtkZWJ1Z30gPSB0aGlzLnByb3BzO1xuICAgIGxldCB7Z2x9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoIWdsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBnbCA9IGNyZWF0ZUdMQ29udGV4dCh7XG4gICAgICAgICAgY2FudmFzLFxuICAgICAgICAgIGRlYnVnLFxuICAgICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25Jbml0aWFsaXphdGlvbkZhaWxlZChlcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBldmVudHMgPSBhZGRFdmVudHMoY2FudmFzLCB7XG4gICAgICBjYWNoZVNpemU6IGZhbHNlLFxuICAgICAgY2FjaGVQb3NpdGlvbjogZmFsc2UsXG4gICAgICBjZW50ZXJPcmlnaW46IGZhbHNlLFxuICAgICAgb25DbGljazogdGhpcy5fb25DbGljayxcbiAgICAgIG9uTW91c2VNb3ZlOiB0aHJvdHRsZSh0aGlzLl9vbk1vdXNlTW92ZSwgMTAwKVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7Z2wsIGV2ZW50c30pO1xuXG4gICAgdGhpcy5fYW5pbWF0aW9uTG9vcCgpO1xuXG4gICAgLy8gQ2FsbCBjYWxsYmFjayBsYXN0LCBpbiBjYXNlIGl0IHRocm93c1xuICAgIHRoaXMucHJvcHMub25SZW5kZXJlckluaXRpYWxpemVkKHtnbH0pO1xuICB9XG5cbiAgLy8gVE9ETyAtIG1vdmUgdGhpcyBiYWNrIHRvIGx1bWEuZ2wvc2NlbmUuanNcbiAgLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbiAgX3BpY2soeCwgeSkge1xuICAgIGNvbnN0IHtnbH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHtjYW1lcmEsIHNjZW5lLCBwaXhlbFJhdGlvfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBwaWNrZWRNb2RlbHMgPSBzY2VuZS5waWNrTW9kZWxzKGdsLCB7XG4gICAgICBjYW1lcmEsXG4gICAgICB4OiB4ICogcGl4ZWxSYXRpbyxcbiAgICAgIHk6IHkgKiBwaXhlbFJhdGlvXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcGlja2VkTW9kZWxzO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbkNsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgcGlja2VkID0gdGhpcy5fcGljayhldmVudC54LCBldmVudC55KTtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soey4uLmV2ZW50LCBwaWNrZWR9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBjb25zdCBwaWNrZWQgPSB0aGlzLl9waWNrKGV2ZW50LngsIGV2ZW50LnkpO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZU1vdmUoey4uLmV2ZW50LCBwaWNrZWR9KTtcbiAgfVxuXG4gIF9yZW5kZXJGcmFtZSgpIHtcbiAgICBjb25zdCB7XG4gICAgICB2aWV3cG9ydDoge3gsIHksIHdpZHRoLCBoZWlnaHR9LFxuICAgICAgYmxlbmRpbmc6IHtlbmFibGUsIGJsZW5kRnVuYywgYmxlbmRFcXVhdGlvbn0sXG4gICAgICBwaXhlbFJhdGlvLFxuICAgICAgY2FtZXJhLFxuICAgICAgc2NlbmVcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHtnbH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICghZ2wgfHwgIXNjZW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90ZTogRG8gdGhpcyBhZnRlciBnbCBjaGVjaywgaW4gY2FzZSBvbk5lZWRSZWRyYXcgY2xlYXJzIGZsYWdzXG4gICAgaWYgKCF0aGlzLnByb3BzLm9uTmVlZFJlZHJhdygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2xlYXIgZGVwdGggYW5kIGNvbG9yIGJ1ZmZlcnNcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyB1cGRhdGUgdmlld3BvcnQgdG8gbGF0ZXN0IHByb3BzXG4gICAgLy8gKHR5cGljYWxseSBjaGFuZ2VkIGJ5IGFwcCBvbiBicm93c2VyIHJlc2l6ZSBldGMpXG4gICAgZ2wudmlld3BvcnQoXG4gICAgICB4ICogcGl4ZWxSYXRpbyxcbiAgICAgIHkgKiBwaXhlbFJhdGlvLFxuICAgICAgd2lkdGggKiBwaXhlbFJhdGlvLFxuICAgICAgaGVpZ2h0ICogcGl4ZWxSYXRpb1xuICAgICk7XG5cbiAgICAvLyBzZXR1cCBibGVkbmluZ1xuICAgIGlmIChlbmFibGUpIHtcbiAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICBnbC5ibGVuZEZ1bmMoLi4uYmxlbmRGdW5jLm1hcChzID0+IGdsR2V0KGdsLCBzKSkpO1xuICAgICAgZ2wuYmxlbmRFcXVhdGlvbihnbEdldChnbCwgYmxlbmRFcXVhdGlvbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbC5kaXNhYmxlKGdsLkJMRU5EKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLm9uQmVmb3JlUmVuZGVyRnJhbWUoKTtcbiAgICBzY2VuZS5yZW5kZXIoe2NhbWVyYX0pO1xuICAgIHRoaXMucHJvcHMub25BZnRlclJlbmRlckZyYW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFpbiBXZWJHTCBhbmltYXRpb24gbG9vcFxuICAgKi9cbiAgQGF1dG9iaW5kXG4gIF9hbmltYXRpb25Mb29wKCkge1xuICAgIHRoaXMuX3JlbmRlckZyYW1lKCk7XG4gICAgLy8gS2VlcCByZWdpc3RlcmluZyBvdXJzZWx2ZXMgZm9yIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxuICAgIEZ4LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9hbmltYXRpb25Mb29wKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7aWQsIHdpZHRoLCBoZWlnaHQsIHBpeGVsUmF0aW99ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGNhbnZhc1xuICAgICAgICByZWY9eyAnb3ZlcmxheScgfVxuICAgICAgICBpZD17IGlkIH1cbiAgICAgICAgd2lkdGg9eyB3aWR0aCAqIHBpeGVsUmF0aW8gfHwgMSB9XG4gICAgICAgIGhlaWdodD17IGhlaWdodCAqIHBpeGVsUmF0aW8gfHwgMSB9XG4gICAgICAgIHN0eWxlPXsge3dpZHRoLCBoZWlnaHR9IH0vPlxuICAgICk7XG4gIH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vc3JjL3dlYmdsLXJlbmRlcmVyLmpzXG4gKiovIiwiLyogKGlnbm9yZWQpICovXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiB1dGlsIChpZ25vcmVkKVxuICoqIG1vZHVsZSBpZCA9IDg1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyogKGlnbm9yZWQpICovXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiB1dGlsIChpZ25vcmVkKVxuICoqIG1vZHVsZSBpZCA9IDg5NVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE2IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTElHSFRJTkcgPSB7XG4gIGVuYWJsZTogdHJ1ZSxcbiAgYW1iaWVudDoge3I6IDEuMCwgZzogMS4wLCBiOiAxLjB9LFxuICBwb2ludHM6IFt7XG4gICAgZGlmZnVzZToge3I6IDAuOCwgZzogMC44LCBiOiAwLjh9LFxuICAgIHNwZWN1bGFyOiB7cjogMC42LCBnOiAwLjYsIGI6IDAuNn0sXG4gICAgcG9zaXRpb246IFswLjUsIDAuNSwgM11cbiAgfV1cbn07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0JBQ0tHUk9VTkRfQ09MT1IgPSB7cjogMCwgZzogMCwgYjogMCwgYTogMH07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0JMRU5ESU5HID0ge1xuICBlbmFibGU6IHRydWUsXG4gIGJsZW5kRnVuYzogWydTUkNfQUxQSEEnLCAnT05FX01JTlVTX1NSQ19BTFBIQSddLFxuICBibGVuZEVxdWF0aW9uOiAnRlVOQ19BREQnXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vc3JjL2NvbmZpZy5qc1xuICoqLyIsIlxuLy8gSU1MRU1FTlRBVElPTiBOT1RFUzogV2h5IG5ldyBsYXllcnMgYXJlIGNyZWF0ZWQgb24gZXZlcnkgcmVuZGVyXG4vL1xuLy8gVGhlIGtleSBoZXJlIGlzIHRvIHVuZGVyc3RhbmQgdGhlIGRlY2xhcmF0aXZlIC8gZnVuY3Rpb25hbFxuLy8gcHJvZ3JhbW1pbmcgbmF0dXJlIG9mIFJlYWN0LlxuLy9cbi8vIC0gSW4gUmVhY3QsIHRoZSBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlbnRpcmUgXCJVSSB0cmVlXCIgaXMgcmUtcmVuZGVyZWRcbi8vICAgZXZlcnkgdGltZSBzb21ldGhpbmcgY2hhbmdlcy5cbi8vIC0gUmVhY3QgdGhlbiBkaWZmcyB0aGUgcmVuZGVyZWQgdHJlZSBvZiBcIlJlYWN0RWxlbWVudHNcIiBhZ2FpbnN0IHRoZVxuLy8gcHJldmlvdXMgdHJlZSBhbmQgbWFrZXMgb3B0aW1pemVkIGNoYW5nZXMgdG8gdGhlIERPTS5cbi8vXG4vLyAtIER1ZSB0aGUgZGlmZmljdWx0eSBvZiBtYWtpbmcgbm9uLURPTSBlbGVtZW50cyBpbiBSZWFjdCAxNCwgb3VyIExheWVyc1xuLy8gYXJlIGEgXCJwc2V1ZG8tcmVhY3RcIiBjb25zdHJ1Y3QuIFNvLCB0aGUgcmVuZGVyIGZ1bmN0aW9uIHdpbGwgaW5kZWVkIGNyZWF0ZVxuLy8gbmV3IGxheWVycyBldmVyeSByZW5kZXIgY2FsbCwgaG93ZXZlciB0aGUgbmV3IGxheWVycyBhcmUgaW1tZWRpYXRlbHlcbi8vIG1hdGNoZWQgYWdhaW5zdCBleGlzdGluZyBsYXllcnMgdXNpbmcgbGF5ZXIgaW5kZXgvbGF5ZXIgaWQuXG4vLyBBIG5ldyBsYXllcnMgb25seSBoYXMgYSBwcm9wcyBmaWVsZCBwb2ludGluZyB0byB0aGUgdW5tb2RpZmllZCBwcm9wc1xuLy8gb2JqZWN0IHN1cHBsaWVkIGJ5IHRoZSBhcHAgb24gY3JlYXRpb24uXG4vLyBBbGwgY2FsY3VsYXRlZCBzdGF0ZSAocHJvZ3JhbXMsIGF0dHJpYnV0ZXMgZXRjKSBhcmUgc3RvcmVkIGluIGEgc3RhdGUgb2JqZWN0XG4vLyBhbmQgdGhpcyBzdGF0ZSBvYmplY3QgaXMgbW92ZWQgZm9yd2FyZCB0byB0aGUgbmV3IGxheWVyIGV2ZXJ5IHJlbmRlci5cbi8vIFRoZSBuZXcgbGF5ZXIgZW5kcyB1cCB3aXRoIHRoZSBzdGF0ZSBvZiB0aGUgb2xkIGxheWVyIGJ1dCB0aGUgcHJvcHMgb2Zcbi8vIHRoZSBuZXcgbGF5ZXIsIHdoaWxlIHRoZSBvbGQgbGF5ZXIgaXMgZGlzY2FyZGVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby10cnktY2F0Y2ggKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5pbXBvcnQgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUxheWVycyh7b2xkTGF5ZXJzLCBuZXdMYXllcnMsIGdsLCBzY2VuZX0pIHtcbiAgLy8gTWF0Y2ggYWxsIGxheWVycywgY2hlY2tpbmcgZm9yIGNhdWdodCBlcnJvcnNcbiAgY29uc3QgZXJyb3IxID0gbWF0Y2hMYXllcnMob2xkTGF5ZXJzLCBuZXdMYXllcnMpO1xuICBjb25zdCBlcnJvcjIgPSBmaW5hbGl6ZU9sZExheWVycyhvbGRMYXllcnMpO1xuICBjb25zdCBlcnJvcjMgPSB1cGRhdGVNYXRjaGVkTGF5ZXJzKG5ld0xheWVycylcbiAgY29uc3QgZXJyb3I0ID0gaW5pdGlhbGl6ZU5ld0xheWVycyhuZXdMYXllcnMsIHtnbH0pO1xuICBhZGRMYXllcnNUb1NjZW5lKG5ld0xheWVycywgc2NlbmUpO1xuICAvLyBUaHJvdyBmaXJzdCBlcnJvciBmb3VuZCwgaWYgYW55XG4gIGNvbnN0IGVycm9yID0gZXJyb3IxIHx8IGVycm9yMiB8fCBlcnJvcjMgfHwgZXJyb3I0O1xuICBpZiAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJzTmVlZFJlZHJhdyhsYXllcnMsIHtjbGVhclJlZHJhd0ZsYWdzID0gZmFsc2V9ID0ge30pIHtcbiAgbGV0IHJlZHJhdyA9IGZhbHNlO1xuICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycykge1xuICAgIHJlZHJhdyA9IHJlZHJhdyB8fCBsYXllci5nZXROZWVkc1JlZHJhdyh7Y2xlYXJSZWRyYXdGbGFnc30pO1xuICB9XG4gIHJldHVybiByZWRyYXc7XG59XG5cbmZ1bmN0aW9uIGxheWVyTmFtZShsYXllcikge1xuICByZXR1cm4gbGF5ZXIgP1xuICAgIGAke2xheWVyLmNvbnN0cnVjdG9yLm5hbWV9e2lkOicke2xheWVyLnByb3BzLmlkfSd9YCA6XG4gICAgJ251bGwgbGF5ZXInO1xufVxuXG5mdW5jdGlvbiBtYXRjaExheWVycyhvbGRMYXllcnMsIG5ld0xheWVycykge1xuICBsZXQgZXJyb3IgPSBudWxsO1xuICBmb3IgKGNvbnN0IG5ld0xheWVyIG9mIG5ld0xheWVycykge1xuICAgIHRyeSB7XG4gICAgICAvLyAxLiBnaXZlbiBhIG5ldyBjb21pbmcgbGF5ZXIsIGZpbmQgaXRzIG1hdGNoaW5nIGxheWVyXG4gICAgICBjb25zdCBvbGRMYXllciA9IF9maW5kTWF0Y2hpbmdMYXllcihvbGRMYXllcnMsIG5ld0xheWVyKTtcblxuICAgICAgLy8gT25seSB0cmFuc2ZlciBzdGF0ZSBhdCB0aGlzIHN0YWdlLiBXZSBtdXN0IG5vdCBnZW5lcmF0ZSBleGNlcHRpb25zXG4gICAgICAvLyB1bnRpbCBhbGwgbGF5ZXJzJyBzdGF0ZSBoYXZlIGJlZW4gdHJhbnNmZXJyZWRcbiAgICAgIGlmIChvbGRMYXllcikge1xuICAgICAgICBsb2coMywgYG1hdGNoZWQgJHtsYXllck5hbWUobmV3TGF5ZXIpfWAsIG9sZExheWVyLCAnPT4nLCBuZXdMYXllcik7XG5cbiAgICAgICAgX3RyYW5zZmVyTGF5ZXJTdGF0ZShvbGRMYXllciwgbmV3TGF5ZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgYGRlY2suZ2wgZXJyb3IgZHVyaW5nIG1hdGNoaW5nIG9mICR7bGF5ZXJOYW1lKG5ld0xheWVyKX1gLCBlcnIpO1xuICAgICAgLy8gU2F2ZSBmaXJzdCBlcnJvclxuICAgICAgZXJyb3IgPSBlcnJvciB8fCBlcnI7XG4gICAgfVxuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gX2ZpbmRNYXRjaGluZ0xheWVyKG9sZExheWVycywgbmV3TGF5ZXIpIHtcbiAgY29uc3QgY2FuZGlkYXRlcyA9IG9sZExheWVycy5maWx0ZXIobCA9PiBsLnByb3BzLmlkID09PSBuZXdMYXllci5wcm9wcy5pZCk7XG4gIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA+IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgZGVjay5nbCBlcnJvciBsYXllciBoYXMgbW9yZSB0aGFuIG9uZSBtYXRjaCAke2xheWVyTmFtZShuZXdMYXllcil9YCk7XG4gIH1cbiAgcmV0dXJuIGNhbmRpZGF0ZXMubGVuZ3RoID4gMCAmJiBjYW5kaWRhdGVzWzBdO1xufVxuXG5mdW5jdGlvbiBfdHJhbnNmZXJMYXllclN0YXRlKG9sZExheWVyLCBuZXdMYXllcikge1xuICBjb25zdCB7c3RhdGUsIHByb3BzfSA9IG9sZExheWVyO1xuICBhc3NlcnQoc3RhdGUsICdNYXRjaGluZyBsYXllciBoYXMgbm8gc3RhdGUnKTtcbiAgYXNzZXJ0KG9sZExheWVyICE9PSBuZXdMYXllciwgJ01hdGNoaW5nIGxheWVyIGlzIHNhbWUnKTtcbiAgLy8gTW92ZSBzdGF0ZVxuICBuZXdMYXllci5zdGF0ZSA9IHN0YXRlO1xuICBzdGF0ZS5sYXllciA9IG5ld0xheWVyO1xuICAvLyBVcGRhdGUgbW9kZWwgbGF5ZXIgcmVmZXJlbmNlXG4gIGlmIChzdGF0ZS5tb2RlbCkge1xuICAgIHN0YXRlLm1vZGVsLnVzZXJEYXRhLmxheWVyID0gbmV3TGF5ZXI7XG4gIH1cbiAgLy8gS2VlcCBhIHRlbXBvcmFyeSByZWYgdG8gdGhlIG9sZCBwcm9wcywgZm9yIHByb3AgY29tcGFyaXNvblxuICBuZXdMYXllci5vbGRQcm9wcyA9IHByb3BzO1xuICBvbGRMYXllci5zdGF0ZSA9IG51bGw7XG59XG5cblxuLy8gTm90ZTogTGF5ZXJzIGNhbid0IGJlIGluaXRpYWxpemVkIHVudGlsIGdsIGNvbnRleHQgaXMgYXZhaWxhYmxlXG4vLyBUaGVyZWZvcmUgdGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCByZXBlYXRlZGx5XG4vLyBUaGlzIGlzIGEgaGFjayBhbmQgc2hvdWxkIGJlIGNsZWFuZWQgdXAgaW4gY2FsbGluZyBjb2RlXG5mdW5jdGlvbiBpbml0aWFsaXplTmV3TGF5ZXJzKGxheWVycywge2dsfSkge1xuICBpZiAoIWdsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZXJyb3IgPSBudWxsO1xuICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycykge1xuICAgIC8vIENoZWNrIGlmIG5ldyBsYXllciwgYW5kIGluaXRpYWxpemUgaXQncyBzdGF0ZVxuICAgIGlmICghbGF5ZXIuc3RhdGUpIHtcbiAgICAgIGxvZygxLCBgaW5pdGlhbGl6aW5nICR7bGF5ZXJOYW1lKGxheWVyKX1gKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxheWVyLmluaXRpYWxpemVMYXllcih7Z2x9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGBkZWNrLmdsIGVycm9yIGR1cmluZyBpbml0aWFsaXphdGlvbiBvZiAke2xheWVyTmFtZShsYXllcil9YCwgZXJyKTtcbiAgICAgICAgLy8gU2F2ZSBmaXJzdCBlcnJvclxuICAgICAgICBlcnJvciA9IGVycm9yIHx8IGVycjtcbiAgICAgIH1cbiAgICAgIC8vIFNldCBiYWNrIHBvaW50ZXIgKHVzZWQgaW4gcGlja2luZylcbiAgICAgIGlmIChsYXllci5zdGF0ZSkge1xuICAgICAgICBsYXllci5zdGF0ZS5sYXllciA9IGxheWVyO1xuICAgICAgICAvLyBTYXZlIGxheWVyIG9uIG1vZGVsIGZvciBwaWNraW5nIHB1cnBvc2VzXG4gICAgICAgIC8vIFRPRE8gLSBzdG9yZSBvbiBtb2RlbC51c2VyRGF0YSByYXRoZXIgdGhhbiBkaXJlY3RseSBvbiBtb2RlbFxuICAgICAgfVxuICAgICAgaWYgKGxheWVyLnN0YXRlICYmIGxheWVyLnN0YXRlLm1vZGVsKSB7XG4gICAgICAgIGxheWVyLnN0YXRlLm1vZGVsLnVzZXJEYXRhLmxheWVyID0gbGF5ZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuLy8gVXBkYXRlIHRoZSBtYXRjaGVkIGxheWVyc1xuZnVuY3Rpb24gdXBkYXRlTWF0Y2hlZExheWVycyhuZXdMYXllcnMpIHtcbiAgbGV0IGVycm9yID0gbnVsbDtcbiAgZm9yIChjb25zdCBsYXllciBvZiBuZXdMYXllcnMpIHtcbiAgICBjb25zdCB7b2xkUHJvcHMsIHByb3BzfSA9IGxheWVyO1xuICAgIGlmIChvbGRQcm9wcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGF5ZXIudXBkYXRlTGF5ZXIob2xkUHJvcHMsIHByb3BzKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGBkZWNrLmdsIGVycm9yIGR1cmluZyB1cGRhdGUgb2YgJHtsYXllck5hbWUobGF5ZXIpfWAsIGVycik7XG4gICAgICAgIC8vIFNhdmUgZmlyc3QgZXJyb3JcbiAgICAgICAgZXJyb3IgPSBlcnJvciB8fCBlcnI7XG4gICAgICB9XG4gICAgICBsb2coMiwgYHVwZGF0aW5nICR7bGF5ZXJOYW1lKGxheWVyKX1gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG4vLyBVcGRhdGUgdGhlIG9sZCBsYXllcnMgdGhhdCB3ZXJlIG1hdGNoZWRcbmZ1bmN0aW9uIGZpbmFsaXplT2xkTGF5ZXJzKG9sZExheWVycykge1xuICBsZXQgZXJyb3IgPSBudWxsO1xuICAvLyBVbm1hdGNoZWQgbGF5ZXJzIHN0aWxsIGhhdmUgc3RhdGUsIGl0IHdpbGwgYmUgZGlzY2FyZGVkXG4gIGZvciAoY29uc3QgbGF5ZXIgb2Ygb2xkTGF5ZXJzKSB7XG4gICAgY29uc3Qge3N0YXRlfSA9IGxheWVyO1xuICAgIGlmIChzdGF0ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGF5ZXIuZmluYWxpemVMYXllcigpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYGRlY2suZ2wgZXJyb3IgZHVyaW5nIGZpbmFsaXphdGlvbiBvZiAke2xheWVyTmFtZShsYXllcil9YCwgZXJyKTtcbiAgICAgICAgLy8gU2F2ZSBmaXJzdCBlcnJvclxuICAgICAgICBlcnJvciA9IGVycm9yIHx8IGVycjtcbiAgICAgIH1cbiAgICAgIGxheWVyLnN0YXRlID0gbnVsbDtcbiAgICAgIGxvZygxLCBgZmluYWxpemluZyAke2xheWVyTmFtZShsYXllcil9YCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gYWRkTGF5ZXJzVG9TY2VuZShsYXllcnMsIHNjZW5lKSB7XG4gIGlmICghc2NlbmUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY2xlYXIgc2NlbmUgYW5kIHJlcG9wdWxhdGUgYmFzZWQgb24gbmV3IGxheWVyc1xuICBzY2VuZS5yZW1vdmVBbGwoKTtcbiAgZm9yIChjb25zdCBsYXllciBvZiBsYXllcnMpIHtcbiAgICAvLyBBZGQgbW9kZWwgdG8gc2NlbmVcbiAgICBpZiAobGF5ZXIuc3RhdGUubW9kZWwpIHtcbiAgICAgIHNjZW5lLmFkZChsYXllci5zdGF0ZS5tb2RlbCk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuLi9zcmMvbGF5ZXItbWFuYWdlci5qc1xuICoqLyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8qIGdsb2JhbCBjb25zb2xlLCB3aW5kb3cgKi9cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9nKHByaW9yaXR5LCAuLi5hcmdzKSB7XG4gIGFzc2VydCh0eXBlb2YgcHJpb3JpdHkgPT09ICdudW1iZXInKTtcbiAgaWYgKHByaW9yaXR5IDw9IGxvZy5wcmlvcml0eSkge1xuICAgIGNvbnNvbGUuZGVidWcoLi4uYXJncyk7XG4gIH1cbn1cblxubG9nLnByaW9yaXR5ID0gMDtcblxuLy8gRXhwb3NlIHRvIGJyb3dzZXJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cubG9nID0gbG9nO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vc3JjL2xvZy5qc1xuICoqLyIsImV4cG9ydCB7ZGVmYXVsdCBhcyBkZWZhdWx0fSBmcm9tICcuL3ZpZXdwb3J0JztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBWaWV3cG9ydH0gZnJvbSAnLi92aWV3cG9ydCc7XG5leHBvcnQge2RlZmF1bHQgYXMgTWFwYm94VHJhbnNmb3JtfSBmcm9tICcuL21hcGJveC10cmFuc2Zvcm0nO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vLi4vc3JjL3ZpZXdwb3J0L2luZGV4LmpzXG4gKiovIiwiLy8gVmlldyBhbmQgUHJvamVjdGlvbiBNYXRyaXggY2FsY3VsYXRpb25zIGZvciBtYXBib3gtanMgc3R5bGVcbi8vIG1hcCB2aWV3IHByb3BlcnRpZXNcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuLy8gQVRUUklCVVRJT046IE1hdHJpeCBjcmVhdGlvbiBhbGdvcyBhcmUgYmFzZWQgb24gbWFwYm94LWdsLWpzIHNvdXJjZSBjb2RlXG4vLyBUaGlzIGlzIGludGVudGlvbmFsbHkgY2xvc2VseSBtYXBwZWQgdG8gbWFwYm94LWdsLWpzIGltcGxlbWVudGF0aW9uIHRvXG4vLyBlbnN1cmUgc2VhbWxlc3MgaW50ZXJvcGVyYXRpb24gd2l0aCByZWFjdC1tYXAtZ2xcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2Jsb2IvMDMzMDQzMjU0ZDMwYTk5YTAwYjk1NjYwZTI5NjQ0NWExYWRlMmQwMS9qcy9nZW8vdHJhbnNmb3JtLmpzXG4vKiBlbHNpbnQtZW5hYmxlICovXG5cbi8vIFdlIGRlZmluZSBhIGNvdXBsZSBvZiBjb29yZGluYXRlIHN5c3RlbXM6XG4vLyAtLS0tLS1cbi8vIExhdExvbiAgICAgICAgICAgICBbbG5nLCBsYXRdID0gWy0xODAgLSAxODAsIC04MSAtIDgxXVxuLy8gV29ybGQgKHpvb20gMCkgICAgIFt4LCB5XSA9IFswLTUxMiwgeTogMC01MTJdXG4vLyBab29tZWQgKHpvb20gTikgICAgW3gsIHldID0gWzAgLSA1MTIqMioqTiwgMCAtIDUxMioyKipOXVxuLy8gVHJhbnNsYXRlZCAgICAgICAgIFt4LCB5XSA9IHplcm8gY2VudGVyZWRcbi8vIFZpZXcgKENhbWVyYSkgICAgICB1bml0IGN1YmUgYXJvdW5kIHZpZXdcbi8vIC0tLS0tLVxuXG5pbXBvcnQge21hdDIsIG1hdDQsIHZlYzR9IGZyb20gJ2dsLW1hdHJpeCc7XG5cbmNvbnN0IFBJID0gTWF0aC5QSTtcbmNvbnN0IFBJXzIgPSBQSSAvIDI7XG5jb25zdCBQSV80ID0gUEkgLyA0O1xuY29uc3QgREVHUkVFU19UT19SQURJQU5TID0gUEkgLyAxODA7XG5jb25zdCBSQURJQU5TX1RPX0RFR1JFRVMgPSAxODAgLyBQSTtcbmNvbnN0IFRJTEVfU0laRSA9IDUxMjtcbmNvbnN0IFdPUkxEX1NDQUxFID0gVElMRV9TSVpFIC8gUElfMjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld3BvcnQge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgLy8gTWFwIHN0YXRlXG4gICAgd2lkdGggPSAwLFxuICAgIGhlaWdodCA9IDAsXG4gICAgbGF0aXR1ZGUgPSAwLFxuICAgIGxvbmdpdHVkZSA9IDAsXG4gICAgem9vbSA9IDAsXG4gICAgcGl0Y2ggPSAwLFxuICAgIGJlYXJpbmcgPSAwLFxuICAgIGFsdGl0dWRlID0gMS41XG4gIH0pIHtcbiAgICAvLyBWaWV3cG9ydFxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnpvb20gPSB6b29tO1xuICAgIHRoaXMubGF0aXR1ZGUgPSBsYXRpdHVkZTtcbiAgICB0aGlzLmxvbmdpdHVkZSA9IGxvbmdpdHVkZTtcbiAgICB0aGlzLmJlYXJpbmcgPSBiZWFyaW5nO1xuXG4gICAgLy8gU2NhbGVcbiAgICB0aGlzLnNjYWxlID0gTWF0aC5wb3coMiwgem9vbSk7XG4gICAgdGhpcy53b3JsZFNpemUgPSBUSUxFX1NJWkUgKiB0aGlzLnNjYWxlO1xuICAgIHRoaXMudGlsZVpvb20gPSBNYXRoLmZsb29yKHpvb20pO1xuICAgIHRoaXMuem9vbUZyYWN0aW9uID0gem9vbSAtIE1hdGguZmxvb3Ioem9vbSk7XG5cbiAgICAvLyBCZWFyaW5nXG4gICAgdGhpcy5iZWFyaW5nUmFkaWFucyA9IGJlYXJpbmcgLyAxODAgKiBNYXRoLlBJO1xuICAgIHRoaXMuYmVhcmluZ1JvdGF0aW9uTWF0cml4ID0gbWF0Mi5jcmVhdGUoKTtcbiAgICBtYXQyLnJvdGF0ZShcbiAgICAgIHRoaXMuYmVhcmluZ1JvdGF0aW9uTWF0cml4LCB0aGlzLmJlYXJpbmdSb3RhdGlvbk1hdHJpeCwgdGhpcy5iZWFyaW5nXG4gICAgKTtcblxuICAgIC8vIFBpdGNoXG4gICAgdGhpcy5vcmlnaW5hbFBpdGNoID0gcGl0Y2g7XG4gICAgdGhpcy5waXRjaCA9IE1hdGgubWluKDYwLCBwaXRjaCk7XG4gICAgdGhpcy5waXRjaFJhZGlhbnMgPSBNYXRoLm1pbig2MCwgcGl0Y2gpIC8gMTgwICogTWF0aC5QSTtcblxuICAgIC8vIEFsdGl0dWRlXG4gICAgdGhpcy5vcmlnaW5hbEFsdGl0dWRlID0gYWx0aXR1ZGU7XG4gICAgdGhpcy5hbHRpdHVkZSA9IE1hdGgubWF4KDAuNzUsIGFsdGl0dWRlKTtcblxuICAgIC8vIENlbnRlciB4LCB5XG4gICAgY29uc3QgeSA9IDE4MCAvIE1hdGguUEkgKlxuICAgICAgTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBsYXRpdHVkZSAqIE1hdGguUEkgLyAzNjApKTtcblxuICAgIHRoaXMuY2VudGVyWDAgPSAoMTgwICsgbG9uZ2l0dWRlKSAvIDM2MCAqIFRJTEVfU0laRTtcbiAgICB0aGlzLmNlbnRlclkwID0gKDE4MCAtIHkpIC8gMzYwICogVElMRV9TSVpFO1xuICAgIHRoaXMuY2VudGVyWCA9IHRoaXMuY2VudGVyWDAgKiB0aGlzLnNjYWxlO1xuICAgIHRoaXMuY2VudGVyWSA9IHRoaXMuY2VudGVyWTAgKiB0aGlzLnNjYWxlO1xuXG4gICAgLy8gRmluZCB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIHBvaW50IHRvIHRoZSBjZW50ZXIgdG9wXG4gICAgLy8gaW4gYWx0aXR1ZGUgdW5pdHMgdXNpbmcgbGF3IG9mIHNpbmVzLlxuICAgIHRoaXMuaGFsZkZvdiA9IE1hdGguYXRhbigwLjUgLyB0aGlzLmFsdGl0dWRlKTtcbiAgICB0aGlzLnRvcEhhbGZTdXJmYWNlRGlzdGFuY2UgPVxuICAgICAgTWF0aC5zaW4odGhpcy5oYWxmRm92KSAqIHRoaXMuYWx0aXR1ZGUgL1xuICAgICAgTWF0aC5zaW4oTWF0aC5QSSAvIDIgLSB0aGlzLnBpdGNoUmFkaWFucyAtIHRoaXMuaGFsZkZvdik7XG5cbiAgICAvLyBDYWxjdWxhdGUgeiB2YWx1ZSBvZiB0aGUgZmFydGhlc3QgZnJhZ21lbnQgdGhhdCBzaG91bGQgYmUgcmVuZGVyZWQuXG4gICAgdGhpcy5mYXJaID0gTWF0aC5jb3MoTWF0aC5QSSAvIDIgLSB0aGlzLnBpdGNoUmFkaWFucykgKlxuICAgICAgdGhpcy50b3BIYWxmU3VyZmFjZURpc3RhbmNlICsgdGhpcy5hbHRpdHVkZTtcblxuICAgIHRoaXMuX3ByZWNvbXB1dGVNYXRyaWNlcygpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cblxuICBwcm9qZWN0KGxuZ0xhdFopIHtcbiAgICBjb25zdCBbeCwgeV0gPSB0aGlzLnByb2plY3Rab29tMChsbmdMYXRaKTtcbiAgICBjb25zdCB2ID0gdmVjNC5mcm9tVmFsdWVzKHgsIHksIGxuZ0xhdFpbMl0gfHwgMCwgMSk7XG4gICAgdmVjNC50cmFuc2Zvcm1NYXQ0KHYsIHYsIHRoaXMudmlld01hdHJpeCk7XG4gICAgdmVjNC50cmFuc2Zvcm1NYXQ0KHYsIHYsIHRoaXMucHJvamVjdGlvbk1hdHJpeCk7XG4gICAgLy8gdmVjNC50cmFuc2Zvcm1NYXQ0KHYsIHYsIHRoaXMudmlld3BvcnRNYXRyaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2plY3QgW2xuZyxsYXRdIG9uIHNwaGVyZSBvbnRvIFt4LHldIG9uIDUxMio1MTIgTWVyY2F0b3IgWm9vbSAwIHRpbGUuXG4gICAqIFBlcmZvcm1zIHRoZSBub25saW5lYXIgcGFydCBvZiB0aGUgd2ViIG1lcmNhdG9yIHByb2plY3Rpb24uXG4gICAqIFJlbWFpbmluZyBwcm9qZWN0aW9uIGlzIGRvbmUgd2l0aCA0eDQgbWF0cmljZXMgd2hpY2ggYWxzbyBoYW5kbGVzXG4gICAqIHBlcnNwZWN0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBsbmdMYXQgLSBbbG5nLCBsYXRdIGNvb3JkaW5hdGVzXG4gICAqICAgU3BlY2lmaWVzIGEgcG9pbnQgb24gdGhlIHNwaGVyZSB0byBwcm9qZWN0IG9udG8gdGhlIG1hcC5cbiAgICogQHJldHVybiB7QXJyYXl9IFt4LHldIGNvb3JkaW5hdGVzLlxuICAgKi9cbiAgcHJvamVjdFpvb20wKFtsbmcsIGxhdF0pIHtcbiAgICBjb25zdCBsYW1iZGEyID0gbG5nICogREVHUkVFU19UT19SQURJQU5TO1xuICAgIGNvbnN0IHBoaTIgPSBsYXQgKiBERUdSRUVTX1RPX1JBRElBTlM7XG4gICAgY29uc3QgeCA9IFdPUkxEX1NDQUxFICogKGxhbWJkYTIgKyBQSSk7XG4gICAgY29uc3QgeSA9IFdPUkxEX1NDQUxFICogKFBJIC0gTWF0aC5sb2coTWF0aC50YW4oUElfNCArIHBoaTIgKiAwLjUpKSk7XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnByb2plY3QgcG9pbnQge3gseX0gb24gbWFwIG9udG8ge2xhdCwgbG9ufSBvbiBzcGhlcmVcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R8VmVjdG9yfSB4eSAtIG9iamVjdCB3aXRoIHt4LHl9IG1lbWJlcnNcbiAgICogIHJlcHJlc2VudGluZyBwb2ludCBvbiBwcm9qZWN0ZWQgbWFwIHBsYW5lXG4gICAqIEByZXR1cm4ge0dlb0Nvb3JkaW5hdGVzfSAtIG9iamVjdCB3aXRoIHtsYXQsbG9ufSBvZiBwb2ludCBvbiBzcGhlcmUuXG4gICAqICAgSGFzIHRvQXJyYXkgbWV0aG9kIGlmIHlvdSBuZWVkIGEgR2VvSlNPTiBBcnJheS5cbiAgICogICBQZXIgY2FydG9ncmFwaGljIHRyYWRpdGlvbiwgbGF0IGFuZCBsb24gYXJlIHNwZWNpZmllZCBhcyBkZWdyZWVzLlxuICAgKi9cbiAgdW5wcm9qZWN0Wm9vbTAoW3gsIHldKSB7XG4gICAgY29uc3QgbGFtYmRhMiA9IHggLyBXT1JMRF9TQ0FMRSAtIFBJO1xuICAgIGNvbnN0IHBoaTIgPSAyICogKE1hdGguYXRhbihNYXRoLmV4cChQSSAtIHkgLyBXT1JMRF9TQ0FMRSkpIC0gUElfNCk7XG4gICAgcmV0dXJuIFtsYW1iZGEyICogUkFESUFOU19UT19ERUdSRUVTLCBwaGkyICogUkFESUFOU19UT19ERUdSRUVTXTtcbiAgfVxuXG4gIGdldFByb2plY3Rpb25NYXRyaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsUHJvamVjdGlvbk1hdHJpeDtcbiAgfVxuXG4gIC8vIGZpdEJvdW5kcyhsbmdsYXRTRSwgbG5nbGF0TlcsIHtwYWRkaW5nID0gMH0gPSB7fSkge1xuICAvLyAgIGNvbnN0IGJvdW5kcyA9IG5ldyBMbmdMYXRCb3VuZHMoXG4gIC8vICAgICBbX2JvdW5kc1swXS5yZXZlcnNlKCksXG4gIC8vICAgICBfYm91bmRzWzFdLnJldmVyc2UoKV1cbiAgLy8gICApO1xuICAvLyAgIGNvbnN0IG9mZnNldCA9IFBvaW50LmNvbnZlcnQoWzAsIDBdKTtcbiAgLy8gICBjb25zdCBudyA9IHRoaXMucHJvamVjdChsbmdsYXROVyk7XG4gIC8vICAgY29uc3Qgc2UgPSB0aGlzLnByb2plY3QobG5nbGF0U0UpO1xuICAvLyAgIGNvbnN0IHNpemUgPSBzZS5zdWIobncpO1xuICAvLyAgIGNvbnN0IHNjYWxlWCA9XG4gIC8vICAgICAodGhpcy53aWR0aCAtIHBhZGRpbmcgKiAyIC0gTWF0aC5hYnMob2Zmc2V0LngpICogMikgLyBzaXplLng7XG4gIC8vICAgY29uc3Qgc2NhbGVZID1cbiAgLy8gICAgICh0aGlzLmhlaWdodCAtIHBhZGRpbmcgKiAyIC0gTWF0aC5hYnMob2Zmc2V0LnkpICogMikgLyBzaXplLnk7XG5cbiAgLy8gICBjb25zdCBjZW50ZXIgPSB0aGlzLnVucHJvamVjdChudy5hZGQoc2UpLmRpdigyKSk7XG4gIC8vICAgY29uc3Qgem9vbSA9IHRoaXMuc2NhbGVab29tKHRoaXMuc2NhbGUgKiBNYXRoLm1pbihzY2FsZVgsIHNjYWxlWSkpO1xuICAvLyAgIHJldHVybiB7XG4gIC8vICAgICBsYXRpdHVkZTogY2VudGVyLmxhdCxcbiAgLy8gICAgIGxvbmdpdHVkZTogY2VudGVyLmxuZyxcbiAgLy8gICAgIHpvb21cbiAgLy8gICB9O1xuICAvLyB9XG5cbiAgX3ByZWNvbXB1dGVNYXRyaWNlcygpIHtcbiAgICB0aGlzLl9nbFByb2plY3Rpb25NYXRyaXggPSB0aGlzLl9jYWxjdWxhdGVHTFByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIGNvbnN0IG0gPSBtYXQ0LmNyZWF0ZSgpO1xuICAgIG1hdDQudHJhbnNsYXRlKG0sIG0sIFswLjUsIDAuNSwgMF0pO1xuICAgIG1hdDQuc2NhbGUobSwgbSwgW3RoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCAxXSk7XG4gICAgbWF0NC5tdWx0aXBseShtLCBtLCB0aGlzLl9nbFByb2plY3Rpb25NYXRyaXgpO1xuICAgIHRoaXMuX3BpeGVsUHJvamVjdGlvbk1hdHJpeCA9IG07XG5cbiAgICBjb25zdCBtSW52ZXJzZSA9IG1hdDQuY2xvbmUobSk7XG4gICAgbWF0NC5pbnZlcnQobUludmVyc2UsIG1JbnZlcnNlKTtcbiAgfVxuXG4gIC8vIFRyYW5zZm9ybXMgZnJvbSBXZWIgTWVyY2F0b3IgVGlsZSAwIFswLTUxMiwwLTUxMl0gdG8gXCJjbGlwIHNwYWNlXCJcbiAgX2NhbGN1bGF0ZUdMUHJvamVjdGlvbk1hdHJpeCgpIHtcbiAgICBjb25zdCBtID0gbWF0NC5jcmVhdGUoKTtcblxuICAgIG1hdDQucGVyc3BlY3RpdmUobSxcbiAgICAgIDIgKiBNYXRoLmF0YW4oKHRoaXMuaGVpZ2h0IC8gMikgLyB0aGlzLmFsdGl0dWRlKSxcbiAgICAgIHRoaXMud2lkdGggLyB0aGlzLmhlaWdodCxcbiAgICAgIDAuMSxcbiAgICAgIHRoaXMuZmFyWlxuICAgICk7XG5cbiAgICAvLyBNb3ZlIGNhbWVyYSB0byBhbHRpdHVkZVxuICAgIG1hdDQudHJhbnNsYXRlKG0sIG0sIFswLCAwLCAtdGhpcy5hbHRpdHVkZV0pO1xuXG4gICAgLy8gQWZ0ZXIgdGhlIHJvdGF0ZVgsIHogdmFsdWVzIGFyZSBpbiBwaXhlbCB1bml0cy4gQ29udmVydCB0aGVtIHRvXG4gICAgLy8gYWx0aXR1ZGUgdW5pdHMuIDEgYWx0aXR1ZGUgdW5pdCA9IHRoZSBzY3JlZW4gaGVpZ2h0LlxuICAgIG1hdDQuc2NhbGUobSwgbSwgWzEsIC0xLCAxIC8gdGhpcy5oZWlnaHRdKTtcblxuICAgIG1hdDQucm90YXRlWChtLCBtLCB0aGlzLnBpdGNoUmFkaWFucyk7XG4gICAgbWF0NC5yb3RhdGVaKG0sIG0sIC10aGlzLmJlYXJpbmdSYWRpYW5zKTtcbiAgICBtYXQ0LnRyYW5zbGF0ZShtLCBtLCBbLXRoaXMuY2VudGVyWCwgLXRoaXMuY2VudGVyWSwgMF0pO1xuICAgIC8vIG1hdDQuc2NhbGUobSwgbSwgW3RoaXMuc2NhbGUsIHRoaXMuc2NhbGUsIHRoaXMuc2NhbGVdKTtcblxuICAgIHJldHVybiBtO1xuICB9XG5cbn1cblxuLyogeGlhb2ppJ3Mgc2hhZGVyXG51bmlmb3JtIG1hdDQgcHJvak1hdHJpeDtcbnVuaWZvcm0gZmxvYXQgem9vbTtcbi8vIGNvbnZlcnQgKGxuZywgbGF0KSB0byBzY3JlZW4gcG9zaXRpb25zIGluIGNsaXAgc3BhY2UuXG4vLyBtYXBib3gtZ2wvanMvZ2VvL3RyYW5zZm9ybS5qc1xudmVjMiBwcm9qZWN0KHZlYzIgcHQpIHtcbiAgZmxvYXQgd29ybGRTaXplID0gNTEyLjAgKiBwb3coMi4wLCB6b29tKTtcbiAgZmxvYXQgbG5nWCA9ICgxODAuMCArIHB0LngpIC8gMzYwLjAgICogd29ybGRTaXplO1xuICBmbG9hdCBsYXRZID0gKDE4MC4wIC0gZGVncmVlcyhsb2codGFuKHJhZGlhbnMocHQueSArIDkwLjApLzIuMCkpKSkgLyAzNjAuMFxuICAqIHdvcmxkU2l6ZTtcbiAgdmVjNCBwID0gdmVjNChsbmdYLCBsYXRZLCAwLCAxLjApICogcHJvak1hdHJpeDtcbiAgcmV0dXJuIHZlYzIocC54L3AueiwgcC55L3Aueik7XG59XG4qL1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vLi4vc3JjL3ZpZXdwb3J0L3ZpZXdwb3J0LmpzXG4gKiovIiwiLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuLy8gUGFpcmVkIGRvd24gdmVyc2lvbiBvZiBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iLzAzMzA0MzI1NGQzMGE5OWEwMGI5NTY2MGUyOTY0NDVhMWFkZTJkMDEvanMvZ2VvL3RyYW5zZm9ybS5qc1xuXG5pbXBvcnQge21hdDIsIG1hdDR9IGZyb20gJ2dsLW1hdHJpeCc7XG5cbi8qKlxuICogQ3JlYXRlIGEgbG9uZ2l0dWRlLCBsYXRpdHVkZSBvYmplY3QgZnJvbSBhIGdpdmVuIGxvbmdpdHVkZSBhbmQgbGF0aXR1ZGVcbiAqIHBhaXIgaW4gZGVncmVlcy5cbiAqIE1hcGJveCBHTCB1c2VzIExvbmdpdHVkZSwgTGF0aXR1ZGUgY29vcmRpbmF0ZSBvcmRlciB0byBtYXRjaCBHZW9KU09OLlxuICpcbiAqIE5vdGUgdGhhdCBhbnkgTWFwYm94IEdMIG1ldGhvZCB0aGF0IGFjY2VwdHMgYSBgTG5nTGF0YCBvYmplY3QgY2FuIGFsc29cbiAqIGFjY2VwdCBhbiBgQXJyYXlgIGFuZCB3aWxsIHBlcmZvcm0gYW4gaW1wbGljaXQgY29udmVyc2lvbi5cbiAqIFRoZSBmb2xsb3dpbmcgbGluZXMgYXJlIGVxdWl2YWxlbnQ6XG4gYGBgXG4gbWFwLnNldENlbnRlcihbLTczLjk3NDksIDQwLjc3MzZdKTtcbiBtYXAuc2V0Q2VudGVyKCBuZXcgbWFwYm94Z2wuTG5nTGF0KC03My45NzQ5LCA0MC43NzM2KSApO1xuIGBgYFxuICpcbiAqIEBjbGFzcyBMbmdMYXRcbiAqIEBjbGFzc2Rlc2MgQSByZXByZXNlbnRhdGlvbiBvZiBhIGxvbmdpdHVkZSwgbGF0aXR1ZGUgcG9pbnQsIGluIGRlZ3JlZXMuXG4gKiBAcGFyYW0ge251bWJlcn0gbG5nIGxvbmdpdHVkZVxuICogQHBhcmFtIHtudW1iZXJ9IGxhdCBsYXRpdHVkZVxuICogQGV4YW1wbGVcbiAqIHZhciBsbCA9IG5ldyBtYXBib3hnbC5MbmdMYXQoLTczLjk3NDksIDQwLjc3MzYpO1xuICovXG5mdW5jdGlvbiBMbmdMYXQobG5nLCBsYXQpIHtcbiAgaWYgKGlzTmFOKGxuZykgfHwgaXNOYU4obGF0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBMbmdMYXQgb2JqZWN0OiAoJyArIGxuZyArICcsICcgKyBsYXQgKyAnKScpO1xuICB9XG4gIHRoaXMubG5nID0gTnVtYmVyKGxuZyk7XG4gIHRoaXMubGF0ID0gTnVtYmVyKGxhdCk7XG4gIGlmICh0aGlzLmxhdCA+IDkwIHx8IHRoaXMubGF0IDwgLTkwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIExuZ0xhdCBsYXRpdHVkZSB2YWx1ZTogbXVzdCBiZSBiZXR3ZWVuIC05MCBhbmQgOTAnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2luZ2xlIHRyYW5zZm9ybSwgZ2VuZXJhbGx5IHVzZWQgZm9yIGEgc2luZ2xlIHRpbGUgdG8gYmVcbiAqIHNjYWxlZCwgcm90YXRlZCwgYW5kIHpvb21lZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwYm94VHJhbnNmb3JtIHtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgd2lkdGggPSAwLFxuICAgIGhlaWdodCA9IDAsXG4gICAgbGF0aXR1ZGUgPSAwLFxuICAgIGxvbmdpdHVkZSA9IDAsXG4gICAgem9vbSA9IDAsXG4gICAgYWx0aXR1ZGUgPSAxLjUsXG4gICAgcGl0Y2ggPSAwLFxuICAgIGJlYXJpbmcgPSAwXG4gIH0pIHtcbiAgICAvLyBjb25zdGFudFxuICAgIHRoaXMudGlsZVNpemUgPSA1MTI7XG5cbiAgICB0aGlzLndpZHRoID0gMDtcbiAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgdGhpcy5fY2VudGVyID0gbmV3IExuZ0xhdCgwLCAwKTtcbiAgICB0aGlzLnpvb20gPSAwO1xuICAgIHRoaXMuYW5nbGUgPSAwO1xuICAgIHRoaXMuX2FsdGl0dWRlID0gMS41O1xuICAgIHRoaXMuX3BpdGNoID0gMDtcblxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnpvb20gPSB6b29tO1xuICAgIHRoaXMuY2VudGVyID0gbmV3IExuZ0xhdChsb25naXR1ZGUsIGxhdGl0dWRlKTtcbiAgICB0aGlzLmFsdGl0dWRlID0gYWx0aXR1ZGU7XG4gICAgdGhpcy5waXRjaCA9IHBpdGNoO1xuICAgIHRoaXMuYmVhcmluZyA9IGJlYXJpbmc7XG4gICAgdGhpcy5fY2FsY1Byb2pNYXRyaXgoKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlICovXG5cbiAgZ2V0IHdvcmxkU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50aWxlU2l6ZSAqIHRoaXMuc2NhbGU7XG4gIH1cblxuICBnZXQgYmVhcmluZygpIHtcbiAgICByZXR1cm4gLXRoaXMuYW5nbGUgLyBNYXRoLlBJICogMTgwO1xuICB9XG4gIHNldCBiZWFyaW5nKGJlYXJpbmcpIHtcbiAgICAvLyBUT0RPOiBCb3VuZHMgY2hlY2tcbiAgICAvLyB2YXIgYiA9XG4gICAgY29uc3QgYiA9IC1iZWFyaW5nICogTWF0aC5QSSAvIDE4MDtcbiAgICBpZiAodGhpcy5hbmdsZSA9PT0gYikgcmV0dXJuO1xuICAgIHRoaXMuYW5nbGUgPSBiO1xuXG4gICAgLy8gMngyIG1hdHJpeCBmb3Igcm90YXRpbmcgcG9pbnRzXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeCA9IG1hdDIuY3JlYXRlKCk7XG4gICAgbWF0Mi5yb3RhdGUodGhpcy5yb3RhdGlvbk1hdHJpeCwgdGhpcy5yb3RhdGlvbk1hdHJpeCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuICBnZXQgcGl0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BpdGNoIC8gTWF0aC5QSSAqIDE4MDtcbiAgfVxuICBzZXQgcGl0Y2gocGl0Y2gpIHtcbiAgICBjb25zdCBwID0gTWF0aC5taW4oNjAsIHBpdGNoKSAvIDE4MCAqIE1hdGguUEk7XG4gICAgaWYgKHRoaXMuX3BpdGNoID09PSBwKSByZXR1cm47XG4gICAgdGhpcy5fcGl0Y2ggPSBwO1xuICB9XG5cbiAgZ2V0IGFsdGl0dWRlKCkge1xuICAgIHJldHVybiB0aGlzLl9hbHRpdHVkZTtcbiAgfVxuICBzZXQgYWx0aXR1ZGUoYWx0aXR1ZGUpIHtcbiAgICBjb25zdCBhID0gTWF0aC5tYXgoMC43NSwgYWx0aXR1ZGUpO1xuICAgIGlmICh0aGlzLl9hbHRpdHVkZSA9PT0gYSkgcmV0dXJuO1xuICAgIHRoaXMuX2FsdGl0dWRlID0gYTtcbiAgfVxuXG4gIGdldCB6b29tKCkgeyByZXR1cm4gdGhpcy5fem9vbTsgfVxuICBzZXQgem9vbSh6b29tKSB7XG4gICAgY29uc3QgeiA9IHpvb207XG4gICAgaWYgKHRoaXMuX3pvb20gPT09IHopIHJldHVybjtcbiAgICB0aGlzLl96b29tID0gejtcbiAgICB0aGlzLnNjYWxlID0gdGhpcy56b29tU2NhbGUoeik7XG4gICAgdGhpcy50aWxlWm9vbSA9IE1hdGguZmxvb3Ioeik7XG4gICAgdGhpcy56b29tRnJhY3Rpb24gPSB6IC0gdGhpcy50aWxlWm9vbTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKSB7IHJldHVybiB0aGlzLl9jZW50ZXI7IH1cbiAgc2V0IGNlbnRlcihjZW50ZXIpIHtcbiAgICBpZiAoY2VudGVyLmxhdCA9PT0gdGhpcy5fY2VudGVyLmxhdCAmJiBjZW50ZXIubG5nID09PSB0aGlzLl9jZW50ZXIubG5nKSByZXR1cm47XG4gICAgdGhpcy5fY2VudGVyID0gY2VudGVyO1xuICB9XG5cbiAgem9vbVNjYWxlKHpvb20pIHsgcmV0dXJuIE1hdGgucG93KDIsIHpvb20pOyB9XG5cbiAgZ2V0IHgoKSB7IHJldHVybiB0aGlzLmxuZ1godGhpcy5jZW50ZXIubG5nKTsgfVxuICBnZXQgeSgpIHsgcmV0dXJuIHRoaXMubGF0WSh0aGlzLmNlbnRlci5sYXQpOyB9XG5cbiAgLyoqXG4gICAqIGxhdGl0dWRlIHRvIGFic29sdXRlIHggY29vcmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxvblxuICAgKiBAcGFyYW0ge251bWJlcn0gW3dvcmxkU2l6ZT10aGlzLndvcmxkU2l6ZV1cbiAgICogQHJldHVybnMge251bWJlcn0gcGl4ZWwgY29vcmRpbmF0ZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbG5nWChsbmcsIHdvcmxkU2l6ZSkge1xuICAgIHJldHVybiAoMTgwICsgbG5nKSAqICh3b3JsZFNpemUgfHwgdGhpcy53b3JsZFNpemUpIC8gMzYwO1xuICB9XG4gIC8qKlxuICAgKiBsYXRpdHVkZSB0byBhYnNvbHV0ZSB5IGNvb3JkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsYXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt3b3JsZFNpemU9dGhpcy53b3JsZFNpemVdXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHBpeGVsIGNvb3JkaW5hdGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxhdFkobGF0LCB3b3JsZFNpemUpIHtcbiAgICBjb25zdCB5ID0gMTgwIC8gTWF0aC5QSSAqIE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgbGF0ICogTWF0aC5QSSAvIDM2MCkpO1xuICAgIHJldHVybiAoMTgwIC0geSkgKiAod29ybGRTaXplIHx8IHRoaXMud29ybGRTaXplKSAvIDM2MDtcbiAgfVxuXG4gIF9jYWxjUHJvak1hdHJpeCgpIHtcbiAgICBjb25zdCBtID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5cbiAgICAvLyBGaW5kIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIgcG9pbnQgdG8gdGhlIGNlbnRlciB0b3AgaW4gYWx0aXR1ZGUgdW5pdHMgdXNpbmcgbGF3IG9mIHNpbmVzLlxuICAgIGNvbnN0IGhhbGZGb3YgPSBNYXRoLmF0YW4oMC41IC8gdGhpcy5hbHRpdHVkZSk7XG4gICAgY29uc3QgdG9wSGFsZlN1cmZhY2VEaXN0YW5jZSA9IE1hdGguc2luKGhhbGZGb3YpICogdGhpcy5hbHRpdHVkZSAvIE1hdGguc2luKE1hdGguUEkgLyAyIC0gdGhpcy5fcGl0Y2ggLSBoYWxmRm92KTtcblxuICAgIC8vIENhbGN1bGF0ZSB6IHZhbHVlIG9mIHRoZSBmYXJ0aGVzdCBmcmFnbWVudCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC5cbiAgICBjb25zdCBmYXJaID0gTWF0aC5jb3MoTWF0aC5QSSAvIDIgLSB0aGlzLl9waXRjaCkgKiB0b3BIYWxmU3VyZmFjZURpc3RhbmNlICsgdGhpcy5hbHRpdHVkZTtcblxuICAgIG1hdDQucGVyc3BlY3RpdmUobSwgMiAqIE1hdGguYXRhbigodGhpcy5oZWlnaHQgLyAyKSAvIHRoaXMuYWx0aXR1ZGUpLCB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQsIDAuMSwgZmFyWik7XG5cbiAgICBtYXQ0LnRyYW5zbGF0ZShtLCBtLCBbMCwgMCwgLXRoaXMuYWx0aXR1ZGVdKTtcblxuICAgIC8vIEFmdGVyIHRoZSByb3RhdGVYLCB6IHZhbHVlcyBhcmUgaW4gcGl4ZWwgdW5pdHMuIENvbnZlcnQgdGhlbSB0b1xuICAgIC8vIGFsdGl0dWRlIHVuaXRzLiAxIGFsdGl0dWRlIHVuaXQgPSB0aGUgc2NyZWVuIGhlaWdodC5cbiAgICBtYXQ0LnNjYWxlKG0sIG0sIFsxLCAtMSwgMSAvIHRoaXMuaGVpZ2h0XSk7XG5cbiAgICBtYXQ0LnJvdGF0ZVgobSwgbSwgdGhpcy5fcGl0Y2gpO1xuICAgIG1hdDQucm90YXRlWihtLCBtLCB0aGlzLmFuZ2xlKTtcbiAgICBtYXQ0LnRyYW5zbGF0ZShtLCBtLCBbLXRoaXMueCwgLXRoaXMueSwgMF0pO1xuXG4gICAgdGhpcy5wcm9qTWF0cml4ID0gbTtcbiAgfVxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuLi8uLi9zcmMvdmlld3BvcnQvbWFwYm94LXRyYW5zZm9ybS5qc1xuICoqLyIsIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qIGVzbGludC1kaXNhYmxlIGd1YXJkLWZvci1pbiAqL1xuaW1wb3J0IHtBdHRyaWJ1dGVNYW5hZ2VyfSBmcm9tICdsdW1hLmdsJztcbmltcG9ydCB7YXJlRXF1YWxTaGFsbG93fSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHthZGRJdGVyYXRvcn0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IGlzRGVlcEVxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuXG4vKlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLmlkIC0gbGF5ZXIgbmFtZVxuICogQHBhcmFtIHthcnJheX0gIHByb3BzLmRhdGEgLSBhcnJheSBvZiBkYXRhIGluc3RhbmNlc1xuICogQHBhcmFtIHtudW1iZXJ9IHByb3BzLndpZHRoIC0gdmlld3BvcnQgd2lkdGgsIHN5bmNlZCB3aXRoIE1hcGJveEdMXG4gKiBAcGFyYW0ge251bWJlcn0gcHJvcHMuaGVpZ2h0IC0gdmlld3BvcnQgd2lkdGgsIHN5bmNlZCB3aXRoIE1hcGJveEdMXG4gKiBAcGFyYW0ge2Jvb2x9IHByb3BzLmlzUGlja2FibGUgLSB3aGV0aGVyIGxheWVyIHJlc3BvbnNlIHRvIG1vdXNlIGV2ZW50XG4gKiBAcGFyYW0ge2Jvb2x9IHByb3BzLm9wYWNpdHkgLSBvcGFjaXR5IG9mIHRoZSBsYXllclxuICovXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBrZXk6IDAsXG4gIG9wYWNpdHk6IDAuOCxcbiAgbnVtSW5zdGFuY2VzOiB1bmRlZmluZWQsXG4gIGRhdGE6IFtdLFxuICBpc1BpY2thYmxlOiBmYWxzZSxcbiAgZGVlcENvbXBhcmU6IGZhbHNlLFxuICBnZXRWYWx1ZTogeCA9PiB4LFxuICBvbkhvdmVyOiAoKSA9PiB7fSxcbiAgb25DbGljazogKCkgPT4ge30sXG4gIC8vIFVwZGF0ZSB0cmlnZ2VyczogYSBrZXkgY2hhbmdlIGRldGVjdGlvbiBtZWNoYW5pc20gaW4gZGVjay5nbFxuICAvL1xuICAvLyBUaGUgdmFsdWUgb2YgYHVwZGF0ZVRyaWdnZXJzYCBpcyBhIG1hcCB3aXRoIGZpZWxkcyBjb3JyZXNwb25kaW5nIHRvXG4gIC8vIGF0dHJpYnV0ZSBuYW1lcyAob3IgYGFsbGApLiBFYWNoIGZpZWxkIGhhcyBhIHZhbHVlIHdoaWNoIGlzIGFuIG9iamVjdCxcbiAgLy8gaXQgY2FuIGNvbnRhaW4gYW55IGFtb3VudCBvZiBkYXRhLiBUaGUgZGF0YSBmb3IgZWFjaCBmaWVsZCBpcyBjb21wYXJlZFxuICAvLyBzaGFsbG93bHksIGFuZCBpZiBhIGNoYW5nZSBpcyBkZXRlY3RlZCwgdGhlIGF0dHJpYnV0ZSBpcyBpbnZhbGlkYXRlZFxuICAvLyAoYWxsIGF0dHJpYnV0ZXMgYXJlIGludmFsaWRhdGVkIGlmIHRoZSBgYWxsYCBrZXkgaXMgdXNlZC4pXG4gIC8vIE5vdGU6IHVwZGF0ZVRyaWdnZXJzIGFyZSBpZ25vcmVkIGJ5IG5vcm1hbCBzaGFsbG93IGNvbXBhcmlzb24sIHNvIGl0IGlzXG4gIC8vIE9LIGZvciB0aGUgYXBwIHRvIG1pbnQgYSBuZXcgb2JqZWN0IG9uIGV2ZXJ5IHJlbmRlci5cbiAgdXBkYXRlVHJpZ2dlcnM6IHt9XG59O1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbnN0YW5jZVBpY2tpbmdDb2xvcnM6XG4gICAge3NpemU6IDMsICcwJzogJ3BpY2tSZWQnLCAnMSc6ICdwaWNrR3JlZW4nLCAnMic6ICdwaWNrQmx1ZSd9XG59O1xuXG5sZXQgY291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIHtcblxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIEFUVFJJQlVURVM7XG4gIH1cblxuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBCYXNlIExheWVyIGNsYXNzXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgLSBTZWUgZG9jcyBhYm92ZVxuICAgKi9cbiAgLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgIHByb3BzID0ge1xuICAgICAgLi4uREVGQVVMVF9QUk9QUyxcbiAgICAgIC4uLnByb3BzXG4gICAgfTtcblxuICAgIC8vIEFkZCBpdGVyYXRvciB0byBvYmplY3RzXG4gICAgLy8gVE9ETyAtIE1vZGlmeWluZyBwcm9wcyBpcyBhbiBhbnRpLXBhdHRlcm5cbiAgICBpZiAocHJvcHMuZGF0YSkge1xuICAgICAgYWRkSXRlcmF0b3IocHJvcHMuZGF0YSk7XG4gICAgICBhc3NlcnQocHJvcHMuZGF0YVtTeW1ib2wuaXRlcmF0b3JdLCAnZGF0YSBwcm9wIG11c3QgaGF2ZSBhbiBpdGVyYXRvcicpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgIHRoaXMuY2hlY2tQcm9wKHByb3BzLmRhdGEsICdkYXRhJyk7XG4gICAgdGhpcy5jaGVja1Byb3AocHJvcHMuaWQsICdpZCcpO1xuICAgIHRoaXMuY2hlY2tQcm9wKHByb3BzLndpZHRoLCAnd2lkdGgnKTtcbiAgICB0aGlzLmNoZWNrUHJvcChwcm9wcy5oZWlnaHQsICdoZWlnaHQnKTtcblxuICAgIHRoaXMuY2hlY2tQcm9wKHByb3BzLndpZHRoLCAnd2lkdGgnKTtcbiAgICB0aGlzLmNoZWNrUHJvcChwcm9wcy5oZWlnaHQsICdoZWlnaHQnKTtcbiAgICB0aGlzLmNoZWNrUHJvcChwcm9wcy5sYXRpdHVkZSwgJ2xhdGl0dWRlJyk7XG4gICAgdGhpcy5jaGVja1Byb3AocHJvcHMubG9uZ2l0dWRlLCAnbG9uZ2l0dWRlJyk7XG4gICAgdGhpcy5jaGVja1Byb3AocHJvcHMuem9vbSwgJ3pvb20nKTtcblxuICAgIHRoaXMuY291bnQgPSBjb3VudGVyKys7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIExJRkVDWUNMRSBNRVRIT0RTLCBvdmVycmlkZGVuIGJ5IHRoZSBsYXllciBzdWJjbGFzc2VzXG5cbiAgLy8gQ2FsbGVkIG9uY2UgdG8gc2V0IHVwIHRoZSBpbml0aWFsIHN0YXRlXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgfVxuXG4gIC8vIGdsIGNvbnRleHQgaXMgbm93IGF2YWlsYWJsZVxuICBkaWRNb3VudCgpIHtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICAvLyBDaGVjayB1cGRhdGUgdHJpZ2dlcnMsIGFuZCBpbnZhbGlkYXRlIHByb3BzIGFjY29yZGluZ2x5XG4gICAgaWYgKHRoaXMuY2hlY2tVcGRhdGVUcmlnZ2VycyhvbGRQcm9wcywgbmV3UHJvcHMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gSWYgYW55IHByb3BzIGhhdmUgY2hhbmdlZCwgaWdub3JpbmcgdXBkYXRlVHJpZ2dlcnMgb2JqZWN0c1xuICAgIC8vICh1cGRhdGVUcmlnZ2VycyBhcmUgZXhwZWN0ZWQgdG8gYmUgcmVtaW50ZWQgb24gZXZlcnkgdXBkYXRlKVxuICAgIGNvbnN0IGVxdWFsU2hhbGxvdyA9IGFyZUVxdWFsU2hhbGxvdyhuZXdQcm9wcywgb2xkUHJvcHMsIHtcbiAgICAgIGlnbm9yZToge3VwZGF0ZVRyaWdnZXJzOiB0cnVlfVxuICAgIH0pO1xuICAgIGlmICghZXF1YWxTaGFsbG93KSB7XG4gICAgICBpZiAobmV3UHJvcHMuZGF0YSAhPT0gb2xkUHJvcHMuZGF0YSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhQ2hhbmdlZDogdHJ1ZX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChuZXdQcm9wcy5kZWVwQ29tcGFyZSAmJiAhaXNEZWVwRXF1YWwobmV3UHJvcHMuZGF0YSwgb2xkUHJvcHMuZGF0YSkpIHtcbiAgICAgIC8vIFN1cHBvcnQgb3B0aW9uYWwgZGVlcCBjb21wYXJlIG9mIGRhdGFcbiAgICAgIC8vIE5vdGU6IHRoaXMgaXMgcXVpdGUgaW5lZmZpY2llbnQsIGFwcCBzaG91bGQgdXNlIGJ1ZmZlciBwcm9wcyBpbnN0ZWFkXG4gICAgICB0aGlzLnNldFN0YXRlKHtkYXRhQ2hhbmdlZDogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIERlZmF1bHQgaW1wbGVtZW50YXRpb24sIGFsbCBhdHRyaWJ1dGVNYW5hZ2VyIHdpbGwgYmUgdXBkYXRlZFxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGF0YUNoYW5nZWQpIHtcbiAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGdsIGNvbnRleHQgc3RpbGwgYXZhaWxhYmxlXG4gIHdpbGxVbm1vdW50KCkge1xuICB9XG5cbiAgLy8gRU5EIExJRkVDWUNMRSBNRVRIT0RTXG4gIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gUHVibGljIEFQSVxuXG4gIHNldE5lZWRzUmVkcmF3KHJlZHJhdyA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSkge1xuICAgICAgdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdyA9IHJlZHJhdztcbiAgICB9XG4gIH1cblxuICAvLyBDaGVja3Mgc3RhdGUgb2YgYXR0cmlidXRlcyBhbmQgbW9kZWxcbiAgLy8gVE9ETyAtIGlzIGF0dHJpYnV0ZSBtYW5hZ2VyIG5lZWRlZD8gLSBNb2RlbCBzaG91bGQgYmUgZW5vdWdoLlxuICBnZXROZWVkc1JlZHJhdyh7Y2xlYXJSZWRyYXdGbGFncyA9IGZhbHNlfSA9IHt9KSB7XG4gICAgLy8gdGhpcyBtZXRob2QgbWF5IGJlIGNhbGxlZCBieSB0aGUgcmVuZGVyIGxvb3AgYXMgc29vbiBhIHRoZSBsYXllclxuICAgIC8vIGhhcyBiZWVuIGNyZWF0ZWQsIHNvIGd1YXJkIGFnYWluc3QgdW5pbml0aWFsaXplZCBzdGF0ZVxuICAgIGlmICghdGhpcy5zdGF0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyLCBtb2RlbH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCByZWRyYXcgPSBmYWxzZTtcbiAgICByZWRyYXcgPSByZWRyYXcgfHwgdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdztcbiAgICB0aGlzLnN0YXRlLm5lZWRzUmVkcmF3ID0gdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdyAmJiAhY2xlYXJSZWRyYXdGbGFncztcblxuICAgIHJlZHJhdyA9IHJlZHJhdyB8fCBhdHRyaWJ1dGVNYW5hZ2VyLmdldE5lZWRzUmVkcmF3KHtjbGVhclJlZHJhd0ZsYWdzfSk7XG4gICAgcmVkcmF3ID0gcmVkcmF3IHx8IG1vZGVsLmdldE5lZWRzUmVkcmF3KHtjbGVhclJlZHJhd0ZsYWdzfSk7XG4gICAgcmV0dXJuIHJlZHJhdztcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgc2VsZWN0ZWQgc3RhdGUgbWVtYmVycyBhbmQgbWFya3MgdGhlIG9iamVjdCBmb3IgcmVkcmF3XG4gIHNldFN0YXRlKHVwZGF0ZU9iamVjdCkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdGF0ZSwgdXBkYXRlT2JqZWN0KTtcbiAgICB0aGlzLnN0YXRlLm5lZWRzUmVkcmF3ID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgc2VsZWN0ZWQgc3RhdGUgbWVtYmVycyBhbmQgbWFya3MgdGhlIG9iamVjdCBmb3IgcmVkcmF3XG4gIHNldFVuaWZvcm1zKHVuaWZvcm1NYXApIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbCkge1xuICAgICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRVbmlmb3Jtcyh1bmlmb3JtTWFwKTtcbiAgICB9XG4gICAgLy8gVE9ETyAtIHNldCBuZWVkc1JlZHJhdyBvbiB0aGUgbW9kZWw/XG4gICAgdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdyA9IHRydWU7XG4gICAgbG9nKDMsICdsYXllci5zZXRVbmlmb3JtcycsIHVuaWZvcm1NYXApO1xuICB9XG5cbiAgLy8gVXNlIGl0ZXJhdGlvbiAodGhlIG9ubHkgcmVxdWlyZWQgY2FwYWJpbGl0eSBvbiBkYXRhKSB0byBnZXQgZmlyc3QgZWxlbWVudFxuICBnZXRGaXJzdE9iamVjdCgpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGRhdGEpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gSU5URVJOQUwgTUVUSE9EU1xuXG4gIC8vIERlZHVjZXMgbnVtZXIgb2YgaW5zdGFuY2VzLiBJbnRlbnRpb24gaXMgdG8gc3VwcG9ydDpcbiAgLy8gLSBFeHBsaWNpdCBzZXR0aW5nIG9mIG51bUluc3RhbmNlc1xuICAvLyAtIEF1dG8tZGVkdWN0aW9uIGZvciBFUzYgY29udGFpbmVycyB0aGF0IGRlZmluZSBhIHNpemUgbWVtYmVyXG4gIC8vIC0gQXV0by1kZWR1Y3Rpb24gZm9yIENsYXNzaWMgQXJyYXlzIHZpYSB0aGUgYnVpbHQtaW4gbGVuZ3RoIGF0dHJpYnV0ZVxuICAvLyAtIEF1dG8tZGVkdWN0aW9uIHZpYSBhcnJheXNcbiAgZ2V0TnVtSW5zdGFuY2VzKHByb3BzKSB7XG4gICAgcHJvcHMgPSBwcm9wcyB8fCB0aGlzLnByb3BzO1xuXG4gICAgLy8gRmlyc3QgY2hlY2sgaWYgdGhlIGxheWVyIGhhcyBzZXQgaXRzIG93biB2YWx1ZVxuICAgIGlmICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUubnVtSW5zdGFuY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLm51bUluc3RhbmNlcztcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhcHAgaGFzIHByb3ZpZGVkIGFuIGV4cGxpY2l0IHZhbHVlXG4gICAgaWYgKHByb3BzLm51bUluc3RhbmNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvcHMubnVtSW5zdGFuY2VzO1xuICAgIH1cblxuICAgIGNvbnN0IHtkYXRhfSA9IHByb3BzO1xuXG4gICAgLy8gQ2hlY2sgaWYgRVM2IGNvbGxlY3Rpb24gXCJjb3VudFwiIGZ1bmN0aW9uIGlzIGF2YWlsYWJsZVxuICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhLmNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZGF0YS5jb3VudCgpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIEVTNiBjb2xsZWN0aW9uIFwic2l6ZVwiIGF0dHJpYnV0ZSBpcyBzZXRcbiAgICBpZiAoZGF0YSAmJiBkYXRhLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRhdGEuc2l6ZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhcnJheSBsZW5ndGggYXR0cmlidXRlIGlzIHNldFxuICAgIC8vIE5vdGU6IGNoZWNraW5nIHRoaXMgbGFzdCBzaW5jZSBzb21lIEVTNiBjb2xsZWN0aW9ucyAoSW1tdXRhYmxlLmpzKVxuICAgIC8vIGVtaXQgcHJvZnVzZSB3YXJuaW5ncyB3aGVuIHRyeWluZyB0byBhY2Nlc3MgYGxlbmd0aGAgYXR0cmlidXRlXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRhdGEubGVuZ3RoO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGRlZHVjZSBudW1JbnN0YW5jZXMnKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIEhlbHBlcnNcblxuICBjaGVja1Byb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIC8vIE5vdGU6IGRhdGFDaGFuZ2VkIG1pZ2h0IGFscmVhZHkgYmUgc2V0XG4gICAgaWYgKG5ld1Byb3BzLmRhdGEgIT09IG9sZFByb3BzLmRhdGEpIHtcbiAgICAgIC8vIEZpZ3VyZSBvdXQgZGF0YSBsZW5ndGhcbiAgICAgIHRoaXMuc3RhdGUuZGF0YUNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHZpZXdwb3J0Q2hhbmdlZCA9XG4gICAgICBuZXdQcm9wcy53aWR0aCAhPT0gb2xkUHJvcHMud2lkdGggfHxcbiAgICAgIG5ld1Byb3BzLmhlaWdodCAhPT0gb2xkUHJvcHMuaGVpZ2h0IHx8XG4gICAgICBuZXdQcm9wcy5sYXRpdHVkZSAhPT0gb2xkUHJvcHMubGF0aXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLmxvbmdpdHVkZSAhPT0gb2xkUHJvcHMubG9uZ2l0dWRlIHx8XG4gICAgICBuZXdQcm9wcy56b29tICE9PSBvbGRQcm9wcy56b29tO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7dmlld3BvcnRDaGFuZ2VkfSk7XG4gIH1cblxuICB1cGRhdGVBdHRyaWJ1dGVzKHByb3BzKSB7XG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXIsIG1vZGVsfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbnVtSW5zdGFuY2VzID0gdGhpcy5nZXROdW1JbnN0YW5jZXMocHJvcHMpO1xuICAgIC8vIEZpZ3VyZSBvdXQgZGF0YSBsZW5ndGhcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLnVwZGF0ZSh7XG4gICAgICBudW1JbnN0YW5jZXMsXG4gICAgICBidWZmZXJNYXA6IHByb3BzLFxuICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgIC8vIERvbid0IHdvcnJ5IGFib3V0IG5vbi1hdHRyaWJ1dGUgcHJvcHNcbiAgICAgIGlnbm9yZVVua25vd25BdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKG1vZGVsKSB7XG4gICAgICBjb25zdCBjaGFuZ2VkQXR0cmlidXRlcyA9XG4gICAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuZ2V0Q2hhbmdlZEF0dHJpYnV0ZXMoe2NsZWFyQ2hhbmdlZEZsYWdzOiB0cnVlfSk7XG4gICAgICBtb2RlbC5zZXRBdHRyaWJ1dGVzKGNoYW5nZWRBdHRyaWJ1dGVzKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVCYXNlVW5pZm9ybXMoKSB7XG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICAvLyBhcHBseSBnYW1tYSB0byBvcGFjaXR5IHRvIG1ha2UgaXQgdmlzdWFsbHkgXCJsaW5lYXJcIlxuICAgICAgb3BhY2l0eTogTWF0aC5wb3codGhpcy5wcm9wcy5vcGFjaXR5IHx8IDAuOCwgMSAvIDIuMilcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIGFueSB1cGRhdGUgdHJpZ2dlcnMgaGF2ZSBjaGFuZ2VkLCBhbmQgaW52YWxpZGF0ZVxuICAvLyBhdHRyaWJ1dGVzIGFjY29yZGluZ2x5LlxuICBjaGVja1VwZGF0ZVRyaWdnZXJzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGxldCBjaGFuZ2UgPSBmYWxzZTtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGZvciAoY29uc3QgcHJvcE5hbWUgaW4gbmV3UHJvcHMudXBkYXRlVHJpZ2dlcnMpIHtcbiAgICAgIGNvbnN0IG9sZFRyaWdnZXJzID0gb2xkUHJvcHMudXBkYXRlVHJpZ2dlcnNbcHJvcE5hbWVdO1xuICAgICAgY29uc3QgbmV3VHJpZ2dlcnMgPSBuZXdQcm9wcy51cGRhdGVUcmlnZ2Vyc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWFyZUVxdWFsU2hhbGxvdyhvbGRUcmlnZ2VycywgbmV3VHJpZ2dlcnMpKSB7XG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2FsbCcpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVNYW5hZ2VyLmludmFsaWRhdGVBbGwoKTtcbiAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZShwcm9wTmFtZSk7XG4gICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hhbmdlO1xuICB9XG5cbiAgLy8gTEFZRVIgTUFOQUdFUiBBUElcblxuICAvLyBDYWxsZWQgYnkgbGF5ZXIgbWFuYWdlciB3aGVuIGEgbmV3IGxheWVyIGlzIGZvdW5kXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG4gIGluaXRpYWxpemVMYXllcih7Z2x9KSB7XG4gICAgYXNzZXJ0KGdsKTtcbiAgICB0aGlzLnN0YXRlID0ge2dsfTtcblxuICAgIC8vIEluaXRpYWxpemUgc3RhdGUgb25seSBvbmNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhdHRyaWJ1dGVNYW5hZ2VyOiBuZXcgQXR0cmlidXRlTWFuYWdlcih7aWQ6IHRoaXMucHJvcHMuaWR9KSxcbiAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgbmVlZHNSZWRyYXc6IHRydWUsXG4gICAgICBkYXRhQ2hhbmdlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICAvLyBBbGwgaW5zdGFuY2VkIGxheWVycyBnZXQgaW5zdGFuY2VQaWNraW5nQ29sb3JzIGF0dHJpYnV0ZSBieSBkZWZhdWx0XG4gICAgLy8gVGhlaXIgc2hhZGVycyBjYW4gdXNlIGl0IHRvIHJlbmRlciBhIHBpY2tpbmcgc2NlbmVcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZChBVFRSSUJVVEVTLCB7XG4gICAgICBpbnN0YW5jZVBpY2tpbmdDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQaWNraW5nQ29sb3JzfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3cG9ydCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXRlKCk7XG4gICAgYXNzZXJ0KHRoaXMuc3RhdGUubW9kZWwsICdNb2RlbCBtdXN0IGJlIHNldCBpbiBpbml0aWFsaXplU3RhdGUnKTtcbiAgICB0aGlzLnNldFZpZXdwb3J0KCk7XG5cbiAgICAvLyBUT0RPIC0gdGhlIGFwcCBtdXN0IGJlIGFibGUgdG8gb3ZlcnJpZGVcblxuICAgIC8vIEFkZCBhbnkgc3ViY2xhc3MgYXR0cmlidXRlc1xuICAgIHRoaXMudXBkYXRlQXR0cmlidXRlcyh0aGlzLnByb3BzKTtcbiAgICB0aGlzLnVwZGF0ZUJhc2VVbmlmb3JtcygpO1xuXG4gICAgY29uc3Qge21vZGVsfSA9IHRoaXMuc3RhdGU7XG4gICAgbW9kZWwuc2V0SW5zdGFuY2VDb3VudCh0aGlzLmdldE51bUluc3RhbmNlcygpKTtcbiAgICBtb2RlbC5pZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgbW9kZWwucHJvZ3JhbS5pZCA9IGAke3RoaXMucHJvcHMuaWR9LXByb2dyYW1gO1xuICAgIG1vZGVsLmdlb21ldHJ5LmlkID0gYCR7dGhpcy5wcm9wcy5pZH0tZ2VvbWV0cnlgO1xuXG4gICAgLy8gQ3JlYXRlIGEgbW9kZWwgZm9yIHRoZSBsYXllclxuICAgIHRoaXMuX3VwZGF0ZU1vZGVsKHtnbH0pO1xuXG4gICAgLy8gQ2FsbCBsaWZlIGN5Y2xlIG1ldGhvZFxuICAgIHRoaXMuZGlkTW91bnQoKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbiAgLy8gQ2FsbGVkIGJ5IGxheWVyIG1hbmFnZXIgd2hlbiBleGlzdGluZyBsYXllciBpcyBnZXR0aW5nIG5ldyBwcm9wc1xuICB1cGRhdGVMYXllcihvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICAvLyBDYWxjdWxhdGUgc3RhbmRhcmQgY2hhbmdlIGZsYWdzXG4gICAgdGhpcy5jaGVja1Byb3BzKG9sZFByb3BzLCBuZXdQcm9wcyk7XG5cbiAgICAvLyBDaGVjayBpZiBhbnkgcHJvcHMgaGF2ZSBjaGFuZ2VkXG4gICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlKG9sZFByb3BzLCBuZXdQcm9wcykpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnZpZXdwb3J0Q2hhbmdlZCkge1xuICAgICAgICB0aGlzLnNldFZpZXdwb3J0KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIExldCB0aGUgc3ViY2xhc3MgbWFyayB3aGF0IGlzIG5lZWRlZCBmb3IgdXBkYXRlXG4gICAgICB0aGlzLndpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKTtcbiAgICAgIC8vIFJ1biB0aGUgYXR0cmlidXRlIHVwZGF0ZXJzXG4gICAgICB0aGlzLnVwZGF0ZUF0dHJpYnV0ZXMobmV3UHJvcHMpO1xuICAgICAgLy8gVXBkYXRlIHRoZSB1bmlmb3Jtc1xuICAgICAgdGhpcy51cGRhdGVCYXNlVW5pZm9ybXMoKTtcblxuICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZWwpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRJbnN0YW5jZUNvdW50KHRoaXMuZ2V0TnVtSW5zdGFuY2VzKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGUuZGF0YUNoYW5nZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXRlLnZpZXdwb3J0Q2hhbmdlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IG1hbmFnZXIgd2hlbiBsYXllciBpcyBhYm91dCB0byBiZSBkaXNwb3NlZFxuICAvLyBOb3RlOiBub3QgZ3VhcmFudGVlZCB0byBiZSBjYWxsZWQgb24gYXBwbGljYXRpb24gc2h1dGRvd25cbiAgZmluYWxpemVMYXllcigpIHtcbiAgICB0aGlzLndpbGxVbm1vdW50KCk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBpY2tpbmdDb2xvcnMoYXR0cmlidXRlLCBudW1JbnN0YW5jZXMpIHtcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIC8vIGFkZCAxIHRvIGluZGV4IHRvIHNlcGVyYXRlIGZyb20gbm8gc2VsZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1JbnN0YW5jZXM7IGkrKykge1xuICAgICAgY29uc3QgcGlja2luZ0NvbG9yID0gdGhpcy5lbmNvZGVQaWNraW5nQ29sb3IoaSk7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDBdID0gcGlja2luZ0NvbG9yWzBdO1xuICAgICAgdmFsdWVbaSAqIHNpemUgKyAxXSA9IHBpY2tpbmdDb2xvclsxXTtcbiAgICAgIHZhbHVlW2kgKiBzaXplICsgMl0gPSBwaWNraW5nQ29sb3JbMl07XG4gICAgfVxuICB9XG5cbiAgZGVjb2RlUGlja2luZ0NvbG9yKGNvbG9yKSB7XG4gICAgYXNzZXJ0KGNvbG9yIGluc3RhbmNlb2YgVWludDhBcnJheSk7XG4gICAgY29uc3QgW2kxLCBpMiwgaTNdID0gY29sb3I7XG4gICAgLy8gMSB3YXMgYWRkZWQgdG8gc2VwZXJhdGUgZnJvbSBubyBzZWxlY3Rpb25cbiAgICBjb25zdCBpbmRleCA9IGkxICsgaTIgKiAyNTYgKyBpMyAqIDY1NTM2IC0gMTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBlbmNvZGVQaWNraW5nQ29sb3IoaSkge1xuICAgIHJldHVybiBbXG4gICAgICAoaSArIDEpICUgMjU2LFxuICAgICAgTWF0aC5mbG9vcigoaSArIDEpIC8gMjU2KSAlIDI1NixcbiAgICAgIE1hdGguZmxvb3IoKGkgKyAxKSAvIDI1NiAvIDI1NikgJSAyNTZcbiAgICBdO1xuICB9XG5cbiAgLy8gVklSVFVBTCBNRVRIT0QgLSBPdmVycmlkZSB0byBhZGQgb3IgbW9kaWZ5IGBpbmZvYCBvYmplY3QgaW4gc3VibGF5ZXJcbiAgLy8gVGhlIHN1YmxheWVyIG1heSBrbm93IHdoYXQgb2JqZWN0IGUuZy4gbGF0LGxvbiBjb3JyZXNwb25kcyB0byB1c2luZyBtYXRoXG4gIC8vIGV0YyBldmVuIHdoZW4gcGlja2luZyBkb2VzIG5vdCB3b3JrXG4gIG9uR2V0SG92ZXJJbmZvKGluZm8pIHtcbiAgICBjb25zdCB7Y29sb3J9ID0gaW5mbztcbiAgICBpbmZvLmluZGV4ID0gdGhpcy5kZWNvZGVQaWNraW5nQ29sb3IoY29sb3IpO1xuICAgIC8vIElmIHByb3BzLmRhdGEgaXMgYW4gaW5kZXhhYmxlIGFycmF5LCBnZXQgdGhlIG9iamVjdFxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuZGF0YSkpIHtcbiAgICAgIGluZm8ub2JqZWN0ID0gdGhpcy5wcm9wcy5kYXRhW2luZm8uaW5kZXhdO1xuICAgIH1cbiAgICBpbmZvLmdlb0Nvb3JkcyA9IHRoaXMudW5wcm9qZWN0KHt4OiBpbmZvLngsIHk6IGluZm8ueX0pO1xuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgb25Ib3ZlcihpbmZvKSB7XG4gICAgY29uc3Qge2NvbG9yfSA9IGluZm87XG5cbiAgICBjb25zdCBzZWxlY3RlZFBpY2tpbmdDb2xvciA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG4gICAgc2VsZWN0ZWRQaWNraW5nQ29sb3JbMF0gPSBjb2xvclswXTtcbiAgICBzZWxlY3RlZFBpY2tpbmdDb2xvclsxXSA9IGNvbG9yWzFdO1xuICAgIHNlbGVjdGVkUGlja2luZ0NvbG9yWzJdID0gY29sb3JbMl07XG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7c2VsZWN0ZWRQaWNraW5nQ29sb3J9KTtcblxuICAgIGluZm8gPSB0aGlzLm9uR2V0SG92ZXJJbmZvKGluZm8pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9uSG92ZXIoaW5mbyk7XG4gIH1cblxuICBvbkNsaWNrKGluZm8pIHtcbiAgICBpbmZvID0gdGhpcy5vbkdldEhvdmVySW5mbyhpbmZvKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkNsaWNrKGluZm8pO1xuICB9XG5cbiAgLy8gSU5URVJOQUwgTUVUSE9EU1xuICBfdXBkYXRlTW9kZWwoe2dsfSkge1xuICAgIGNvbnN0IHttb2RlbCwgYXR0cmlidXRlTWFuYWdlciwgdW5pZm9ybXN9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGFzc2VydChtb2RlbCk7XG4gICAgbW9kZWwuc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVNYW5hZ2VyLmdldEF0dHJpYnV0ZXMoKSk7XG4gICAgbW9kZWwuc2V0VW5pZm9ybXModW5pZm9ybXMpO1xuICAgIC8vIHdoZXRoZXIgY3VycmVudCBsYXllciByZXNwb25kcyB0byBtb3VzZSBldmVudHNcbiAgICBtb2RlbC5zZXRQaWNrYWJsZSh0aGlzLnByb3BzLmlzUGlja2FibGUpO1xuICB9XG5cbiAgY2hlY2tQcm9wKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICBpZiAocHJvcGVydHkgPT09IHVuZGVmaW5lZCB8fCBwcm9wZXJ0eSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQcm9wZXJ0eSAke3Byb3BlcnR5TmFtZX0gdW5kZWZpbmVkIGluIGxheWVyICR7dGhpcy5wcm9wcy5pZH1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBNQVAgTEFZRVIgRlVOQ1RJT05BTElUWVxuXG4gIHNldFZpZXdwb3J0KCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tfSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3cG9ydDoge3g6IDAsIHk6IDAsIHdpZHRoLCBoZWlnaHR9LFxuICAgICAgbWVyY2F0b3I6IFZpZXdwb3J0TWVyY2F0b3Ioe1xuICAgICAgICB3aWR0aCwgaGVpZ2h0LCBsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tLFxuICAgICAgICB0aWxlU2l6ZTogNTEyXG4gICAgICB9KVxuICAgIH0pO1xuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgdmlld3BvcnQ6IFswLCAwLCB3aWR0aCwgaGVpZ2h0XSxcbiAgICAgIG1lcmNhdG9yU2NhbGU6IE1hdGgucG93KDIsIHpvb20pLFxuICAgICAgbWVyY2F0b3JDZW50ZXI6IFtsb25naXR1ZGUsIGxhdGl0dWRlXVxuICAgIH0pO1xuICAgIGxvZygzLCB0aGlzLnN0YXRlLnZpZXdwb3J0LCBsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBjb252ZXJzaW9uIGlzIGRvbmUgaW4gc2hhZGVyLCBzbyBpbiBtYW55IGNhc2VzIHRoZXJlIGlzIG5vIG5lZWRcbiAgICogZm9yIHRoaXMgZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGxhdExuZyAtIEVpdGhlciBbbGF0LGxuZ10gb3Ige2xhdCwgbG9ufVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0geCwgeVxuICAgKi9cbiAgcHJvamVjdChsYXRMbmcpIHtcbiAgICBjb25zdCB7bWVyY2F0b3J9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBbeCwgeV0gPSBBcnJheS5pc0FycmF5KGxhdExuZykgP1xuICAgICAgbWVyY2F0b3IucHJvamVjdChbbGF0TG5nWzFdLCBsYXRMbmdbMF1dKSA6XG4gICAgICBtZXJjYXRvci5wcm9qZWN0KFtsYXRMbmcubG9uLCBsYXRMbmcubGF0XSk7XG4gICAgcmV0dXJuIHt4LCB5fTtcbiAgfVxuXG4gIHVucHJvamVjdCh4eSkge1xuICAgIGNvbnN0IHttZXJjYXRvcn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IFtsb24sIGxhdF0gPSBBcnJheS5pc0FycmF5KHh5KSA/XG4gICAgICBtZXJjYXRvci51bnByb2plY3QoeHkpIDpcbiAgICAgIG1lcmNhdG9yLnVucHJvamVjdChbeHkueCwgeHkueV0pO1xuICAgIHJldHVybiB7bGF0LCBsb259O1xuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuLi9zcmMvbGF5ZXIuanNcbiAqKi8iLCIvLyBFbmFibGUgY2xhc3NpYyBKYXZhU2NyaXB0IG9iamVjdCBtYXBzIHRvIGJlIHVzZWQgYXMgZGF0YVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkSXRlcmF0b3Iob2JqZWN0KSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iamVjdCkgJiYgIW9iamVjdFtTeW1ib2wuaXRlcmF0b3JdKSB7XG4gICAgb2JqZWN0W1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiBpdGVyYXRvcigpIHtcbiAgICAgIHJldHVybiB2YWx1ZUl0ZXJhdG9yKHRoaXMpO1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24qIHZhbHVlSXRlcmF0b3Iob2JqKSB7XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSBTeW1ib2wuaXRlcmF0b3IpIHtcbiAgICAgIHlpZWxkIG9ialtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG8pIHtcbiAgcmV0dXJuIG8gIT09IG51bGwgJiYgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIG8uY29uc3RydWN0b3IgPT09IE9iamVjdDtcbn1cblxuLy8gU2hhbGxvdyBjb21wYXJlXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gYXJlRXF1YWxTaGFsbG93KGEsIGIsIHtpZ25vcmUgPSB7fX0gPSB7fSkge1xuXG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIGEgIT09ICdvYmplY3QnIHx8IGEgPT09IG51bGwgfHxcbiAgICB0eXBlb2YgYiAhPT0gJ29iamVjdCcgfHwgYiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhhKS5sZW5ndGggIT09IE9iamVjdC5rZXlzKGIpLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIGEpIHtcbiAgICBpZiAoIShrZXkgaW4gaWdub3JlKSAmJiAoIShrZXkgaW4gYikgfHwgYVtrZXldICE9PSBiW2tleV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIGIpIHtcbiAgICBpZiAoIShrZXkgaW4gaWdub3JlKSAmJiAoIShrZXkgaW4gYSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vc3JjL3V0aWwuanNcbiAqKi8iLCJleHBvcnQge2RlZmF1bHQgYXMgZGVmYXVsdH0gZnJvbSAnLi9oZXhhZ29uLWxheWVyJztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvaGV4YWdvbi1sYXllci9pbmRleC5qc1xuICoqLyIsIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLXN0eWxlICovXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi8uLi9sYXllcic7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBDeWxpbmRlckdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogMiwgJzAnOiAneCcsICcxJzogJ3knfSxcbiAgaW5zdGFuY2VFbGV2YXRpb25zOiB7c2l6ZTogMSwgJzAnOiAneid9LFxuICBpbnN0YW5jZUNvbG9yczoge3NpemU6IDMsICcwJzogJ3JlZCcsICcxJzogJ2dyZWVuJywgJzInOiAnYmx1ZSd9XG59O1xuXG5jb25zdCBfZ2V0Q2VudHJvaWQgPSB4ID0+IHguY2VudHJvaWQ7XG5jb25zdCBfZ2V0RWxldmF0aW9uID0geCA9PiB4LmVsZXZhdGlvbiB8fCAwO1xuY29uc3QgX2dldENvbG9yID0geCA9PiB4LmNvbG9yIHx8IFsyNTUsIDAsIDBdO1xuY29uc3QgX2dldFZlcnRpY2VzID0geCA9PiB4LnZlcnRpY2VzO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZXhhZ29uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIEhleGFnb25MYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMuZG90UmFkaXVzIC0gaGV4YWdvbiByYWRpdXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMuZWxldmF0aW9uIC0gaGV4YWdvbiBoZWlnaHRcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0cy5vbkhleGFnb25Ib3ZlcmVkKGluZGV4LCBlKSAtIHBvcHVwIHNlbGVjdGVkIGluZGV4XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdHMub25IZXhhZ29uQ2xpY2tlZChpbmRleCwgZSkgLSBwb3B1cCBzZWxlY3RlZCBpbmRleFxuICAgKi9cbiAgY29uc3RydWN0b3Ioe1xuICAgIGlkID0gJ2hleGFnb24tbGF5ZXInLFxuICAgIGRvdFJhZGl1cyA9IDEwLFxuICAgIGVsZXZhdGlvbiA9IDEwMCxcbiAgICB2ZXJ0aWNlcyxcbiAgICBnZXRDZW50cm9pZCA9IF9nZXRDZW50cm9pZCxcbiAgICBnZXRFbGV2YXRpb24gPSBfZ2V0RWxldmF0aW9uLFxuICAgIGdldENvbG9yID0gX2dldENvbG9yLFxuICAgIGdldFZlcnRpY2VzID0gX2dldFZlcnRpY2VzLFxuICAgIC4uLm9wdHNcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWQsXG4gICAgICBkb3RSYWRpdXMsXG4gICAgICBlbGV2YXRpb24sXG4gICAgICB2ZXJ0aWNlcyxcbiAgICAgIGdldENlbnRyb2lkLFxuICAgICAgZ2V0RWxldmF0aW9uLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRWZXJ0aWNlcyxcbiAgICAgIC4uLm9wdHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2wsIGF0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IHRoaXMuZ2V0TW9kZWwoZ2wpXG4gICAgfSk7XG5cbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZChBVFRSSUJVVEVTLCB7XG4gICAgICBpbnN0YW5jZVBvc2l0aW9uczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9uc30sXG4gICAgICBpbnN0YW5jZUVsZXZhdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VFbGV2YXRpb25zfSxcbiAgICAgIGluc3RhbmNlQ29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzfVxuICAgIH0pO1xuXG4gICAgdGhpcy5jYWxjdWxhdGVSYWRpdXNBbmRBbmdsZSgpO1xuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICBlbGV2YXRpb246IHRoaXMucHJvcHMuZWxldmF0aW9uXG4gICAgfSk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIHN1cGVyLndpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKTtcblxuICAgIGNvbnN0IHtkYXRhQ2hhbmdlZCwgdmlld3BvcnRDaGFuZ2VkLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoZGF0YUNoYW5nZWQgfHwgdmlld3BvcnRDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmNhbGN1bGF0ZVJhZGl1c0FuZEFuZ2xlKCk7XG4gICAgfVxuICAgIGlmIChkYXRhQ2hhbmdlZCkge1xuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICBlbGV2YXRpb246IHRoaXMucHJvcHMuZWxldmF0aW9uXG4gICAgfSk7XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IEN5bGluZGVyR2VvbWV0cnkoe1xuICAgICAgcmFkaXVzOiAxLFxuICAgICAgdG9wUmFkaXVzOiAxLFxuICAgICAgYm90dG9tUmFkaXVzOiAxLFxuICAgICAgdG9wQ2FwOiB0cnVlLFxuICAgICAgYm90dG9tQ2FwOiB0cnVlLFxuICAgICAgaGVpZ2h0OiAxLFxuICAgICAgbnJhZGlhbDogNixcbiAgICAgIG52ZXJ0aWNhbDogMVxuICAgIH0pO1xuXG4gICAgLy8gY29uc3QgTlVNX1NFR01FTlRTID0gNjtcbiAgICAvLyBjb25zdCBQSTIgPSBNYXRoLlBJICogMjtcblxuICAgIC8vIGxldCB2ZXJ0aWNlcyA9IFtdO1xuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNX1NFR01FTlRTOyBpKyspIHtcbiAgICAvLyAgIHZlcnRpY2VzID0gW1xuICAgIC8vICAgICAuLi52ZXJ0aWNlcyxcbiAgICAvLyAgICAgTWF0aC5jb3MoUEkyICogaSAvIE5VTV9TRUdNRU5UUyksXG4gICAgLy8gICAgIE1hdGguc2luKFBJMiAqIGkgLyBOVU1fU0VHTUVOVFMpLFxuICAgIC8vICAgICAwXG4gICAgLy8gICBdO1xuICAgIC8vIH1cblxuICAgIC8vIGNvbnN0IGdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KHtcbiAgICAvLyAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgIC8vICAgZHJhd01vZGU6ICdUUklBTkdMRV9GQU4nLFxuICAgIC8vICAgdmVydGljZXM6IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpXG4gICAgLy8gfSk7XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgcHJvZ3JhbTogbmV3IFByb2dyYW0oZ2wsIHtcbiAgICAgICAgdnM6IGdsc2xpZnkoJy4vaGV4YWdvbi1sYXllci12ZXJ0ZXguZ2xzbCcpLFxuICAgICAgICBmczogZ2xzbGlmeSgnLi9oZXhhZ29uLWxheWVyLWZyYWdtZW50Lmdsc2wnKSxcbiAgICAgICAgaWQ6ICdoZXhhZ29uJ1xuICAgICAgfSksXG4gICAgICBnZW9tZXRyeSxcbiAgICAgIGlzSW5zdGFuY2VkOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0Q2VudHJvaWR9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGhleGFnb24gb2YgZGF0YSkge1xuICAgICAgY29uc3QgY2VudHJvaWQgPSBnZXRDZW50cm9pZChoZXhhZ29uKTtcbiAgICAgIHZhbHVlW2kgKyAwXSA9IGNlbnRyb2lkWzBdO1xuICAgICAgdmFsdWVbaSArIDFdID0gY2VudHJvaWRbMV07XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VFbGV2YXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRFbGV2YXRpb259ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGhleGFnb24gb2YgZGF0YSkge1xuICAgICAgY29uc3QgZWxldmF0aW9uID0gZ2V0RWxldmF0aW9uKGhleGFnb24pIHx8IDA7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBlbGV2YXRpb247XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldENvbG9yfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBoZXhhZ29uIG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3IoaGV4YWdvbik7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBjb2xvclswXTtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IGNvbG9yWzFdO1xuICAgICAgdmFsdWVbaSArIDJdID0gY29sb3JbMl07XG4gICAgICBpICs9IDM7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyB0aGlzIGlzIHRoZSBvbmx5IHBsYWNlIHRoYXQgdXNlcyBoZXhhZ29uIHZlcnRpY2VzXG4gIC8vIGNvbnNpZGVyIG1vdmUgcmFkaXVzIGFuZCBhbmdsZSBjYWxjdWxhdGlvbiB0byB0aGUgc2hhZGVyXG4gIGNhbGN1bGF0ZVJhZGl1c0FuZEFuZ2xlKCkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRWZXJ0aWNlc30gPSB0aGlzLnByb3BzO1xuICAgIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVpdGhlciBnZXQgdmVydGljZXMgZnJvbSBwcm9wLCBvciBmcm9tIGZpcnN0IGhleGFnb25cbiAgICBsZXQge3ZlcnRpY2VzfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKCF2ZXJ0aWNlcykge1xuICAgICAgY29uc3QgZmlyc3RIZXhhZ29uID0gdGhpcy5nZXRGaXJzdE9iamVjdCgpO1xuICAgICAgdmVydGljZXMgPSBnZXRWZXJ0aWNlcyhmaXJzdEhleGFnb24pO1xuICAgIH1cbiAgICBjb25zdCB2ZXJ0ZXgwID0gdmVydGljZXNbMF07XG4gICAgY29uc3QgdmVydGV4MyA9IHZlcnRpY2VzWzNdO1xuXG4gICAgLy8gdHJhbnNmb3JtIHRvIHNwYWNlIGNvb3JkaW5hdGVzXG4gICAgY29uc3Qgc3BhY2VDb29yZDAgPSB0aGlzLnByb2plY3Qoe2xhdDogdmVydGV4MFsxXSwgbG9uOiB2ZXJ0ZXgwWzBdfSk7XG4gICAgY29uc3Qgc3BhY2VDb29yZDMgPSB0aGlzLnByb2plY3Qoe2xhdDogdmVydGV4M1sxXSwgbG9uOiB2ZXJ0ZXgzWzBdfSk7XG5cbiAgICAvLyBkaXN0YW5jZSBiZXR3ZWVuIHR3byBjbG9zZSBjZW50cm9pZHNcbiAgICBjb25zdCBkeCA9IHNwYWNlQ29vcmQwLnggLSBzcGFjZUNvb3JkMy54O1xuICAgIGNvbnN0IGR5ID0gc3BhY2VDb29yZDAueSAtIHNwYWNlQ29vcmQzLnk7XG4gICAgY29uc3QgZHh5ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgLy8gQ2FsY3VsYXRlIGFuZ2xlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaGV4YWdvbiB2ZXJ0ZXggYXhpcyBpcyB0aWx0ZWRcbiAgICAgIGFuZ2xlOiBNYXRoLmFjb3MoZHggLyBkeHkpICogLU1hdGguc2lnbihkeSkgKyBNYXRoLlBJIC8gMixcbiAgICAgIC8vIEFsbG93IHVzZXIgdG8gZmluZSB0dW5lIHJhZGl1c1xuICAgICAgcmFkaXVzOiBkeHkgLyAyICogTWF0aC5taW4oMSwgdGhpcy5wcm9wcy5kb3RSYWRpdXMpXG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvaGV4YWdvbi1sYXllci9oZXhhZ29uLWxheWVyLmpzXG4gKiovIiwiZXhwb3J0IHtkZWZhdWx0IGFzIGRlZmF1bHR9IGZyb20gJy4vY2hvcm9wbGV0aC1sYXllcic7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuLi8uLi8uLi9zcmMvbGF5ZXJzL2Nob3JvcGxldGgtbGF5ZXIvaW5kZXguanNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vLi4vbGF5ZXInO1xuaW1wb3J0IGVhcmN1dCBmcm9tICdlYXJjdXQnO1xuaW1wb3J0IGZsYXR0ZW5EZWVwIGZyb20gJ2xvZGFzaC5mbGF0dGVuZGVlcCc7XG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ2dlb2pzb24tbm9ybWFsaXplJztcbmltcG9ydCB7TW9kZWwsIFByb2dyYW0sIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluZGljZXM6IHtzaXplOiAxLCAnMCc6ICdpbmRleCcsIGlzSW5kZXhlZDogdHJ1ZX0sXG4gIHBvc2l0aW9uczoge3NpemU6IDMsICcwJzogJ3gnLCAnMSc6ICd5JywgJzInOiAndW51c2VkJ30sXG4gIGNvbG9yczoge3NpemU6IDMsICcwJzogJ3JlZCcsICcxJzogJ2dyZWVuJywgJzInOiAnYmx1ZSd9LFxuICAvLyBPdmVycmlkZSBwaWNraW5nIGNvbG9ycyB0byBwcmV2ZW50IGF1dG8gYWxsb2NhdGlvblxuICBwaWNraW5nQ29sb3JzOiB7c2l6ZTogMywgJzAnOiAncGlja1JlZCcsICcxJzogJ3BpY2tHcmVlbicsICcyJzogJ3BpY2tCbHVlJ31cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENob3JvcGxldGhMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBjbGFzc2Rlc2NcbiAgICogQ2hvcm9wbGV0aExheWVyXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAgICogQHBhcmFtIHtib29sfSBwcm9wcy5kcmF3Q29udG91ciAtID8gZHJhd0NvbnRvdXIgOiBkcmF3QXJlYVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9wcy5vbkNob3JvcGxldGhIb3ZlcmVkIC0gcHJvdmlkZSBwcm9lcnRpZXMgb2YgdGhlXG4gICAqIHNlbGVjdGVkIGNob3JvcGxldGgsIHRvZ2V0aGVyIHdpdGggdGhlIG1vdXNlIGV2ZW50IHdoZW4gbW91c2UgaG92ZXJlZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9wcy5vbkNob3JvcGxldGhDbGlja2VkIC0gcHJvdmlkZSBwcm9lcnRpZXMgb2YgdGhlXG4gICAqIHNlbGVjdGVkIGNob3JvcGxldGgsIHRvZ2V0aGVyIHdpdGggdGhlIG1vdXNlIGV2ZW50IHdoZW4gbW91c2UgY2xpY2tlZFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgLi4ucHJvcHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2wsIGF0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkRHluYW1pYyhBVFRSSUJVVEVTLCB7XG4gICAgICAvLyBQcmltdGl2ZSBhdHRyaWJ1dGVzXG4gICAgICBpbmRpY2VzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluZGljZXN9LFxuICAgICAgcG9zaXRpb25zOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uc30sXG4gICAgICBjb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlQ29sb3JzfSxcbiAgICAgIC8vIEluc3RhbmNlZCBhdHRyaWJ1dGVzXG4gICAgICBwaWNraW5nQ29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZVBpY2tpbmdDb2xvcnMsIG5vQWxsb2M6IHRydWV9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFVuaWZvcm1zKHtvcGFjaXR5OiB0aGlzLnByb3BzLm9wYWNpdHl9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG51bUluc3RhbmNlczogMCxcbiAgICAgIG1vZGVsOiB0aGlzLmdldE1vZGVsKGdsKVxuICAgIH0pO1xuXG4gICAgdGhpcy5leHRyYWN0Q2hvcm9wbGV0aHMoKTtcbiAgfVxuXG4gIHdpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpO1xuXG4gICAgY29uc3Qge2RhdGFDaGFuZ2VkLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKGRhdGFDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmV4dHJhY3RDaG9yb3BsZXRocygpO1xuXG4gICAgICBhdHRyaWJ1dGVNYW5hZ2VyLmludmFsaWRhdGVBbGwoKTtcbiAgICB9XG5cbiAgICBpZiAob2xkUHJvcHMub3BhY2l0eSAhPT0gbmV3UHJvcHMub3BhY2l0eSkge1xuICAgICAgdGhpcy5zZXRVbmlmb3Jtcyh7b3BhY2l0eTogbmV3UHJvcHMub3BhY2l0eX0pO1xuICAgIH1cbiAgfVxuXG4gIGdldE1vZGVsKGdsKSB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbCh7XG4gICAgICBwcm9ncmFtOiBuZXcgUHJvZ3JhbShnbCwge1xuICAgICAgICB2czogZ2xzbGlmeSgnLi9jaG9yb3BsZXRoLWxheWVyLXZlcnRleC5nbHNsJyksXG4gICAgICAgIGZzOiBnbHNsaWZ5KCcuL2Nob3JvcGxldGgtbGF5ZXItZnJhZ21lbnQuZ2xzbCcpLFxuICAgICAgICBpZDogJ2Nob3JvcGxldGgnXG4gICAgICB9KSxcbiAgICAgIGdlb21ldHJ5OiBuZXcgR2VvbWV0cnkoe1xuICAgICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgICAgZHJhd01vZGU6IHRoaXMucHJvcHMuZHJhd0NvbnRvdXIgPyAnTElORVMnIDogJ1RSSUFOR0xFUydcbiAgICAgIH0pLFxuICAgICAgdmVydGV4Q291bnQ6IDAsXG4gICAgICBpc0luZGV4ZWQ6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB2ZXJ0aWNlcyA9IGZsYXR0ZW5EZWVwKHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzKTtcbiAgICBhdHRyaWJ1dGUudmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluZGljZXMoYXR0cmlidXRlKSB7XG4gICAgLy8gYWRqdXN0IGluZGV4IG9mZnNldCBmb3IgbXVsdGlwbGUgY2hvcm9wbGV0aHNcbiAgICBjb25zdCBvZmZzZXRzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMucmVkdWNlKFxuICAgICAgKGFjYywgdmVydGljZXMpID0+IFsuLi5hY2MsIGFjY1thY2MubGVuZ3RoIC0gMV0gKyB2ZXJ0aWNlcy5sZW5ndGhdLFxuICAgICAgWzBdXG4gICAgKTtcblxuICAgIGNvbnN0IGluZGljZXMgPSB0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcy5tYXAoXG4gICAgICAodmVydGljZXMsIGNob3JvcGxldGhJbmRleCkgPT4gdGhpcy5wcm9wcy5kcmF3Q29udG91ciA/XG4gICAgICAgIC8vIDEuIGdldCBzZXF1ZW50aWFsbHkgb3JkZXJlZCBpbmRpY2VzIG9mIGVhY2ggY2hvcm9wbGV0aCBjb250b3VyXG4gICAgICAgIC8vIDIuIG9mZnNldCB0aGVtIGJ5IHRoZSBudW1iZXIgb2YgaW5kaWNlcyBpbiBwcmV2aW91cyBjaG9yb3BsZXRoc1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUNvbnRvdXJJbmRpY2VzKHZlcnRpY2VzLmxlbmd0aCkubWFwKFxuICAgICAgICAgIGluZGV4ID0+IGluZGV4ICsgb2Zmc2V0c1tjaG9yb3BsZXRoSW5kZXhdXG4gICAgICAgICkgOlxuICAgICAgICAvLyAxLiBnZXQgdHJpYW5ndWxhdGVkIGluZGljZXMgZm9yIHRoZSBpbnRlcm5hbCBhcmVhc1xuICAgICAgICAvLyAyLiBvZmZzZXQgdGhlbSBieSB0aGUgbnVtYmVyIG9mIGluZGljZXMgaW4gcHJldmlvdXMgY2hvcm9wbGV0aHNcbiAgICAgICAgZWFyY3V0KGZsYXR0ZW5EZWVwKHZlcnRpY2VzKSwgbnVsbCwgMykubWFwKFxuICAgICAgICAgIGluZGV4ID0+IGluZGV4ICsgb2Zmc2V0c1tjaG9yb3BsZXRoSW5kZXhdXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IFVpbnQxNkFycmF5KGZsYXR0ZW5EZWVwKGluZGljZXMpKTtcbiAgICBhdHRyaWJ1dGUudGFyZ2V0ID0gdGhpcy5zdGF0ZS5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUjtcbiAgICB0aGlzLnN0YXRlLm1vZGVsLnNldFZlcnRleENvdW50KGF0dHJpYnV0ZS52YWx1ZS5sZW5ndGggLyBhdHRyaWJ1dGUuc2l6ZSk7XG4gIH1cblxuICBjYWxjdWxhdGVDb2xvcnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMubWFwKFxuICAgICAgdmVydGljZXMgPT4gdmVydGljZXMubWFwKFxuICAgICAgICB2ZXJ0ZXggPT4gdGhpcy5wcm9wcy5kcmF3Q29udG91ciA/IFswLCAwLCAwXSA6IFsxMjgsIDEyOCwgMTI4XVxuICAgICAgKVxuICAgICk7XG5cbiAgICBhdHRyaWJ1dGUudmFsdWUgPSBuZXcgRmxvYXQzMkFycmF5KGZsYXR0ZW5EZWVwKGNvbG9ycykpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHQgcGlja2luZyBjb2xvcnMgY2FsY3VsYXRpb25cbiAgY2FsY3VsYXRlUGlja2luZ0NvbG9ycyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcy5tYXAoXG4gICAgICAodmVydGljZXMsIGNob3JvcGxldGhJbmRleCkgPT4gdmVydGljZXMubWFwKFxuICAgICAgICB2ZXJ0ZXggPT4gdGhpcy5wcm9wcy5kcmF3Q29udG91ciA/IFstMSwgLTEsIC0xXSA6IFtcbiAgICAgICAgICAoY2hvcm9wbGV0aEluZGV4ICsgMSkgJSAyNTYsXG4gICAgICAgICAgTWF0aC5mbG9vcigoY2hvcm9wbGV0aEluZGV4ICsgMSkgLyAyNTYpICUgMjU2LFxuICAgICAgICAgIE1hdGguZmxvb3IoKGNob3JvcGxldGhJbmRleCArIDEpIC8gMjU2IC8gMjU2KSAlIDI1Nl1cbiAgICAgIClcbiAgICApO1xuXG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShmbGF0dGVuRGVlcChjb2xvcnMpKTtcbiAgfVxuXG4gIGV4dHJhY3RDaG9yb3BsZXRocygpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRHZW9qc29uID0gbm9ybWFsaXplKGRhdGEpO1xuXG4gICAgdGhpcy5zdGF0ZS5jaG9yb3BsZXRocyA9IG5vcm1hbGl6ZWRHZW9qc29uLmZlYXR1cmVzLm1hcChjaG9yb3BsZXRoID0+IHtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IGNob3JvcGxldGguZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF07XG4gICAgICAvLyBmbGF0dGVuIG5lc3RlZCBwb2x5Z29uc1xuICAgICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMSAmJiBjb29yZGluYXRlc1swXS5sZW5ndGggPiAyKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXNbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9wZXJ0aWVzOiBjaG9yb3BsZXRoLnByb3BlcnRpZXMsXG4gICAgICAgIGNvb3JkaW5hdGVzXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMgPSB0aGlzLnN0YXRlLmNob3JvcGxldGhzLm1hcChcbiAgICAgIGNob3JvcGxldGggPT4gY2hvcm9wbGV0aC5jb29yZGluYXRlcy5tYXAoXG4gICAgICAgIGNvb3JkaW5hdGUgPT4gW2Nvb3JkaW5hdGVbMF0sIGNvb3JkaW5hdGVbMV0sIDBdXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUNvbnRvdXJJbmRpY2VzKG51bVZlcnRpY2VzKSB7XG4gICAgLy8gdXNlIHZlcnRleCBwYWlycyBmb3IgZ2wuTElORVMgPT4gWzAsIDEsIDEsIDIsIDIsIC4uLiwgbi0xLCBuLTEsIDBdXG4gICAgbGV0IGluZGljZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG51bVZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgICBpbmRpY2VzID0gWy4uLmluZGljZXMsIGksIGldO1xuICAgIH1cbiAgICByZXR1cm4gWzAsIC4uLmluZGljZXMsIDBdO1xuXG4gIH1cblxuICBvbkhvdmVyKGluZm8pIHtcbiAgICBjb25zdCB7aW5kZXh9ID0gaW5mbztcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGZlYXR1cmUgPSBkYXRhLmZlYXR1cmVzW2luZGV4XTtcbiAgICB0aGlzLnByb3BzLm9uSG92ZXIoey4uLmluZm8sIGZlYXR1cmV9KTtcbiAgfVxuXG4gIG9uQ2xpY2soaW5mbykge1xuICAgIGNvbnN0IHtpbmRleH0gPSBpbmZvO1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZmVhdHVyZSA9IGRhdGEuZmVhdHVyZXNbaW5kZXhdO1xuICAgIHRoaXMucHJvcHMub25DbGljayh7Li4uaW5mbywgZmVhdHVyZX0pO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvY2hvcm9wbGV0aC1sYXllci9jaG9yb3BsZXRoLWxheWVyLmpzXG4gKiovIiwiZXhwb3J0IHtkZWZhdWx0IGFzIGRlZmF1bHR9IGZyb20gJy4vc2NhdHRlcnBsb3QtbGF5ZXInO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vLi4vLi4vc3JjL2xheWVycy9zY2F0dGVycGxvdC1sYXllci9pbmRleC5qc1xuICoqLyIsIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi8uLi9sYXllcic7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSgnZ2xzbGlmeScpO1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbnN0YW5jZVBvc2l0aW9uczoge3NpemU6IDMsICcwJzogJ3gnLCAnMSc6ICd5JywgJzInOiAndW51c2VkJ30sXG4gIGluc3RhbmNlQ29sb3JzOiB7c2l6ZTogMywgJzAnOiAncmVkJywgJzEnOiAnZ3JlZW4nLCAnMic6ICdibHVlJ31cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYXR0ZXJwbG90TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG5cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiBBVFRSSUJVVEVTO1xuICB9XG5cbiAgLypcbiAgICogQGNsYXNzZGVzY1xuICAgKiBTY2F0dGVycGxvdExheWVyXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHByb3BzLnJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgKi9cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IHRoaXMuZ2V0TW9kZWwoZ2wpXG4gICAgfSk7XG5cbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZChBVFRSSUJVVEVTLCB7XG4gICAgICBpbnN0YW5jZVBvc2l0aW9uczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9uc30sXG4gICAgICBpbnN0YW5jZUNvbG9yczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZUNvbG9yc31cbiAgICB9KTtcbiAgfVxuXG4gIGRpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlVW5pZm9ybXMoKTtcbiAgfVxuXG4gIHdpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMudXBkYXRlVW5pZm9ybXMoKTtcbiAgfVxuXG4gIGdldE1vZGVsKGdsKSB7XG4gICAgY29uc3QgTlVNX1NFR01FTlRTID0gMTY7XG4gICAgY29uc3QgUEkyID0gTWF0aC5QSSAqIDI7XG5cbiAgICBsZXQgcG9zaXRpb25zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1fU0VHTUVOVFM7IGkrKykge1xuICAgICAgcG9zaXRpb25zID0gW1xuICAgICAgICAuLi5wb3NpdGlvbnMsXG4gICAgICAgIE1hdGguY29zKFBJMiAqIGkgLyBOVU1fU0VHTUVOVFMpLFxuICAgICAgICBNYXRoLnNpbihQSTIgKiBpIC8gTlVNX1NFR01FTlRTKSxcbiAgICAgICAgMFxuICAgICAgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIHByb2dyYW06IG5ldyBQcm9ncmFtKGdsLCB7XG4gICAgICAgIHZzOiBnbHNsaWZ5KCcuL3NjYXR0ZXJwbG90LWxheWVyLXZlcnRleC5nbHNsJyksXG4gICAgICAgIGZzOiBnbHNsaWZ5KCcuL3NjYXR0ZXJwbG90LWxheWVyLWZyYWdtZW50Lmdsc2wnKSxcbiAgICAgICAgaWQ6ICdzY2F0dGVycGxvdCdcbiAgICAgIH0pLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGRyYXdNb2RlOiAnVFJJQU5HTEVfRkFOJyxcbiAgICAgICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucylcbiAgICAgIH0pLFxuICAgICAgaXNJbnN0YW5jZWQ6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVVuaWZvcm1zKCkge1xuICAgIHRoaXMuY2FsY3VsYXRlUmFkaXVzKCk7XG4gICAgY29uc3Qge3JhZGl1c30gPSB0aGlzLnN0YXRlO1xuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgcmFkaXVzXG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgdmFsdWVbaSArIDBdID0gcG9pbnQucG9zaXRpb24ueDtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IHBvaW50LnBvc2l0aW9uLnk7XG4gICAgICB2YWx1ZVtpICsgMl0gPSBwb2ludC5wb3NpdGlvbi56O1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBwb2ludC5jb2xvclswXTtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IHBvaW50LmNvbG9yWzFdO1xuICAgICAgdmFsdWVbaSArIDJdID0gcG9pbnQuY29sb3JbMl07XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlUmFkaXVzKCkge1xuICAgIC8vIHVzZSByYWRpdXMgaWYgc3BlY2lmaWVkXG4gICAgaWYgKHRoaXMucHJvcHMucmFkaXVzKSB7XG4gICAgICB0aGlzLnN0YXRlLnJhZGl1cyA9IHRoaXMucHJvcHMucmFkaXVzO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBpeGVsMCA9IHRoaXMucHJvamVjdCh7bG9uOiAtMTIyLCBsYXQ6IDM3LjV9KTtcbiAgICBjb25zdCBwaXhlbDEgPSB0aGlzLnByb2plY3Qoe2xvbjogLTEyMiwgbGF0OiAzNy41MDAyfSk7XG5cbiAgICBjb25zdCBkeCA9IHBpeGVsMC54IC0gcGl4ZWwxLng7XG4gICAgY29uc3QgZHkgPSBwaXhlbDAueSAtIHBpeGVsMS55O1xuXG4gICAgdGhpcy5zdGF0ZS5yYWRpdXMgPSBNYXRoLm1heChNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpLCAyLjApO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvc2NhdHRlcnBsb3QtbGF5ZXIvc2NhdHRlcnBsb3QtbGF5ZXIuanNcbiAqKi8iLCJleHBvcnQge2RlZmF1bHQgYXMgZGVmYXVsdH0gZnJvbSAnLi9ncmlkLWxheWVyJztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvZ3JpZC1sYXllci9pbmRleC5qc1xuICoqLyIsIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi8uLi9sYXllcic7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSgnZ2xzbGlmeScpO1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbnN0YW5jZVBvc2l0aW9uczoge3NpemU6IDMsICcwJzogJ3gnLCAnMSc6ICd5JywgJzInOiAndW51c2VkJ30sXG4gIGluc3RhbmNlQ29sb3JzOiB7c2l6ZTogNCwgJzAnOiAncmVkJywgJzEnOiAnZ3JlZW4nLCAnMic6ICdibHVlJywgJzMnOiAnYWxwaGEnfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZExheWVyIGV4dGVuZHMgTGF5ZXIge1xuXG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gQVRUUklCVVRFUztcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIEdyaWRMYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMudW5pdFdpZHRoIC0gd2lkdGggb2YgdGhlIHVuaXQgcmVjdGFuZ2xlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRzLnVuaXRIZWlnaHQgLSBoZWlnaHQgb2YgdGhlIHVuaXQgcmVjdGFuZ2xlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgdW5pdFdpZHRoOiAxMDAsXG4gICAgICB1bml0SGVpZ2h0OiAxMDAsXG4gICAgICAuLi5vcHRzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGVsOiB0aGlzLmdldE1vZGVsKGdsKVxuICAgIH0pO1xuXG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoQVRUUklCVVRFUywge1xuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnN9LFxuICAgICAgaW5zdGFuY2VDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnN9XG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZUNlbGwoKTtcbiAgfVxuXG4gIHdpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpO1xuXG4gICAgY29uc3QgY2VsbFNpemVDaGFuZ2VkID1cbiAgICAgIG5ld1Byb3BzLnVuaXRXaWR0aCAhPT0gb2xkUHJvcHMudW5pdFdpZHRoIHx8XG4gICAgICBuZXdQcm9wcy51bml0SGVpZ2h0ICE9PSBvbGRQcm9wcy51bml0SGVpZ2h0O1xuXG4gICAgaWYgKGNlbGxTaXplQ2hhbmdlZCB8fCB0aGlzLnN0YXRlLnZpZXdwb3J0Q2hhbmdlZCkge1xuICAgICAgdGhpcy51cGRhdGVDZWxsKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TW9kZWwoZ2wpIHtcbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIHByb2dyYW06IG5ldyBQcm9ncmFtKGdsLCB7XG4gICAgICAgIHZzOiBnbHNsaWZ5KCcuL2dyaWQtbGF5ZXItdmVydGV4Lmdsc2wnKSxcbiAgICAgICAgZnM6IGdsc2xpZnkoJy4vZ3JpZC1sYXllci1mcmFnbWVudC5nbHNsJyksXG4gICAgICAgIGlkOiAnZ3JpZCdcbiAgICAgIH0pLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgICBkcmF3TW9kZTogJ1RSSUFOR0xFX0ZBTicsXG4gICAgICAgIHZlcnRpY2VzOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwXSlcbiAgICAgIH0pLFxuICAgICAgaXNJbnN0YW5jZWQ6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUNlbGwoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHQsIHVuaXRXaWR0aCwgdW5pdEhlaWdodH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbnVtQ29sID0gTWF0aC5jZWlsKHdpZHRoICogMiAvIHVuaXRXaWR0aCk7XG4gICAgY29uc3QgbnVtUm93ID0gTWF0aC5jZWlsKGhlaWdodCAqIDIgLyB1bml0SGVpZ2h0KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG51bUNvbCxcbiAgICAgIG51bVJvdyxcbiAgICAgIG51bUluc3RhbmNlczogbnVtQ29sICogbnVtUm93XG4gICAgfSk7XG5cbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuXG4gICAgY29uc3QgTUFSR0lOID0gMjtcbiAgICBjb25zdCBzY2FsZSA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgdW5pdFdpZHRoIC0gTUFSR0lOICogMixcbiAgICAgIHVuaXRIZWlnaHQgLSBNQVJHSU4gKiAyLFxuICAgICAgMVxuICAgIF0pO1xuICAgIHRoaXMuc2V0VW5pZm9ybXMoe3NjYWxlfSk7XG5cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zKGF0dHJpYnV0ZSwgbnVtSW5zdGFuY2VzKSB7XG4gICAgY29uc3Qge3VuaXRXaWR0aCwgdW5pdEhlaWdodCwgd2lkdGgsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtudW1Db2x9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1JbnN0YW5jZXM7IGkrKykge1xuICAgICAgY29uc3QgeCA9IGkgJSBudW1Db2w7XG4gICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihpIC8gbnVtQ29sKTtcbiAgICAgIHZhbHVlW2kgKiBzaXplICsgMF0gPSB4ICogdW5pdFdpZHRoIC0gd2lkdGg7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDFdID0geSAqIHVuaXRIZWlnaHQgLSBoZWlnaHQ7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDJdID0gMDtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZUNvbG9ycyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgdW5pdFdpZHRoLCB1bml0SGVpZ2h0LCB3aWR0aCwgaGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge251bUNvbCwgbnVtUm93fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcblxuICAgIHZhbHVlLmZpbGwoMC4wKTtcblxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgY29uc3QgcGl4ZWwgPSB0aGlzLnByb2plY3QoW3BvaW50LnBvc2l0aW9uLnksIHBvaW50LnBvc2l0aW9uLnhdKTtcbiAgICAgIGNvbnN0IGNvbElkID0gTWF0aC5mbG9vcigocGl4ZWwueCArIHdpZHRoKSAvIHVuaXRXaWR0aCk7XG4gICAgICBjb25zdCByb3dJZCA9IE1hdGguZmxvb3IoKHBpeGVsLnkgKyBoZWlnaHQpIC8gdW5pdEhlaWdodCk7XG4gICAgICBpZiAoY29sSWQgPCBudW1Db2wgJiYgcm93SWQgPCBudW1Sb3cpIHtcbiAgICAgICAgY29uc3QgaTQgPSAoY29sSWQgKyByb3dJZCAqIG51bUNvbCkgKiBzaXplO1xuICAgICAgICB2YWx1ZVtpNCArIDJdID0gdmFsdWVbaTQgKyAwXSArPSAxO1xuICAgICAgICB2YWx1ZVtpNCArIDFdICs9IDU7XG4gICAgICAgIHZhbHVlW2k0ICsgM10gPSAwLjY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7bWF4Q291bnQ6IE1hdGgubWF4KC4uLnZhbHVlKX0pO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvZ3JpZC1sYXllci9ncmlkLWxheWVyLmpzXG4gKiovIiwiZXhwb3J0IHtkZWZhdWx0IGFzIGRlZmF1bHR9IGZyb20gJy4vYXJjLWxheWVyJztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2luZGV4LmpzXG4gKiovIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uLy4uL2xheWVyJztcbmltcG9ydCB7TW9kZWwsIFByb2dyYW0sIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogNCwgJzAnOiAneDAnLCAnMSc6ICd5MCcsICcyJzogJ3gxJywgJzMnOiAneTEnfSxcbiAgaW5zdGFuY2VDb2xvcnM6IHtzaXplOiAzLCAnMCc6ICdyZWQnLCAnMSc6ICdncmVlbicsICcyJzogJ2JsdWUnfVxufTtcblxuY29uc3QgUkVEID0gWzI1NSwgMCwgMF07XG5jb25zdCBCTFVFID0gWzAsIDAsIDI1NV07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFyY0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBBcmNMYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHJva2VXaWR0aCA9IDEsXG4gICAgY29sb3IwID0gUkVELFxuICAgIGNvbG9yMSA9IEJMVUUsXG4gICAgLi4ub3B0c1xuICB9ID0ge30pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHJva2VXaWR0aCxcbiAgICAgIGNvbG9yMCxcbiAgICAgIGNvbG9yMSxcbiAgICAgIC4uLm9wdHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2wsIGF0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5jcmVhdGVNb2RlbChnbCk7XG4gICAgbW9kZWwudXNlckRhdGEuc3Ryb2tlV2lkdGggPSB0aGlzLnByb3BzLnN0cm9rZVdpZHRoO1xuICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsfSk7XG5cbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZChBVFRSSUJVVEVTLCB7XG4gICAgICBpbnN0YW5jZVBvc2l0aW9uczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9uc30sXG4gICAgICBpbnN0YW5jZUNvbG9yczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZUNvbG9yc31cbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXh0UHJvcHMpIHtcbiAgICBzdXBlci53aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXh0UHJvcHMpO1xuICAgIHRoaXMuc3RhdGUubW9kZWwudXNlckRhdGEuc3Ryb2tlV2lkdGggPSBuZXh0UHJvcHMuc3Ryb2tlV2lkdGg7XG4gICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcbiAgfVxuXG4gIGNyZWF0ZU1vZGVsKGdsKSB7XG4gICAgbGV0IHBvc2l0aW9ucyA9IFtdO1xuICAgIGNvbnN0IE5VTV9TRUdNRU5UUyA9IDUwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNX1NFR01FTlRTOyBpKyspIHtcbiAgICAgIHBvc2l0aW9ucyA9IFsuLi5wb3NpdGlvbnMsIGksIGksIGldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgcHJvZ3JhbTogbmV3IFByb2dyYW0oZ2wsIHtcbiAgICAgICAgdnM6IGdsc2xpZnkoJy4vYXJjLWxheWVyLXZlcnRleC5nbHNsJyksXG4gICAgICAgIGZzOiBnbHNsaWZ5KCcuL2FyYy1sYXllci1mcmFnbWVudC5nbHNsJyksXG4gICAgICAgIGlkOiAnYXJjJ1xuICAgICAgfSksXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgaWQ6ICdhcmMnLFxuICAgICAgICBkcmF3TW9kZTogJ0xJTkVfU1RSSVAnLFxuICAgICAgICBwb3NpdGlvbnM6IG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKVxuICAgICAgfSksXG4gICAgICBpc0luc3RhbmNlZDogdHJ1ZSxcbiAgICAgIG9uQmVmb3JlUmVuZGVyKCkge1xuICAgICAgICB0aGlzLnVzZXJEYXRhLm9sZFN0cm9rZVdpZHRoID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLkxJTkVfV0lEVEgpO1xuICAgICAgICB0aGlzLnByb2dyYW0uZ2wubGluZVdpZHRoKHRoaXMudXNlckRhdGEuc3Ryb2tlV2lkdGggfHwgMSk7XG4gICAgICB9LFxuICAgICAgb25BZnRlclJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5wcm9ncmFtLmdsLmxpbmVXaWR0aCh0aGlzLnVzZXJEYXRhLm9sZFN0cm9rZVdpZHRoIHx8IDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ29sb3JzKCkge1xuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgY29sb3IwOiB0aGlzLnByb3BzLmNvbG9yMCxcbiAgICAgIGNvbG9yMTogdGhpcy5wcm9wcy5jb2xvcjFcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBhcmMgb2YgZGF0YSkge1xuICAgICAgdmFsdWVbaSArIDBdID0gYXJjLnBvc2l0aW9uLngwO1xuICAgICAgdmFsdWVbaSArIDFdID0gYXJjLnBvc2l0aW9uLnkwO1xuICAgICAgdmFsdWVbaSArIDJdID0gYXJjLnBvc2l0aW9uLngxO1xuICAgICAgdmFsdWVbaSArIDNdID0gYXJjLnBvc2l0aW9uLnkxO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBwb2ludC5jb2xvclswXTtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IHBvaW50LmNvbG9yWzFdO1xuICAgICAgdmFsdWVbaSArIDJdID0gcG9pbnQuY29sb3JbMl07XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qc1xuICoqLyIsImV4cG9ydCB7ZGVmYXVsdCBhcyBkZWZhdWx0fSBmcm9tICcuL2xpbmUtbGF5ZXInO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi4vLi4vLi4vc3JjL2xheWVycy9saW5lLWxheWVyL2luZGV4LmpzXG4gKiovIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uLy4uL2xheWVyJztcbmltcG9ydCB7TW9kZWwsIFByb2dyYW0sIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogNCwgJzAnOiAneDAnLCAnMSc6ICd5MCcsICcyJzogJ3gxJywgJzMnOiAneTEnfSxcbiAgaW5zdGFuY2VDb2xvcnM6IHtzaXplOiAzLCAnMCc6ICdyZWQnLCAnMSc6ICdncmVlbicsICcyJzogJ2JsdWUnfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBMaW5lTGF5ZXJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3Ryb2tlV2lkdGggPSA5LFxuICAgIC4uLm9wdHNcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3Ryb2tlV2lkdGgsXG4gICAgICAuLi5vcHRzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuY3JlYXRlTW9kZWwoZ2wpO1xuICAgIG1vZGVsLnVzZXJEYXRhLnN0cm9rZVdpZHRoID0gdGhpcy5wcm9wcy5zdHJva2VXaWR0aDtcbiAgICB0aGlzLnNldFN0YXRlKHttb2RlbH0pO1xuXG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoQVRUUklCVVRFUywge1xuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnN9LFxuICAgICAgaW5zdGFuY2VDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnN9XG4gICAgfSk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXh0UHJvcHMpIHtcbiAgICBzdXBlci53aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXh0UHJvcHMpO1xuICAgIHRoaXMuc3RhdGUubW9kZWwudXNlckRhdGEuc3Ryb2tlV2lkdGggPSBuZXh0UHJvcHMuc3Ryb2tlV2lkdGg7XG4gIH1cblxuICBjcmVhdGVNb2RlbChnbCkge1xuICAgIGxldCBwb3NpdGlvbnMgPSBbMCwgMCwgMCwgMSwgMSwgMV07XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIHByb2dyYW06IG5ldyBQcm9ncmFtKGdsLCB7XG4gICAgICAgIHZzOiBnbHNsaWZ5KCcuL2xpbmUtbGF5ZXItdmVydGV4Lmdsc2wnKSxcbiAgICAgICAgZnM6IGdsc2xpZnkoJy4vbGluZS1sYXllci1mcmFnbWVudC5nbHNsJyksXG4gICAgICAgIGlkOiAnbGluZSdcbiAgICAgIH0pLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGlkOiAnbGluZScsXG4gICAgICAgIGRyYXdNb2RlOiAnTElORV9TVFJJUCcsXG4gICAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpXG4gICAgICB9KSxcbiAgICAgIGlzSW5zdGFuY2VkOiB0cnVlLFxuICAgICAgb25CZWZvcmVSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMudXNlckRhdGEub2xkU3Ryb2tlV2lkdGggPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTElORV9XSURUSCk7XG4gICAgICAgIHRoaXMucHJvZ3JhbS5nbC5saW5lV2lkdGgodGhpcy51c2VyRGF0YS5zdHJva2VXaWR0aCB8fCAxKTtcbiAgICAgIH0sXG4gICAgICBvbkFmdGVyUmVuZGVyKCkge1xuICAgICAgICB0aGlzLnByb2dyYW0uZ2wubGluZVdpZHRoKHRoaXMudXNlckRhdGEub2xkU3Ryb2tlV2lkdGggfHwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBsaW5lLnBvc2l0aW9uLngwO1xuICAgICAgdmFsdWVbaSArIDFdID0gbGluZS5wb3NpdGlvbi55MDtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IGxpbmUucG9zaXRpb24ueDE7XG4gICAgICB2YWx1ZVtpICsgM10gPSBsaW5lLnBvc2l0aW9uLnkxO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBwb2ludC5jb2xvclswXTtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IHBvaW50LmNvbG9yWzFdO1xuICAgICAgdmFsdWVbaSArIDJdID0gcG9pbnQuY29sb3JbMl07XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uLy4uLy4uL3NyYy9sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUG9zdCBmcm9tICcuL1Bvc3QnXG5cbmNvbnN0IExpZ2h0Qm94ID0gKHthY3RpdmV9KSA9PiB7XG5cbiAgICB2YXIgaGVpZ2h0ID0ge2hlaWdodDogd2luZG93LmlubmVySGVpZ2h0LTIwMH1cblxuICAgIHZhciBwb3N0ID0ge1xuICAgICAgJ2tleSc6MSxcbiAgICAgICd0eXBlJzondHdlZXQnLFxuICAgICAgJ2NvbnRlbnQnOidMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBWZXN0aWJ1bHVtIHVsdHJpY2llcyBmYWNpbGlzaXMgaXBzdW0sIG5vbiBzYWdpdHRpcyB2ZWxpdCB2ZW5lbmF0aXMgZ3JhdmlkYS4nLCBcbiAgICAgICdkYXRlJzogRGF0ZS5ub3coKSxcbiAgICAgICdsb2NhdGlvbic6IFswLDBdLFxuICAgICAgJ2xpbmsnOiAnaHR0cDovL3d3dy5nb29nbGUuY29tJyxcbiAgICAgICdpbWFnZSc6ICcuLi9zdGF0aWMvaW1nL3Bob3RvLnBuZydcbiAgICB9XG5cbiAgICB2YXIgbWV0YSA9IHtcbiAgICAgICd0eXBlJzpwb3N0LnR5cGUsXG4gICAgICAnZGF0ZSc6cG9zdC5kYXRlLFxuICAgICAgJ2xvY2F0aW9uJzpwb3N0LmxvY2F0aW9uLFxuICAgICAgJ2xpbmsnOnBvc3QubGlua1xuICAgIH1cblxuICAgIGlmKGFjdGl2ZSl7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJsaWdodEJveFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFdyYXBwZXJcIiBzdHlsZT17aGVpZ2h0fT5cbiAgICAgICAgICAgIDxQb3N0IGZvcm1hdD1cImxpZ2h0Qm94XCIgbWV0YT17bWV0YX0+XG4gICAgICAgICAgICAgIHtwb3N0LmltYWdlfVxuICAgICAgICAgICAgPC9Qb3N0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59XG5cbkxpZ2h0Qm94LnByb3BUeXBlcyA9IHtcbiAgYWN0aXZlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59XG5leHBvcnQgZGVmYXVsdCBMaWdodEJveFxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb21wb25lbnRzL0xpZ2h0Qm94LmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZGF0ZVRvU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmNvbnN0IFBvc3QgPSAoe2Zvcm1hdCwgZGF0YX0pID0+IHtcbiAgaWYgKGZvcm1hdCA9PT0gJ2Z1bGwnKSB7XG4gICAgdmFyIG1ldGFUeXBlcyA9IFsnZGF0ZSddXG4gICAgaWYgKGRhdGEubG9jYXRpb24pIG1ldGFUeXBlcy5wdXNoKCdsb2NhdGlvbicpXG4gICAgaWYgKGRhdGEubGluaykgbWV0YVR5cGVzLnB1c2goJ2xpbmsnKVxuICAgIHZhciBtZXRhID0gbWV0YVR5cGVzLm1hcCgobSwgaSkgPT4ge1xuICAgICAgdmFyIHZhbHVlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG0gPT09ICdkYXRlJykge1xuICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoZGF0YS5kYXRlKVxuICAgICAgICAgIHJldHVybiAoPHA+e2RhdGVUb1N0cmluZyhkLCB0cnVlKX08L3A+KVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2Z1bGwnKSB7XG4gICAgICAgICAgcmV0dXJuICg8aW1nIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIGtleT17aX0gc3JjPXsnL3N0YXRpYy9pbWcvaWNvbi0nICsgbSArICcucG5nJ30vPilcbiAgICAgICAgfVxuICAgICAgfSkoKVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e219IGtleT17aX0+e3ZhbHVlfTwvZGl2PlxuICAgICAgKVxuICAgIH0pXG5cbiAgICBjb25zdCBjb250ZW50ID0gZGF0YSA9PiB7XG4gICAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgICAgICBjYXNlICd0d2VldCc6XG4gICAgICAgICAgdmFyIGltYWdlcyA9IGRhdGEuaW1hZ2VzID8gZGF0YS5pbWFnZXMubWFwKCh1cmwsIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiA8aW1nIHNyYz17dXJsfSBrZXk9e2l9Lz5cbiAgICAgICAgICB9KSA6ICcnXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1lc3NhZ2VcIj5cIntkYXRhLmNvbnRlbnR9XCI8L3A+XG4gICAgICAgICAgICAgIHtpbWFnZXN9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9e2RhdGEuaW1hZ2VzWzBdfS8+XG4gICAgICAgICAgICAgIDxwPntkYXRhLmNvbnRlbnR9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICBjYXNlICdhdWRpbyc6XG4gICAgICAgICAgdmFyIHNvdW5kQ2xvdWRVUkwgPSAnaHR0cHM6Ly93LnNvdW5kY2xvdWQuY29tL3BsYXllci8/dXJsPSdcbiAgICAgICAgICBzb3VuZENsb3VkVVJMICs9IGRhdGEubGlua1xuICAgICAgICAgIHNvdW5kQ2xvdWRVUkwgKz0gJyZjb2xvcj1GOEQxNDMmYXV0b19wbGF5PWZhbHNlJmhpZGVfcmVsYXRlZD1mYWxzZSZzaG93X2NvbW1lbnRzPXRydWUmc2hvd191c2VyPXRydWUmc2hvd19yZXBvc3RzPWZhbHNlJ1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMj57ZGF0YS50aXRsZX08L2gyPlxuICAgICAgICAgICAgICA8cD5zb3VuZDwvcD5cbiAgICAgICAgICAgICAgPGlmcmFtZSBzcmM9e3NvdW5kQ2xvdWRVUkx9PjwvaWZyYW1lPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICBjYXNlICdibG9nJzpcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgyPntkYXRhLnRpdGxlfTwvaDI+XG4gICAgICAgICAgICAgIDxwPntkYXRhLmNvbnRlbnR9PC9wPlxuICAgICAgICAgICAgICA8cD48YSBocmVmPXtkYXRhLmxpbmt9PlJlYWQgbW9yZS4uLjwvYT48L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuICcnXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsncG9zdCAnICsgZGF0YS5rZXl9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInR5cGVcIj5cbiAgICAgICAgICA8aW1nIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHNyYz17Jy9zdGF0aWMvaW1nL2ljb24tJyArIGRhdGEudHlwZSsnLnBuZyd9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgIHtjb250ZW50KGRhdGEpfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YVwiPlxuICAgICAgICAgICAge21ldGF9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoYXJlXCI+PGltZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBzcmM9XCJzdGF0aWMvaW1nL2ljb24tc2hhcmUucG5nXCIvPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gJydcbn1cblxuUG9zdC5wcm9wVHlwZXMgPSB7XG4gIGZvcm1hdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBkYXRhOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9zdFxuXG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvUG9zdC5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJ1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcidcbmltcG9ydCBTaWdodGluZ0dyYXBoIGZyb20gJy4vU2lnaHRpbmdHcmFwaCdcblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcGFkZGluZzogWzIsIDhdLFxuICAgICAgeDogMCxcbiAgICAgIGN1cnNvclk6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgcmFuZ2U6IFswLCAwXSxcbiAgICAgIGRvbWFpbjogWzAsIDBdLFxuICAgICAgc2NhbGVEYXlzOiBudWxsLFxuICAgICAgc2NhbGVUaW1lOiBudWxsLFxuICAgICAgdG90YWxTaWdodGluZ3M6IFtdLFxuICAgICAgbW91c2VPdmVyOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIGNvbnN0IHsgZXhwZWRpdGlvbiB9ID0gbmV4dFByb3BzXG4gICAgaWYgKGV4cGVkaXRpb24pIHtcbiAgICAgIGNvbnN0IHsgcGFkZGluZyB9ID0gdGhpcy5zdGF0ZVxuICAgICAgY29uc3Qgc3RhcnREYXRlID0gZXhwZWRpdGlvbi5zdGFydFxuICAgICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gNzJcbiAgICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjA1XG4gICAgICBjb25zdCB4ID0gd2lkdGggKiAwLjU4XG4gICAgICB2YXIgZGF5Q291bnQgPSBleHBlZGl0aW9uLmRheUNvdW50ICsgMVxuXG4gICAgICB2YXIgZGF0YSA9IFtdXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRheUNvdW50OyBpKyspIHtcbiAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzdGFydERhdGUuZ2V0VGltZSgpICsgaSAqICgxMDAwICogMzYwMCAqIDI0KSlcbiAgICAgICAgZGF0YS5wdXNoKGQpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJhbmdlID0gWzAgKyBwYWRkaW5nWzFdLCBoZWlnaHQgLSBwYWRkaW5nWzFdXVxuICAgICAgY29uc3QgZG9tYWluID0gW2RheUNvdW50IC0gMSwgMF1cbiAgICAgIGNvbnN0IHNjYWxlRGF5cyA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgIC5yYW5nZShyYW5nZSlcbiAgICAgIGNvbnN0IHNjYWxlVGltZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgLmRvbWFpbihbc3RhcnREYXRlLmdldFRpbWUoKSArIChkYXlDb3VudCAtIDEpICogKDEwMDAgKiAzNjAwICogMjQpLCBzdGFydERhdGUuZ2V0VGltZSgpXSlcbiAgICAgICAgLnJhbmdlKHJhbmdlKVxuXG4gICAgICBjb25zdCBjdXJzb3JZID0gdGhpcy5zdGF0ZS5tb3VzZU92ZXIgPyB0aGlzLnN0YXRlLmN1cnNvclkgOiAoc2NhbGVUaW1lKGV4cGVkaXRpb24uY3VycmVudERhdGUuZ2V0VGltZSgpKSAtIDgpXG5cbiAgICAgIHZhciB0b3RhbFNpZ2h0aW5ncyA9IGV4cGVkaXRpb24udG90YWxTaWdodGluZ3NcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIC4uLnRoaXMuc3RhdGUsXG4gICAgICAgIHgsXG4gICAgICAgIGN1cnNvclksXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHJhbmdlLFxuICAgICAgICBkb21haW4sXG4gICAgICAgIHNjYWxlRGF5cyxcbiAgICAgICAgc2NhbGVUaW1lLFxuICAgICAgICB0b3RhbFNpZ2h0aW5nc1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgb25DbGljayAoZSkge1xuICAgIGNvbnN0IHsgc2NhbGVUaW1lLCByYW5nZSB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHsganVtcFRvLCBleHBlZGl0aW9uSUQgfSA9IHRoaXMucHJvcHNcbiAgICB2YXIgeSA9IGUubmF0aXZlRXZlbnQub2Zmc2V0WVxuICAgIGp1bXBUbyhuZXcgRGF0ZShzY2FsZVRpbWUuaW52ZXJ0KE1hdGgubWF4KHJhbmdlWzBdICsgMSwgTWF0aC5taW4ocmFuZ2VbMV0gLSAxLCB5KSkpKSwgZXhwZWRpdGlvbklEKVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIG9uTW91c2VNb3ZlIChlKSB7XG4gICAgY29uc3QgeyByYW5nZSwgcGFkZGluZyB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IGN1cnNvclkgPSBNYXRoLm1heChyYW5nZVswXSwgTWF0aC5taW4ocmFuZ2VbMV0sIGUubmF0aXZlRXZlbnQub2Zmc2V0WSkpIC0gcGFkZGluZ1sxXVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgIGN1cnNvclksXG4gICAgICBtb3VzZU92ZXI6IHRydWVcbiAgICB9KVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIG9uTW91c2VPdXQgKGUpIHtcbiAgICBjb25zdCB7IGV4cGVkaXRpb24gfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IHNjYWxlVGltZSB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IGN1cnNvclkgPSAoc2NhbGVUaW1lKGV4cGVkaXRpb24uY3VycmVudERhdGUuZ2V0VGltZSgpKSAtIDgpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAuLi50aGlzLnN0YXRlLFxuICAgICAgY3Vyc29yWSxcbiAgICAgIG1vdXNlT3ZlcjogZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IGV4cGVkaXRpb24gfSA9IHRoaXMucHJvcHNcbiAgICBpZiAoIWV4cGVkaXRpb24pIHJldHVybiA8c3ZnIGlkPVwidGltZWxpbmVcIj48L3N2Zz5cbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGRhdGEsIHgsIHJhbmdlLCBzY2FsZURheXMsIGN1cnNvclksIHRvdGFsU2lnaHRpbmdzLCBwYWRkaW5nIH0gPSB0aGlzLnN0YXRlXG5cbiAgICBjb25zdCBkYXlzID0gZGF0YS5tYXAoKGQsIGkpID0+IHtcbiAgICAgIHJldHVybiA8Y2lyY2xlIGN4PXt4fSBjeT17c2NhbGVEYXlzKGkpfSByPXszfSBrZXk9e2l9IGZpbGw9XCJ3aGl0ZVwiLz5cbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgXG4gICAgICAgIGlkPVwidGltZWxpbmVcIiBcbiAgICAgICAgY2xhc3NOYW1lPXtsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9kYXRhJyB8fCBsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9hYm91dCcgPyAnaW52aXNpYmxlJyA6ICd2aXNpYmxlJ30gXG4gICAgICAgIHN0eWxlPXt7aGVpZ2h0OiBoZWlnaHQgKyAncHgnfX0gXG4gICAgICAgIG9uTW91c2VPdXQ9e3RoaXMub25Nb3VzZU91dH0gXG4gICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLm9uTW91c2VNb3ZlfSBcbiAgICAgICAgb25DbGljaz17dGhpcy5vbkNsaWNrfT5cbiAgICAgICAgPGZpbHRlciBpZD1cImRyb3BzaGFkb3dcIiBoZWlnaHQ9XCIxMjAlXCI+XG4gICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIGluPVwiU291cmNlQWxwaGFcIiBzdGREZXZpYXRpb249XCIzXCIvPlxuICAgICAgICAgIDxmZU9mZnNldCBkeD1cIjJcIiBkeT1cIjBcIiByZXN1bHQ9XCJvZmZzZXRibHVyXCIvPlxuICAgICAgICAgIDxmZU1lcmdlPlxuICAgICAgICAgICAgPGZlTWVyZ2VOb2RlLz5cbiAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj1cIlNvdXJjZUdyYXBoaWNcIi8+XG4gICAgICAgICAgPC9mZU1lcmdlPlxuICAgICAgICA8L2ZpbHRlcj5cbiAgICAgICAgPGcgdHJhbnNmb3JtPXsndHJhbnNsYXRlKCcgKyAwICsgJywnICsgcGFkZGluZ1sxXSArICcpJ30gc3R5bGU9e3twb2ludGVyRXZlbnRzOiAnbm9uZSd9fT5cbiAgICAgICAgICA8U2lnaHRpbmdHcmFwaCBzaWdodGluZ3M9e3RvdGFsU2lnaHRpbmdzfSB3aWR0aD17d2lkdGh9IGhlaWdodD17aGVpZ2h0IC0gcGFkZGluZ1sxXSAqIDJ9Lz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8bGluZSB4MT17eH0geDI9e3h9IHkxPXtyYW5nZVswXX0geTI9e3JhbmdlWzFdfSBzdHlsZT17e3N0cm9rZTogJ3doaXRlJ319Lz5cbiAgICAgICAgPGc+eyBkYXlzIH08L2c+XG4gICAgICAgIDxnIHRyYW5zZm9ybT17J3RyYW5zbGF0ZSgnICsgKHggLSAyMCkgKyAnLCcgKyBjdXJzb3JZICsgJyknfSBzdHlsZT17e3BvaW50ZXJFdmVudHM6ICdub25lJ319PlxuICAgICAgICAgIDxwYXRoIGZpbGw9XCIjRjlEMTQ0XCIgZD1cIk04LDBjNSwwLDEyLDgsMTIsOHMtNyw4LTEyLDhjLTQuNCwwLTgtMy42LTgtOEMwLDMuNiwzLjYsMCw4LDB6XCIgc3R5bGU9e3tmaWx0ZXI6ICd1cmwoI2Ryb3BzaGFkb3cpJ319Lz5cbiAgICAgICAgICA8Y2lyY2xlIGZpbGw9XCIjMUYxNDI2XCIgY3g9XCI3LjlcIiBjeT1cIjcuOFwiIHI9XCIzXCIvPlxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cbn1cblxuVGltZWxpbmUucHJvcFR5cGVzID0ge1xuICBleHBlZGl0aW9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICBqdW1wVG86IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGV4cGVkaXRpb25JRDogUHJvcFR5cGVzLnN0cmluZ1xufVxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvVGltZWxpbmUuanNcbiAqKi8iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnXG5cbmNvbnN0IFNpZ2h0aW5nR3JhcGggPSAoe3dpZHRoLCBoZWlnaHQsIHNpZ2h0aW5nc30pID0+IHtcbiAgY29uc3QgbWFyZ2luID0gMC40MlxuICB3aWR0aCA9IHdpZHRoIC0gKG1hcmdpbiAqIHdpZHRoKVxuXG4gIHZhciB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oWzAsIGQzLm1heChzaWdodGluZ3MpXSlcbiAgICAucmFuZ2UoW3dpZHRoLCB3aWR0aCAqIG1hcmdpbl0pXG5cbiAgdmFyIHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihbMCwgc2lnaHRpbmdzLmxlbmd0aCAtIDFdKVxuICAgIC5yYW5nZShbMCwgaGVpZ2h0XSlcblxuICByZXR1cm4gKFxuICAgIDxnPlxuICAgICAgPHBhdGggZmlsbD17J3JnYmEoMTk2LDEzMSwzOSwwLjgpJ30gZD17XG4gICAgICAgIGQzLmFyZWEoKVxuICAgICAgICAgIC54MCh3aWR0aClcbiAgICAgICAgICAueDEoKGQpID0+IHgoZCkpXG4gICAgICAgICAgLnkoKGQsIGkpID0+IHkoaSkpKHNpZ2h0aW5ncylcbiAgICAgIH0vPlxuICAgIDwvZz5cbiAgKVxufVxuXG5TaWdodGluZ0dyYXBoLnByb3BUeXBlcyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHNpZ2h0aW5nczogUHJvcFR5cGVzLmFycmF5XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ2h0aW5nR3JhcGhcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvU2lnaHRpbmdHcmFwaC5qc1xuICoqLyIsImltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBOYXZpZ2F0aW9uSXRlbSBmcm9tICcuL05hdmlnYXRpb25JdGVtJ1xuXG5jb25zdCBOYXZpZ2F0aW9uID0gKHtwYXRoTmFtZSwgc2V0UGFnZX0pID0+IHtcbiAgICAgICAgICAvLyA8TmF2aWdhdGlvbkl0ZW0gc2V0UGFnZT17c2V0UGFnZX0gYWN0aXZlPXtwYXRoTmFtZSA9PT0gJy9kYXRhJ30+RGF0YTwvTmF2aWdhdGlvbkl0ZW0+XG4gICAgICAgICAgLy8gPE5hdmlnYXRpb25JdGVtIGFjdGl2ZT17cGF0aE5hbWUgPT09ICcvc2hhcmUnfT5TaGFyZTwvTmF2aWdhdGlvbkl0ZW0+XG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cImhlYWRlclwiPlxuICAgICAgPGRpdiBpZD1cIm5hdmlnYXRpb25cIj5cbiAgICAgICAgPHVsPlxuICAgICAgICAgIDxOYXZpZ2F0aW9uSXRlbSBzZXRQYWdlPXtzZXRQYWdlfSBhY3RpdmU9e3BhdGhOYW1lID09PSAnLycgfHwgcGF0aE5hbWUgPT09ICcvbWFwJ30+TWFwPC9OYXZpZ2F0aW9uSXRlbT5cbiAgICAgICAgICA8TmF2aWdhdGlvbkl0ZW0gc2V0UGFnZT17c2V0UGFnZX0gYWN0aXZlPXtwYXRoTmFtZSA9PT0gJy9qb3VybmFsJ30+Sm91cm5hbDwvTmF2aWdhdGlvbkl0ZW0+XG4gICAgICAgICAgPE5hdmlnYXRpb25JdGVtIHNldFBhZ2U9e3NldFBhZ2V9IGFjdGl2ZT17cGF0aE5hbWUgPT09ICcvZGF0YSd9PkRhdGE8L05hdmlnYXRpb25JdGVtPlxuICAgICAgICAgIDxOYXZpZ2F0aW9uSXRlbSBzZXRQYWdlPXtzZXRQYWdlfSBhY3RpdmU9e3BhdGhOYW1lID09PSAnL2Fib3V0J30+QWJvdXQ8L05hdmlnYXRpb25JdGVtPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgICA8aDE+SU5UTyBUSEUgT0tBVkFOR088L2gxPlxuICAgICAgPGltZyBpZD1cImxvZ29cIiBzcmM9XCJzdGF0aWMvaW1nL2xvZ28uc3ZnXCIgYWx0PVwiSW50byB0aGUgT2thdmFuZ29cIi8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuTmF2aWdhdGlvbi5wcm9wVHlwZXMgPSB7XG4gIHBhdGhOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNldFBhZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvTmF2aWdhdGlvbi5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuY29uc3QgTmF2aWdhdGlvbkl0ZW0gPSAoe2NoaWxkcmVuLCBhY3RpdmUsIHNldFBhZ2V9KSA9PiB7XG4gIGlmICghc2V0UGFnZSkgc2V0UGFnZSA9ICgpID0+IHsgcmV0dXJuIH1cbiAgcmV0dXJuIChcbiAgICA8bGkgY2xhc3NOYW1lPXthY3RpdmUgPyAnYWN0aXZlJyA6ICcnfSBvbkNsaWNrPXtzZXRQYWdlfT5cbiAgICAgIDxMaW5rIHRvPXtjaGlsZHJlbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCl9PntjaGlsZHJlbi50b1N0cmluZygpfTwvTGluaz5cbiAgICA8L2xpPlxuICApXG59XG5cbk5hdmlnYXRpb25JdGVtLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gIHNldFBhZ2U6IFByb3BUeXBlcy5mdW5jXG4gIC8vIGFjdGl2ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1cmVkXG4gIC8vIHBhdGhOYW1lOiBQcm9wVHlwZXMubm9kZS5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvbkl0ZW1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvTmF2aWdhdGlvbkl0ZW0uanNcbiAqKi8iLCJcbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSAncmVhY3QtYWRkb25zLWNzcy10cmFuc2l0aW9uLWdyb3VwJ1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcidcblxuY2xhc3MgSW50cm9kdWN0aW9uQm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbXBsZXRlZDogZmFsc2UsXG4gICAgICBjb250ZW50RW5hYmxlZDogZmFsc2UsXG4gICAgICBzdGFydERhdGU6IDAsXG4gICAgICBjdXJyZW50UG9zdHM6IFtdLFxuICAgICAgcG9zdHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRlbnQ6IDxwIGtleT1cIjBcIj5UaGUgT2thdmFuZ28gRGVsdGEgaXMgb25lIG9mIHRoZSB3b3JsZOKAmXMgbGFzdCBncmVhdCB3ZXRsYW5kIHdpbGRlcm5lc3Nlcy48L3A+LFxuICAgICAgICAgIHRpbWVSYW5nZTogWzAsIDYwMDBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZW50OiA8cCBrZXk9XCIxXCI+QSB0ZWFtIG9mIEJh4oCZWWVpLCBzY2llbnRpc3RzLCBlbmdpbmVlcnMgYW5kIGFkdmVudHVyZXJzIGlzIGpvdXJuZXlpbmcgYSAzNDUga2lsb21ldGVycyBjcm9zc2luZyB0aGUgZGVsdGEsIGZpbmRpbmcgbmV3IHNwZWNpZXMgYW5kIGV4cGxvcmluZyBuZXcgZ3JvdW5kLjwvcD4sXG4gICAgICAgICAgdGltZVJhbmdlOiBbNjAwMCwgMTMwMDBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZW50OiA8cCBrZXk9XCIyXCI+Sm9pbiB1cyBpbiByZWFsLXRpbWUgYXMgd2UgZXhwbG9yZTxici8+PHNwYW4+dGhlIGJlYXRpbmcgaGVhcnQgb2Ygb3VyIHBsYW5ldC48L3NwYW4+PC9wPixcbiAgICAgICAgICB0aW1lUmFuZ2U6IFsxMzAwMCwgMjEwMDBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgdGljayAoKSB7XG4gICAgY29uc3QgeyBlbmFibGVDb250ZW50IH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBwb3N0cywgc3RhcnREYXRlIH0gPSB0aGlzLnN0YXRlXG5cbiAgICBpZiAoIShsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nIHx8IGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL21hcCcpKSB7XG4gICAgICB0aGlzLnN0YXRlLmNvbXBsZXRlZCA9IHRydWVcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCkgLSBzdGFydERhdGVcbiAgICB2YXIgY3VycmVudFBvc3RzID0gW11cbiAgICBwb3N0cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAudGltZVJhbmdlWzBdIDw9IG5vdyAmJiBwLnRpbWVSYW5nZVsxXSA+IG5vdykge1xuICAgICAgICBjdXJyZW50UG9zdHMucHVzaChwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAobm93ID4gcG9zdHNbcG9zdHMubGVuZ3RoIC0gMV0udGltZVJhbmdlWzFdIC0gNjAwMCAmJiAhdGhpcy5zdGF0ZS5jb250ZW50RW5hYmxlZCkge1xuICAgICAgdGhpcy5zdGF0ZS5jb250ZW50RW5hYmxlZCA9IHRydWVcbiAgICAgIGVuYWJsZUNvbnRlbnQoKVxuICAgIH1cblxuICAgIHZhciBmbGFnID0gdHJ1ZVxuICAgIGlmIChjdXJyZW50UG9zdHMubGVuZ3RoICE9PSB0aGlzLnN0YXRlLmN1cnJlbnRQb3N0cy5sZW5ndGgpIGZsYWcgPSBmYWxzZVxuICAgIGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLm1heChjdXJyZW50UG9zdHMubGVuZ3RoLCB0aGlzLnN0YXRlLmN1cnJlbnRQb3N0cy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRQb3N0c1tpXSAhPT0gdGhpcy5zdGF0ZS5jdXJyZW50UG9zdHNbaV0pIHtcbiAgICAgICAgICBmbGFnID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmbGFnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgICAgY3VycmVudFBvc3RzOiBjdXJyZW50UG9zdHNcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChub3cgPiBwb3N0c1twb3N0cy5sZW5ndGggLSAxXS50aW1lUmFuZ2VbMV0pIHtcbiAgICAgIHRoaXMuc3RhdGUuY29tcGxldGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2spXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAuLi50aGlzLnN0YXRlLFxuICAgICAgc3RhcnREYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgICAvLyBjb25zb2xlLmxvZygnYWdhIGNvbXBvbmVudERpZE1vdW50JylcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IGN1cnJlbnRQb3N0cywgY29tcGxldGVkIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgcG9zdHMgPSBjdXJyZW50UG9zdHMubWFwKHAgPT4ge1xuICAgICAgcmV0dXJuIHAuY29udGVudFxuICAgIH0pXG5cbiAgICBjb25zdCBjb250YWluZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoY29tcGxldGVkKSByZXR1cm4gJydcbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cIm5vdGlmXCIgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfSB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXsyMDB9PlxuICAgICAgICAgICAge3Bvc3RzfVxuICAgICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cIkludHJvZHVjdGlvbkJveFwiPlxuICAgICAgICB7Y29udGFpbmVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuSW50cm9kdWN0aW9uQm94LnByb3BUeXBlcyA9IHtcbiAgZW5hYmxlQ29udGVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnRyb2R1Y3Rpb25Cb3hcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvSW50cm9kdWN0aW9uQm94LmpzXG4gKiovIiwiXG4vLyBpbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgTm90aWZpY2F0aW9uUGFuZWxDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9Ob3RpZmljYXRpb25QYW5lbENvbnRhaW5lcidcbmltcG9ydCBDb250cm9sUGFuZWxDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9Db250cm9sUGFuZWxDb250YWluZXIuanMnXG5cbmNvbnN0IE1hcFBhZ2UgPSAoKSA9PiB7XG4gIHZhciBoZWlnaHQgPSB7aGVpZ2h0OiB3aW5kb3cuaW5uZXJXaWR0aCA+IDc2OCA/IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwMCA6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT0ncGFnZScgaWQ9XCJtYXBQYWdlXCIgc3R5bGU9e2hlaWdodH0+XG4gICAgICA8Q29udHJvbFBhbmVsQ29udGFpbmVyIHBhdGhOYW1lPXtsb2NhdGlvbi5wYXRobmFtZX0vPlxuICAgICAgPE5vdGlmaWNhdGlvblBhbmVsQ29udGFpbmVyLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4vLyBNYXBQYWdlLnByb3BUeXBlcyA9IHtcbi8vICAgYWN0aXZlIDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxuLy8gfVxuZXhwb3J0IGRlZmF1bHQgTWFwUGFnZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9NYXBQYWdlLmpzXG4gKiovIiwiXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgTm90aWZpY2F0aW9uUGFuZWwgZnJvbSAnLi4vY29tcG9uZW50cy9Ob3RpZmljYXRpb25QYW5lbCdcbi8vIGltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vYWN0aW9ucy5qcydcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBvd25Qcm9wcykgPT4ge1xuICB2YXIgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW3N0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbl1cbiAgaWYgKGV4cGVkaXRpb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zdHM6IGV4cGVkaXRpb24uY3VycmVudFBvc3RzLFxuICAgICAgY3VycmVudERhdGU6IGV4cGVkaXRpb24uY3VycmVudERhdGVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cbn1cblxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoLCBvd25Qcm9wcykgPT4ge1xuICByZXR1cm4ge1xuICB9XG59XG5cbmNvbnN0IE5vdGlmaWNhdGlvblBhbmVsQ29udGFpbmVyID0gY29ubmVjdChcbiAgbWFwU3RhdGVUb1Byb3BzLFxuICBtYXBEaXNwYXRjaFRvUHJvcHNcbikoTm90aWZpY2F0aW9uUGFuZWwpXG5cbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvblBhbmVsQ29udGFpbmVyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb250YWluZXJzL05vdGlmaWNhdGlvblBhbmVsQ29udGFpbmVyLmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL05vdGlmaWNhdGlvbidcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5cbmNvbnN0IE5vdGlmaWNhdGlvblBhbmVsID0gKHtwb3N0cywgY3VycmVudERhdGV9KSA9PiB7XG5cbiAgdmFyIHN0YXJ0XG4gIHZhciBlbmRcbiAgaWYgKGN1cnJlbnREYXRlKSB7XG4gICAgc3RhcnQgPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSAwLjUgKiAoMTAwMCAqIDM2MDApKVxuICAgIGVuZCA9IG5ldyBEYXRlKGN1cnJlbnREYXRlLmdldFRpbWUoKSArIDAuNSAqICgxMDAwICogMzYwMCkpXG4gIH1cblxuICBpZiAoIXBvc3RzKSBwb3N0cyA9IFtdXG4gIHZhciBub3RpZmljYXRpb25JdGVtcyA9IHBvc3RzXG4gICAgLmZpbHRlcihwb3N0ID0+IHtcbiAgICAgIHZhciBkID0gbmV3IERhdGUocG9zdC5wcm9wZXJ0aWVzLkRhdGVUaW1lKVxuICAgICAgcmV0dXJuIGQuZ2V0VGltZSgpID49IHN0YXJ0ICYmIGQuZ2V0VGltZSgpIDwgZW5kXG4gICAgfSlcblxuICBub3RpZmljYXRpb25JdGVtcyA9IG5vdGlmaWNhdGlvbkl0ZW1zXG4gICAgLmZpbHRlcigocG9zdCwgaSkgPT4ge1xuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoID4gNzY4IHx8IGkgPT09IG5vdGlmaWNhdGlvbkl0ZW1zLmxlbmd0aCAtIDFcbiAgICB9KVxuICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoYS5wcm9wZXJ0aWVzLkRhdGVUaW1lKS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLnByb3BlcnRpZXMuRGF0ZVRpbWUpLmdldFRpbWUoKVxuICAgIH0pXG4gICAgLm1hcCgocG9zdCwgaSkgPT4ge1xuICAgICAgc3dpdGNoIChwb3N0LnR5cGUpIHtcbiAgICAgICAgY2FzZSAndHdlZXQnOlxuICAgICAgICAgIHZhciB0ZXh0ID0gcG9zdC5wcm9wZXJ0aWVzLlRleHRcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zcGxpdCgnICcpLnNsaWNlKDAsIHRleHQuc3BsaXQoJyAnKS5sZW5ndGggLSAxKS5qb2luKCcgJylcbiAgICAgICAgICBpZiAocG9zdC5wcm9wZXJ0aWVzLlR3ZWV0KSB0ZXh0ID0gcG9zdC5wcm9wZXJ0aWVzLlR3ZWV0LnRleHRcbiAgICAgICAgICB2YXIgaW1hZ2VzID0gcG9zdC5wcm9wZXJ0aWVzLkltYWdlc1xuICAgICAgICAgICAgLmZpbHRlcigoaW1nLCBqKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBqID09PSAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm1hcCgoaW1nLCBqKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiA8aW1nIHNyYz17aW1nLlVybC5yZXBsYWNlKCdodHRwOi8vJywnaHR0cHM6Ly8nKX0gd2lkdGg9XCIxMDAlXCIga2V5PXtqfS8+XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Tm90aWZpY2F0aW9uIHR5cGU9e3Bvc3QudHlwZX0ga2V5PXtwb3N0LmlkfT5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3twb3NpdGlvbjp3aW5kb3cuaW5uZXJXaWR0aCA+IDc2OCB8fCBwb3N0LnByb3BlcnRpZXMuSW1hZ2VzLmxlbmd0aCA9PT0gMCA/ICdyZWxhdGl2ZScgOiAnYWJzb2x1dGUnfX0+e3RleHR9PC9wPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlc1wiPntpbWFnZXN9PC9kaXY+XG4gICAgICAgICAgICA8L05vdGlmaWNhdGlvbj5cbiAgICAgICAgICApXG4gICAgICAgIGNhc2UgJ2F1ZGlvJzpcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE5vdGlmaWNhdGlvbiB0eXBlPXtwb3N0LnR5cGV9IGtleT17cG9zdC5pZH0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj57cG9zdC5wcm9wZXJ0aWVzLlRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgPC9Ob3RpZmljYXRpb24+XG4gICAgICAgICAgKVxuICAgICAgICBjYXNlICdibG9nJzpcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE5vdGlmaWNhdGlvbiB0eXBlPXtwb3N0LnR5cGV9IGtleT17cG9zdC5pZH0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj57cG9zdC5wcm9wZXJ0aWVzLlRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgPC9Ob3RpZmljYXRpb24+XG4gICAgICAgICAgKVxuICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgICAgdmFyIHdpZHRoID0gMFxuICAgICAgICAgIHZhciBoZWlnaHQgPSAwXG4gICAgICAgICAgaWYgKHBvc3QucHJvcGVydGllcy5EaW1lbnNpb25zKSB7XG4gICAgICAgICAgICB3aWR0aCA9IHBvc3QucHJvcGVydGllcy5EaW1lbnNpb25zWzBdXG4gICAgICAgICAgICBoZWlnaHQgPSBwb3N0LnByb3BlcnRpZXMuRGltZW5zaW9uc1sxXVxuICAgICAgICAgIH0gZWxzZSBpZiAocG9zdC5wcm9wZXJ0aWVzLlNpemUpIHtcbiAgICAgICAgICAgIHdpZHRoID0gcG9zdC5wcm9wZXJ0aWVzLlNpemVbMF1cbiAgICAgICAgICAgIGhlaWdodCA9IHBvc3QucHJvcGVydGllcy5TaXplWzFdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Tm90aWZpY2F0aW9uIHR5cGU9e3Bvc3QudHlwZX0ga2V5PXtwb3N0LmlkfSA+XG4gICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1hZ2VcIiBzcmM9e3Bvc3QucHJvcGVydGllcy5VcmwucmVwbGFjZSgnaHR0cDovLycsJ2h0dHBzOi8vJyl9IHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9Lz5cbiAgICAgICAgICAgIDwvTm90aWZpY2F0aW9uPlxuICAgICAgICAgIClcbiAgICAgIH1cbiAgICB9KVxuXG4gIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCA+IDc2OCA/IHtoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwMH0gOiB7fVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cIm5vdGlmaWNhdGlvblBhbmVsXCIgc3R5bGU9e2hlaWdodH0+XG4gICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJub3RpZlwiIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezMwMH0gdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MTUwfT5cbiAgICAgIHtub3RpZmljYXRpb25JdGVtc31cbiAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuTm90aWZpY2F0aW9uUGFuZWwucHJvcFR5cGVzID0ge1xuICBwb3N0czogUHJvcFR5cGVzLmFycmF5LFxuICBjdXJyZW50RGF0ZTogUHJvcFR5cGVzLm9iamVjdFxufVxuXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb25QYW5lbFxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9Ob3RpZmljYXRpb25QYW5lbC5qc1xuICoqLyIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnXG5cbmNvbnN0IE5vdGlmaWNhdGlvbiA9ICh7Y2hpbGRyZW4sIHR5cGV9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uXCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0eXBlXCI+XG4gICAgICA8aW1nIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHNyYz17J3N0YXRpYy9pbWcvaWNvbi0nICsgdHlwZSArICcucG5nJ30vPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbilcblxuTm90aWZpY2F0aW9uLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxufVxuXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb25cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvTm90aWZpY2F0aW9uLmpzXG4gKiovIiwiXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgQ29udHJvbFBhbmVsIGZyb20gJy4uL2NvbXBvbmVudHMvQ29udHJvbFBhbmVsJ1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuLi9hY3Rpb25zJ1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIG93blByb3BzKSA9PiB7XG4gIHZhciBwcm9wcyA9IHtcbiAgICBjdXJyZW50UGFnZTogc3RhdGUuY3VycmVudFBhZ2UsXG4gICAgZXhwZWRpdGlvbklEOiBzdGF0ZS5zZWxlY3RlZEV4cGVkaXRpb24sXG4gICAgZXhwZWRpdGlvbnM6IHN0YXRlLmV4cGVkaXRpb25zXG4gIH1cblxuICB2YXIgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW3N0YXRlLnNlbGVjdGVkRXhwZWRpdGlvbl1cbiAgaWYgKHByb3BzLmV4cGVkaXRpb25JRCkge1xuICAgIHByb3BzLmN1cnJlbnREYXRlID0gZXhwZWRpdGlvbi5jdXJyZW50RGF0ZVxuICAgIHByb3BzLnBsYXliYWNrID0gZXhwZWRpdGlvbi5wbGF5YmFja1xuICAgIHByb3BzLm1haW5Gb2N1cyA9IGV4cGVkaXRpb24ubWFpbkZvY3VzXG4gICAgcHJvcHMuc2Vjb25kYXJ5Rm9jdXMgPSBleHBlZGl0aW9uLnNlY29uZGFyeUZvY3VzXG4gICAgcHJvcHMuem9vbSA9IGV4cGVkaXRpb24uem9vbVxuICAgIHByb3BzLmxheW91dCA9IGV4cGVkaXRpb24ubGF5b3V0XG4gICAgcHJvcHMudmlld3BvcnQgPSB7XG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIGxvbmdpdHVkZTogZXhwZWRpdGlvbi5jb29yZGluYXRlc1swXSxcbiAgICAgIGxhdGl0dWRlOiBleHBlZGl0aW9uLmNvb3JkaW5hdGVzWzFdLFxuICAgICAgem9vbTogZXhwZWRpdGlvbi56b29tXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHByb3BzXG59XG5cbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCwgb3duUHJvcHMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBvblllYXJDaGFuZ2U6ICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbnMuc2V0RXhwZWRpdGlvbih2YWx1ZSkpXG4gICAgfSxcbiAgICBvblBsYXliYWNrQ2hhbmdlOiAodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25zLnNldENvbnRyb2woJ3BsYXliYWNrJywgdmFsdWUpKVxuICAgIH0sXG4gICAgb25NYWluRm9jdXNDaGFuZ2U6ICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbnMuc2V0Q29udHJvbCgnbWFpbkZvY3VzJywgdmFsdWUpKVxuICAgIH0sXG4gICAgb25TZWNvbmRhcnlGb2N1c0NoYW5nZTogKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9ucy5zZXRDb250cm9sKCdzZWNvbmRhcnlGb2N1cycsIHZhbHVlKSlcbiAgICB9LFxuICAgIG9uWm9vbUNoYW5nZTogKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9ucy5zZXRDb250cm9sKCd6b29tJywgdmFsdWUpKVxuICAgIH0sXG4gICAgb25MYXlvdXRDaGFuZ2U6ICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbnMuc2V0Q29udHJvbCgnbGF5b3V0JywgdmFsdWUpKVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBDb250cm9sUGFuZWxDb250YWluZXIgPSBjb25uZWN0KFxuICBtYXBTdGF0ZVRvUHJvcHMsXG4gIG1hcERpc3BhdGNoVG9Qcm9wc1xuKShDb250cm9sUGFuZWwpXG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xQYW5lbENvbnRhaW5lclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29udGFpbmVycy9Db250cm9sUGFuZWxDb250YWluZXIuanNcbiAqKi8iLCJcbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnXG5pbXBvcnQgWWVhclNlbGVjdG9yIGZyb20gJy4vWWVhclNlbGVjdG9yJ1xuaW1wb3J0IERhdGVTZWxlY3RvciBmcm9tICcuL0RhdGVTZWxlY3RvcidcbmltcG9ydCBQbGF5YmFja1NlbGVjdG9yIGZyb20gJy4vUGxheWJhY2tTZWxlY3RvcidcbmltcG9ydCBGb2N1c1NlbGVjdG9yIGZyb20gJy4vRm9jdXNTZWxlY3RvcidcbmltcG9ydCBab29tU2VsZWN0b3IgZnJvbSAnLi9ab29tU2VsZWN0b3InXG5pbXBvcnQgTGF5b3V0U2VsZWN0b3IgZnJvbSAnLi9MYXlvdXRTZWxlY3RvcidcblxuY29uc3QgQ29udHJvbFBhbmVsID0gKHtwYXRoTmFtZSwgZXhwZWRpdGlvbklELCBleHBlZGl0aW9ucywgY3VycmVudERhdGUsIHBsYXliYWNrLCBtYWluRm9jdXMsIHNlY29uZGFyeUZvY3VzLCB6b29tLCBsYXlvdXQsIG9uWWVhckNoYW5nZSwgb25QbGF5YmFja0NoYW5nZSwgb25NYWluRm9jdXNDaGFuZ2UsIG9uU2Vjb25kYXJ5Rm9jdXNDaGFuZ2UsIG9uWm9vbUNoYW5nZSwgb25MYXlvdXRDaGFuZ2UsIHZpZXdwb3J0fSkgPT4ge1xuICBpZiAoIWV4cGVkaXRpb25JRCkgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbFBhbmVsXCI+PC9kaXY+XG5cbiAgaWYgKHBhdGhOYW1lID09PSAnLycpIHBhdGhOYW1lID0gJy9tYXAnXG5cbiAgLy8ge3BhdGhOYW1lID09PSAnL21hcCcgPyA8Rm9jdXNTZWxlY3RvciBtYWluRm9jdXM9e21haW5Gb2N1c30gc2Vjb25kYXJ5Rm9jdXM9e3NlY29uZGFyeUZvY3VzfSBvbk1haW5Gb2N1c0NoYW5nZT17b25NYWluRm9jdXNDaGFuZ2V9IG9uU2Vjb25kYXJ5Rm9jdXNDaGFuZ2U9e29uU2Vjb25kYXJ5Rm9jdXNDaGFuZ2V9Lz4gOiBudWxsfVxuICAvLyB7cGF0aE5hbWUgPT09ICcvam91cm5hbCcgPyA8TGF5b3V0U2VsZWN0b3IgbW9kZT17bGF5b3V0fSBvbkxheW91dENoYW5nZT17b25MYXlvdXRDaGFuZ2V9Lz4gOiBudWxsfVxuICAgICAgLy8gPFllYXJTZWxlY3RvciBleHBlZGl0aW9ucz17ZXhwZWRpdGlvbnN9IGV4cGVkaXRpb25JRD17ZXhwZWRpdGlvbklEfSBvblllYXJDaGFuZ2U9e29uWWVhckNoYW5nZX0vPlxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbFBhbmVsXCI+XG4gICAgICA8RGF0ZVNlbGVjdG9yIGV4cGVkaXRpb25zPXtleHBlZGl0aW9uc30gZXhwZWRpdGlvbklEPXtleHBlZGl0aW9uSUR9IGN1cnJlbnREYXRlPXtjdXJyZW50RGF0ZX0gLz5cbiAgICAgIHtwYXRoTmFtZSA9PT0gJy9tYXAnID8gPFBsYXliYWNrU2VsZWN0b3IgbW9kZT17cGxheWJhY2t9IG9uUGxheWJhY2tDaGFuZ2U9e29uUGxheWJhY2tDaGFuZ2V9Lz4gOiBudWxsfVxuICAgICAge3BhdGhOYW1lID09PSAnL21hcCcgJiYgd2luZG93LmlubmVyV2lkdGggPiA3NjggPyA8Wm9vbVNlbGVjdG9yIG9uWm9vbUNoYW5nZT17b25ab29tQ2hhbmdlfSB2aWV3cG9ydD17dmlld3BvcnR9Lz4gOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbkNvbnRyb2xQYW5lbC5wcm9wVHlwZXMgPSB7XG4gIHBhdGhOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGV4cGVkaXRpb25JRDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZXhwZWRpdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGN1cnJlbnREYXRlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBwbGF5YmFjazogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWFpbkZvY3VzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZWNvbmRhcnlGb2N1czogUHJvcFR5cGVzLnN0cmluZyxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlcixcbiAgbGF5b3V0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblllYXJDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uUGxheWJhY2tDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uTWFpbkZvY3VzQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblNlY29uZGFyeUZvY3VzQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblpvb21DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uTGF5b3V0Q2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB2aWV3UG9ydDogUHJvcFR5cGVzLm9iamVjdFxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sUGFuZWxcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvQ29udHJvbFBhbmVsLmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBZZWFyU2VsZWN0b3IgPSAoe2V4cGVkaXRpb25JRCwgZXhwZWRpdGlvbnMsIG9uWWVhckNoYW5nZX0pID0+IHtcbiAgdmFyIHRvZ2dsZURyb3Bkb3duID0gKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdZZWFyU2VsZWN0b3JEcm9wZG93bicpLmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKVxuICB9XG5cbiAgdmFyIGN1cnJlbnRFeHBlZGl0aW9uTmFtZSA9IGV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF0ubmFtZVxuICB2YXIgZXhwZWRpdGlvbkxpc3QgPSBPYmplY3Qua2V5cyhleHBlZGl0aW9ucylcbiAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGV4cGVkaXRpb25zW2JdLmVuZC5nZXRUaW1lKCkgLSBleHBlZGl0aW9uc1thXS5lbmQuZ2V0VGltZSgpXG4gICAgfSlcbiAgICAubWFwKGZ1bmN0aW9uIChrLCBpKSB7XG4gICAgICB2YXIgZXhwZWRpdGlvbiA9IGV4cGVkaXRpb25zW2tdXG4gICAgICByZXR1cm4gPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiBvblllYXJDaGFuZ2Uoayl9IGtleT17aX0+e2V4cGVkaXRpb24ubmFtZX08L2E+XG4gICAgfSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24geWVhclNlbGVjdG9yIGNvbnRyb2xTZWxlY3RvclwiPlxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0b2dnbGVEcm9wZG93bn0gY2xhc3NOYW1lPVwiZHJvcGJ0blwiPntjdXJyZW50RXhwZWRpdGlvbk5hbWV9PHNwYW4+PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgPGRpdiBpZD1cIlllYXJTZWxlY3RvckRyb3Bkb3duXCIgY2xhc3NOYW1lPVwiZHJvcGRvd24tY29udGVudFwiPlxuICAgICAgICB7ZXhwZWRpdGlvbkxpc3R9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5ZZWFyU2VsZWN0b3IucHJvcFR5cGVzID0ge1xuICBvblllYXJDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGV4cGVkaXRpb25JRDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBleHBlZGl0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59XG5cbmV4cG9ydCBkZWZhdWx0IFllYXJTZWxlY3RvclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9ZZWFyU2VsZWN0b3IuanNcbiAqKi8iLCJcbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnXG5pbXBvcnQge2RhdGVUb1N0cmluZ30gZnJvbSAnLi4vdXRpbHMnXG5cbmNvbnN0IERhdGVTZWxlY3RvciA9ICh7ZXhwZWRpdGlvbnMsIGV4cGVkaXRpb25JRCwgY3VycmVudERhdGV9KSA9PiB7XG4gIHZhciBleHBlZGl0aW9uID0gZXhwZWRpdGlvbnNbZXhwZWRpdGlvbklEXVxuICB2YXIgZGF5Q291bnQgPSBNYXRoLmZsb29yKChjdXJyZW50RGF0ZS5nZXRUaW1lKCkgLSBleHBlZGl0aW9uLnN0YXJ0LmdldFRpbWUoKSkgLyAoMTAwMCAqIDM2MDAgKiAyNCkpXG4gIHZhciBkYXRlU3RyaW5nID0gZGF0ZVRvU3RyaW5nKGN1cnJlbnREYXRlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJkYXRlU2VsZWN0b3IgY29udHJvbFNlbGVjdG9yXCI+XG4gICAgICA8cD5cbiAgICAgICAgREFZIHtkYXlDb3VudH1cbiAgICAgICAgPGJyLz5cbiAgICAgICAge2RhdGVTdHJpbmd9XG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuRGF0ZVNlbGVjdG9yLnByb3BUeXBlcyA9IHtcbiAgZXhwZWRpdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZXhwZWRpdGlvbklEOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGN1cnJlbnREYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0ZVNlbGVjdG9yXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb21wb25lbnRzL0RhdGVTZWxlY3Rvci5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcbmltcG9ydCBhdXRvYmluZCBmcm9tICdhdXRvYmluZC1kZWNvcmF0b3InXG5cbmNsYXNzIFBsYXliYWNrU2VsZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW91c2VPdmVyOiAnJ1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBvbk1vdXNlTW92ZSAoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgIG1vdXNlT3ZlcjogZS5uYXRpdmVFdmVudC50YXJnZXQuY2xhc3NOYW1lXG4gICAgfSlcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBvbk1vdXNlT3V0IChlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAuLi50aGlzLnN0YXRlLFxuICAgICAgbW91c2VPdmVyOiAnJ1xuICAgIH0pXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgbW9kZSwgb25QbGF5YmFja0NoYW5nZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IHsgbW91c2VPdmVyIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3Qgb25Nb3VzZU1vdmUgPSB0aGlzLm9uTW91c2VNb3ZlXG4gICAgdmFyIHR5cGVzID0gWydmYXN0QmFja3dhcmQnLCAnYmFja3dhcmQnLCAncGF1c2UnLCAnZm9yd2FyZCcsICdmYXN0Rm9yd2FyZCddXG4gICAgdmFyIGJ1dHRvbnMgPSB0eXBlcy5tYXAoZnVuY3Rpb24gKHMsIGkpIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSAncGxheWJhY2tCdXR0b24gJyArIChzID09PSBtb2RlID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnKVxuXG4gICAgICB2YXIgc3JjID0gKCkgPT4ge1xuICAgICAgICB2YXIgdXJsID0gJy9zdGF0aWMvaW1nL2ljb24tJyArIHNcbiAgICAgICAgaWYgKHMgPT09IG1vZGUgfHwgbW91c2VPdmVyID09PSBzKSB1cmwgKz0gJy1ob3ZlcidcbiAgICAgICAgcmV0dXJuIHVybCArICcucG5nJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc05hbWV9IGtleT17aX0gb25DbGljaz17KCkgPT4gb25QbGF5YmFja0NoYW5nZShzKX0gb25Nb3VzZU1vdmU9e29uTW91c2VNb3ZlfT5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT17c30gd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgc3JjPXtzcmMoKX0vPlxuICAgICAgICA8L2xpPlxuICAgICAgKVxuICAgIH0pXG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9XCJwbGF5YmFja1NlbGVjdG9yIGJ1dHRvblJvdyBjb250cm9sU2VsZWN0b3JcIiBvbk1vdXNlT3V0PXt0aGlzLm9uTW91c2VPdXR9PlxuICAgICAgICB7YnV0dG9uc31cbiAgICAgIDwvdWw+XG4gICAgKVxuICB9XG59XG5cblBsYXliYWNrU2VsZWN0b3IucHJvcFR5cGVzID0ge1xuICBtb2RlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uUGxheWJhY2tDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWJhY2tTZWxlY3RvclxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvUGxheWJhY2tTZWxlY3Rvci5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcblxuY29uc3QgRm9jdXNTZWxlY3RvciA9ICh7bWFpbkZvY3VzLCBzZWNvbmRhcnlGb2N1cywgb25NYWluRm9jdXNDaGFuZ2UsIG9uU2Vjb25kYXJ5Rm9jdXNDaGFuZ2V9KSA9PiB7XG5cbiAgdmFyIHRvZ2dsZURyb3Bkb3duID0gKGkpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIkZvY3VzU2VsZWN0b3JcIitpK1wiT3B0aW9uc1wiKS5jbGFzc0xpc3QudG9nZ2xlKFwic2hvd1wiKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmb2N1c1NlbGVjdG9yIGNvbnRyb2xTZWxlY3RvclwiPlxuICAgICAgPHA+Rm9jdXMgb246PC9wPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93blwiPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpPT50b2dnbGVEcm9wZG93bigxKX0gY2xhc3NOYW1lPVwiZHJvcGJ0blwiPnttYWluRm9jdXN9PC9idXR0b24+XG4gICAgICAgIDxkaXYgaWQ9XCJGb2N1c1NlbGVjdG9yMU9wdGlvbnNcIiBjbGFzc05hbWU9XCJkcm9wZG93bi1jb250ZW50XCI+XG4gICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKT0+b25NYWluRm9jdXNDaGFuZ2UoXCJleHBsb3JlcnNcIil9PkV4cGxvcmVyczwvYT5cbiAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpPT5vbk1haW5Gb2N1c0NoYW5nZShcInNlbnNvcnNcIil9PlNlbnNvcnM8L2E+XG4gICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKT0+b25NYWluRm9jdXNDaGFuZ2UoXCJhbmltYWxzXCIpfT5BbmltYWxzPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93blwiPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpPT50b2dnbGVEcm9wZG93bigyKX0gY2xhc3NOYW1lPVwiZHJvcGJ0blwiPntzZWNvbmRhcnlGb2N1c308L2J1dHRvbj5cbiAgICAgICAgPGRpdiBpZD1cIkZvY3VzU2VsZWN0b3IyT3B0aW9uc1wiIGNsYXNzTmFtZT1cImRyb3Bkb3duLWNvbnRlbnRcIj5cbiAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpPT5vblNlY29uZGFyeUZvY3VzQ2hhbmdlKFwic3RldmVcIil9PlN0ZXZlPC9hPlxuICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCk9Pm9uU2Vjb25kYXJ5Rm9jdXNDaGFuZ2UoXCJqZXJcIil9PkplcjwvYT5cbiAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpPT5vblNlY29uZGFyeUZvY3VzQ2hhbmdlKFwic2hhaFwiKX0+U2hhaDwvYT5cbiAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpPT5vblNlY29uZGFyeUZvY3VzQ2hhbmdlKFwiY2hyaXNcIil9PkNocmlzPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbkZvY3VzU2VsZWN0b3IucHJvcFR5cGVzID0ge1xuICBtYWluRm9jdXM6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2Vjb25kYXJ5Rm9jdXM6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb25NYWluRm9jdXNDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uU2Vjb25kYXJ5Rm9jdXNDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9jdXNTZWxlY3RvclxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvRm9jdXNTZWxlY3Rvci5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnXG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJ1xuXG5jbGFzcyBab29tU2VsZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW91c2VPdmVyOiAnJ1xuICAgIH1cbiAgfVxuXG4gIC8vIEBhdXRvYmluZFxuICAvLyBvbk1vdXNlTW92ZSAoZSkge1xuICAvLyAgIHRoaXMuc2V0U3RhdGUoe1xuICAvLyAgICAgLi4udGhpcy5zdGF0ZSxcbiAgLy8gICAgIG1vdXNlT3ZlcjogZS5uYXRpdmVFdmVudC50YXJnZXQuY2xhc3NOYW1lXG4gIC8vICAgfSlcbiAgLy8gfVxuXG4gIC8vIEBhdXRvYmluZFxuICAvLyBvbk1vdXNlT3V0IChlKSB7XG4gIC8vICAgdGhpcy5zZXRTdGF0ZSh7XG4gIC8vICAgICAuLi50aGlzLnN0YXRlLFxuICAvLyAgICAgbW91c2VPdmVyOiAnJ1xuICAvLyAgIH0pXG4gIC8vIH1cblxuICAvLyBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcblxuICAvLyB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IG9uWm9vbUNoYW5nZSwgdmlld3BvcnQgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBvbk1vdXNlTW92ZSA9IHRoaXMub25Nb3VzZU1vdmVcbiAgICBjb25zdCB7IG1vdXNlT3ZlciB9ID0gdGhpcy5zdGF0ZVxuICAgIHZhciB0eXBlcyA9IFsnZGVjcmVtZW50JywgJ2luY3JlbWVudCddXG5cbiAgICB2YXIgYnV0dG9ucyA9IHR5cGVzLm1hcChmdW5jdGlvbiAocywgaSkge1xuICAgICAgdmFyIHNyYyA9ICgpID0+IHtcbiAgICAgICAgdmFyIHVybCA9ICcvc3RhdGljL2ltZy9pY29uLScgKyBzXG4gICAgICAgIGlmIChtb3VzZU92ZXIgPT09IHMpIHVybCArPSAnLWhvdmVyJ1xuICAgICAgICByZXR1cm4gdXJsICsgJy5wbmcnXG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwiem9vbUJ1dHRvblwiIGtleT17aX0gb25DbGljaz17KCkgPT4geyBvblpvb21DaGFuZ2UocykgfX0+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9e3N9IHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHNyYz17c3JjKCl9Lz5cbiAgICAgICAgPC9saT5cbiAgICAgIClcbiAgICB9KVxuXG4gICAgY29uc3QgeyB1bnByb2plY3QgfSA9IFZpZXdwb3J0TWVyY2F0b3IoeyAuLi52aWV3cG9ydCB9KVxuICAgIHZhciBzY2FsZVJhbmdlID0gKHVucHJvamVjdChbNjQsIDBdKVswXSAtIHVucHJvamVjdChbMCwgMF0pWzBdKSAqIDExMVxuICAgIHZhciBzY2FsZVN0cmluZyA9IE1hdGgucm91bmQoc2NhbGVSYW5nZSkgKyAna20nXG4gICAgaWYgKHNjYWxlUmFuZ2UgPCAxKSBzY2FsZVN0cmluZyA9IE1hdGgucm91bmQoc2NhbGVSYW5nZSAqIDEwMDApICsgJ20nXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3RvciBjb250cm9sU2VsZWN0b3JcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiYnV0dG9uUm93XCI+XG4gICAgICAgICAgICB7YnV0dG9uc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgICA8bGluZSB4MT17MH0geTE9ezE3LjV9IHgyPXsxMn0geTI9ezE3LjV9IHN0cm9rZT17J3doaXRlJ30vPlxuICAgICAgICAgIDxsaW5lIHgxPXs1Mn0geTE9ezE3LjV9IHgyPXs2NH0geTI9ezE3LjV9IHN0cm9rZT17J3doaXRlJ30vPlxuICAgICAgICAgIDxsaW5lIHgxPXswLjV9IHkxPXsxMn0geDI9ezAuNX0geTI9ezIyfSBzdHJva2U9eyd3aGl0ZSd9Lz5cbiAgICAgICAgICA8bGluZSB4MT17NjMuNX0geTE9ezEyfSB4Mj17NjMuNX0geTI9ezIyfSBzdHJva2U9eyd3aGl0ZSd9Lz5cbiAgICAgICAgICA8dGV4dCB4PXszMn0geT17MTh9IGZpbGw9eyd3aGl0ZSd9IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICAgICAgYWxpZ25tZW50QmFzZWxpbmU6ICdtaWRkbGUnLFxuICAgICAgICAgICAgdGV4dEFuY2hvcjogJ21pZGRsZSdcbiAgICAgICAgICB9fT57c2NhbGVTdHJpbmd9PC90ZXh0PlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5ab29tU2VsZWN0b3IucHJvcFR5cGVzID0ge1xuICBvblpvb21DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHZpZXdQb3J0OiBQcm9wVHlwZXMub2JqZWN0XG59XG5cbmV4cG9ydCBkZWZhdWx0IFpvb21TZWxlY3RvclxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvWm9vbVNlbGVjdG9yLmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBMYXlvdXRTZWxlY3RvciA9ICh7bW9kZSwgb25MYXlvdXRDaGFuZ2V9KSA9PiB7XG4gIHZhciB0eXBlcyA9IFsncm93cycsJ2dyaWQnXVxuXG4gIHZhciBidXR0b25zID0gdHlwZXMubWFwKGZ1bmN0aW9uKHMsaSl7XG5cbiAgICB2YXIgY2xhc3NOYW1lID0gJ2xheW91dEJ1dHRvbiAnICsgKHMgPT09IG1vZGUgPydhY3RpdmUnOidpbmFjdGl2ZScpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBrZXk9e2l9IG9uQ2xpY2s9eygpPT5vbkxheW91dENoYW5nZShzKX0+XG4gICAgICAgIDxpbWcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIvPlxuICAgICAgPC9saT5cbiAgICApXG4gIH0pXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImJ1dHRvblJvd1wiPlxuICAgICAgICAgIHtidXR0b25zfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuTGF5b3V0U2VsZWN0b3IucHJvcFR5cGVzID0ge1xuICBvbkxheW91dENoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbW9kZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59XG5cbmV4cG9ydCBkZWZhdWx0IExheW91dFNlbGVjdG9yXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb21wb25lbnRzL0xheW91dFNlbGVjdG9yLmpzXG4gKiovIiwiXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgSm91cm5hbFBhZ2UgZnJvbSAnLi4vY29tcG9uZW50cy9Kb3VybmFsUGFnZSdcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vYWN0aW9ucy5qcydcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJ1xuXG5cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBvd25Qcm9wcykgPT4ge1xuICBjb25zdCBleHBlZGl0aW9uSUQgPSBzdGF0ZS5zZWxlY3RlZEV4cGVkaXRpb25cbiAgY29uc3QgZXhwZWRpdGlvbiA9IHN0YXRlLmV4cGVkaXRpb25zW2V4cGVkaXRpb25JRF1cbiAgaWYgKCFleHBlZGl0aW9uKSByZXR1cm4geyBwb3N0czogW10gfVxuICBcbiAgcmV0dXJuIHtcbiAgICBleHBlZGl0aW9uOiBleHBlZGl0aW9uLFxuICAgIHBvc3RzOiBkMy52YWx1ZXMoZXhwZWRpdGlvbi5mZWF0dXJlcykubWFwKHAgPT4ge1xuICAgICAgdmFyIGtleSA9IHAuaWRcbiAgICAgIHZhciB0eXBlID0gcC5wcm9wZXJ0aWVzLkZlYXR1cmVUeXBlXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHAucHJvcGVydGllcy5EYXRlVGltZSlcbiAgICAgIHZhciBsb2NhdGlvbiA9IHAuZ2VvbWV0cnkuY29vcmRpbmF0ZXNcbiAgICAgIHZhciBhdXRob3IgPSBwLnByb3BlcnRpZXMuTWVtYmVyXG4gICAgICB2YXIgdGl0bGUsIGNvbnRlbnQsIGltYWdlcywgbGluaywgZGltZW5zaW9uc1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ3R3ZWV0Jykge1xuICAgICAgICBpZiAoZXhwZWRpdGlvbklEICE9PSAnb2thdmFuZ29fMTQnKSB7XG4gICAgICAgICAgY29udGVudCA9IHAucHJvcGVydGllcy5UZXh0XG4gICAgICAgICAgaW1hZ2VzID0gcC5wcm9wZXJ0aWVzLkltYWdlcy5tYXAoaSA9PiB7IHJldHVybiBpLlVybC5yZXBsYWNlKCdodHRwOi8vJywnaHR0cHM6Ly8nKSB9KVxuICAgICAgICAgIGxpbmsgPSBwLnByb3BlcnRpZXMuVXJsLnJlcGxhY2UoJ2h0dHA6Ly8nLCdodHRwczovLycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGVudCA9IHAucHJvcGVydGllcy5Ud2VldC50ZXh0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgPT09ICdpbWFnZScpIHtcbiAgICAgICAgaWYgKGV4cGVkaXRpb25JRCAhPT0gJ29rYXZhbmdvXzE0Jykge1xuICAgICAgICAgIGNvbnRlbnQgPSBwLnByb3BlcnRpZXMuTm90ZXNcbiAgICAgICAgICBpbWFnZXMgPSBbcC5wcm9wZXJ0aWVzLlVybC5yZXBsYWNlKCdodHRwOi8vJywnaHR0cHM6Ly8nKV1cbiAgICAgICAgICBsaW5rID0gcC5wcm9wZXJ0aWVzLkluc3RhZ3JhbUlEXG4gICAgICAgICAgZGltZW5zaW9ucyA9IHAucHJvcGVydGllcy5EaW1lbnNpb25zXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGVudCA9IHAucHJvcGVydGllcy5Ob3Rlc1xuICAgICAgICAgIGltYWdlcyA9IFtwLnByb3BlcnRpZXMuVXJsLnJlcGxhY2UoJ2h0dHA6Ly8nLCdodHRwczovLycpXVxuICAgICAgICAgIGxpbmsgPSBwLnByb3BlcnRpZXMuSW5zdGFncmFtSURcbiAgICAgICAgICBkaW1lbnNpb25zID0gcC5wcm9wZXJ0aWVzLlNpemVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PT0gJ2Jsb2cnKSB7XG4gICAgICAgIHRpdGxlID0gcC5wcm9wZXJ0aWVzLlRpdGxlXG4gICAgICAgIGNvbnRlbnQgPSBwLnByb3BlcnRpZXMuU3VtbWFyeVxuICAgICAgICBsaW5rID0gcC5wcm9wZXJ0aWVzLlVybC5yZXBsYWNlKCdodHRwOi8vJywnaHR0cHM6Ly8nKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PT0gJ2F1ZGlvJykge1xuICAgICAgICB0aXRsZSA9IHAucHJvcGVydGllcy5UaXRsZVxuICAgICAgICBsaW5rID0gcC5wcm9wZXJ0aWVzLlNvdW5kQ2xvdWRVUkwucmVwbGFjZSgnaHR0cDovLycsJ2h0dHBzOi8vJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5LFxuICAgICAgICB0eXBlLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgaW1hZ2VzLFxuICAgICAgICBsaW5rLFxuICAgICAgICBkYXRlLFxuICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgYXV0aG9yLFxuICAgICAgICBkaW1lbnNpb25zXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gsIG93blByb3BzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgY2hlY2tGZWVkQ29udGVudDogKCkgPT4ge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKGFjdGlvbnMuY2hlY2tGZWVkQ29udGVudCgpKVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBKb3VybmFsUGFnZUNvbnRhaW5lciA9IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4pKEpvdXJuYWxQYWdlKVxuXG5leHBvcnQgZGVmYXVsdCBKb3VybmFsUGFnZUNvbnRhaW5lclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29udGFpbmVycy9Kb3VybmFsUGFnZUNvbnRhaW5lci5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcbmltcG9ydCBGZWVkIGZyb20gJy4vRmVlZCdcbmltcG9ydCBDb250cm9sUGFuZWxDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9Db250cm9sUGFuZWxDb250YWluZXIuanMnXG4vLyBpbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJ1xuXG5jbGFzcyBKb3VybmFsUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIFxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtwb3N0cywgY2hlY2tGZWVkQ29udGVudCwgZXhwZWRpdGlvbn0gPSB0aGlzLnByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYWdlJyBpZD1cImpvdXJuYWxQYWdlXCI+XG4gICAgICAgIDxDb250cm9sUGFuZWxDb250YWluZXIgcGF0aE5hbWU9e2xvY2F0aW9uLnBhdGhuYW1lfS8+XG4gICAgICAgIDxGZWVkIHBvc3RzPXtwb3N0c30gY2hlY2tGZWVkQ29udGVudD17Y2hlY2tGZWVkQ29udGVudH0gZXhwZWRpdGlvbj17ZXhwZWRpdGlvbn0vPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbkpvdXJuYWxQYWdlLnByb3BUeXBlcyA9IHtcbiAgcG9zdHM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBleHBlZGl0aW9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjaGVja0ZlZWRDb250ZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59XG5cbmV4cG9ydCBkZWZhdWx0IEpvdXJuYWxQYWdlXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb21wb25lbnRzL0pvdXJuYWxQYWdlLmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFBvc3QgZnJvbSAnLi9Qb3N0J1xuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnXG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJ1xuXG5jbGFzcyBGZWVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gIH1cblxuICBAYXV0b2JpbmQgXG4gIGFnYSAoKSB7XG4gICAgY29uc29sZS5sb2coJ2FnYSBzY3JvbGwhJylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBwb3N0cywgY2hlY2tGZWVkQ29udGVudCB9ID0gdGhpcy5wcm9wc1xuXG4gICAgY29uc3QgZm9ybWF0ID0gJ2Z1bGwnXG4gICAgY29uc3QgcG9zdEZlZWQgPSBwb3N0c1xuICAgICAgLnNsaWNlKDApXG4gICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gYi5kYXRlIC0gYS5kYXRlXG4gICAgICB9KVxuICAgICAgLm1hcChwb3N0ID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8UG9zdCBmb3JtYXQ9e2Zvcm1hdH0gZGF0YT17cG9zdH0ga2V5PXtwb3N0LmtleX0+XG4gICAgICAgICAgICB7cG9zdC5jb250ZW50fVxuICAgICAgICAgIDwvUG9zdD5cbiAgICAgICAgKVxuICAgICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwiZmVlZFwiIG9uV2hlZWw9e2NoZWNrRmVlZENvbnRlbnR9PlxuICAgICAgICB7cG9zdEZlZWR9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuRmVlZC5wcm9wVHlwZXMgPSB7XG4gIHBvc3RzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgZXhwZWRpdGlvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgY2hlY2tGZWVkQ29udGVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufVxuXG5leHBvcnQgZGVmYXVsdCBGZWVkXG5cblxuXG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3RhdGljL2pzL2NvbXBvbmVudHMvRmVlZC5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcbmltcG9ydCBEYXRhUGFnZUluZGV4IGZyb20gJy4vRGF0YVBhZ2VJbmRleCdcbmltcG9ydCBBUElFeHBsb3JlciBmcm9tICcuL0FQSUV4cGxvcmVyJ1xuXG5jb25zdCBEYXRhUGFnZSA9ICgpID0+IHtcblxuICB2YXIgc2VjdGlvbnMgPSBbXG4gICAgeydrZXknOjEsICd0aXRsZSc6J092ZXJ2aWV3JywgJ2NvbnRlbnQnOlxuICAgICAgKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgVGhlIE9rYXZhbmdvIERhdGFiYXNlIGlzIGEgZ3Jvd2luZyByZWNvcmQgb2YgZGF0YSBnZW5lcmF0ZWQgYnkgdGhlIGV4cGxvcmVycyBhbmQgc2NpZW50aXN0cyBvbiB0aGVpciAxMjAgZGF5IGV4cGVkaXRpb24gdG8gdGhlIE9rYXZhbmdvIERlbHRhLiBUaGUgZGF0YWJhc2UgZW5jb21wYXNzZXMgPGVtPndpbGRsaWZlIHNpZ2h0aW5ncywgdHdlZXRzLCBhdWRpbyByZWNvcmRpbmdzPC9lbT4gYW5kIDxlbT5pbWFnZXM8L2VtPiB0YWtlbiBieSB0aGUgcGFydGljaXBhbnRzLCBhcyB3ZWxsIGFzIDxlbT5zZW5zb3IgbWVhc3VyZW1lbnRzPC9lbT4gY2FwdHVyaW5nIHRoaW5ncyBsaWtlIDxlbT50ZW1wZXJhdHVyZSwgcEggbGV2ZWxzLCBhbmQgaGVhcnQgcmF0ZXM8L2VtPi5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICBUaGUgaW50ZW50aW9uIG9mIHRoZSBPa2F2YW5nbyBEYXRhYmFzZSBBUEkgaXMgdG8gc2hhcmUgdGhlIGRhdGEgaW4gYWxtb3N0IHJlYWwtdGltZSBhcyBpdOKAmXMgdXBsb2FkZWQsIHNvIHRoYXQgcGVvcGxlIGFsbCBvdmVyIHRoZSB3b3JsZCBjYW4gZm9sbG93IHRoZSBqb3VybmV5IGFzIGl0IHVuZm9sZHMuIEl0IGFsc28gYWxsb3dzIGZvciBvdGhlcnMgdG8gdXNlIHRoZSBkYXRhIGZvciB0aGVpciBvd24gcHVycG9zZXMuIEJlbG93IGFyZSBleGFtcGxlcyBvZiBjb29sIHRoaW5ncyBwZW9wbGUgaGF2ZSBidWlsZCB3aXRoIG91ciBBUEkuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj4gXG4gICAgICApXG4gICAgfSxcbiAgICB7J2tleSc6MiwgJ3RpdGxlJzonRXhwbG9yZScsICdjb250ZW50JzpcbiAgICAgICg8QVBJRXhwbG9yZXIvPilcbiAgICB9LFxuICAgIHsna2V5JzozLCAndGl0bGUnOidEb2N1bWVudGF0aW9uJywgJ2NvbnRlbnQnOlxuICAgICAgKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMz5XaGF0IGlzIGFuIEFQST88L2gzPlxuICAgICAgICAgIDxwPkFQSSBzdGFuZHMgZm9yIGFwcGxpY2F0aW9uIHByb2dyYW1taW5nIGludGVyZmFjZSwgd2hpY2ggdXN1YWxseSBpbnZvbHZlcyBhIHNldCBvZiBwcm9jZXNzZXMgYW5kIGNvbW1hbmRzIHRoYXQgbWFrZSBpdCBjb252ZW5pZW50IGZvciBwZW9wbGUgdG8gYWNjZXNzIGNvbXB1dGVyIGNvZGUgb3IgaW5mb3JtYXRpb24gdGhhdCBzb21lb25lIGhhcyBhbHJlYWR5IHByb2R1Y2VkLiBGb3IgaW5zdGFuY2UsIGlmIHlvdSB3YW50IHRvIG1ha2UgeW91ciBvd24gYXBwIHBvc3QgYSBtZXNzYWdlIHRvIEZhY2Vib29rLCB5b3Ugd291bGQgcHJvYmFibHkgdXNlIEZhY2Vib29r4oCZcyBBUEkgdG8gaW50ZWdyYXRlIHlvdXIgYXBwIHdpdGggdGhlaXJzLjwvcD5cbiAgICAgICAgICA8aDM+V2hhdCBpcyBhIERhdGFiYXNlPzwvaDM+XG4gICAgICAgICAgPHA+QSBkYXRhYmFzZSBpcyBhbiBvcmdhbml6ZWQgY29sbGVjdGlvbiBvZiBkYXRhLiBGb3IgdGhlIE9rYXZhbmdvIFdpbGRsaWZlIERhdGFiYXNlLCBlYWNoIHR5cGUgb2YgZGF0YSAmIzgyMTI7IGEgd2lsZGxpZmUgc2lnaHRpbmcsIGltYWdlLCBzZW5zb3IgcmVhZGluZyBvciBhdWRpbyByZWNvcmRpbmcsIHRvIG5hbWUgYSBmZXcgJiM4MjEyOyBpcyB1cGxvYWRlZCB0byBhbiBvbmxpbmUgc2VydmVyIHZpYSBzYXRlbGxpdGUuIEFzIHRoZSBleHBlZGl0aW9uIHVuZm9sZHMsIHRoZSBkYXRhYmFzZSB3aWxsIGdyb3csIGhvbGRpbmcgbW9yZSBhbmQgbW9yZSByZWNvcmRzIG9mIHdoYXQgdGhlIGV4cGxvcmVycyBhbmQgc2NpZW50aXN0cyBoYXZlIHdpdG5lc3NlZCBvbiB0aGUgdHJpcC48L3A+XG4gICAgICAgICAgPGgzPldoYXQgaXMgYSBEYXRhYmFzZSBBUEk/PC9oMz5cbiAgICAgICAgICA8cD5UaGUgT2thdmFuZ28gRGF0YWJhc2UgQVBJIGlzIHRoZSBpbnRlcmZhY2UgdGhhdCBhbGxvd3MgeW91IHRvIGFzayB0aGUgZGF0YWJhc2UgdG8gc2hvdyB5b3Ugd2hhdOKAmXMgaW5zaWRlLiBVc3VhbGx5LCBBUEnigJlzIGFyZSBzb2Z0d2FyZS10by1zb2Z0d2FyZSBpbnRlcmZhY2VzIHRoYXQgYXJlbuKAmXQgdGhhdCBlYXN5IGZvciBodW1hbnMgdG8gdW5kZXJzdGFuZC4gVG8gYXNrIHRoZSBkYXRhYmFzZSB0byBnaXZlIHlvdSBkYXRhIGJhY2ssIHlvdSBtYWtlIGEgc3BlY2lmaWMgcXVlcnkgaW4gdGhlIGZvcm0gb2YgYSBVUkwuIFRoZSBkYXRhYmFzZSBpcyBhYmxlIHRvIHBhcnNlIGFuZCByZWNvZ25pemUgdGhpcyByZXF1ZXN0LCBhbmQgcmV0dXJucyB0aGUgZGF0YSB0byB5b3UgaW4gc29tZSBraW5kIG9mIHN0cnVjdHVyZWQgd2F5LCBsaWtlIGFuIFhNTCBvciBKU09OIGZpbGUuIEluIG91ciBjYXNlLCB0aGUgT2thdmFuZ28gRGF0YWJhc2UgcmV0dXJucyBpbmZvcm1hdGlvbiBpbiBKU09OIChKYXZhc2NyaXB0IE9iamVjdCBOb3RhdGlvbikuPC9wPlxuICAgICAgICAgIDxoMz5DYWxsaW5nIHRoZSBBUEk8L2gzPlxuICAgICAgICAgIDxwPkJhc2ljYWxseSwgaXQmIzM5O3MgbGlrZSB0aGlzOiA8Y29kZT4vYXBpLyZsdDt2aWV3Jmd0Oy8mbHQ7b3V0cHV0Jmd0Oz8mbHQ7cXVlcnkmZ3Q7PC9jb2RlPjwvcD5cbiAgICAgICAgICA8cD5UaGUgdmlldyBpcyB3aGF0IGtpbmQgb2YgdGhpbmcgeW91IHdhbnQgYmFjay4gVGhlIGNvcmUgb2YgdGhlIEFQSSBsaWVzIGluIHRoZSBmZWF0dXJlcyB2aWV3LCBidXQgeW91IGNhbiBhbHNvIHZpZXcgZXhwZWRpdGlvbnMsIG1lbWJlcnMgYW5kIHNwZWNpZXMgYXMgZ2VuZXJhbCBsaXN0cy48L3A+XG4gICAgICAgICAgPHA+VGhlIG91dHB1dCByZXR1cm5zIHRoZSBkYXRhIGFzIEpTT04gaWYgbm90aGluZyBpcyBzcGVjaWZpZWQsIG90aGVyd2lzZSB5b3UgY2FuIHNwZWNpZnkgPGNvZGU+bWFwPC9jb2RlPiB0byBzZWUgdGhlIGRhdGEgcGxvdHRlZCBzcGF0aWFsbHkgb3IgPGNvZGU+dml6PC9jb2RlPiBmb3IgYSBncmFwaC48L3A+XG4gICAgICAgICAgPHA+VGhlIHF1ZXJ5IGRlZmluZXMgdGhlIGZpbHRlciAoZXg6IDxjb2RlPkZlYXR1cmVUeXBlPXNpZ2h0aW5nPC9jb2RlPikuIE11bHRpcGxlIGZpbHRlcnMgYXJlIGFwcGVuZGVkIHdpdGggPGNvZGU+JjwvY29kZT4gaW4gYmV0d2Vlbi48L3A+XG4gICAgICAgICAgPGgzPkFQSSBFbmRwb2ludHM8L2gzPlxuICAgICAgICAgIDxwPlRoZSBmb2xsb3dpbmcgbGlzdCBvdXRsaW5lcyBhbGwgcG9zc2libGUgbWV0aG9kcyBmb3IgYWNjZXNzaW5nIGZlYXR1cmVzIGluIHRoZSBPa2F2YW5nbyBEYXRhYmFzZS4gVGhlc2UgbWV0aG9kcyBhcmUgYWxzbyBrbm93biBhcyBlbmRwb2ludHMsIGFuZCBhcmUgcmVxdWVzdGVkIHdpdGggYSBVUkwuIEZvciBleGFtcGxlLCB0byBsb2FkIGFsbCBvZiB0aGUgZWxlcGhhbnQgc2lnaHRpbmdzIChsaW1pdGVkIHRvIHRoZSBmaXJzdCAxMDAgYnkgZGVmYXVsdCksIHlvdSB3b3VsZCByZXF1ZXN0OiA8Y29kZT48YSBocmVmPVwiaHR0cDovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL2ZlYXR1cmVzP0ZlYXR1cmVUeXBlPXNpZ2h0aW5nJlNwZWNpZXNOYW1lPUVsZXBoYW50XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgaHR0cDovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL2ZlYXR1cmVzP0ZlYXR1cmVUeXBlPXNpZ2h0aW5nJlNwZWNpZXNOYW1lPUVsZXBoYW50PC9hPjwvY29kZT48L3A+XG4gICAgICAgICAgPHA+VGhlIEVsZXBoYW50IHNpZ2h0aW5ncyBjb3VsZCBiZSBmaWx0ZXJlZCBmdXJ0aGVyLCBieSB0aGUgZXhwZWRpdGlvbiBtZW1iZXIgd2hvIHNhdyB0aGVtLCBnZW9ncmFwaGljIHJlZ2lvbiwgb3IgZGF5IG9mIGV4cGVkaXRpb24sIGZvciBleGFtcGxlLiBFYWNoIEFQSSBlbmRwb2ludCBjYWxsIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcgZ2VuZXJhbCBpbmZvcm1hdGlvbjo8L3A+XG4gICAgICAgICAgPHA+PGNvZGU+bGltaXQ6PC9jb2RlPiB0aGUgYW1vdW50IG9mIGVudHJpZXMgcmV0dXJuZWQuIFRoZSBkZWZhdWx0IGxpbWl0IGlzIDEwMCwgYnV0IHRoaXMgY2FuIGJlIGNoYW5nZWQgKGV4OiA8Y29kZT5saW1pdD0zMDwvY29kZT4pLiBMYXJnZXIgbGltaXRzIHRheCB0aGUgZGF0YWJhc2UsIHNvIGl0IGlzIHJlY29tbWVuZGVkIHRvIGtlZXAgeW91ciBsaW1pdCByZXF1ZXN0IGFzIHNtYWxsIGFzIHBvc3NpYmxlLjwvcD5cbiAgICAgICAgICA8cD48Y29kZT5yZXNvbHV0aW9uOjwvY29kZT4gcmV0dXJucyBhIGZlYXR1cmUgZm9yIGV2ZXJ5IDxjb2RlPnJlc29sdXRpb248L2NvZGU+IHNlY29uZHMuIFRoaXMgbWlnaHQgYmUgdXNlZnVsIGlmIHlvdSB3YW50IGEgbGFyZ2VyIHNhbXBsZSBzZXQgb3IgdGltZSBwZXJpb2QsIGJ1dCBkb27igJl0IHdhbnQgdG8gb3ZlcmxvYWQgYSBncmFwaCB3aXRoIGV2ZXJ5IHNpbmdsZSBkYXRhIHBvaW50LiA8Y29kZT5mdWxsPC9jb2RlPiByZXR1cm5zIGFsbCBmZWF0dXJlcy48L3A+XG4gICAgICAgICAgPHA+PGNvZGU+ZmlsdGVyOjwvY29kZT4gZmVhdHVyZSBlbmRwb2ludHMgY2FuIGJlIGZpbHRlcmVkIGJ5IG1lbWJlciwgZXhwZWRpdGlvbiwgYXMgd2VsbCBhcyBnZW5lcmFsIGZpbHRlcnMgbGlrZSA8Y29kZT5saW1pdCwgcmVzb2x1dGlvbiw8L2NvZGU+IGFuZCA8Y29kZT5vcmRlci48L2NvZGU+PC9wPlxuICAgICAgICAgIDxwPjxjb2RlPnJldHVybmVkOjwvY29kZT4gdGhlIGFtb3VudCBvZiBlbnRyaWVzIHJldHVybmVkICh0aGlzIHVzdWFsbHkgY29ycmVsYXRlcyB0byBsaW1pdCwgYnV0IG1heSBiZSBsZXNzIHRoYW4gdGhlIGxpbWl0IGluZGljYXRlZCBpZiB0aGVyZSBhcmUgZmV3ZXIgcmVzdWx0cyBpbiB0aGUgZGF0YWJhc2UpLjwvcD5cbiAgICAgICAgICA8cD48Y29kZT5vcmRlcjo8L2NvZGU+IHJlc3VsdHMgYXJlIHJldHVybmVkIGJ5IGRlZmF1bHQgaW4gYXNjZW5kaW5nIG9yZGVyIChpbmRpY2F0ZWQgYnkgc2V0dGluZyA8Y29kZT5vcmRlcjwvY29kZT4gdG8gPGNvZGU+YXNjZW5kaW5nPC9jb2RlPiBvciA8Y29kZT4xPC9jb2RlPiksIG9yIGRlc2NlbmRpbmcgb3JkZXIgKGluZGljYXRlZCBieSBzZXR0aW5nIDxjb2RlPm9yZGVyPC9jb2RlPiB0byA8Y29kZT5kZXNjZW5kaW5nPC9jb2RlPiBvciA8Y29kZT4tMTwvY29kZT4pLjwvcD5cbiAgICAgICAgICA8cD48Y29kZT50b3RhbDo8L2NvZGU+IGluZGljYXRlcyB0aGUgdG90YWwgYW1vdW50IG9mIG1hdGNoaW5nIHJlc3VsdHMgZm9yIHRoZSBxdWVyeSBpbiB0aGUgZGF0YWJhc2UsIGV2ZW4gaWYgdGhlIGFtb3VudCByZXR1cm5lZCBpcyBsaW1pdGVkLjwvcD5cbiAgICAgICAgICA8aDQ+QWRkaXRpb25hbCBGaWx0ZXJzOjwvaDQ+XG4gICAgICAgICAgPHA+PGNvZGU+c3RhcnREYXRlOjwvY29kZT4gc3BlY2lmaWVzIHRoZSBzdGFydGluZyBkYXRlIG9mIHRoZSBmZWF0dXJlcyB0byBiZSByZXR1cm5lZC4gTWF5IGJlIGNvbWJpbmVkIHdpdGggPGNvZGU+ZW5kRGF0ZS48L2NvZGU+IEZvcm1hdCBpcyA8Y29kZT55eXl5LW1tLWRkPC9jb2RlPiAoZXg6IDxjb2RlPnN0YXJ0RGF0ZT0yMDE1LTA2LTAzPC9jb2RlPikuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPmVuZERhdGU6PC9jb2RlPiBzcGVjaWZpZXMgdGhlIGVuZGluZyBkYXRlIG9mIHRoZSBmZWF0dXJlcyB0byBiZSByZXR1cm5lZC4gTWF5IGJlIGNvbWJpbmVkIHdpdGggPGNvZGU+c3RhcnREYXRlLjwvY29kZT4gRm9ybWF0IGlzIDxjb2RlPnl5eXktbW0tZGQ8L2NvZGU+IChleDogPGNvZGU+ZW5kRGF0ZT0yMDE1LTA2LTAzPC9jb2RlPikuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPmdlb0JvdW5kczo8L2NvZGU+IHVwcGVyIGxlZnQgKE5XKSwgbG93ZXIgcmlnaHQgKFNFKTogbG9uXzEsbGF0XzEsbG9uXzIsbGF0XzIuIFNvIHRoZSBPa2F2YW5nbyBEZWx0YSBpcyBzb21ldGhpbmcgbGlrZSA8Y29kZT5nZW9Cb3VuZHM9MjAsLTE3LDI2LC0yMjwvY29kZT48L3A+XG4gICAgICAgICAgPHA+PGNvZGU+ZXhwZWRpdGlvbkRheTo8L2NvZGU+IHJldHVybnMgZGF0YSBmcm9tIGEgc3BlY2lmaWMgZGF5IG9mIHRoZSBleHBlZGl0aW9uIChleDogPGNvZGU+ZXhwZWRpdGlvbkRheT0xPC9jb2RlPik8L3A+XG4gICAgICAgICAgPGg0PlZpZXcgRW5kcG9pbnRzOjwvaDQ+XG4gICAgICAgICAgPHA+VGhlc2UgZW5kcG9pbnRzIG9mZmVyIG92ZXJ2aWV3cyBvZiBhbGwgdGhlIG1lbWJlcnMsIGV4cGVkaXRpb25zIGFuZCBzcGVjaWVzIHRoYXQgY291bGQgYmUgdXNlZCB0byBmdXJ0aGVyIGZpbHRlciBmZWF0dXJlcyBpbiB0aGUgZGF0YWJhc2UuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPm1lbWJlcnM6PC9jb2RlPiByZXZlYWxzIGFuIGFycmF5IG9mIGZlYXR1cmVzIGFzc29jaWF0ZWQgd2l0aCBlYWNoIG1lbWJlci4gRW5kcG9pbnQgdXJsOiA8Y29kZT48YSBocmVmPVwiaHR0cDovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL21lbWJlcnNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwOi8vaW50b3RoZW9rYXZhbmdvLm9yZy9hcGkvbWVtYmVyczwvYT48L2NvZGU+PC9wPlxuICAgICAgICAgIDxwPjxjb2RlPmV4cGVkaXRpb25zOjwvY29kZT4gcmV2ZWFscyBhbGwgb2YgdGhlIGV4cGVkaXRpb25zIHRvIHRoZSBPa2F2YW5nbyBEZWx0YSwgYWxvbmcgd2l0aCBzdGFydCBkYXRlIGFuZCBkdXJhdGlvbi4gRW5kcG9pbnQgdXJsOiA8Y29kZT48YSBocmVmPVwiaHR0cDovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL2V4cGVkaXRpb25zXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cDovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL2V4cGVkaXRpb25zPC9hPjwvY29kZT48L3A+XG4gICAgICAgICAgPHA+PGNvZGU+c3BlY2llczo8L2NvZGU+IHJldmVhbHMgYWxsIG9mIHRoZSBzcGVjaWVzIHNpZ2h0aW5ncyBvbiB0aGUgZXhwZWRpdGlvbnMuIEVuZHBvaW50IHVybDogPGNvZGU+PGEgaHJlZj1cImh0dHA6Ly9pbnRvdGhlb2thdmFuZ28ub3JnL2FwaS9zcGVjaWVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cDovL2ludG90aGVva2F2YW5nby5vcmcvYXBpL3NwZWNpZXM8L2E+PC9jb2RlPjwvcD5cbiAgICAgICAgICA8aDQ+RmVhdHVyZXMgRW5kcG9pbnRzOjwvaDQ+XG4gICAgICAgICAgPHA+SWYgeW91IHRyeSB0byBjYWxsIHRoZSBmZWF0dXJlcyB2aWV3LCB0aGUgZm9ybWF0IGxvb2tzIHF1aXRlIGRpZmZlcmVudCBmcm9tIHRoZSBvdGhlciB2aWV3IGVuZHBvaW50cy4gVGhpcyBpcyBiZWNhdXNlIHRoZSBGZWF0dXJlcyB2aWV3IGNvbnRhaW5zIHRoZSBidWxrIG9mIHdoYXTigJlzIGluIHRoZSBkYXRhYmFzZSwgYW5kIGlzIHRoZSBtYWluIGNvbGxlY3Rpb24gdG8gYmUgc2VhcmNoZWQgYW5kIGZpbHRlcmVkLjwvcD5cbiAgICAgICAgICA8cD5UaGUgcHJpbWFyeSB3YXkgdG8gZmlsdGVyIHRoZSBmZWF0dXJlcyBpcyBieSA8Y29kZT5GZWF0dXJlVHlwZTwvY29kZT4gKGV4OiA8Y29kZT5GZWF0dXJlVHlwZT1hbWJpdDwvY29kZT4pLjwvcD5cbiAgICAgICAgICA8cD5IZXJlIGlzIGEgbGlzdCBvZiB0aGUgcG9zc2libGUgRmVhdHVyZVR5cGVzLCBhbmQgdGhlIGRhdGEgdGhleSBjb250YWluOiA8L3A+XG4gICAgICAgICAgPHA+PGNvZGU+YW1iaXQ6PC9jb2RlPiBjb250YWlucyBoZWFydCByYXRlIGFuZCBvdGhlciBhY3Rpdml0eSBkYXRhIGNhcHR1cmVkIGZyb20gYW1iaXQgd2F0Y2hlcyB3b3JuIGJ5IGNlcnRhaW4gZXhwbG9yZXJzLjwvcD5cbiAgICAgICAgICA8cD48Y29kZT5hbWJpdF9nZW86PC9jb2RlPiBjb250YWlucyBnZW9sb2NhdGlvbiBkYXRhIGZyb20gdGhlIGFtYml0IHdhdGNoZXMuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPmF1ZGlvOjwvY29kZT4gYXVkaW8gcmVjb3JkaW5ncyB0YWtlbiBpbiB0aGUgZmllbGQuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPmJlYWNvbjo8L2NvZGU+IGdlb2xvY2F0aW9uIGRhdGEgc2VudCBieSBiZWFjb25zIGV2ZXJ5IDMwIG1pbnV0ZXMuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPmltYWdlOjwvY29kZT4gYWxsIGltYWdlcyB1cGxvYWRlZCB0byB0aGUgZGF0YWJhc2UuIFRoZXNlIGNhbiBiZSBmaWx0ZXJlZCBmdXJ0aGVyIGJ5IDxjb2RlPkltYWdlVHlwZTogR29Qcm8sIERvY3VtZW50YXJ5PC9jb2RlPiBvciA8Y29kZT5TcGVjaW1lbi48L2NvZGU+PC9wPlxuICAgICAgICAgIDxwPjxjb2RlPnNlbnNvcjo8L2NvZGU+IHNlbnNvciByZWFkaW5ncyB0YWtlbiBieSBlbnZpcm9ubWVudGFsIHNlbnNvcnMgYXR0YWNoZWQgdG8gdGhlIGV4cGVkaXRpb24gYm9hdC4gRGF0YSBpbmNsdWRlcyB0ZW1wZXJhdHVyZSwgcEggbGV2ZWxzIGFuZCBvdGhlciBlbnZpcm9ubWVudGFsIHJlYWRpbmdzLjwvcD5cbiAgICAgICAgICA8cD48Y29kZT5zaWdodGluZzo8L2NvZGU+IGFsbCBzcGVjaWVzIHNpZ2h0aW5ncyBvbiB0aGUgZXhwZWRpdGlvbi4gWW91IGNhbiBmdXJ0aGVyIGZpbHRlciBieSA8Y29kZT5TcGVjaWVzTmFtZTwvY29kZT4gKGV4OiA8Y29kZT5TcGVjaWVzTmFtZT1FbGVwaGFudDwvY29kZT4pLiBUaGUgcmVzdWx0cyByZXR1cm4gYSB0aW1lc3RhbXBlZCBnZW9sb2NhdGVkIHBvaW50LCB3aXRoIGEgPGNvZGU+Q291bnQ8L2NvZGU+IG9mIGhvdyBtYW55IHNwZWNpZXMgd2VyZSBzaWdodGVkLCBhcyB3ZWxsIGFzIGltYWdlcyBpZiB0aGV5IHdlcmUgdGFrZW4uIEEgPGNvZGU+VGF4b25vbXk8L2NvZGU+IG9iamVjdCByZXR1cm5zIHRoZSBzY2llbnRpZmljIG5hbWUsIGFuZCBhIDxjb2RlPk5vdGVzPC9jb2RlPiBmaWVsZCByZWNvcmRzIGEgZGVzY3JpcHRpb24gdXBsb2FkZWQgd2l0aCB0aGUgc2lnaHRpbmcuPC9wPlxuICAgICAgICAgIDxwPjxjb2RlPnR3ZWV0OjwvY29kZT4gYSBsaXN0IG9mIGFsbCB0d2VldHMgd2l0aCB0aGUgaGFzaHRhZyAjb2thdmFuZ28xNS48L3A+XG4gICAgICAgICAgPHA+PGNvZGU+bG9uZ2Zvcm06PC9jb2RlPiByZXR1cm5zIGxvbmdmb3JtIGJsb2cgZW50cmllcyBwb3N0ZWQgdG8gdGhlIG9rYXZhbmdvIGNvbGxlY3Rpb24gb24gPGEgaHJlZj1cImh0dHBzOi8vbWVkaXVtLmNvbS90YWcvb2thdmFuZ28xNVwiIHRhcmdldD1cIl9ibGFua1wiPk1lZGl1bS48L2E+PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIF1cblxuICB2YXIgaW5kZXggPSBzZWN0aW9ucy5tYXAoZnVuY3Rpb24oc2VjdGlvbil7XG4gICAgcmV0dXJuIDxoMyBrZXk9e3NlY3Rpb24ua2V5fT57c2VjdGlvbi5rZXl9IC0ge3NlY3Rpb24udGl0bGV9PC9oMz5cbiAgfSlcblxuICB2YXIgY29udGVudCA9IHNlY3Rpb25zLm1hcChmdW5jdGlvbihzZWN0aW9uKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e3NlY3Rpb24ua2V5fT5cbiAgICAgICAgPGgyPntzZWN0aW9uLmtleX0gLSB7c2VjdGlvbi50aXRsZX08L2gyPlxuICAgICAgICB7c2VjdGlvbi5jb250ZW50fVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9KVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiAgY2xhc3NOYW1lPSdwYWdlJyAgaWQ9XCJkYXRhUGFnZVwiPlxuICAgICAgPERhdGFQYWdlSW5kZXg+XG4gICAgICAgIHtpbmRleH1cbiAgICAgIDwvRGF0YVBhZ2VJbmRleD5cbiAgICAgIDxkaXYgaWQ9XCJkYXRhUGFnZUNvbnRlbnRcIj5cbiAgICAgICAge2NvbnRlbnR9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKSAgXG59XG5cbkRhdGFQYWdlLnByb3BUeXBlcyA9IHtcbiAgLy8gYWN0aXZlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFQYWdlXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9EYXRhUGFnZS5qc1xuICoqLyIsIlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCdcblxuY29uc3QgRGF0YVBhZ2VJbmRleCA9ICh7Y2hpbGRyZW59KSA9PiAoXG4gIDxkaXYgaWQ9XCJBUElJbmRleFwiPlxuICAgIHtjaGlsZHJlbn1cbiAgPC9kaXY+XG4pXG5cbkRhdGFQYWdlSW5kZXgucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZFxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhUGFnZUluZGV4XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9EYXRhUGFnZUluZGV4LmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZX0gZnJvbSAncmVhY3QnXG5cbmNvbnN0IEFQSUV4cGxvcmVyID0gKCkgPT4gKFxuICA8cD5Db21pbmcgc29vbi4uLjwvcD5cbilcblxuZXhwb3J0IGRlZmF1bHQgQVBJRXhwbG9yZXJcblxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3N0YXRpYy9qcy9jb21wb25lbnRzL0FQSUV4cGxvcmVyLmpzXG4gKiovIiwiXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBBYm91dFBhZ2UgPSAoKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9J3BhZ2UnICBpZD1cImFib3V0UGFnZVwiPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2VXcmFwcGVyXCI+XG4gICAgICAgIDxpZnJhbWUgY2xhc3NOYW1lPVwidmltZW9cIiBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMTI0NDIxNDUwP2F1dG9wbGF5PTAmYXBpPTFcIiB3aWR0aD17d2luZG93LmlubmVyV2lkdGggKiAwLjl9IGhlaWdodD17d2luZG93LmlubmVyV2lkdGggKiAwLjkgKiAwLjUyNX0gZnJhbWVCb3JkZXI9XCIwXCJhbGxvd0Z1bGxTY3JlZW4+PC9pZnJhbWU+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sdW1uV3JhcHBlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sdW1uIGhlYWRsaW5lXCI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgMTggZGF5cywgMzQ1IGtpbG9tZXRlcnMsPGJyLz5cbiAgICAgICAgICAgICAgMSByaXZlciwgMzEgYWR2ZW50dXJlcnMsIDEwMCUgb3BlbiBkYXRhLjxici8+XG4gICAgICAgICAgICAgIEpvaW4gdXMgaW4gcmVhbC10aW1lIGFzIHdlIGV4cGxvcmVcbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxoMT5cbiAgICAgICAgICAgICAgVEhFIEJFQVRJTkcgSEVBUlQgT0YgT1VSIFBMQU5FVFxuICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbHVtblwiPlxuICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgIFRoZSBPa2F2YW5nbyBEZWx0YSBpcyBvbmUgb2YgdGhlIHdvcmxk4oCZcyBsYXN0IGdyZWF0IHdldGxhbmQgd2lsZGVybmVzc2VzLiBBbHRob3VnaCB0aGUgRGVsdGEgaGFzIGJlZW4gYXdhcmRlZCBVTkVTQ08gV0hTIFN0YXR1cyBpdHMgY2F0Y2htZW50cyBpbiB0aGUgaGlnaGxhbmRzIG9mIEFuZ29sYSBhcmUgc3RpbGwgdW5wcm90ZWN0ZWQgYW5kIGxhcmdlbHkgdW5zdHVkaWVkLiBBIHRlYW0gb2YgQmHigJlZZWksIHNjaWVudGlzdHMsIGVuZ2luZWVycyBhbmQgYWR2ZW50dXJlcnMgd2lsbCBqb3VybmV5IGEgMzQ1IGtpbG9tZXRlcnMgY3Jvc3NpbmcgdGhlIHJpdmVyLCBmaW5kaW5nIG5ldyBzcGVjaWVzLCBleHBsb3JpbmcgbmV3IGdyb3VuZCwgYW5kIHRha2luZyB0aGUgcHVsc2Ugb2YgdGhpcyBtaWdodHkgcml2ZXIgdGhhdCBicmluZ3MgbGlmZS1naXZpbmcgd2F0ZXIgdG8gdGhlIEpld2VsIG9mIHRoZSBLYWxhaGFyaS5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICBUaGlzIHNpdGUgZGlzcGxheXMgZGF0YSB3aGljaCBpcyB1cGxvYWRlZCBkYWlseSwgdmlhIHNhdGVsbGl0ZSwgYnkgdGhlIGV4cGVkaXRpb24gdGVhbS4gRGF0YSBpcyBhbHNvIGF2YWlsYWJsZSB0aHJvdWdoIGEgcHVibGljIEFQSSwgYWxsb3dpbmcgYW55b25lIHRvIHJlbWl4LCBhbmFseXplIG9yIHZpc3VhbGl6ZSB0aGUgY29sbGVjdGVkIGluZm9ybWF0aW9uLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2x1bW5XcmFwcGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnb2FsSWNvblwiPjxpbWcgc3JjPVwic3RhdGljL2ltZy9pY29uSW50cm9VbmRlcnN0YW5kLnBuZ1wiLz48L2Rpdj5cbiAgICAgICAgICAgIDxoMj5VTkRFUlNUQU5EPGJyLz5USEUgV0lMREVSTkVTUzwvaDI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgVG8gZWZmZWN0aXZlbHkgcHJvdGVjdCB0aGUgT2thdmFuZ28gYW5kIGl0cyBjYXRjaG1lbnRzIGl0IGlzIGVzc2VudGlhbCB0byBnYWluIGtub3dsZWRnZSBhbmQgaW5zaWdodCBpbnRvIHRoZSBmdW5jdGlvbmluZyBvZiB0aGUgc3lzdGVtIGFzIGEgd2hvbGUuIFN0YXJ0aW5nIGluIDIwMTEgdGhlIE9rYXZhbmdvIFdpbGRlcm5lc3MgUHJvamVjdCBoYXMgY29uZHVjdGVkIHllYXJseSB0cmFuc2VjdHMgb2YgdGhlIERlbHRhLCBnYXRoZXJpbmcgdW5pcXVlIGRhdGEgYW5kIGltbWVyc2luZyB0aGUgZXhwZWRpdGlvbiBtZW1iZXJzIGluIHRoZSBlYmIgYW5kIGZsb3cgb2YgdGhpcyBwcmlzdGluZSB3aWxkZXJuZXNzLiBUcmF2ZWxpbmcgZG93biB0aGUgcml2ZXIsIHRoZSB0ZWFtIHdpbGwgY29sbGVjdCBkYXRhIG9uIGluc2VjdHMsIGZpc2gsIGJpcmRzLCByZXB0aWxlcyBhbmQgbWFtbWFscywgYXMgd2VsbCBhcyBjb25kdWN0IHdhdGVyIHF1YWxpdHkgYXNzZXNzbWVudHMgYW5kIGxhbmRzY2FwZSBzdXJ2ZXlzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sdW1uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ29hbEljb25cIj48aW1nIHNyYz1cInN0YXRpYy9pbWcvaWNvbkludHJvUHJlc2VydmUucG5nXCIvPjwvZGl2PlxuICAgICAgICAgICAgPGgyPlJBSVNFIEFXQVJFTkVTUzxici8+QU5EIFBSRVNFUlZFPC9oMj5cbiAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICBBbHRob3VnaCB0aGUgT2thdmFuZ28gaXRzZWxmIGlzIHByb3RlY3RlZCBhcyBhIFVORVNDTyBXb3JsZCBIZXJpdGFnZSBTaXRlLCBpdHMgY2F0Y2htZW50IGFuZCB3YXRlciBzdXBwbHkgaW4gQW5nb2xhIGFuZCBOYW1pYmlhIHJlbWFpbiB2dWxuZXJhYmxlIHRvIGh1bWFuIGludGVyZmVyZW5jZS4gQnkgZ2F0aGVyaW5nIGFuZCBmcmVlbHkgZGlzc2VtaW5hdGluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZnVuY3Rpb25pbmcgYW5kIGhlYWx0aCBvZiB0aGUgZW50aXJlIHN5c3RlbSB0aGUgMjAxNiBleHBlZGl0aW9uIGFpbXMgdG8gcmFpc2UgdGhlIGxldmVscyBvZiBib3RoIHVuZGVyc3RhbmRpbmcgYW5kIGF3YXJlbmVzcyBvZiB0aGlzIHVuaXF1ZSBhbmQgZnJhZ2lsZSBzeXN0ZW0uXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgT25jZSBiYXNlLWxpbmUgZGF0YSBvbiB0aGUgc3lzdGVtIGJlY29tZXMgZnJlZWx5IGF2YWlsYWJsZSBlZmZlY3RpdmUgbWVhc3VyZXMgY2FuIHRoZW4gYmUgaW1wbGVtZW50ZWQgdG8gaW5zdXJlIHRoZSBjb250aW51ZWQgaGVhbHRoIGFuZCBzdXJ2aXZhbCBvZiB0aGlzIGdyZWF0IEFmcmljYW4gd2lsZGVybmVzcy5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sdW1uV3JhcHBlciBjcmVkaXRzXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAgRVhQRURJVElPTiBURUFNPGJyLz48c3BhbiBjbGFzcz1cImpvYlwiPjxzcGFuIGNsYXNzPVwiZXhwbG9yZXJCb3ggbGVnZW5kXCI+PC9zcGFuPiBOYXRpb25hbCBHZW9ncmFwaGljIEVtZXJnaW5nIEV4cGxvcmVyczwvc3Bhbj5cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgQWRqYW55IENvc3RhIDxzcGFuIGNsYXNzPVwiam9iXCI+QXNzaXN0YW50IERpcmVjdG9yICYgMm5kIEZpc2g8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgQ2hyaXMgQm95ZXMgPHNwYW4gY2xhc3M9XCJqb2JcIj5FeHBlZGl0aW9ucyBMZWFkZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgR29ib25hbWFuZyBcIkdCXCIgS2dldGhvIDxzcGFuIGNsYXNzPVwiam9iXCI+UG9sZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgR290eiBOZWVmIDxzcGFuIGNsYXNzPVwiam9iXCI+U2NpZW5ldGlmaWMgQ29sbGVjdGlvbnMgJiBMZWFkZXIgSW52ZXJ0ZWJyYXRlczwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICBKZXIgVGhvcnAgPHNwYW4gY2xhc3M9XCJqb2JcIj5EYXRhPC9zcGFuPjxici8+XG4gICAgICAgICAgICAgIEpvaG4gSGlsdG9uIDxzcGFuIGNsYXNzPVwiam9iXCI+UHJvamVjdCBEaXJlY3Rvcjwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICBLZXJsbGVuIENvc3RhIDxzcGFuIGNsYXNzPVwiam9iXCI+UGxhbnRzICYgTWFtbWFsczwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICBLeWxlIEdvcmRvbiA8c3BhbiBjbGFzcz1cImpvYlwiPkV4cGVkaXRpb24gTG9naXN0aWNzPC9zcGFuPjxici8+XG4gICAgICAgICAgICAgIExlaWxhbWFuZyBcIlNjaG5hcHBzXCIgS2dldGhvIDxzcGFuIGNsYXNzPVwiam9iXCI+UG9sZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgTHVrZSBNYW5zb24gPHNwYW4gY2xhc3M9XCJqb2JcIj5FeHBlZGl0aW9uIExvZ2lzdGljczwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICBNaWEgTWFlc3RybyA8c3BhbiBjbGFzcz1cImpvYlwiPlBob3RvZ3JhcGhlcjwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICBNb3RpZW1hbmcg4oCcSnVkZ2XigJ0gWGhpa2Fib3JhIDxzcGFuIGNsYXNzPVwiam9iXCI+UG9sZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgTmVpbCBHZWxpbmFzIDxzcGFuIGNsYXNzPVwiam9iXCI+RmlsbW1ha2VyPC9zcGFuPjxici8+XG4gICAgICAgICAgICAgIE5pbmRhIEJhcHRpc3RhIDxzcGFuIGNsYXNzPVwiam9iXCI+UmVwdGlsZXM8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgTmtlbGV0c2FuZyDigJxSYWxwaOKAnSBNb3NodXBhIDxzcGFuIGNsYXNzPVwiam9iXCI+UG9sZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgUmFjaGVsIFN1c3NtYW4gPHNwYW4gY2xhc3M9XCJqb2JcIj5QaG90b2dyYXBoZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgU2hhaCBTZWxiZSA8c3BhbiBjbGFzcz1cImpvYlwiPlRlY2g8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgU3RldmUgQm95ZXMgPHNwYW4gY2xhc3M9XCJqb2JcIj5Qcm9qZWN0IExlYWRlciAmIEJpcmRzPC9zcGFuPjxici8+XG4gICAgICAgICAgICAgIFRvcGhvIFwiVG9tXCIgUmV0aXlvIDxzcGFuIGNsYXNzPVwiam9iXCI+UG9sZXI8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgVHVtZWxldG8gXCJXYXRlclwiIFNldGxhYm9zaGE8c3BhbiBjbGFzcz1cImpvYlwiPlBvbGVyPC9zcGFuPjxici8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2dvc1wiPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy5uYXRpb25hbGdlb2dyYXBoaWMuY29tL1wiPlxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwic3RhdGljL2ltZy9uYXRnZW9Mb2dvLnN2Z1wiIGFsdD1cIk5hdGlvbmFsIEdlb2dyYXBoaWMgTG9nb1wiIGhlaWdodD1cIjM1cHhcIi8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly9jb25zZXJ2aWZ5Lm9yZy9cIj5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cInN0YXRpYy9pbWcvY29uc2VydmlmeS5wbmdcIiBhbHQ9XCJDb25zZXJ2aWZ5IExvZ29cIiBoZWlnaHQ9XCIzNXB4XCIvPlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vd3d3Lm8tYy1yLm9yZy9cIj5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cInN0YXRpYy9pbWcvb2NyTG9nby5zdmdcIiBhbHQ9XCJUaGUgT2ZmaWNlIGZvciBDcmVhdGl2ZSBSZXNlYXJjaCBMb2dvXCIgaGVpZ2h0PVwiMzVweFwiLz5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL3d3dy53aWxkYmlyZHRydXN0LmNvbS9cIj5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cInN0YXRpYy9pbWcvd2J0TG9nby5wbmdcIiBhbHQ9XCJXaWxkIEJpcmQgVHJ1c3QgTG9nb1wiIGhlaWdodD1cIjM1cHhcIi8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG4gIClcbn1cblxuQWJvdXRQYWdlLnByb3BUeXBlcyA9IHtcbiAgLy8gYWN0aXZlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFib3V0UGFnZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9BYm91dFBhZ2UuanNcbiAqKi8iLCJcbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnXG5cbmNvbnN0IFNoYXJlUGFnZSA9ICgpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2ICBjbGFzc05hbWU9J3BhZ2UnICBpZD1cInNoYXJlUGFnZVwiPlNoYXJlIHBhZ2U8L2Rpdj5cbiAgKVxufVxuXG5TaGFyZVBhZ2UucHJvcFR5cGVzID0ge1xuICAvLyBhY3RpdmU6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVQYWdlXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zdGF0aWMvanMvY29tcG9uZW50cy9TaGFyZVBhZ2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9