
/*

  define boundaries in expedition
  update boundaries in day

*/

const okavangoReducer = (
  state = {
    isFetching: false,
    selectedExpedition: null,
    expeditions: {}
  },
  action
) => {
  var expeditions, features, id, tile, dayID, expeditionID, day

  switch (action.type) {
    case 'LOAD-EXPEDITIONS':
      return Object.assign({}, state, {
        isFetching: true
      })

    case 'REQUEST-EXPEDITIONS':
      break

    case 'RECEIVED-EXPEDITIONS':
      expeditions = {}
      var latestDate = new Date(0)
      var latestExpedition
      Object.keys(action.data.results).forEach((id) => {
        var e = action.data.results[id]
        expeditions[id] = expeditionReducer(state.expeditions[id], action)
        if (expeditions[id].start.getTime() + expeditions[id].dayCount * (1000 * 3600 * 24) > latestDate.getTime()) {
          latestDate = new Date(e.start.getTime() + e.dayCount * (1000 * 3600 * 24))
          latestExpedition = id
        }
      })

      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, expeditions),
        isFetching: false,
        selectedExpedition: latestExpedition
      })

    case 'SET-EXPEDITION':
      var selectedExpedition = action.id
      return Object.assign({}, state, {
        selectedExpedition: selectedExpedition
      })

    case 'SET-CONTROL':
      id = state.selectedExpedition
      expeditions = {
        [id]: expeditionReducer(state.expeditions[id], action)
      }
      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, expeditions)
      })

    case 'LOAD-DAY':
      expeditionID = action.expeditionID
      dayID = action.dayID
      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, state.expedition[expeditionID], {
            days: Object.assign({}, state.expedition[expeditionID].days, {
              [dayID]: dayReducer(state.expeditions[expeditionID].days[dayID], action)
            })
          })
        })
      })

    case 'REQUEST-DAY':
      break

    case 'RECEIVED-DAY':
      expeditionID = action.expeditionID
      dayID = action.dayID
      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, state.expedition[expeditionID], {
            days: Object.assign({}, state.expedition[expeditionID].days, {
              [dayID]: dayReducer(state.expeditions[expeditionID].days[dayID], action)
            })
          })
        })
      })

    case 'LOAD-FEATURES-BY-TILE':
      break

    case 'REQUEST-FEATURES-BY-TILE':
      break

    case 'RECEIVED-FEATURES-BY-TILE':
      expeditionID = action.expeditionID
      tile = action.tile

      features = {}
      action.data.results.forEach((f) => {
        var id = f.properties.t_created
        features[id] = featureReducer(state.expeditions[expeditionID].features[id], action, f)
      })

      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, state.expedition[expeditionID], {
            features: Object.assign({}, state.expeditions[expeditionID].features, features),
            featuresByTile: Object.assign({}, state.expeditions[expeditionID].featuresByTile, {
              [tile]: Object.assign({}, state.expeditions[expeditionID].featuresByTile[tile], Object.keys(features))
            })
          })
        })
      })

    case 'LOAD-FEATURES-BY-DAY':
      break

    case 'REQUEST-FEATURES-BY-DAY':
      break

    case 'RECEIVED-FEATURES-BY-DAY':
      expeditionID = action.expeditionID
      day = action.day

      features = {}
      action.data.results.forEach((f) => {
        var id = f.properties.t_created
        features[id] = featureReducer(state.expeditions[expeditionID].features[id], action, f)
      })

      return Object.assign({}, state, {
        expeditions: Object.assign({}, state.expeditions, {
          [expeditionID]: Object.assign({}, state.expedition[expeditionID], {
            features: Object.assign({}, state.expeditions[expeditionID].features, features),
            featuresByDay: Object.assign({}, state.expeditions[expeditionID].featuresByDay, {
              [day]: Object.assign({}, state.expeditions[expeditionID].featuresByDay[day], Object.keys(features))
            })
          })
        })
      })

    case 'SELECT-FEATURE':
      break

    case 'UNSELECT-FEATURE':
      break
    default:
      return state
  }

  return state
}

const expeditionReducer = (
  state = {
    playback: 'forward',
    isFetching: false,
    boundaries: [-180, -90, 180, 90],
    start: new Date(),
    end: new Date(),
    currentDate: new Date(),
    dayCount: 0,
    days: [],
    features: {},
    featuresByType: {},
    featuresByDay: {}
  },
  action
) => {
  switch (action.type) {
    case 'RECEIVED-EXPEDITIONS':
      var start = new Date(action.data.StartDate)
      var dayCount = action.data.Days
      var end = new Date(start.getTime() + dayCount * (1000 * 3600 * 24))
      var currentDate = new Date(end.getTime() - (1000 * 3600 * 24))
      return Object.assign({}, state, {
        start: start,
        currentDate: currentDate,
        end: end,
        dayCount: dayCount
      })

    case 'SET-CONTROL':
      return Object.assign({}, state, {
        [action.type]: action.mode
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
    features: {
      beacon: {}
    }
  },
  action
) => {
  var start, end, boundaries, features
  switch (action.type) {
    case 'LOAD-DAY':
      return Object.assign({}, state, {
        isFetching: true
      })

    case 'RECEIVED-DAY':
      start = new Date()
      end = new Date(0)
      boundaries = [180, 90, -180, -90]
      features = {}
      action.data.results.features.forEach((f) => {
        var d = new Date(f.properties.DateTime)
        if (d.getTime() < start.getTime()) start = d
        if (d.getTime() < end.getTime()) end = d

        var l = f.geometry.coordinates
        if (l[0] < boundaries[0]) boundaries[0] = l[0]
        if (l[0] > boundaries[2]) boundaries[2] = l[0]
        if (l[1] < boundaries[1]) boundaries[1] = l[1]
        if (l[1] > boundaries[3]) boundaries[3] = l[1]

        features.beacon = action.data.results.features
      })

      return Object.assign({}, state, {
        isFetching: false,
        start: start,
        end: end,
        boundaries: boundaries,
        features: Object.assign({}, state.features, {
          beacon: features.beacon
        })
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
    case 'RECEIVED-FEATURES':
      return Object.assign({}, state, feature)
    default:
      break
  }

  return state
}

export default okavangoReducer
