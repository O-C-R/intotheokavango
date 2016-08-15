
import fetch from 'isomorphic-fetch'
import * as d3 from 'd3'
// import { animate } from './animation'

function timestampToString (t) {
  var d = new Date(t)
  var year = d.getUTCFullYear()
  var month = (d.getUTCMonth() + 1) + ''
  if (month.length === 1) month = '0' + month
  var date = (d.getUTCDate()) + ''
  if (date.length === 1) date = '0' + date
  return year + '-' + month + '-' + date
}

export const COMPLETE_DAYS = 'COMPLETE_DAYS'

export function completeDays (expeditionID) {
  return {
    type: COMPLETE_DAYS,
    expeditionID
  }
}

export const SHOW_LOADING_WHEEL = 'SHOW_LOADING_WHEEL'

export function showLoadingWheel () {
  return {
    type: SHOW_LOADING_WHEEL
  }
}

export const HIDE_LOADING_WHEEL = 'HIDE_LOADING_WHEEL'

export function hideLoadingWheel () {
  return {
    type: HIDE_LOADING_WHEEL
  }
}

export const JUMP_TO = 'JUMP_TO'

export function jumpTo (date) {
  return function (dispatch, getState) {
    var state = getState()
    var expeditionID = state.selectedExpedition
    var expedition = state.expeditions[expeditionID]
    // note: currentDay has a 1 day offset with API expeditionDay, which starts at 1
    var expeditionDay = Math.floor((date.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
    if (expedition.days[expeditionDay]) {
      dispatch(updateTime(date, true))
      return dispatch(fetchDay(date))
    } else {
      dispatch(showLoadingWheel())
      return dispatch(fetchDay(date))
    }
  }
}

export const START = 'START'

export function startAnimation () {
  return {
    type: START
  }
}

export const REQUEST_EXPEDITIONS = 'REQUEST_EXPEDITIONS'

export function requestExpeditions () {
  return {
    type: REQUEST_EXPEDITIONS
  }
}

export const UPDATE_TIME = 'UPDATE_TIME'

export function updateTime (currentDate, updateMapState, expeditionID) {
  return {
    type: UPDATE_TIME,
    currentDate,
    updateMapState,
    expeditionID
  }
}

export const UPDATE_MAP = 'UPDATE_MAP'

export function updateMap (currentDate, coordinates, viewGeoBounds, zoom) {
  return function (dispatch, getState) {
    var state = getState()
    var expedition = state.expeditions[state.selectedExpedition]
    var tiles = expedition.featuresByTile
    var tileResolution = Math.floor((expedition.geoBounds[2] - expedition.geoBounds[0]) * 111 / 10)

    const coordinatesToTile = (coordinates, geoBounds) => {
      var x = Math.floor((coordinates[0] - geoBounds[0]) * 111 / 10)
      var y = Math.floor((coordinates[1] - geoBounds[3]) * 111 / 10)
      return {x, y}
    }

    const tileToCoordinates = (tile, geoBounds) => {
      var lng = (tile.x * 10 / 111) + geoBounds[0]
      var lat = (tile.y * 10 / 111) + geoBounds[3]
      return [lng, lat]
    }

    var west = viewGeoBounds[0]
    var north = viewGeoBounds[1]
    var east = viewGeoBounds[2]
    var south = viewGeoBounds[3]

    // TODO TEMPORARY: limiting max range
    var centroid = [(west + east) / 2, (south + north) / 2]
    west = centroid[0] + Math.max(west - centroid[0], -0.1)
    east = centroid[0] + Math.min(east - centroid[0], 0.1)
    north = centroid[1] + Math.min(north - centroid[1], 0.1)
    south = centroid[1] + Math.max(south - centroid[1], -0.1)
    // TEMPORARY

    var northWestTile = coordinatesToTile([west, north], expedition.geoBounds)
    var southEastTile = Object.assign({}, northWestTile)
    while (tileToCoordinates(southEastTile, expedition.geoBounds)[0] <= east) {
      southEastTile.x++
    }
    while (tileToCoordinates(southEastTile, expedition.geoBounds)[1] >= south) {
      southEastTile.y--
    }

    var tileRange = []
    var tilesInView = []
    for (var x = northWestTile.x; x <= southEastTile.x; x++) {
      for (var y = northWestTile.y; y >= southEastTile.y; y--) {
        var tile = x + y * tileResolution
        if (!tiles[tile]) tileRange.push({x, y})
        tilesInView.push(x + y * tileResolution)
      }
    }

    var queryNorthWest = [180, -90]
    var querySouthEast = [-180, 90]
    tileRange.forEach((t) => {
      var northWest = tileToCoordinates(t, expedition.geoBounds)
      var southEast = tileToCoordinates({x: t.x + 1, y: t.y - 1}, expedition.geoBounds)
      if (queryNorthWest[0] > northWest[0]) queryNorthWest[0] = northWest[0]
      if (queryNorthWest[1] < northWest[1]) queryNorthWest[1] = northWest[1]
      if (querySouthEast[0] < southEast[0]) querySouthEast[0] = southEast[0]
      if (querySouthEast[1] > southEast[1]) querySouthEast[1] = southEast[1]
    })
    var queryGeoBounds = [queryNorthWest[0], queryNorthWest[1], querySouthEast[0], querySouthEast[1]]

    tileRange.forEach((t, i, a) => {
      a[i] = t.x + t.y * tileResolution
    })

    if (tileRange.length > 0) {
      const goFetch = (featureTypes, results) => {
        var type = featureTypes.shift()
        var queryString = 'http://intotheokavango.org/api/features?limit=0&FeatureType=' + type + '&Expedition=' + state.selectedExpedition + '&geoBounds=' + queryGeoBounds.toString()
        console.log('querying:', queryString)
        fetch(queryString)
          .then(response => response.json())
          .then(json => {
            results = results.concat(json.results.features)
            if (featureTypes.length > 0) {
              // console.log('received ' + json.results.features.length + ' ' + type)
              goFetch(featureTypes, results)
            } else {
              console.log('done with query! Received ' + json.results.features.length + ' ' + type)
              dispatch(receiveFeatures(state.selectedExpedition, results, tileRange))
            }
          })
      }
      goFetch(['blog', 'audio', 'image', 'tweet', 'sighting'], [])
    }

    return dispatch({
      type: UPDATE_MAP,
      currentDate,
      coordinates,
      viewGeoBounds,
      tilesInView,
      zoom,
      tileRange
    })
  }
}

export const RECEIVE_EXPEDITIONS = 'RECEIVE_EXPEDITIONS'

export function receiveExpeditions (data) {
  return {
    type: RECEIVE_EXPEDITIONS,
    data
  }
}

export function fetchExpeditions () {
  return function (dispatch, getState) {
    dispatch(requestExpeditions())
    return fetch('http://intotheokavango.org/api/expeditions')
      .then(response => response.json())
      .then(json => dispatch(receiveExpeditions(json)))
      .then(() => dispatch(fetchDay()))
      // .then(() => dispatch(startAnimation()))
      // .then(() => {
      //   var state = getState()
      //   Object.keys(state.expeditions).forEach((id) => {
      //     if (id !== state.selectedExpedition) {
      //       dispatch(fetchDay(null, null, id))
      //     }
      //   })
      //   dispatch(fetchTotalSightings(state.selectedExpedition))
      // })
  }
}

export function fetchTotalSightings (id) {
  return function (dispatch, getState) {
    return fetch('http://intotheokavango.org/api/sightings?FeatureType=sighting&limit=0&Expedition=' + id)
      .then(response => response.json())
      .then(json => dispatch(receiveTotalSightings(id, json)))
  }
}

export const RECEIVE_TOTAL_SIGHTINGS = 'RECEIVE_TOTAL_SIGHTINGS'

export function receiveTotalSightings (id, data) {
  return {
    type: RECEIVE_TOTAL_SIGHTINGS,
    id,
    data
  }
}

export function fetchDay (date, initialDate, id) {
  if (!initialDate) initialDate = date
  return function (dispatch, getState) {
    var state = getState()
    var expeditionID = id || state.selectedExpedition
    var expedition = state.expeditions[expeditionID]
    if (!date) date = expedition.currentDate
    // note: currentDay has a 1 day offset with API expeditionDay, which starts at 1
    var expeditionDay = Math.floor((date.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
    var daysToFetch = []
    if (!expedition.days[expeditionDay - 1] && expeditionDay - 1 >= 0) daysToFetch.push(expeditionDay - 1)
    if (!expedition.days[expeditionDay]) daysToFetch.push(expeditionDay)
    if (!expedition.days[expeditionDay + 1] && expeditionDay + 1 < expedition.dayCount - 1) daysToFetch.push(expeditionDay + 1)

    if (daysToFetch.length === 0) return

    daysToFetch.forEach(function (d, i, a) {
      var t = expedition.start.getTime() + d * (1000 * 3600 * 24)
      a[i] = t
    })
    var range = [
      timestampToString(d3.min(daysToFetch)),
      timestampToString(d3.max(daysToFetch) + (1000 * 3600 * 24))
    ]
    // var queryString = 'http://intotheokavango.org/api/features?FeatureType=beacon&limit=0&Expedition=' + expeditionID + '&startDate=' + range[0] + '&endDate=' + range[1]
    // console.log('querystring:', queryString, expeditionDay)

    const goFetch = (featureTypes, results) => {
      var type = featureTypes.shift()
      var queryString = 'http://intotheokavango.org/api/features?limit=0&FeatureType=' + type + '&Expedition=' + expeditionID + '&startDate=' + range[0] + '&endDate=' + range[1]
      if (type === 'ambit_geo') queryString += '&resolution=60'
      console.log('querying:', queryString)
      fetch(queryString)
        .then(response => response.json())
        .then(json => {
          results = results.concat(json.results.features)
          if (featureTypes.length > 0) {
            console.log('received ' + json.results.features.length + ' ' + type)
            goFetch(featureTypes, results)
          } else {
            console.log('done with query! Received ' + json.results.features.length + ' ' + type)
            dispatch(receiveDay(expeditionID, results, range))
            dispatch(completeDays(expeditionID))
            var state = getState()
            var expedition = state.expeditions[state.selectedExpedition]
            var days = expedition.days
            var incompleteDays = []
            d3.keys(expedition.days).forEach((k) => {
              if (expedition.days[k].incomplete) incompleteDays.push(k)
            })
            if (incompleteDays.length === 0) {
              // not sure why I need this '|| date'
              if (!state.animate) dispatch(startAnimation())
              dispatch(updateTime(initialDate || date, false, expeditionID))
              dispatch(hideLoadingWheel())
            } else {
              console.log('incomplete days', incompleteDays)
              var nextTarget = -1
              for (var i = 0; i < incompleteDays.length; i++) {
                var id = incompleteDays[i]
                for (var j = Math.max(0, id - 1); j < expedition.dayCount; j++) {
                  if (!days[j]) {
                    nextTarget = j
                    break
                  }
                }
                if (nextTarget > -1) break
              }
              if (nextTarget > -1) {
                nextTarget = new Date(expedition.start.getTime() + nextTarget * (1000 * 3600 * 24))
                dispatch(fetchDay(nextTarget, initialDate, expeditionID))
              }
            }
          }
        })
    }
    // goFetch(['beacon', 'ambit_geo'], [])
    goFetch(['ambit_geo', 'beacon'], [])
  }
}

export const SET_EXPEDITION = 'SET_EXPEDITION'

export function setExpedition (id) {
  return function (dispatch, getState) {
    var state = getState()
    var expedition = state.expeditions[id]
    if (expedition.totalSightings.length === 0) {
      dispatch(fetchTotalSightings(id))
    }
    dispatch({
      type: SET_EXPEDITION,
      id
    })
  }
}

export const SET_CONTROL = 'SET_CONTROL'

export function setControl (target, mode) {
  return {
    type: SET_CONTROL,
    target,
    mode
  }
}

export const REQUEST_DAY = 'REQUEST_DAY'

export function requestDay (expeditionID, dayID) {
  return {
    type: REQUEST_DAY,
    expeditionID,
    dayID
  }
}

export const RECEIVE_DAY = 'RECEIVE_DAY'

export function receiveDay (expeditionID, data, dateRange) {
  return {
    type: RECEIVE_DAY,
    expeditionID,
    data,
    dateRange
  }
}

export const RECEIVE_FEATURES = 'RECEIVE_FEATURES'

export function receiveFeatures (expeditionID, data, tileRange) {
  return {
    type: RECEIVE_FEATURES,
    expeditionID,
    data,
    tileRange
  }
}

export const SELECT_FEATURE = 'SELECT_FEATURE'

export function selectFeature () {
  return {
    type: SELECT_FEATURE
  }
}

export const UNSELECT_FEATURE = 'UNSELECT_FEATURE'

export function unselectFeature () {
  return {
    type: UNSELECT_FEATURE
  }
}
