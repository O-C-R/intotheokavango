
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

export const START = 'START'

export function startAnimation (dispatch, getState) {
  // animate(dispatch, getState, true)
  return {
    type: START
  }
}

export const UPDATE_MAP = 'UPDATE_MAP'

export function updateMap (currentDate) {
  return {
    type: UPDATE_MAP,
    currentDate
  }
}

export const REQUEST_EXPEDITIONS = 'REQUEST_EXPEDITIONS'

export function requestExpeditions () {
  return {
    type: REQUEST_EXPEDITIONS
  }
}

export const UPDATE_TIME = 'UPDATE_TIME'

export function updateTime (currentDate) {
  return {
    type: UPDATE_TIME,
    currentDate
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
      .then(() => dispatch(startAnimation(dispatch, getState)))
      // TODO catch errors
  }
}

export function fetchDay (currentDate) {
  return function (dispatch, getState) {
    // dispatch(requestDay())
    var state = getState()
    var expeditionID = state.selectedExpedition
    var expedition = state.expeditions[expeditionID]
    if (!currentDate) currentDate = expedition.currentDate
    console.log('FETCH DAY', currentDate, expedition.currentDate)
    // note: currentDay has a 1 day offset with API expeditionDay, which starts at 1
    var expeditionDay = Math.floor((currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
    var daysToFetch = []
    // console.log('DAYSTOFETCH', )
    if (!expedition.days[expeditionDay - 1] && expeditionDay - 1 >= 0) daysToFetch.push(expeditionDay - 1)
    if (!expedition.days[expeditionDay]) daysToFetch.push(expeditionDay)
    if (!expedition.days[expeditionDay] + 1 && expeditionDay + 1 < expedition.dayCount - 1) daysToFetch.push(expeditionDay + 1)

    // if (!expedition.days[expeditionDay + 2] && expeditionDay + 2 < expedition.dayCount) daysToFetch.push(expeditionDay + 2)
    console.log('DAYSTOFETCH', expedition.days, expeditionDay, daysToFetch)
    daysToFetch.forEach(function (d, i, a) {
      var t = expedition.start.getTime() + d * (1000 * 3600 * 24)
      a[i] = t
    })
    var range = [
      timestampToString(d3.min(daysToFetch)),
      timestampToString(d3.max(daysToFetch) + (1000 * 3600 * 24))
    ]
    var queryString = 'http://intotheokavango.org/api/features?FeatureType=beacon&Expedition=' + expeditionID + '&startDate=' + range[0] + '&endDate=' + range[1]
    console.log('querystring:', queryString, expeditionDay)

    return fetch(queryString)
      .then(response => response.json())
      .then(json => dispatch(receiveDay(expeditionID, json)))
  }
}

export const SET_EXPEDITION = 'SET_EXPEDITION'

export function setExpeditions (id) {
  return {
    type: SET_EXPEDITION,
    id
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

export function receiveDay (expeditionID, data) {
  return {
    type: RECEIVE_DAY,
    expeditionID,
    data
  }
}

export const REQUEST_FEATURES = 'REQUEST_FEATURES'

export function requestFeatures () {
  return {
    type: REQUEST_FEATURES
  }
}

export const RECEIVE_FEATURES = 'RECEIVE_FEATURES'

export function receiveFeatures (expeditionID, data) {
  return {
    type: RECEIVE_FEATURES,
    expeditionID,
    data
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
