
import fetch from 'isomorphic-fetch'
// import { animate } from './animation'

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

export function fetchDay () {
  return function (dispatch, getState) {
    dispatch(requestDay())
    var state = getState()
    var expeditionID = state.selectedExpedition
    var expedition = state.expeditions[expeditionID]
    var expeditionDay = Math.floor((expedition.currentDate - expedition.start) / (1000 * 3600 * 24))
    var queryString = 'http://intotheokavango.org/api/features?FeatureType=beacon&Expedition=' + expeditionID + '&expeditionDay=' + (expeditionDay + 2) // TODO WHY +2?
    return fetch(queryString)
      .then(response => response.json())
      .then(json => dispatch(receiveDay(expeditionID, expeditionDay, json)))
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

export function receiveDay (expeditionID, dayID, data) {
  return {
    type: RECEIVE_DAY,
    expeditionID,
    dayID,
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
