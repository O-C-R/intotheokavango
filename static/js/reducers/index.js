
import * as actions from '../actions'

const okavangoReducer = (
  state = {
<<<<<<< Updated upstream
    animate: false
=======
    animate: false,
>>>>>>> Stashed changes
    isFetching: false,
    selectedExpedition: null,
    expeditions: {}
  },
  action
) => {
  var expeditions, features, id, dayID, expeditionID, expedition, tiles, days

  switch (action.type) {
    case actions.START:
      return Object.assign({}, state, {
        animate: true
      })

    case actions.UPDATE_MAP:
      expeditionID = action.expeditionID || state.selectedExpedition
      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: expeditionReducer(state.expeditions[expeditionID], action)
        })
      })

    case actions.REQUEST_EXPEDITIONS:
      break

    case actions.RECEIVE_EXPEDITIONS:
      expeditions = {}
      var latestDate = new Date(0)
      var latestExpedition
      Object.keys(action.data.results).forEach((id) => {
        var e = action.data.results[id]
        expeditions[id] = expeditionReducer(state.expeditions[id], action, e)
        if (expeditions[id].start.getTime() + expeditions[id].dayCount * (1000 * 3600 * 24) > latestDate.getTime()) {
          latestDate = new Date(expeditions[id].start.getTime() + expeditions[id].dayCount * (1000 * 3600 * 24))
          latestExpedition = id
        }
      })

      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, expeditions),
        isFetching: false,
        selectedExpedition: latestExpedition
      })

    case actions.SET_EXPEDITION:
      var selectedExpedition = action.id
      return Object.assign({}, state, {
        selectedExpedition: selectedExpedition
      })

    case actions.SET_CONTROL:
      id = state.selectedExpedition
      expeditions = {
        [id]: expeditionReducer(state.expeditions[id], action)
      }
      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, expeditions)
      })

    case actions.REQUEST_DAY:
      expeditionID = action.expeditionID || state.selectedExpedition
      expedition = state.expeditions[expeditionID]
      dayID = action.dayID || Math.floor((expedition.currentDate.getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, expedition, {
            days: Object.assign({}, expedition.days, {
              [dayID]: dayReducer(expedition.days[dayID], action)
            })
          })
        })
      })

    case actions.RECEIVE_DAY:
      expeditionID = action.expeditionID
      expedition = state.expeditions[expeditionID]
      dayID = action.dayID

      features = {}
      action.data.results.features.forEach((f) => {
        var id = f.properties.t_created
        features[id] = featureReducer(expedition.features[id], action, f)
      })

      tiles = {}
      days = {}
      Object.keys(features).forEach((id) => {
        var feature = features[id]

        var tile = Math.floor(feature.geometry.coordinates[1] * 10) * Math.floor((expedition.boundaries[2] - expedition.boundaries[0]) * 10) + Math.floor(feature.geometry.coordinates[0] * 10)

        var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
        if (!tiles[tile]) tiles[tile] = {}
        if (!days[day]) days[day] = {}
        tiles[tile][id] = feature
        days[day][id] = feature
      })
      Object.keys(tiles).forEach((k) => {
        tiles[k] = Object.assign({}, expedition.featuresByTile[k], tiles[k])
      })
      Object.keys(days).forEach((k) => {
        days[k] = Object.assign({}, expedition.featuresByDay[k], days[k])
      })

      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, expedition, {
            days: Object.assign({}, expedition.days, {
              [dayID]: dayReducer(expedition.days[dayID], action, features)
            }),
            features: Object.assign({}, expedition.features, features),
            featuresByTile: Object.assign({}, expedition.featuresByTile, tiles),
            featuresByDay: Object.assign({}, expedition.featuresByDay, days)
          })
        })
      })

    case actions.REQUEST_FEATURES:
      break

    case actions.RECEIVE_FEATURES:
      expeditionID = action.expeditionID
      expedition = state.expeditions[expeditionID]

      features = {}
      action.data.results.features.forEach((f) => {
        var id = f.properties.t_created
        features[id] = featureReducer(expedition.features[id], action, f)
      })

      tiles = {}
      days = {}
      Object.keys(features).forEach((id) => {
        var feature = features[id]
        var tile = Math.floor(feature.geometry.coordinates[1] * 10) * Math.floor((expedition.boundaries[2] - expedition.boundaries[0]) * 10) + Math.floor(feature.geometry.coordinates[0] * 10)
        var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
        if (!tiles[tile]) tiles[tile] = {}
        if (!days[day]) days[day] = {}
        tiles[tile][id] = feature
        days[day][id] = feature
      })
      Object.keys(tiles).forEach((k) => {
        tiles[k] = Object.assign({}, expedition.featuresByTile[k], tiles[k])
      })
      Object.keys(days).forEach((k) => {
        days[k] = Object.assign({}, expedition.featuresByDay[k], days[k])
      })

      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, expedition, {
            features: Object.assign({}, expedition.features, features),
            featuresByTile: Object.assign({}, expedition.featuresByTile, tiles),
            featuresByDay: Object.assign({}, expedition.featuresByDay, days)
          })
        })
      })

    case actions.SELECT_FEATURE:
      break

    case actions.UNSELECT_FEATURE:
      break
    default:
      return state
  }

  return state
}

