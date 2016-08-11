
import * as actions from '../actions'
import * as d3 from 'd3'

const okavangoReducer = (
  state = {
    mapStateNeedsUpdate: false,
    animate: false,
    isFetching: false,
    selectedExpedition: null,
    expeditions: {}
  },
  action
) => {
  var expeditions, features, id, expeditionID, expedition, tiles, days

  switch (action.type) {
    case actions.COMPLETE_DAYS:
      id = action.expeditionID || state.selectedExpedition
      return Object.assign({}, state, {
        mapStateNeedsUpdate: false,
        expeditions: Object.assign({}, state.expeditions, {
          [id]: expeditionReducer(state.expeditions[id], action)
        })
      })

    case actions.SHOW_LOADING_WHEEL:
      return Object.assign({}, state, {
        mapStateNeedsUpdate: false,
        isFetching: true
      })

    case actions.HIDE_LOADING_WHEEL:
      return Object.assign({}, state, {
        mapStateNeedsUpdate: true,
        isFetching: false
      })

    case actions.START:
      return Object.assign({}, state, {
        mapStateNeedsUpdate: true,
        animate: true
      })

    case actions.UPDATE_TIME:
      expeditionID = action.expeditionID || state.selectedExpedition
      return Object.assign({}, state, {
        mapStateNeedsUpdate: false,
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
        mapStateNeedsUpdate: true,
        selectedExpedition: selectedExpedition
      })

    case actions.SET_CONTROL:
      id = state.selectedExpedition
      expeditions = {
        [id]: expeditionReducer(state.expeditions[id], action)
      }
      return Object.assign({}, state, {
        mapStateNeedsUpdate: false,
        expeditions: Object.assign({}, state.expeditions, expeditions)
      })

    case actions.RECEIVE_DAY:
      /*
        assess incomplete days
        fill missing days
        jump reload
        map
      */
      expeditionID = action.expeditionID
      expedition = state.expeditions[expeditionID]

      // list expected received days
      var dateRange = action.dateRange.map((d) => {
        return Math.floor((new Date(d).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
      })
      var daysQueried = []
      for (var i = dateRange[0]; i < dateRange[1]; i++) {
        daysQueried.push(i)
      }

      // initialize features
      features = {}
      action.data.results.features.forEach((f) => {
        var id = f.id
        features[id] = featureReducer(expedition.features[id], action, f)
      })

      // sort features by tile and time buckets
      var featuresByTile = {}
      var featuresByDay = {}

      daysQueried.forEach((d) => {
        featuresByDay[d] = {}
      })

      Object.keys(features).forEach((id) => {
        var feature = features[id]

        var tile = Math.floor(feature.geometry.coordinates[1] * 10) * Math.floor((expedition.boundaries[2] - expedition.boundaries[0]) * 10) + Math.floor(feature.geometry.coordinates[0] * 10)

        var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
        if (!featuresByTile[tile]) featuresByTile[tile] = {}
        if (!featuresByDay[day]) featuresByDay[day] = {}
        featuresByTile[tile][id] = feature
        featuresByDay[day][id] = feature
      })
      Object.keys(featuresByTile).forEach((t) => {
        featuresByTile[t] = Object.assign({}, expedition.featuresByTile[t], featuresByTile[t])
      })

      Object.keys(featuresByDay).forEach((d) => {
        featuresByDay[d] = Object.assign({}, expedition.featuresByDay[d], featuresByDay[d])

        // extending beaon features to entire day
        // pick the two earliest and latest features
        if (d3.values(featuresByDay[d]).length > 0) {
          var timeRange = [new Date(), new Date(0)]
          var featureRange = []
          d3.values(featuresByDay[d]).forEach((f) => {
            var dateTime = new Date(f.properties.DateTime)
            if (timeRange[0].getTime() > dateTime.getTime()) {
              timeRange[0] = dateTime
              featureRange[0] = f
            }
            if (timeRange[1].getTime() < dateTime.getTime()) {
              timeRange[1] = dateTime
              featureRange[1] = f
            }
          })

          // clone features with new dates
          var start = new Date(timeRange[0].getTime() - (timeRange[0].getTime() % (1000 * 3600 * 24)))
          var end = new Date(start.getTime() + (1000 * 3600 * 24))
          id = Date.now() + (Math.floor(Math.random() * 10000) / 10000)
          featuresByDay[d][id] = Object.assign({}, featureRange[0])
          featuresByDay[d][id].properties = Object.assign({}, featuresByDay[d][id].properties, {
            DateTime: start.toString()
          })
          id = Date.now() + (Math.floor(Math.random() * 10000) / 10000)
          featuresByDay[d][id] = Object.assign({}, featureRange[1])
          featuresByDay[d][id].properties = Object.assign({}, featuresByDay[d][id].properties, {
            DateTime: end.toString()
          })
        }
      })

      featuresByDay = Object.assign({}, expedition.featuresByDay, featuresByDay)
      featuresByTile = Object.assign({}, expedition.featuresByTile, featuresByTile)

      days = Object.assign({}, featuresByDay)
      for (id in days) {
        days[id] = dayReducer(expedition.days[id], action, featuresByDay[id])
      }

      return Object.assign({}, state, {
        mapStateNeedsUpdate: false,
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, expedition, {
            days: Object.assign({}, expedition.days, days),
            features: Object.assign({}, expedition.features, features),
            featuresByTile: featuresByTile,
            featuresByDay: featuresByDay
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
        var id = f.id
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
        mapStateNeedsUpdate: false,
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
    end: new Date(0),
    currentDate: new Date(),
    dayCount: 0,
    days: [],
    features: {},
    featuresByTile: {},
    featuresByDay: {},
    mainFocus: 'Explorers',
    secondaryFocus: 'Steve',
    missingDays: {}
  },
  action,
  data
) => {
  switch (action.type) {
    case actions.COMPLETE_DAYS:
      var i
      var days = Object.assign({}, state.days)

      // add mock days at both ends of the expedition
      for (i = 0; i < state.dayCount; i++) {
        if (days[i] && !days[i].incomplete) {
          days[-1] = Object.assign({}, days[i])
          break
        }
      }
      for (i = state.dayCount; i >= 0; i--) {
        if (days[i] && !days[i].incomplete) {
          days[state.dayCount] = Object.assign({}, days[i])
          break
        }
      }

      // detect incomplete days
      var incompleteRange = [-1, -1]
      var completedDays = []
      for (i = 0; i < state.dayCount; i++) {
        var day = days[i]
        if (!day) {
          incompleteRange = [-1, -1]
        } else {
          if (day.incomplete && days[i - 1] && !days[i - 1].incomplete) {
            incompleteRange[0] = i
            incompleteRange[1] = -1
          }
          if (day.incomplete && days[i + 1] && !days[i + 1].incomplete) {
            incompleteRange[1] = i
          }
        }

        // full data gap detected, filling in
        if (incompleteRange[0] > -1 && incompleteRange[1] > -1) {
          // look for filling values bordering the gap
          var fillingDays = [days[+incompleteRange[0] - 1], days[+incompleteRange[1] + 1]]
          var fillingBeacons = [
            d3.values(fillingDays[0].beacons).slice(0).sort((a, b) => {
              return new Date(b.properties.DateTime).getTime() - new Date(a.properties.DateTime).getTime()
            })[0],
            d3.values(fillingDays[1].beacons).slice(0).sort((a, b) => {
              return new Date(a.properties.DateTime).getTime() - new Date(b.properties.DateTime).getTime()
            })[0]
          ]

          // fill in gaps
          var l2 = Math.ceil((incompleteRange[1] - incompleteRange[0] + 1) / 2)
          for (var j = 0; j < l2; j++) {
            var dayIndex = [(+incompleteRange[0] + j), (+incompleteRange[1] - j)]
            for (var k = 0; k < 2; k++) {
              for (var l = 0; l < 2; l++) {
                if (l === 0 || days[dayIndex[0]] !== days[dayIndex[1]]) {
                  var dayID = dayIndex[k]
                  day = days[dayID]
                  var date = new Date(state.start.getTime() + (1000 * 3600 * 24) * (dayID + (k === l ? 0 : 1)))
                  var beaconID = Date.now() + (Math.floor(Math.random() * 10000) / 10000)
                  day.beacons[beaconID] = Object.assign({}, fillingBeacons[k])
                  day.beacons[beaconID].properties = Object.assign({}, day.beacons[beaconID].properties, {
                    DateTime: date
                  })
                  day.incomplete = false
                  if (completedDays.indexOf(dayID) === -1) completedDays.push(dayID)
                }
              }
            }
          }
          incompleteRange = [-1, -1]
        }
      }

      // remove mock days at both ends of the expedition
      delete days[-1]
      delete days[state.dayCount]

      console.log('fill following days:', completedDays, days)
      return Object.assign({}, state, {
        days: days
      })

    case actions.UPDATE_TIME:
      return Object.assign({}, state, {
        currentDate: action.currentDate
      })

    // 86400
    // expeditionDay 1 : startDate => startDate + 1
    // expeditionDay 34 : startDate => startDate + 34
    // end 35

    case actions.RECEIVE_EXPEDITIONS:
      var dayCount = data.Days + 1
      // TODO time zone ???
      var start = new Date(new Date(data.StartDate).getTime() + 2 * (1000 * 3600))
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
    end: new Date(0),
    boundaries: [0, 0, 0, 0],
    beacons: {},
    incomplete: true
  },
  action,
  features
) => {
  var start, end, boundaries
  switch (action.type) {
    // case actions.REQUEST_DAY:
    //   return Object.assign({}, state, {
    //     isFetching: true
    //   })

    case actions.RECEIVE_DAY:
      start = new Date()
      end = new Date(0)
      boundaries = [180, 90, -180, -90]

      var incomplete = Object.keys(features).length === 0

      Object.keys(features).forEach((k) => {
        var f = features[k]
        var d = new Date(f.properties.DateTime)
        if (d.getTime() < start.getTime()) start = d
        if (d.getTime() > end.getTime()) end = d

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
        beacons: Object.assign({}, state.features, features),
        incomplete: incomplete
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
