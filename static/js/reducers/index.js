
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
        mapStateNeedsUpdate: action.updateMapState,
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: expeditionReducer(state.expeditions[expeditionID], action)
        })
      })

    case actions.UPDATE_MAP:
      expeditionID = action.expeditionID || state.selectedExpedition
      return Object.assign({}, state, {
        mapStateNeedsUpdate: true,
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: expeditionReducer(state.expeditions[expeditionID], action)
        })
      })

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
      expeditionID = action.expeditionID
      expedition = state.expeditions[expeditionID]

      // initialize feature buckets
      var featuresByDay = {}
      var dateRange = action.dateRange.map((d) => {
        return Math.floor((new Date(d).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
      })
      for (var i = dateRange[0]; i <= dateRange[1]; i++) {
        featuresByDay[i] = {}
      }

      // initialize features
      features = {}
      action.data.results.features.forEach((f) => {
        var id = f.id
        features[id] = featureReducer(expedition.features[id], action, f)
      })

      // sort features by tile and time buckets
      Object.keys(features).forEach((id) => {
        var feature = features[id]
        var day = Math.floor((new Date(feature.properties.DateTime).getTime() - expedition.start.getTime()) / (1000 * 3600 * 24))
        if (!featuresByDay[day]) featuresByDay[day] = {}
        featuresByDay[day][id] = feature
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
            featuresByDay: featuresByDay
          })
        })
      })

    case actions.RECEIVE_FEATURES:
      expeditionID = action.expeditionID
      expedition = state.expeditions[expeditionID]

      var tileRange = action.tileRange
      var featuresByTile = {}
      tileRange.forEach((t, i) => {
        featuresByTile[t] = {}
      })

      features = {}
      action.data.results.features.forEach((f) => {
        var id = f.id
        features[id] = featureReducer(expedition.features[id], action, f)
      })

      var tileResolution = Math.floor((expedition.geoBounds[2] - expedition.geoBounds[0]) * 111 / 10)
      const coordinatesToTile = (coordinates, geoBounds) => {
        var x = Math.floor((coordinates[0] - geoBounds[0]) * 111 / 10)
        var y = Math.floor((coordinates[1] - geoBounds[3]) * 111 / 10)
        return {x, y}
      }

      Object.keys(features).forEach((id) => {
        var feature = features[id]
        var tileCoordinates = coordinatesToTile(feature.geometry.coordinates, expedition.geoBounds)
        var tile = tileCoordinates.x + tileCoordinates.y * tileResolution
        if (!featuresByTile[tile]) featuresByTile[tile] = {}
        featuresByTile[tile][id] = feature
      })
      Object.keys(featuresByTile).forEach((k) => {
        featuresByTile[k] = Object.assign({}, expedition.featuresByTile[k], featuresByTile[k])
      })

      if (action.data.results.features && action.data.results.features.length > 0) {
        console.log('YES', featuresByTile)
      }

      return Object.assign({}, state, {
        mapStateNeedsUpdate: false,
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, expedition, {
            features: Object.assign({}, expedition.features, features),
            featuresByTile: Object.assign({}, expedition.featuresByTile, featuresByTile)
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
    geoBounds: [-8, -21.5, 25.5, 12],
    tileSize: 10,
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
    coordinates: [0, 0],
    currentFeatures: []
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

    case actions.UPDATE_MAP:
      var currentFeatures = []
      action.tilesInView.forEach((t) => {
        var tileFeatures = d3.values(state.featuresByTile[t]).map((f) => {
          return {
            position: {
              x: f.geometry.coordinates[0] + f.properties.scatter[0],
              y: f.geometry.coordinates[1] + f.properties.scatter[1],
              z: 0
            },
            radius: f.properties.radius,
            color: [255, 0, 0]
          }
        })
        currentFeatures = currentFeatures.concat(tileFeatures)
      })

      return Object.assign({}, state, {
        currentFeatures: currentFeatures,
        currentDate: action.currentDate,
        coordinates: action.coordinates
      })

    case actions.RECEIVE_EXPEDITIONS:
      var dayCount = data.Days + 1
      var start = new Date(new Date(data.StartDate).getTime() + 2 * (1000 * 3600))
      var end = new Date(start.getTime() + dayCount * (1000 * 3600 * 24))
      var currentDate = new Date(end.getTime() - (1000 * 3600 * 24))

      var name = data.Name

      // 111 km per latitude degree
      // ~ 10km per screen at zoom level 14
      // [west, north, east, south]
      var geoBounds = data.GeoBounds
      // var geoBoundsDistance = [(geoBounds[2] - geoBounds[0]) * 111, (geoBounds[3] - geoBounds[1]) * 111]

      return Object.assign({}, state, {
        name: name,
        start: start,
        currentDate: currentDate,
        end: end,
        dayCount: dayCount,
        geoBounds: geoBounds
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
    beacons: {},
    incomplete: true
  },
  action,
  features
) => {
  var start, end
  switch (action.type) {
    case actions.RECEIVE_DAY:
      start = new Date()
      end = new Date(0)

      var incomplete = Object.keys(features).length === 0

      Object.keys(features).forEach((k) => {
        var f = features[k]
        var d = new Date(f.properties.DateTime)
        if (d.getTime() < start.getTime()) start = d
        if (d.getTime() > end.getTime()) end = d
      })

      return Object.assign({}, state, {
        isFetching: false,
        start: start,
        end: end,
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
      // feature.properties.scatter = [((Math.random() * 2) - 1) * 0.00075, ((Math.random() * 2) - 1) * 0.00075]
      return Object.assign({}, state, feature)
    case actions.RECEIVE_FEATURES:
      feature.properties.scatter = [((Math.random() * 2) - 1) * 0.00075, ((Math.random() * 2) - 1) * 0.00075]
      if(feature.properties.FeatureType === 'sighting') {
        feature.properties.radius = 2 + Math.sqrt(feature.properties.Count) * 2
        // var bn = feature.properties.SpeciesName;
        // if (colorMap[bn] == undefined) {
        //   var c = new RColor().get(true);
        //   so.fillColor = c;
        //   colorMap[bn] = c;
        // } else {
        //   so.fillColor = colorMap[bn];
        // }
      }

      return Object.assign({}, state, feature)
    default:
      break
  }

  return state
}

export default okavangoReducer