const expeditionReducer = (
  state = {
    name: '',
    playback: 'forward',
    zoom: 10,
    isFetching: false,
    boundaries: [-180, -90, 180, 90],
    start: new Date(),
    end: new Date(),
    currentDate: new Date(),
    dayCount: 0,
    days: [],
    features: {},
    featuresByTile: {},
    featuresByDay: {},
    mainFocus: 'Explorers',
    secondaryFocus: 'Steve'
  },
  action,
  data
) => {
  switch (action.type) {
    case actions.UPDATE_MAP:
      return Object.assign({}, state, {
        currentDate: action.currentDate
      })

    case actions.RECEIVE_EXPEDITIONS:
      var dayCount = data.Days
      var start = new Date(data.StartDate)
      var end = new Date(start.getTime() + dayCount * (1000 * 3600 * 24))
      var currentDate = new Date(end.getTime() - (1000 * 3600 * 24))
      var name = data.Name

      var boundaries = [-180, -90, 180, 90]

      return Object.assign({}, state, {
        name: name,
        start: start,
        currentDate: currentDate,
        end: end,
        dayCount: dayCount,
        boundaries: boundaries
      })

    case actions.SET_CONTROL:
      if (action.target === 'zoom') {
        if (action.mode === 'increment') action.mode = Math.max(1, Math.min(15, state.zoom + 1))
        if (action.mode === 'decrement') action.mode = Math.max(1, Math.min(15, state.zoom - 1))
      }
      return Object.assign({}, state, {
        [action.target]: action.mode
      })

    default:
      break
  }
  return state
}

const dayReducer = (
  state = {
    isFetching: false,
    start: new Date(),
    end: new Date(),
    boundaries: [0, 0, 0, 0],
    beacons: []
  },
  action,
  features
) => {
  var start, end, boundaries
  switch (action.type) {
    case actions.REQUEST_DAY:
      return Object.assign({}, state, {
        isFetching: true
      })

    case actions.RECEIVE_DAY:
      start = new Date()
      end = new Date(0)
      boundaries = [180, 90, -180, -90]

      Object.keys(features).forEach((k) => {
        var f = features[k]
        var d = new Date(f.properties.DateTime)
        if (d.getTime() < start.getTime()) start = d
        if (d.getTime() < end.getTime()) end = d

        var l = f.geometry.coordinates
        if (l[0] < boundaries[0]) boundaries[0] = l[0]
        if (l[0] > boundaries[2]) boundaries[2] = l[0]
        if (l[1] < boundaries[1]) boundaries[1] = l[1]
        if (l[1] > boundaries[3]) boundaries[3] = l[1]
      })

      return Object.assign({}, state, {
        isFetching: false,
        start: start,
        end: end,
        boundaries: boundaries,
        beacons: Object.assign({}, state.features, features)
      })

    default:
      break
  }

  return state
}

const featureReducer = (
  state = {},
  action,
  feature
) => {
  switch (action.type) {
    case actions.RECEIVE_DAY:
      return Object.assign({}, state, feature)
    case actions.RECEIVE_FEATURES:
      return Object.assign({}, state, feature)
    default:
      break
  }

  return state
}

export default okavangoReducer
